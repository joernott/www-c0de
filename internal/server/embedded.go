package server

import (
	"errors"
	"io"
	"io/fs"
	"path/filepath"
	"time"

	"github.com/caddyserver/caddy/v2"
	"github.com/caddyserver/caddy/v2/caddyconfig/caddyfile"

	"github.com/joernott/www-c0de/internal/site"
)

func init() {
	caddy.RegisterModule(Embedded{})
}

// siteFS returns the website the module serves. Tests replace it.
var siteFS = site.FS

// started is the modification time of all embedded files. Embedded files have none, and
// without one Caddy sends no ETag, so browsers couldn't revalidate their copies. The start
// of the server changes with every deployment, like the files may.
var started = time.Now().Truncate(time.Second)

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
// separators are converted (which only changes anything on Windows, where the tests and
// quick checks run).
func (e *Embedded) Open(name string) (fs.File, error) {
	f, err := e.site.Open(filepath.ToSlash(name))
	if err != nil {
		return nil, err
	}
	return file{f}, nil
}

// UnmarshalCaddyfile accepts the module without options.
func (e *Embedded) UnmarshalCaddyfile(d *caddyfile.Dispenser) error {
	d.Next() // the module name
	if d.NextArg() {
		return d.ArgErr()
	}
	return nil
}

// file is an embedded file with the modification time "started". It keeps the methods
// Caddy needs: Seek for serving files, ReadDir for directories.
type file struct {
	fs.File
}

func (f file) Stat() (fs.FileInfo, error) {
	info, err := f.File.Stat()
	if err != nil {
		return nil, err
	}
	return fileInfo{info}, nil
}

func (f file) Seek(offset int64, whence int) (int64, error) {
	if s, ok := f.File.(io.Seeker); ok {
		return s.Seek(offset, whence)
	}
	return 0, errors.ErrUnsupported
}

func (f file) ReadDir(n int) ([]fs.DirEntry, error) {
	if d, ok := f.File.(fs.ReadDirFile); ok {
		return d.ReadDir(n)
	}
	return nil, errors.ErrUnsupported
}

type fileInfo struct {
	fs.FileInfo
}

func (fileInfo) ModTime() time.Time { return started }

var (
	_ caddy.Provisioner     = (*Embedded)(nil)
	_ caddyfile.Unmarshaler = (*Embedded)(nil)
	_ fs.FS                 = (*Embedded)(nil)
	_ io.ReadSeeker         = file{}
)
