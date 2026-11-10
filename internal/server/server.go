// Package server runs Caddy with the configuration of the website.
package server

import (
	"bytes"
	_ "embed"
	"fmt"
	"text/template"

	"github.com/caddyserver/caddy/v2"
	"github.com/caddyserver/caddy/v2/caddyconfig"

	// The Caddyfile adapter and the standard modules of Caddy.
	_ "github.com/caddyserver/caddy/v2/caddyconfig/caddyfile"
	_ "github.com/caddyserver/caddy/v2/modules/standard"
)

//go:embed Caddyfile.tmpl
var caddyfileTemplate string

var caddyfileTmpl = template.Must(template.New("Caddyfile").Parse(caddyfileTemplate))

// Caddyfile returns the Caddyfile for the configuration.
func Caddyfile(c Config) ([]byte, error) {
	if err := c.Validate(); err != nil {
		return nil, err
	}
	var buf bytes.Buffer
	if err := caddyfileTmpl.Execute(&buf, c); err != nil {
		return nil, err
	}
	return buf.Bytes(), nil
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
