// Package server runs Caddy with the configuration of the website.
package server

import (
	"bytes"
	_ "embed"
	"fmt"
	"net/http"
	"text/template"
	"time"

	"github.com/caddyserver/caddy/v2"
	"github.com/caddyserver/caddy/v2/caddyconfig"

	// The Caddyfile adapter and the standard modules of Caddy.
	_ "github.com/caddyserver/caddy/v2/caddyconfig/caddyfile"
	_ "github.com/caddyserver/caddy/v2/modules/standard"
)

//go:embed Caddyfile.tmpl
var caddyfileTemplate string

var caddyfileTmpl = template.Must(template.New("Caddyfile").Parse(caddyfileTemplate))

// Caddyfile returns the Caddyfile for the configuration and the embedded website.
func Caddyfile(c Config) ([]byte, error) {
	if err := c.Validate(); err != nil {
		return nil, err
	}
	csp, err := contentSecurityPolicy(siteFS())
	if err != nil {
		return nil, fmt.Errorf("reading the scripts of the website: %w", err)
	}
	var buf bytes.Buffer
	data := struct {
		Config
		CSP string
	}{c, csp}
	if err := caddyfileTmpl.Execute(&buf, data); err != nil {
		return nil, err
	}
	return buf.Bytes(), nil
}

// Health checks the health check of a running server on 127.0.0.1.
func Health(c Config) error {
	client := http.Client{Timeout: 3 * time.Second}
	resp, err := client.Get(fmt.Sprintf("http://127.0.0.1:%d/healthz", c.HealthPort))
	if err != nil {
		return err
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("the health check answers %s", resp.Status)
	}
	return nil
}

// Start starts Caddy with the configuration. It returns when the server listens; Stop ends
// it.
func Start(c Config) error {
	file, err := Caddyfile(c)
	if err != nil {
		return err
	}
	cfg, warnings, err := caddyconfig.GetAdapter("caddyfile").Adapt(file, map[string]any{"filename": "Caddyfile"})
	if err != nil {
		return fmt.Errorf("adapting the Caddyfile: %w", err)
	}
	if len(warnings) > 0 {
		return fmt.Errorf("the Caddyfile has warnings: %v", warnings)
	}
	return caddy.Load(cfg, true)
}

// Stop stops Caddy.
func Stop() error {
	return caddy.Stop()
}
