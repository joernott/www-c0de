package server

import (
	"io/fs"
	"path/filepath"

	"github.com/caddyserver/caddy/v2"
	"github.com/caddyserver/caddy/v2/caddyconfig/caddyfile"

	"github.com/joernott/www-c0de/internal/site"
)

func init() {
	caddy.RegisterModule(Embedded{})
}

// siteFS returns the website the module serves. Tests replace it.
var siteFS = site.FS

// Embedded is the Caddy file system module caddy.fs.embedded. It serves the website that
// is embedded into the binary. In the Caddyfile it is declared with the global option
// "filesystem <name> embedded" and used with "fs <name>".
type Embedded struct {
	site fs.FS
}

// CaddyModule returns the Caddy module information.
func (Embedded) CaddyModule() caddy.ModuleInfo {
	return caddy.ModuleInfo{
		ID:  "caddy.fs.embedded",
		New: func() caddy.Module { return new(Embedded) },
	}
}

// Provision opens the embedded website.
func (e *Embedded) Provision(caddy.Context) error {
	e.site = siteFS()
	return nil
}

// Open opens a file of the website. Caddy joins the site root and the request path with
// the separator of the operating system, but an fs.FS only accepts slashes, so the
// separators are converted (which only changes anything on Windows, where the tests and quick checks run).
func (e *Embedded) Open(name string) (fs.File, error) {
	return e.site.Open(filepath.ToSlash(name))
}

// UnmarshalCaddyfile accepts the module without options.
func (e *Embedded) UnmarshalCaddyfile(d *caddyfile.Dispenser) error {
	d.Next() // the module name
	if d.NextArg() {
		return d.ArgErr()
	}
	return nil
}

var (
	_ caddy.Provisioner     = (*Embedded)(nil)
	_ caddyfile.Unmarshaler = (*Embedded)(nil)
	_ fs.FS                 = (*Embedded)(nil)
)
