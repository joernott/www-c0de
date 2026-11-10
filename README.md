# www-c0de

The website [c0de.at](https://c0de.at) with the documentation and tutorials of the Minecraft mod [c0de](https://github.com/joernott/minecraft-c0de) and its companion mods. The site is built with Vue.js and Tailwind CSS and served by Caddy from a single static Go binary, which runs in a container on the web server.

- [Concept](docs/concept.md) and its [review](docs/concept_review.md)
- [Implementation plan](docs/implementation_plan.md)
- [Development environment](docs/development_environment.md)

## Building

You need Go 1.27 and Node.js 26.

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
| `make image` | Builds the image with Podman (`CONTAINER=docker make image` for Docker) |
| `make run`, `make stop` | Runs the image on ports 80/443 with certificates from Caddy's local CA |
| `make e2e` | Runs the Playwright tests against `https://localhost` |

## Running

The binary is configured with environment variables:

| Variable | Default | Meaning |
|---|---|---|
| `C0DE_DOMAIN` | `c0de.at` | The domain the site is served for |
| `C0DE_DATA` | `/data` | Folder for the certificates and the ACME account |
| `C0DE_TLS` | `acme` | `acme` (Let's Encrypt), `internal` (Caddy's local CA, for tests) or `off` (plain HTTP) |
| `C0DE_HTTP_PORT` | `80` (`8080` in the image) | Port for HTTP |
| `C0DE_HTTPS_PORT` | `443` (`8443` in the image) | Port for HTTPS and HTTP/3 |
| `C0DE_BIND` | all addresses | IP address to listen on |

`c0de-www caddyfile` prints the Caddyfile for the current settings, `c0de-www version` the version.

The image runs as an unprivileged user on the ports 8080 and 8443; publish them as 80 and 443. From release 0.1.0 on, it is published on ghcr.io:

```sh
podman run -d -p 80:8080 -p 443:8443 -p 443:8443/udp -v www-c0de-data:/data ghcr.io/joernott/www-c0de
```

## License

BSD 3-Clause, see [LICENSE](LICENSE).
