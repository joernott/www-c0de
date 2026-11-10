// Command c0de-www is the web server of c0de.at: Caddy with the website embedded.
//
// Usage:
//
//	c0de-www [run]        serves the website with the settings from the environment
//	c0de-www caddyfile    prints the Caddyfile for the settings from the environment
//	c0de-www health       checks the health check of the running server (exit code 0 or 1)
//	c0de-www version      prints the version
//	c0de-www caddy ...    runs a Caddy command, e.g. "c0de-www caddy list-modules"
//
// Settings: C0DE_DOMAIN (default c0de.at), C0DE_DATA (default /data), C0DE_TLS (acme,
// internal or off; default acme), C0DE_HTTP_PORT (default 80), C0DE_HTTPS_PORT (default 443),
// C0DE_HEALTH_PORT (default 8081), C0DE_BIND (IP address to listen on; default all),
// C0DE_ACME_CA and C0DE_ACME_CA_ROOT (another ACME server than Let's Encrypt and its root
// certificate, for tests).
package main

import (
	"fmt"
	"os"
	"os/signal"
	"syscall"

	caddycmd "github.com/caddyserver/caddy/v2/cmd"

	"github.com/joernott/www-c0de/internal/server"
)

// version is set by the build (-ldflags "-X main.version=...").
var version = "dev"

func main() {
	command := "run"
	if len(os.Args) > 1 {
		command = os.Args[1]
	}
	switch command {
	case "run":
		if err := run(); err != nil {
			fmt.Fprintln(os.Stderr, "c0de-www:", err)
			os.Exit(1)
		}
	case "caddyfile":
		config, err := server.ConfigFromEnv(os.Getenv)
		if err == nil {
			var file []byte
			if file, err = server.Caddyfile(config); err == nil {
				_, err = os.Stdout.Write(file)
			}
		}
		if err != nil {
			fmt.Fprintln(os.Stderr, "c0de-www:", err)
			os.Exit(1)
		}
	case "health":
		config, err := server.ConfigFromEnv(os.Getenv)
		if err == nil {
			err = server.Health(config)
		}
		if err != nil {
			fmt.Fprintln(os.Stderr, "c0de-www:", err)
			os.Exit(1)
		}
	case "version":
		fmt.Println("c0de-www", version)
	case "caddy":
		os.Args = append(os.Args[:1], os.Args[2:]...)
		caddycmd.Main()
	default:
		fmt.Fprintf(os.Stderr, "c0de-www: unknown command %q (run, caddyfile, health, version or caddy)\n", command)
		os.Exit(2)
	}
}

func run() error {
	config, err := server.ConfigFromEnv(os.Getenv)
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
