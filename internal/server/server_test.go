package server

import (
	"bufio"
	"crypto/sha256"
	"crypto/tls"
	"crypto/x509"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"io/fs"
	"net"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"strings"
	"testing"
	"testing/fstest"
	"time"
)

const inlineScriptBody = `window.__VP_SITE_DATA__={"title":"c0de"}`

// testSite replaces the embedded website, so the tests don't depend on a site build.
var testSite = fstest.MapFS{
	"index.html":           {Data: []byte("<h1>home</h1><script>" + inlineScriptBody + "</script><script type=\"module\" src=\"/assets/app.js\"></script>")},
	"index.html.br":        {Data: []byte("brotli home")},
	"c0de/guide.html":      {Data: []byte("<h1>guide</h1>")},
	"c0de/math/index.html": {Data: []byte("<h1>math</h1>")},
	"assets/app.1a2b.js":   {Data: []byte("console.log('app')")},
	"not-found.html":       {Data: []byte("<h1>not found</h1>")},
	"de/not-found.html":    {Data: []byte("<h1>nicht gefunden</h1>")},
}

func TestMain(m *testing.M) {
	siteFS = func() fs.FS { return testSite }
	os.Exit(m.Run())
}

func TestConfigDefaults(t *testing.T) {
	c, err := ConfigFromEnv(func(string) string { return "" })
	if err != nil {
		t.Fatal(err)
	}
	want := Config{Domain: "c0de.at", DataDir: "/data", TLS: TLSACME, HTTPPort: 80, HTTPSPort: 443, HealthPort: 8081}
	if c != want {
		t.Errorf("got %+v, want %+v", c, want)
	}
}

func TestConfigErrors(t *testing.T) {
	for name, env := range map[string]map[string]string{
		"domain with a brace":    {"C0DE_DOMAIN": "c0de.at {"},
		"domain in capitals":     {"C0DE_DOMAIN": "C0DE.AT"},
		"unknown TLS mode":       {"C0DE_TLS": "self-signed"},
		"port not a number":      {"C0DE_HTTP_PORT": "http"},
		"port out of range":      {"C0DE_HTTPS_PORT": "70000"},
		"same ports":             {"C0DE_HTTP_PORT": "8080", "C0DE_HTTPS_PORT": "8080"},
		"health on the web port": {"C0DE_HEALTH_PORT": "80"},
		"data dir with spaces":   {"C0DE_DATA": "/my data"},
		"bind not an address":    {"C0DE_BIND": "localhost"},
		"ACME server over http":  {"C0DE_ACME_CA": "http://pebble:14000/dir"},
		"ACME root with a brace": {"C0DE_ACME_CA_ROOT": "/certs/{root}.pem"},
		"proxy not an address":   {"C0DE_TRUSTED_PROXIES": "10.0.0.0/8 proxy.local"},
		"GitHub API not a URL":   {"C0DE_GITHUB_API": "api.github.com"},
		"GitHub API with braces": {"C0DE_GITHUB_API": "http://github/{x}"},
	} {
		t.Run(name, func(t *testing.T) {
			if _, err := ConfigFromEnv(func(k string) string { return env[k] }); err == nil {
				t.Error("no error")
			}
		})
	}
}

func TestConfigTrustedProxies(t *testing.T) {
	c, err := ConfigFromEnv(func(k string) string {
		return map[string]string{"C0DE_TRUSTED_PROXIES": " 10.0.0.0/8,192.0.2.1  private_ranges "}[k]
	})
	if err != nil {
		t.Fatal(err)
	}
	if c.TrustedProxies != "10.0.0.0/8 192.0.2.1 private_ranges" {
		t.Errorf("got %q", c.TrustedProxies)
	}
	file, err := Caddyfile(c)
	if err != nil {
		t.Fatal(err)
	}
	if !strings.Contains(string(file), "trusted_proxies static 10.0.0.0/8 192.0.2.1 private_ranges") {
		t.Errorf("the Caddyfile doesn't trust the proxies:\n%s", file)
	}
}

