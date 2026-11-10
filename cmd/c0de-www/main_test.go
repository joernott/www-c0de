package main

import (
	"testing"

	"github.com/joernott/www-c0de/internal/server"
)

func TestFlags(t *testing.T) {
	t.Setenv("C0DE_TLS", "")
	t.Setenv("C0DE_TRUSTED_PROXIES", "10.0.0.0/8")

	c, err := configFrom("run", nil)
	if err != nil {
		t.Fatal(err)
	}
	if c.TLS != server.TLSACME || c.TrustedProxies != "10.0.0.0/8" {
		t.Errorf("without flags: %+v", c)
	}

	c, err = configFrom("run", []string{"--httponly", "--trusted-proxies", "192.0.2.1,192.0.2.2"})
	if err != nil {
		t.Fatal(err)
	}
	if c.TLS != server.TLSOff || c.TrustedProxies != "192.0.2.1 192.0.2.2" {
		t.Errorf("with flags: %+v", c)
	}

	for _, args := range [][]string{{"--unknown"}, {"extra"}, {"--trusted-proxies", "proxy.local"}} {
		if _, err := configFrom("run", args); err == nil {
			t.Errorf("%v: no error", args)
		}
	}
}
