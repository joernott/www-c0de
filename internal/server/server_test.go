package server

import (
	"crypto/tls"
	"crypto/x509"
	"fmt"
	"io"
	"io/fs"
	"net"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"testing"
	"testing/fstest"
	"time"
)

// testSite replaces the embedded website, so the tests don't depend on a site build.
var testSite = fstest.MapFS{
	"index.html":           {Data: []byte("<h1>home</h1>")},
	"c0de/guide.html":      {Data: []byte("<h1>guide</h1>")},
	"c0de/math/index.html": {Data: []byte("<h1>math</h1>")},
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
	want := Config{Domain: "c0de.at", DataDir: "/data", TLS: TLSACME, HTTPPort: 80, HTTPSPort: 443}
	if c != want {
		t.Errorf("got %+v, want %+v", c, want)
	}
}

func TestConfigErrors(t *testing.T) {
	for name, env := range map[string]map[string]string{
		"domain with a brace":  {"C0DE_DOMAIN": "c0de.at {"},
		"domain in capitals":   {"C0DE_DOMAIN": "C0DE.AT"},
		"unknown TLS mode":     {"C0DE_TLS": "self-signed"},
		"port not a number":    {"C0DE_HTTP_PORT": "http"},
		"port out of range":    {"C0DE_HTTPS_PORT": "70000"},
		"same ports":           {"C0DE_HTTP_PORT": "8080", "C0DE_HTTPS_PORT": "8080"},
		"data dir with spaces": {"C0DE_DATA": "/my data"},
		"bind not an address":  {"C0DE_BIND": "localhost"},
	} {
		t.Run(name, func(t *testing.T) {
			if _, err := ConfigFromEnv(func(k string) string { return env[k] }); err == nil {
				t.Error("no error")
			}
		})
	}
}

func TestCaddyfileTLSModes(t *testing.T) {
	base := Config{Domain: "c0de.at", DataDir: "/data", HTTPPort: 80, HTTPSPort: 443}
	for mode, want := range map[string][]string{
		TLSACME:     {"\nc0de.at {"},
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

func get(t *testing.T, client *http.Client, url string) (int, string) {
	t.Helper()
	resp, err := client.Get(url)
	if err != nil {
		t.Fatal(err)
	}
	defer resp.Body.Close()
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		t.Fatal(err)
	}
	return resp.StatusCode, string(body)
}

func TestServeHTTP(t *testing.T) {
	ports := freePorts(t, 2)
	start(t, Config{Domain: "localhost", DataDir: t.TempDir(), TLS: TLSOff, HTTPPort: ports[0], HTTPSPort: ports[1], Bind: "127.0.0.1"})
	base := fmt.Sprintf("http://127.0.0.1:%d", ports[0])
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
		status, body := get(t, http.DefaultClient, base+tc.path)
		if status != tc.status || !strings.Contains(body, tc.body) {
			t.Errorf("%s: got %d %q, want %d with %q", tc.path, status, body, tc.status, tc.body)
		}
	}
}

func TestServeHTTPSWithInternalCA(t *testing.T) {
	ports := freePorts(t, 2)
	data := t.TempDir()
	start(t, Config{Domain: "localhost", DataDir: data, TLS: TLSInternal, HTTPPort: ports[0], HTTPSPort: ports[1], Bind: "127.0.0.1"})

	// The root certificate of the local CA is created when the server starts.
	root, err := os.ReadFile(filepath.Join(data, "caddy", "pki", "authorities", "local", "root.crt"))
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
	url := fmt.Sprintf("https://localhost:%d/", ports[1])
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
	status, body := get(t, client, url)
	if status != http.StatusOK || !strings.Contains(body, "home") {
		t.Errorf("HTTPS: got %d %q", status, body)
	}

	resp, err := client.Get(fmt.Sprintf("http://localhost:%d/c0de/guide", ports[0]))
	if err != nil {
		t.Fatal(err)
	}
	resp.Body.Close()
	// Caddy treats its HTTPS port as internal (the container maps 443 to it), so the
	// redirect leads to the standard port.
	want := "https://localhost/c0de/guide"
	if resp.StatusCode != http.StatusPermanentRedirect || resp.Header.Get("Location") != want {
		t.Errorf("HTTP: got %d to %q, want a redirect to %q", resp.StatusCode, resp.Header.Get("Location"), want)
	}
}
