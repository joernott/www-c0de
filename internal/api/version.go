package api

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"regexp"
	"strconv"
	"sync"
	"time"
)

const (
	// versionsTTL is how long the versions are kept before GitHub is asked again.
	versionsTTL = time.Hour
	// versionsRetry is how long the server waits after GitHub failed before it asks again;
	// meanwhile it answers the last known versions.
	versionsRetry = 5 * time.Minute
	// githubTimeout limits a request to GitHub.
	githubTimeout = 5 * time.Second
)

// repositories are the mods whose versions /api/version answers, by their key in the answer.
var repositories = map[string]string{
	"c0de":     "joernott/minecraft-c0de",
	"c0de_net": "joernott/minecraft-c0de-net",
}

// versions knows the latest released versions of the mods (task 9.2).
type versions struct {
	mu sync.Mutex
	// github is the address of the GitHub API; tests replace it.
	github  string
	client  *http.Client
	known   map[string]string
	refresh time.Time // when to ask GitHub again
}

// serve answers GET /api/version: {"c0de": "0.4.0", "c0de_net": "0.2.0"}.
func (v *versions) serve(w http.ResponseWriter, r *http.Request, now time.Time) {
	if r.Method != http.MethodGet && r.Method != http.MethodHead {
		notAllowed(w, r, "GET, HEAD, OPTIONS")
		return
	}
	v.mu.Lock()
	defer v.mu.Unlock()
	if !now.Before(v.refresh) {
		// Not cancelled when this client goes: the answer is for all clients.
		latest, err := v.fetch(context.WithoutCancel(r.Context()))
		if err == nil {
			v.known, v.refresh = latest, now.Add(versionsTTL)
		} else {
			v.refresh = now.Add(versionsRetry)
		}
	}
	if v.known == nil {
		writeError(w, http.StatusServiceUnavailable, "the versions are unknown: GitHub can't be reached")
		return
	}
	writeJSON(w, http.StatusOK, v.known)
}

// fetch asks GitHub for the releases of all mods.
func (v *versions) fetch(ctx context.Context) (map[string]string, error) {
	ctx, cancel := context.WithTimeout(ctx, githubTimeout)
	defer cancel()
	latest := map[string]string{}
	for key, repository := range repositories {
		version, err := v.latest(ctx, repository)
		if err != nil {
			return nil, err
		}
		latest[key] = version
	}
	return latest, nil
}

// latest returns the highest version of the releases of a repository. It reads the list of
// releases, because /releases/latest skips pre-releases, and all versions are pre-releases
// so far.
func (v *versions) latest(ctx context.Context, repository string) (string, error) {
	github, client := v.github, v.client
	if github == "" {
		github = "https://api.github.com"
	}
	if client == nil {
		client = http.DefaultClient
	}
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, github+"/repos/"+repository+"/releases?per_page=100", nil)
	if err != nil {
		return "", err
	}
	req.Header.Set("Accept", "application/vnd.github+json")
	req.Header.Set("X-GitHub-Api-Version", "2022-11-28")
	req.Header.Set("User-Agent", "c0de.at")
	resp, err := client.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("%s: %s", repository, resp.Status)
	}
	var releases []struct {
		Tag   string `json:"tag_name"`
		Draft bool   `json:"draft"`
	}
	if err := json.NewDecoder(io.LimitReader(resp.Body, 4<<20)).Decode(&releases); err != nil {
		return "", fmt.Errorf("%s: %w", repository, err)
	}
	best := ""
	var bestKey [4]int
	for _, release := range releases {
		key, ok := versionKey(release.Tag)
		if ok && !release.Draft && (best == "" || less(bestKey, key)) {
			best, bestKey = trimV(release.Tag), key
		}
	}
	if best == "" {
		return "", fmt.Errorf("%s: no release", repository)
	}
	return best, nil
}

var versionPattern = regexp.MustCompile(`^v?(\d+)\.(\d+)\.(\d+)(-[0-9A-Za-z.-]+)?$`)

// versionKey sorts versions: major, minor, patch, and 1 for a release, 0 for a
// pre-release of the same version (1.0.0-rc.1 comes before 1.0.0).
func versionKey(tag string) ([4]int, bool) {
	m := versionPattern.FindStringSubmatch(tag)
	if m == nil {
		return [4]int{}, false
	}
	var key [4]int
	for i := 0; i < 3; i++ {
		n, err := strconv.Atoi(m[i+1])
		if err != nil {
			return key, false
		}
		key[i] = n
	}
	if m[4] == "" {
		key[3] = 1
	}
	return key, true
}

func less(a, b [4]int) bool {
	for i := range a {
		if a[i] != b[i] {
			return a[i] < b[i]
		}
	}
	return false
}

func trimV(tag string) string {
	if len(tag) > 0 && tag[0] == 'v' {
		return tag[1:]
	}
	return tag
}
