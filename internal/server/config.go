package server

import (
	"fmt"
	"net/netip"
	"net/url"
	"regexp"
	"strconv"
	"strings"
)

// TLS modes of the server.
const (
	// TLSACME gets the certificates from Let's Encrypt.
	TLSACME = "acme"
	// TLSInternal uses the local certificate authority of Caddy, for tests.
	TLSInternal = "internal"
	// TLSOff serves plain HTTP on the HTTP port only: behind a reverse proxy that does the
	// TLS (c0de-www run --httponly), or for quick checks on a workstation.
	TLSOff = "off"
)

// Config holds the settings of the server. They are read from environment variables, so
// that nothing in the image depends on the host it runs on.
type Config struct {
	// Domain is the domain the site is served for (C0DE_DOMAIN, default c0de.at). In the
	// TLS modes acme and internal, www.<domain> redirects to it.
	Domain string
	// DataDir keeps the certificates, the ACME account and the access log (C0DE_DATA,
	// default /data).
	DataDir string
	// TLS is one of TLSACME, TLSInternal or TLSOff (C0DE_TLS, default acme).
	TLS string
	// HTTPPort is the port for HTTP (C0DE_HTTP_PORT, default 80).
	HTTPPort int
	// HTTPSPort is the port for HTTPS and HTTP/3 (C0DE_HTTPS_PORT, default 443).
	HTTPSPort int
	// HealthPort is the port of the health check on 127.0.0.1 (C0DE_HEALTH_PORT, default
	// 8081).
	HealthPort int
	// Bind is the IP address to listen on (C0DE_BIND, default all addresses).
	Bind string
	// ACMECA is the directory URL of another ACME server than Let's Encrypt, e.g. Pebble
	// for tests (C0DE_ACME_CA).
	ACMECA string
	// ACMECARoot is the root certificate (PEM file) of that ACME server (C0DE_ACME_CA_ROOT).
	ACMECARoot string
	// TrustedProxies are the reverse proxies in front of the server, as IP addresses or
	// ranges (CIDR) separated by spaces or commas, or "private_ranges"
	// (C0DE_TRUSTED_PROXIES). The address of the client is then taken from the header
	// X-Forwarded-For of their requests and logged as client_ip.
	TrustedProxies string
	// GitHubAPI is the address of the GitHub API for /api/version (C0DE_GITHUB_API, default
	// https://api.github.com); the tests of the tutorial programs point it to a fake one.
	GitHubAPI string
}

var (
	domainPattern = regexp.MustCompile(`^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$`)
	// Characters that a path can't contain in the Caddyfile.
	unsafePath = regexp.MustCompile(`[\s{}"#]`)
)

// ConfigFromEnv reads the configuration with the function getenv (usually os.Getenv) and
// checks it.
func ConfigFromEnv(getenv func(string) string) (Config, error) {
	c := Config{
		Domain:     valueOr(getenv("C0DE_DOMAIN"), "c0de.at"),
		DataDir:    valueOr(getenv("C0DE_DATA"), "/data"),
		TLS:        valueOr(getenv("C0DE_TLS"), TLSACME),
		Bind:       getenv("C0DE_BIND"),
		ACMECA:     getenv("C0DE_ACME_CA"),
		ACMECARoot: getenv("C0DE_ACME_CA_ROOT"),
		GitHubAPI:  getenv("C0DE_GITHUB_API"),
	}
	c.TrustedProxies = normalizeList(getenv("C0DE_TRUSTED_PROXIES"))
	var err error
	if c.HTTPPort, err = port("C0DE_HTTP_PORT", valueOr(getenv("C0DE_HTTP_PORT"), "80")); err != nil {
		return c, err
	}
	if c.HTTPSPort, err = port("C0DE_HTTPS_PORT", valueOr(getenv("C0DE_HTTPS_PORT"), "443")); err != nil {
		return c, err
	}
	if c.HealthPort, err = port("C0DE_HEALTH_PORT", valueOr(getenv("C0DE_HEALTH_PORT"), "8081")); err != nil {
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
	if c.DataDir == "" || unsafePath.MatchString(c.DataDir) {
		return fmt.Errorf("C0DE_DATA: %q is not a usable folder name", c.DataDir)
	}
	if c.Bind != "" {
		if _, err := netip.ParseAddr(c.Bind); err != nil {
			return fmt.Errorf("C0DE_BIND: %q is not an IP address", c.Bind)
		}
	}
	if c.HTTPPort == c.HTTPSPort || c.HealthPort == c.HTTPPort || c.HealthPort == c.HTTPSPort {
		return fmt.Errorf("C0DE_HTTP_PORT, C0DE_HTTPS_PORT and C0DE_HEALTH_PORT must differ")
	}
	if c.ACMECA != "" {
		if u, err := url.Parse(c.ACMECA); err != nil || u.Scheme != "https" || u.Host == "" || unsafePath.MatchString(c.ACMECA) {
			return fmt.Errorf("C0DE_ACME_CA: %q is not an https URL", c.ACMECA)
		}
	}
	if c.GitHubAPI != "" {
		if u, err := url.Parse(c.GitHubAPI); err != nil || (u.Scheme != "https" && u.Scheme != "http") || u.Host == "" || unsafePath.MatchString(c.GitHubAPI) {
			return fmt.Errorf("C0DE_GITHUB_API: %q is not an http or https URL", c.GitHubAPI)
		}
	}
	if unsafePath.MatchString(c.ACMECARoot) {
		return fmt.Errorf("C0DE_ACME_CA_ROOT: %q is not a usable file name", c.ACMECARoot)
	}
	for _, proxy := range strings.Fields(c.TrustedProxies) {
		if proxy == "private_ranges" {
			continue
		}
		if _, err := netip.ParsePrefix(proxy); err != nil {
			if _, err := netip.ParseAddr(proxy); err != nil {
				return fmt.Errorf("C0DE_TRUSTED_PROXIES: %q is not an IP address, a range or private_ranges", proxy)
			}
		}
	}
	return nil
}

// normalizeList turns a list separated by commas or spaces into one separated by spaces.
func normalizeList(list string) string {
	return strings.Join(strings.Fields(strings.ReplaceAll(list, ",", " ")), " ")
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