func TestCaddyfileTLSModes(t *testing.T) {
	base := Config{Domain: "c0de.at", DataDir: "/data", HTTPPort: 80, HTTPSPort: 443, HealthPort: 8081}
	for mode, want := range map[string][]string{
		TLSACME:     {"\nc0de.at {", "\nwww.c0de.at {"},
		TLSInternal: {"local_certs", "skip_install_trust", "\nc0de.at {"},
		TLSOff:      {"auto_https off", "\nhttp://:80 {"},
	} {
		c := base
		c.TLS = mode
		file, err := Caddyfile(c)
		if err != nil {
			t.Fatal(err)
		}
		for _, w := range want {
			if !strings.Contains(string(file), w) {
				t.Errorf("%s: the Caddyfile doesn't contain %q:\n%s", mode, w, file)
			}
		}
		if mode == TLSACME && strings.Contains(string(file), "local_certs") {
			t.Errorf("acme: the Caddyfile uses the local CA:\n%s", file)
		}
		if mode == TLSOff && strings.Contains(string(file), "www.") {
			t.Errorf("off: the Caddyfile redirects www:\n%s", file)
		}
	}
}

func TestCaddyfileACMEServer(t *testing.T) {
	c := Config{Domain: "c0de.test", DataDir: "/data", TLS: TLSACME, HTTPPort: 80, HTTPSPort: 443, HealthPort: 8081,
		ACMECA: "https://pebble:14000/dir", ACMECARoot: "/pebble/root.pem"}
	file, err := Caddyfile(c)
	if err != nil {
		t.Fatal(err)
	}
	for _, w := range []string{"acme_ca https://pebble:14000/dir", "acme_ca_root /pebble/root.pem"} {
		if !strings.Contains(string(file), w) {
			t.Errorf("the Caddyfile doesn't contain %q", w)
		}
	}
}

func TestContentSecurityPolicy(t *testing.T) {
	csp, err := contentSecurityPolicy(testSite)
	if err != nil {
		t.Fatal(err)
	}
	sum := sha256.Sum256([]byte(inlineScriptBody))
	hash := "'sha256-" + base64.StdEncoding.EncodeToString(sum[:]) + "'"
	if !strings.Contains(csp, "script-src 'self' "+hash+";") {
		t.Errorf("the policy doesn't allow the inline script %s: %s", hash, csp)
	}
	scripts := strings.Split(strings.Split(csp, "script-src")[1], ";")[0]
	if strings.Contains(scripts, "unsafe") {
		t.Errorf("the policy allows unsafe scripts: %s", csp)
	}
}

// start runs the server for the test and stops it at the end.
func start(t *testing.T, c Config) {
	t.Helper()
	if err := Start(c); err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() {
		if err := Stop(); err != nil {
			t.Error(err)
		}
	})
}

// dataDir returns a folder for the data of the server. On Windows, Caddy may still hold
// the access log open when the test ends, so the folder is removed as far as possible.
func dataDir(t *testing.T) string {
	t.Helper()
	dir, err := os.MkdirTemp("", "c0de-www-test-")
	if err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() { _ = os.RemoveAll(dir) })
	return dir
}

func freePorts(t *testing.T, n int) []int {
	t.Helper()
	var ports []int
	for range n {
		l, err := net.Listen("tcp", "127.0.0.1:0")
		if err != nil {
			t.Fatal(err)
		}
		defer l.Close()
		ports = append(ports, l.Addr().(*net.TCPAddr).Port)
	}
	return ports
}

func testConfig(t *testing.T, mode string) Config {
	ports := freePorts(t, 3)
	return Config{Domain: "localhost", DataDir: dataDir(t), TLS: mode, HTTPPort: ports[0], HTTPSPort: ports[1],
		HealthPort: ports[2], Bind: "127.0.0.1"}
}

func get(t *testing.T, client *http.Client, url string, header ...string) (*http.Response, string) {
	t.Helper()
	req, err := http.NewRequest(http.MethodGet, url, nil)
	if err != nil {
		t.Fatal(err)
	}
	for i := 0; i+1 < len(header); i += 2 {
		req.Header.Set(header[i], header[i+1])
	}
	resp, err := client.Do(req)
	if err != nil {
		t.Fatal(err)
	}
	defer resp.Body.Close()
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		t.Fatal(err)
	}
	return resp, string(body)
}

// The transport doesn't decompress, so the tests see what the server sends.
var plainClient = &http.Client{Transport: &http.Transport{DisableCompression: true}}

