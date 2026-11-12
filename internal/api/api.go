// Package api is the small API of c0de.at for the recipes of c0de net (task 9.1): an echo of
// every request, a shared to-do list and the latest versions of the mods (task 9.2). It is a Caddy HTTP handler, used in the Caddyfile
// with the directive c0de_api for the paths /api/*.
package api

import (
	"encoding/json"
	"net"
	"net/http"
	"strings"
	"sync"
	"time"

	"github.com/caddyserver/caddy/v2"
	"github.com/caddyserver/caddy/v2/caddyconfig/caddyfile"
	"github.com/caddyserver/caddy/v2/caddyconfig/httpcaddyfile"
	"github.com/caddyserver/caddy/v2/modules/caddyhttp"
)

const (
	// RequestsPerMinute is how many requests a client may send to the API in a minute.
	RequestsPerMinute = 60
	// maxClients is how many clients the rate limit keeps track of in a minute; more get
	// 429 as well, so a flood of addresses can't fill the memory.
	maxClients = 10000
)

func init() {
	caddy.RegisterModule(new(API))
	httpcaddyfile.RegisterHandlerDirective("c0de_api", func(h httpcaddyfile.Helper) (caddyhttp.MiddlewareHandler, error) {
		a := new(API)
		return a, a.UnmarshalCaddyfile(h.Dispenser)
	})
	httpcaddyfile.RegisterDirectiveOrder("c0de_api", httpcaddyfile.Before, "file_server")
}

// API is the Caddy module http.handlers.c0de_api. It answers every request itself: the
// paths it doesn't know with 404.
type API struct {
	now      func() time.Time
	limiter  limiter
	todos    todos
	versions versions
}

// CaddyModule returns the Caddy module information.
func (*API) CaddyModule() caddy.ModuleInfo {
	return caddy.ModuleInfo{
		ID:  "http.handlers.c0de_api",
		New: func() caddy.Module { return new(API) },
	}
}

// Provision sets the clock.
func (a *API) Provision(caddy.Context) error {
	a.now = time.Now
	return nil
}

// UnmarshalCaddyfile accepts the directive without options.
func (a *API) UnmarshalCaddyfile(d *caddyfile.Dispenser) error {
	d.Next() // the directive
	if d.NextArg() {
		return d.ArgErr()
	}
	return nil
}

// ServeHTTP answers a request of the API.
func (a *API) ServeHTTP(w http.ResponseWriter, r *http.Request, _ caddyhttp.Handler) error {
	w.Header().Set("Cache-Control", "no-store")
	if !a.limiter.allow(clientIP(r), a.now()) {
		w.Header().Set("Retry-After", "60")
		writeError(w, http.StatusTooManyRequests, "too many requests: at most 60 a minute")
		return nil
	}
	switch path := r.URL.Path; {
	case path == "/api/tutorial/echo" || strings.HasPrefix(path, "/api/tutorial/echo/"):
		echo(w, r)
	case path == "/api/tutorial/todo" || strings.HasPrefix(path, "/api/tutorial/todo/"):
		a.todos.serve(w, r, strings.TrimPrefix(path, "/api/tutorial/todo"), a.now())
	case path == "/api/version":
		a.versions.serve(w, r, a.now())
	default:
		writeError(w, http.StatusNotFound, "no such endpoint")
	}
	return nil
}

// clientIP is the address of the client: behind trusted proxies the one Caddy found in
// X-Forwarded-For (client_ip), otherwise the one of the connection.
func clientIP(r *http.Request) string {
	if ip, ok := caddyhttp.GetVar(r.Context(), caddyhttp.ClientIPVarKey).(string); ok && ip != "" {
		return ip
	}
	host, _, err := net.SplitHostPort(r.RemoteAddr)
	if err != nil {
		return r.RemoteAddr
	}
	return host
}

// limiter counts the requests of every client in the current minute.
type limiter struct {
	mu     sync.Mutex
	minute time.Time
	counts map[string]int
}

func (l *limiter) allow(client string, now time.Time) bool {
	l.mu.Lock()
	defer l.mu.Unlock()
	if minute := now.Truncate(time.Minute); !minute.Equal(l.minute) || l.counts == nil {
		l.minute = minute
		l.counts = map[string]int{}
	}
	if _, known := l.counts[client]; !known && len(l.counts) >= maxClients {
		return false
	}
	l.counts[client]++
	return l.counts[client] <= RequestsPerMinute
}

func writeJSON(w http.ResponseWriter, status int, value any) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(value)
}

// writeError answers with a status and a message: {"error": "..."}.
func writeError(w http.ResponseWriter, status int, message string) {
	writeJSON(w, status, map[string]string{"error": message})
}

var (
	_ caddy.Provisioner           = (*API)(nil)
	_ caddyfile.Unmarshaler       = (*API)(nil)
	_ caddyhttp.MiddlewareHandler = (*API)(nil)
)
