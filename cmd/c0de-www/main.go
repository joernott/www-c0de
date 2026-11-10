// Command c0de-www is the web server of c0de.at: Caddy with the website embedded.
//
// Usage:
//
//	c0de-www [run] [flags]        serves the website
//	c0de-www caddyfile [flags]    prints the Caddyfile for the settings
//	c0de-www health               checks the health check of the running server (exit code 0 or 1)
//	c0de-www version              prints the version
//	c0de-www caddy ...            runs a Caddy command, e.g. "c0de-www caddy list-modules"
//
// Flags of run and caddyfile (they override the environment):
//
//	--httponly                    serves plain HTTP only, behind a reverse proxy that does the
//	                              TLS (the same as C0DE_TLS=off)
//	--trusted-proxies <list>      the reverse proxies whose X-Forwarded-For is trusted (the same
//	                              as C0DE_TRUSTED_PROXIES)
//
// Settings: C0DE_DOMAIN (default c0de.at), C0DE_DATA (default /data), C0DE_TLS (acme,
// internal or off; default acme), C0DE_HTTP_PORT (default 80), C0DE_HTTPS_PORT (default 443),
// C0DE_HEALTH_PORT (default 8081), C0DE_BIND (IP address to listen on; default all),
// C0DE_TRUSTED_PROXIES (IP addresses or ranges, or private_ranges), C0DE_ACME_CA and
// C0DE_ACME_CA_ROOT (another ACME server than Let's Encrypt and its root certificate, for
// tests).
package main

import (
	"flag"
	"fmt"
	"os"
	"os/signal"
	"strings"
	"syscall"

	caddycmd "github.com/caddyserver/caddy/v2/cmd"

	"github.com/joernott/www-c0de/internal/server"
)

// version is set by the build (-ldflags "-X main.version=...").
var version = "dev"

func main() {
	command, args := "run", os.Args[1:]
	if len(args) > 0 && !strings.HasPrefix(args[0], "-") {
		command, args = args[0], args[1:]
	}
	var err error
	switch command {
	case "run":
		err = run(args)
	case "caddyfile":
		var config server.Config
		if config, err = configFrom(command, args); err == nil {
			var file []byte
			if file, err = server.Caddyfile(config); err == nil {
				_, err = os.Stdout.Write(file)
			}
		}
	case "health":
		var config server.Config
		if config, err = server.ConfigFromEnv(os.Getenv); err == nil {
			err = server.Health(config)
		}
	case "version":
		fmt.Println("c0de-www", version)
	case "caddy":
		os.Args = append(os.Args[:1], args...)
		caddycmd.Main()
	default:
		fmt.Fprintf(os.Stderr, "c0de-www: unknown command %q (run, caddyfile, health, version or caddy)\n", command)
		os.Exit(2)
	}
	if err != nil {
		fmt.Fprintln(os.Stderr, "c0de-www:", err)
		os.Exit(1)
	}
}

// configFrom reads the settings from the environment and the flags of a command.
func configFrom(command string, args []string) (server.Config, error) {
	flags := flag.NewFlagSet("c0de-www "+command, flag.ContinueOnError)
	httpOnly := flags.Bool("httponly", false, "serve plain HTTP only, behind a reverse proxy that does the TLS (C0DE_TLS=off)")
	proxies := flags.String("trusted-proxies", "", "the reverse proxies whose X-Forwarded-For is trusted: IP addresses or ranges, or private_ranges (C0DE_TRUSTED_PROXIES)")
	if err := flags.Parse(args); err != nil {
		return server.Config{}, err
	}
	if flags.NArg() > 0 {
		return server.Config{}, fmt.Errorf("unexpected arguments: %s", strings.Join(flags.Args(), " "))
	}
	getenv := func(name string) string {
		switch {
		case name == "C0DE_TLS" && *httpOnly:
			return server.TLSOff
		case name == "C0DE_TRUSTED_PROXIES" && *proxies != "":
			return *proxies
		}
		return os.Getenv(name)
	}
	return server.ConfigFromEnv(getenv)
}

func run(args []string) error {
	config, err := configFrom("run", args)
	if err != nil {
		return err
	}
	if err := server.Start(config); err != nil {
		return err
	}
	signals := make(chan os.Signal, 1)
	signal.Notify(signals, os.Interrupt, syscall.SIGTERM)
	<-signals
	return server.Stop()
}