func TestServeHTTP(t *testing.T) {
	c := testConfig(t, TLSOff)
	start(t, c)
	base := fmt.Sprintf("http://127.0.0.1:%d", c.HTTPPort)
	for _, tc := range []struct {
		path   string
		status int
		body   string
	}{
		{"/", http.StatusOK, "home"},
		{"/c0de/guide", http.StatusOK, "guide"},
		{"/c0de/guide.html", http.StatusOK, "guide"},
		{"/c0de/math/", http.StatusOK, "math"},
		{"/missing", http.StatusNotFound, "not found"},
		{"/de/missing", http.StatusNotFound, "nicht gefunden"},
		{"/design", http.StatusNotFound, "not found"},
	} {
		resp, body := get(t, plainClient, base+tc.path)
		if resp.StatusCode != tc.status || !strings.Contains(body, tc.body) {
			t.Errorf("%s: got %d %q, want %d with %q", tc.path, resp.StatusCode, body, tc.status, tc.body)
		}
	}
}

func TestHeaders(t *testing.T) {
	c := testConfig(t, TLSOff)
	start(t, c)
	base := fmt.Sprintf("http://127.0.0.1:%d", c.HTTPPort)

	page, _ := get(t, plainClient, base+"/c0de/guide")
	for header, want := range map[string]string{
		"Strict-Transport-Security":  "max-age=31536000",
		"X-Content-Type-Options":     "nosniff",
		"X-Frame-Options":            "DENY",
		"Referrer-Policy":            "strict-origin-when-cross-origin",
		"Cross-Origin-Opener-Policy": "same-origin",
		"Cache-Control":              "no-cache",
		"Server":                     "",
	} {
		if got := page.Header.Get(header); got != want {
			t.Errorf("%s: got %q, want %q", header, got, want)
		}
	}
	if csp := page.Header.Get("Content-Security-Policy"); !strings.Contains(csp, "default-src 'self'") {
		t.Errorf("Content-Security-Policy: %q", csp)
	}

	asset, _ := get(t, plainClient, base+"/assets/app.1a2b.js")
	if got := asset.Header.Get("Cache-Control"); got != "public, max-age=31536000, immutable" {
		t.Errorf("Cache-Control of an asset: %q", got)
	}

	missing, _ := get(t, plainClient, base+"/missing")
	if missing.Header.Get("Content-Security-Policy") == "" {
		t.Error("the not-found page has no Content-Security-Policy")
	}
}

func TestRevalidation(t *testing.T) {
	c := testConfig(t, TLSOff)
	start(t, c)
	url := fmt.Sprintf("http://127.0.0.1:%d/c0de/guide", c.HTTPPort)
	first, _ := get(t, plainClient, url)
	etag := first.Header.Get("ETag")
	if etag == "" {
		t.Fatal("no ETag")
	}
	second, _ := get(t, plainClient, url, "If-None-Match", etag)
	if second.StatusCode != http.StatusNotModified {
		t.Errorf("revalidation: got %d, want 304", second.StatusCode)
	}
}

func TestPrecompressed(t *testing.T) {
	c := testConfig(t, TLSOff)
	start(t, c)
	resp, body := get(t, plainClient, fmt.Sprintf("http://127.0.0.1:%d/", c.HTTPPort), "Accept-Encoding", "br, gzip")
	if resp.Header.Get("Content-Encoding") != "br" || body != "brotli home" {
		t.Errorf("got %q encoded as %q", body, resp.Header.Get("Content-Encoding"))
	}
}

func TestHealth(t *testing.T) {
	c := testConfig(t, TLSOff)
	if err := Health(c); err == nil {
		t.Error("healthy without a server")
	}
	start(t, c)
	if err := Health(c); err != nil {
		t.Error(err)
	}
}

