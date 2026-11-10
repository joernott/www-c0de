package server

import (
	"fmt"
	"net/netip"
	"regexp"
	"strconv"
)

// TLS modes of the server.
const (
	// TLSACME gets the certificates from Let's Encrypt.
	TLSACME = "acme"
	// TLSInternal uses the local certificate authority of Caddy, for tests.
	TLSInternal = "internal"
	// TLSOff serves plain HTTP on the HTTP port only, for quick checks on a workstation.
	TLSOff = "off"
)

// Config holds the settings of the server. They are read from environment variables, so
// that nothing in the image depends on the host it runs on.
type Config struct {
	// Domain is the domain the site is served for (C0DE_DOMAIN, default c0de.at).
	Domain string
	// DataDir keeps the certificates and the ACME account (C0DE_DATA, default /data).
	DataDir string
	// TLS is one of TLSACME, TLSInternal or TLSOff (C0DE_TLS, default acme).
	TLS string
	// HTTPPort is the port for HTTP (C0DE_HTTP_PORT, default 80).
	HTTPPort int
	// HTTPSPort is the port for HTTPS and HTTP/3 (C0DE_HTTPS_PORT, default 443).
	HTTPSPort int
	// Bind is the IP address to listen on (C0DE_BIND, default all addresses).
	Bind string
}

var domainPattern = regexp.MustCompile(`^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$`)

// ConfigFromEnv reads the configuration with the function getenv (usually os.Getenv) and
// checks it.
func ConfigFromEnv(getenv func(string) string) (Config, error) {
	c := Config{
		Domain:  valueOr(getenv("C0DE_DOMAIN"), "c0de.at"),
		DataDir: valueOr(getenv("C0DE_DATA"), "/data"),
		TLS:     valueOr(getenv("C0DE_TLS"), TLSACME),
		Bind:    getenv("C0DE_BIND"),
	}
	var err error
	if c.HTTPPort, err = port("C0DE_HTTP_PORT", valueOr(getenv("C0DE_HTTP_PORT"), "80")); err != nil {
		return c, err
	}
	if c.HTTPSPort, err = port("C0DE_HTTPS_PORT", valueOr(getenv("C0DE_HTTPS_PORT"), "443")); err != nil {
		return c, err
	}
	return c, c.Validate()
}

// Validate checks the configuration. The values end up in the Caddyfile, so they are
// restricted to what they can legitimately contain.
func (c Config) Validate() error {
	if !domainPattern.MatchString(c.Domain) {
		return fmt.Errorf("C0DE_DOMAIN: %q is not a valid domain name", c.Domain)
	}
	switch c.TLS {
	case TLSACME, TLSInternal, TLSOff:
	default:
		return fmt.Errorf("C0DE_TLS: %q is not one of %s, %s or %s", c.TLS, TLSACME, TLSInternal, TLSOff)
	}
	if c.DataDir == "" || regexp.MustCompile(`[\s{}"#]`).MatchString(c.DataDir) {
		return fmt.Errorf("C0DE_DATA: %q is not a usable folder name", c.DataDir)
	}
	if c.Bind != "" {
		if _, err := netip.ParseAddr(c.Bind); err != nil {
			return fmt.Errorf("C0DE_BIND: %q is not an IP address", c.Bind)
		}
	}
	if c.HTTPPort == c.HTTPSPort {
		return fmt.Errorf("C0DE_HTTP_PORT and C0DE_HTTPS_PORT are both %d", c.HTTPPort)
	}
	return nil
}

func valueOr(value, fallback string) string {
	if value == "" {
		return fallback
	}
	return value
}

func port(name, value string) (int, error) {
	p, err := strconv.Atoi(value)
	if err != nil || p < 1 || p > 65535 {
		return 0, fmt.Errorf("%s: %q is not a port number", name, value)
	}
	return p, nil
}
