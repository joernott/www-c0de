package api

import (
	"net/http"
	"net/http/httptest"
	"strings"
	"sync/atomic"
	"testing"
	"time"
)

// fakeGitHub answers the lists of releases; fail makes it answer 500.
func fakeGitHub(t *testing.T, fail *atomic.Bool, calls *atomic.Int32) *httptest.Server {
	releases := map[string]string{
		"/repos/joernott/minecraft-c0de/releases": `[
			{"tag_name": "v0.3.1", "draft": false},
			{"tag_name": "v0.5.0", "draft": true},
			{"tag_name": "v0.4.0", "draft": false, "prerelease": true},
			{"tag_name": "v0.4.0-rc.1", "draft": false},
			{"tag_name": "nightly", "draft": false}
		]`,
		"/repos/joernott/minecraft-c0de-net/releases": `[{"tag_name": "v0.2.0"}, {"tag_name": "v0.10.0-beta"}]`,
	}
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		calls.Add(1)
		if r.Header.Get("User-Agent") == "" || r.URL.Query().Get("per_page") != "100" {
			t.Errorf("request to GitHub: %v %s", r.Header, r.URL)
		}
		body, ok := releases[r.URL.Path]
		if fail.Load() || !ok {
			http.Error(w, "down", http.StatusInternalServerError)
			return
		}
		_, _ = w.Write([]byte(body))
	}))
	t.Cleanup(server.Close)
	return server
}

func TestVersion(t *testing.T) {
	var fail atomic.Bool
	var calls atomic.Int32
	a, clock := newAPI()
	a.versions.github = fakeGitHub(t, &fail, &calls).URL

	want := `{"c0de":"0.4.0","c0de_net":"0.10.0-beta"}`
	check := func(when string, status int, body string) {
		t.Helper()
		w := do(t, a, http.MethodGet, "/api/version", "")
		if w.Code != status || !strings.Contains(w.Body.String(), body) {
			t.Errorf("%s: %d %s", when, w.Code, w.Body)
		}
	}
	check("first", http.StatusOK, want)
	check("cached", http.StatusOK, want)
	if calls.Load() != 2 {
		t.Errorf("GitHub was asked %d times, want 2 (one per mod)", calls.Load())
	}

	// GitHub fails after an hour: the last known versions, and no new question for 5 minutes.
	fail.Store(true)
	clock.now = clock.now.Add(versionsTTL)
	check("GitHub down", http.StatusOK, want)
	asked := calls.Load()
	clock.now = clock.now.Add(time.Minute)
	check("GitHub down, a minute later", http.StatusOK, want)
	if calls.Load() != asked {
		t.Error("GitHub was asked again before the retry")
	}
	fail.Store(false)
	clock.now = clock.now.Add(versionsRetry)
	check("GitHub back", http.StatusOK, want)
	if calls.Load() == asked {
		t.Error("GitHub wasn't asked again after the retry")
	}

	if w := do(t, a, http.MethodPost, "/api/version", "{}"); w.Code != http.StatusMethodNotAllowed {
		t.Errorf("POST: %d", w.Code)
	}
}

func TestVersionToken(t *testing.T) {
	var auth []string
	github := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		auth = append(auth, r.Header.Get("Authorization"))
		_, _ = w.Write([]byte(`[{"tag_name": "v1.2.3"}]`))
	}))
	defer github.Close()
	for _, tc := range []struct{ token, want string }{{"", ""}, {"secret", "Bearer secret"}} {
		auth = nil
		a, _ := newAPI()
		a.versions.github, a.versions.token = github.URL, tc.token
		if w := do(t, a, http.MethodGet, "/api/version", ""); w.Code != http.StatusOK {
			t.Errorf("token %q: %d %s", tc.token, w.Code, w.Body)
		}
		for _, got := range auth {
			if got != tc.want {
				t.Errorf("token %q: Authorization %q, want %q", tc.token, got, tc.want)
			}
		}
	}
}

func TestVersionUnknown(t *testing.T) {
	var fail atomic.Bool
	var calls atomic.Int32
	fail.Store(true)
	a, _ := newAPI()
	a.versions.github = fakeGitHub(t, &fail, &calls).URL
	if w := do(t, a, http.MethodGet, "/api/version", ""); w.Code != http.StatusServiceUnavailable {
		t.Errorf("without any known versions: %d %s", w.Code, w.Body)
	}
}

func TestVersionKey(t *testing.T) {
	for _, tc := range []struct{ a, b string }{
		{"0.4.0-rc.1", "0.4.0"},
		{"v0.3.1", "v0.4.0"},
		{"0.9.0", "0.10.0"},
		{"1.9.9", "2.0.0-alpha"},
	} {
		a, okA := versionKey(tc.a)
		b, okB := versionKey(tc.b)
		if !okA || !okB || !less(a, b) || less(b, a) {
			t.Errorf("%s should come before %s", tc.a, tc.b)
		}
	}
	for _, tag := range []string{"nightly", "1.0", "v1.0.0.0", "1.0.0+build"} {
		if _, ok := versionKey(tag); ok {
			t.Errorf("%s is no version", tag)
		}
	}
}