func TestAccessLog(t *testing.T) {
	c := testConfig(t, TLSOff)
	start(t, c)
	get(t, plainClient, fmt.Sprintf("http://127.0.0.1:%d/c0de/guide", c.HTTPPort),
		"Cookie", "secret=1", "User-Agent", "test-browser", "Referer", "https://example.com/")

	// The log is written asynchronously.
	var entry map[string]any
	for deadline := time.Now().Add(5 * time.Second); entry == nil; time.Sleep(100 * time.Millisecond) {
		if time.Now().After(deadline) {
			t.Fatal("no access log entry")
		}
		f, err := os.Open(filepath.Join(c.DataDir, "log", "access.log"))
		if err != nil {
			continue
		}
		scanner := bufio.NewScanner(f)
		for scanner.Scan() {
			var e map[string]any
			if json.Unmarshal(scanner.Bytes(), &e) == nil && e["request"] != nil {
				entry = e
			}
		}
		f.Close()
	}
	request := entry["request"].(map[string]any)
	headers := request["headers"].(map[string]any)
	if request["remote_ip"] != "127.0.0.1" || request["remote_port"] == "" || request["uri"] != "/c0de/guide" {
		t.Errorf("request: %v", request)
	}
	if fmt.Sprint(headers["User-Agent"]) != "[test-browser]" || fmt.Sprint(headers["Referer"]) != "[https://example.com/]" {
		t.Errorf("headers: %v", headers)
	}
	if fmt.Sprint(headers["Cookie"]) != "[REDACTED]" {
		t.Errorf("the cookie is logged: %v", headers["Cookie"])
	}
	for _, field := range []string{"ts", "status", "size", "duration"} {
		if _, ok := entry[field]; !ok {
			t.Errorf("the entry has no %s: %v", field, entry)
		}
	}
}

func TestServeHTTPSWithInternalCA(t *testing.T) {
	c := testConfig(t, TLSInternal)
	start(t, c)

	// The root certificate of the local CA is created when the server starts.
	root, err := os.ReadFile(filepath.Join(c.DataDir, "caddy", "pki", "authorities", "local", "root.crt"))
	if err != nil {
		t.Fatal(err)
	}
	pool := x509.NewCertPool()
	if !pool.AppendCertsFromPEM(root) {
		t.Fatal("the root certificate can't be read")
	}
	client := &http.Client{
		Timeout:   10 * time.Second,
		Transport: &http.Transport{TLSClientConfig: &tls.Config{RootCAs: pool}},
		CheckRedirect: func(*http.Request, []*http.Request) error {
			return http.ErrUseLastResponse
		},
	}

	// Caddy creates the certificate in the background after starting.
	url := fmt.Sprintf("https://localhost:%d/", c.HTTPSPort)
	for deadline := time.Now().Add(10 * time.Second); ; time.Sleep(100 * time.Millisecond) {
		resp, err := client.Get(url)
		if err == nil {
			resp.Body.Close()
			break
		}
		if time.Now().After(deadline) {
			t.Fatal(err)
		}
	}
	resp, body := get(t, client, url)
	if resp.StatusCode != http.StatusOK || !strings.Contains(body, "home") {
		t.Errorf("HTTPS: got %d %q", resp.StatusCode, body)
	}

	// Caddy treats its HTTPS port as internal (the container maps 443 to it), so the
	// redirect leads to the standard port.
	from := fmt.Sprintf("http://localhost:%d/c0de/guide", c.HTTPPort)
	redirect, _ := get(t, client, from)
	if redirect.StatusCode != http.StatusPermanentRedirect || redirect.Header.Get("Location") != "https://localhost/c0de/guide" {
		t.Errorf("%s: got %d to %q", from, redirect.StatusCode, redirect.Header.Get("Location"))
	}

	// www.localhost doesn't resolve everywhere, so the request goes to localhost with the
	// host name www.localhost.
	req, err := http.NewRequest(http.MethodGet, fmt.Sprintf("https://localhost:%d/c0de/", c.HTTPSPort), nil)
	if err != nil {
		t.Fatal(err)
	}
	req.Host = "www.localhost"
	www, err := client.Do(req)
	if err != nil {
		t.Fatal(err)
	}
	www.Body.Close()
	if www.StatusCode != http.StatusMovedPermanently || www.Header.Get("Location") != "https://localhost/c0de/" {
		t.Errorf("www: got %d to %q", www.StatusCode, www.Header.Get("Location"))
	}
}

