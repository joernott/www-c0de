# www-c0de

The website [c0de.at](https://c0de.at) with the documentation and tutorials of the Minecraft mod [c0de](https://github.com/joernott/minecraft-c0de) and its companion mods. The site is built with Vue.js and Tailwind CSS and served by Caddy from a single static Go binary, which runs in a container on the web server.

- [Concept](docs/concept.md) and its [review](docs/concept_review.md)
- [Implementation plan](docs/implementation_plan.md)
- [Development environment](docs/development_environment.md)
- [Operations](docs/operations.md): running the site on the web server

## Building

You need Go 1.27, Node.js 26 and Java 21 or newer (the build lays out the programs of the site for their 3D views with the program runner of c0de).

```sh
cd site
npm ci
npm run dev        # development server with hot reload on http://localhost:5173
npm run build      # builds the site into internal/site/dist
cd ..
CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -trimpath -o dist/c0de-www ./cmd/c0de-www
```

The binary contains the site that was built last. On Linux, `make` does the same and more:

| Command | What it does |
|---|---|
| `make lint test` | Whitespace, gofmt, go vet, ESLint, Prettier, vue-tsc, Go tests and Vitest |
| `make binary` | Builds the site and the static binary `dist/c0de-www` |
| `make image` | Builds the image with Docker (`CONTAINER=podman make image` for Podman) |
| `make run`, `make stop` | Runs the image on ports 80/443 with certificates from Caddy's local CA |
| `make e2e` | Runs the Playwright tests and Lighthouse against `https://localhost` |
| `make acme-test` | Gets certificates from Pebble, the test server of Let's Encrypt, with the image (Docker Compose) |

## Running

The binary is configured with environment variables:

| Variable | Default | Meaning |
|---|---|---|
| `C0DE_DOMAIN` | `c0de.at` | The domain the site is served for |
| `C0DE_DATA` | `/data` | Folder for the certificates, the ACME account and the access log |
| `C0DE_TLS` | `acme` | `acme` (Let's Encrypt), `internal` (Caddy's local CA, for tests) or `off` (plain HTTP) |
| `C0DE_HTTP_PORT` | `80` (`8080` in the image) | Port for HTTP |
| `C0DE_HTTPS_PORT` | `443` (`8443` in the image) | Port for HTTPS and HTTP/3 |
| `C0DE_BIND` | all addresses | IP address to listen on |
| `C0DE_TRUSTED_PROXIES` | none | Reverse proxies in front of the server (IP addresses or ranges, or `private_ranges`); the client address is taken from their `X-Forwarded-For` |
| `C0DE_HEALTH_PORT` | `8081` | Port of the health check on 127.0.0.1 (`c0de-www health`) |
| `C0DE_ACME_CA`, `C0DE_ACME_CA_ROOT` | Let's Encrypt | Another ACME server and its root certificate, for tests |

Behind a reverse proxy that does the TLS, run `c0de-www run --httponly --trusted-proxies <address of the proxy>`: the flags are the same as `C0DE_TLS=off` and `C0DE_TRUSTED_PROXIES`, see [operations](docs/operations.md#behind-a-reverse-proxy).

`c0de-www caddyfile` prints the Caddyfile for the current settings (and the same flags), `c0de-www health` checks the running server, `c0de-www version` prints the version.

The image runs as an unprivileged user on the ports 8080 and 8443; publish them as 80 and 443. From release 0.1.0 on, it is published on ghcr.io:

```sh
podman run -d --read-only -p 80:8080 -p 443:8443 -p 443:8443/udp -v www-c0de-data:/data ghcr.io/joernott/www-c0de
```

## License

BSD 3-Clause, see [LICENSE](LICENSE).
