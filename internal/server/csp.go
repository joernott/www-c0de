package server

import (
	"crypto/sha256"
	"encoding/base64"
	"io/fs"
	"regexp"
	"slices"
	"strings"
)

var inlineScript = regexp.MustCompile(`(?s)<script\b([^>]*)>(.*?)</script>`)

// scriptHashes returns the hashes of the inline scripts of all pages of the site, in the
// form of the Content-Security-Policy ('sha256-...'). VitePress writes a few small inline
// scripts into every page; allowing exactly these keeps 'unsafe-inline' out of the policy.
func scriptHashes(site fs.FS) ([]string, error) {
	seen := map[string]bool{}
	err := fs.WalkDir(site, ".", func(path string, d fs.DirEntry, err error) error {
		if err != nil || d.IsDir() || !strings.HasSuffix(path, ".html") {
			return err
		}
		page, err := fs.ReadFile(site, path)
		if err != nil {
			return err
		}
		for _, m := range inlineScript.FindAllSubmatch(page, -1) {
			if strings.Contains(string(m[1]), "src=") || len(m[2]) == 0 {
				continue
			}
			sum := sha256.Sum256(m[2])
			seen["'sha256-"+base64.StdEncoding.EncodeToString(sum[:])+"'"] = true
		}
		return nil
	})
	hashes := make([]string, 0, len(seen))
	for h := range seen {
		hashes = append(hashes, h)
	}
	slices.Sort(hashes)
	return hashes, err
}

// contentSecurityPolicy returns the policy of the site: everything comes from the site
// itself. Styles need 'unsafe-inline', because the colors of the code and of the tabs are
// style attributes; scripts don't.
func contentSecurityPolicy(site fs.FS) (string, error) {
	hashes, err := scriptHashes(site)
	if err != nil {
		return "", err
	}
	return strings.Join([]string{
		"default-src 'self'",
		"script-src " + strings.Join(append([]string{"'self'"}, hashes...), " "),
		"style-src 'self' 'unsafe-inline'",
		"img-src 'self'",
		"font-src 'self'",
		"connect-src 'self'",
		"object-src 'none'",
		"base-uri 'self'",
		"form-action 'none'",
		"frame-ancestors 'none'",
	}, "; "), nil
}