// logEntry returns the last request in the access log, waiting until it is written.
func logEntry(t *testing.T, c Config, uri string) map[string]any {
	t.Helper()
	for deadline := time.Now().Add(5 * time.Second); ; time.Sleep(100 * time.Millisecond) {
		if time.Now().After(deadline) {
			t.Fatalf("no access log entry for %s", uri)
		}
		f, err := os.Open(filepath.Join(c.DataDir, "log", "access.log"))
		if err != nil {
			continue
		}
		var found map[string]any
		scanner := bufio.NewScanner(f)
		for scanner.Scan() {
			var e map[string]any
			if json.Unmarshal(scanner.Bytes(), &e) == nil {
				if r, ok := e["request"].(map[string]any); ok && r["uri"] == uri {
					found = e
				}
			}
		}
		f.Close()
		if found != nil {
			return found
		}
	}
}

func TestBehindAReverseProxy(t *testing.T) {
	for name, tc := range map[string]struct {
		proxies string
		client  string
	}{
		"trusted proxy":   {"127.0.0.1/32", "203.0.113.7"},
		"untrusted proxy": {"", "127.0.0.1"},
	} {
		t.Run(name, func(t *testing.T) {
			c := testConfig(t, TLSOff)
			c.TrustedProxies = tc.proxies
			start(t, c)
			uri := "/c0de/guide?" + strings.ReplaceAll(name, " ", "-")
			// The client sent a faked address; the proxy appended the real one.
			get(t, plainClient, fmt.Sprintf("http://127.0.0.1:%d%s", c.HTTPPort, uri), "X-Forwarded-For", "198.51.100.66, 203.0.113.7")
			request := logEntry(t, c, uri)["request"].(map[string]any)
			if request["client_ip"] != tc.client || request["remote_ip"] != "127.0.0.1" {
				t.Errorf("client_ip %v, remote_ip %v; want client_ip %s", request["client_ip"], request["remote_ip"], tc.client)
			}
		})
	}
}

func TestAPI(t *testing.T) {
	github := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		_, _ = w.Write([]byte(`[{"tag_name": "v1.2.3"}]`))
	}))
	defer github.Close()
	c := testConfig(t, TLSOff)
	c.GitHubAPI = github.URL
	start(t, c)
	base := fmt.Sprintf("http://127.0.0.1:%d", c.HTTPPort)

	req, err := http.NewRequest(http.MethodTrace, base+"/api/tutorial/echo?a=1", nil)
	if err != nil {
		t.Fatal(err)
	}
	req.Header.Set("X-Lamp", "attic")
	resp, err := plainClient.Do(req)
	if err != nil {
		t.Fatal(err)
	}
	defer resp.Body.Close()
	var echoed struct {
		Method  string            `json:"method"`
		Query   string            `json:"query"`
		Headers map[string]string `json:"headers"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&echoed); err != nil {
		t.Fatal(err)
	}
	if resp.StatusCode != http.StatusOK || echoed.Method != http.MethodTrace || echoed.Query != "a=1" || echoed.Headers["x-lamp"] != "attic" {
		t.Errorf("echo: %d %+v", resp.StatusCode, echoed)
	}
	for header, want := range map[string]string{
		"Cache-Control":          "no-store",
		"X-Content-Type-Options": "nosniff",
		"Content-Type":           "application/json; charset=utf-8",
	} {
		if got := resp.Header.Get(header); got != want {
			t.Errorf("%s: got %q, want %q", header, got, want)
		}
	}

	// Unknown paths of the API answer in JSON, not with the not-found page.
	missing, body := get(t, plainClient, base+"/api/missing")
	if missing.StatusCode != http.StatusNotFound || !strings.Contains(body, `"error"`) {
		t.Errorf("/api/missing: %d %q", missing.StatusCode, body)
	}
	// The versions come from the configured GitHub.
	if resp, body := get(t, plainClient, base+"/api/version"); resp.StatusCode != http.StatusOK || !strings.Contains(body, `"c0de":"1.2.3"`) {
		t.Errorf("/api/version: %d %q", resp.StatusCode, body)
	}
	// The pages are still served.
	if page, body := get(t, plainClient, base+"/c0de/guide"); page.StatusCode != http.StatusOK || !strings.Contains(body, "guide") {
		t.Errorf("/c0de/guide: %d %q", page.StatusCode, body)
	}
}
