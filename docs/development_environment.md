# Development environment

This document describes how the website c0de.at is developed, built and tested. It uses the same Windows workstation and development VM as the mods [c0de](https://github.com/joernott/minecraft-c0de/blob/main/docs/development_environment.md) and [c0de net](https://github.com/joernott/minecraft-c0de-net/blob/main/docs/development_environment.md).

## Overview

| Place | Purpose |
|---|---|
| Windows workstation | Writing code and content, the VitePress development server with hot reload, unit tests (Vitest, Go), building the site and the Linux binary |
| Development VM (`doener@192.168.178.101`, Debian 13, 8 cores, 16 GB) | Container builds with Podman, the container on ports 80/443 as on the web server, end-to-end tests with Playwright, ACME tests with Pebble, the systemd unit |
| GitHub Actions | Build and test of every push, end-to-end tests, releases (GitHub release and image on ghcr.io) |

## Versions

The current stable version of every tool and package is used. Renovate keeps them up to date with pull requests; CI must be green before one is merged. Versions at the start (2026-11-10):

| Tool or package | Version | Where it is pinned |
|---|---|---|
| Go | 1.27.3 | `go.mod` (`go` and `toolchain` lines) |
| Caddy | 2.11.9 | `go.mod` |
| Node.js | 26 (LTS "Lithium", 26.13.0) | `.nvmrc`, `package.json` (`engines`) |
| VitePress | 1.6.4 | `site/package.json` |
| Vue.js | 3.5 | `site/package.json` |
| Tailwind CSS | 4.3 (with `@tailwindcss/postcss`) | `site/package.json` |
| TypeScript | 6.0 (typescript-eslint 8.72 supports TypeScript below 6.1 only; 7.0 follows when it does) | `site/package.json` |
| vue-tsc | 3.3 | `site/package.json` |
| Vitest | 5.1 | `site/package.json` |
| ESLint, typescript-eslint, eslint-plugin-vue | 10.14, 8.72, 10.12 | `site/package.json` |
| Prettier | 3.9 | `site/package.json` |
| Playwright, axe-core for Playwright | 1.65, 4.14 | `e2e/package.json` |
| Lighthouse CI | 0.16 | `e2e/package.json` |
| Podman | 5.4 (Debian 13) | on the VM and the web server |

Notes on the choices:

  - **VitePress 1.6** is the latest stable release; 2.0 is still an alpha. VitePress 1.6 uses Vite 5, while Vitest 5 needs Vite 6.4 or newer. Both are installed side by side: Vitest only tests plain TypeScript (the import, the navigation logic) and never runs VitePress. When VitePress 2.0 is released, Renovate proposes the update.
  - **Tailwind CSS through PostCSS**, not through its Vite plugin, so it doesn't depend on the Vite version inside VitePress.
  - **Go and Node.js are pinned in the repository** (`go.mod`, `.nvmrc`) and CI reads them from there (`go-version-file`, `node-version-file`). So there is one place to change them.

## Windows workstation

### Software

  - Git for Windows (Git Bash), VS Code, GitHub CLI
  - Go 1.27.3 (installed)
  - Node.js 26 LTS. Node.js 24 is installed at the moment and must be updated to 26.

There is no Docker, Podman or `make` on the workstation. Containers are built and run on the VM.

### Daily work

| Command | What it does |
|---|---|
| `npm run dev` (in `site/`) | VitePress development server with hot reload on `http://localhost:5173` |
| `npm run import -- --local ../minecraft-c0de --local ../minecraft-c0de-net` (in `site/`) | Imports the documentation from the local working copies instead of the release tags (from sprint 3) |
| `npm run build` (in `site/`) | Builds the site into `internal/site/dist`, where the Go binary embeds it (from sprint 3 it imports the sources at their tags first) |
| `npm test`, `npm run lint`, `npm run typecheck` (in `site/`) | Vitest, ESLint and Prettier, vue-tsc |
| `go test ./...` | Go tests of the server |
| `CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -trimpath -o dist/c0de-www ./cmd/c0de-www` | Builds the static Linux binary with the built site |
| `C0DE_TLS=off C0DE_HTTP_PORT=8089 C0DE_BIND=127.0.0.1 C0DE_DATA=$TEMP/c0de-www go run ./cmd/c0de-www` | Runs the server with the built site on Windows over HTTP (`http://127.0.0.1:8089`) for a quick check of the binary |
| `scripts/check-whitespace.sh` | Whitespace of all files |

## Development VM

The VM is shared with doenerstag, c0de and c0de net. SSH: `ssh -i ~/.ssh/id_ed25519_claude doener@192.168.178.101`, with passwordless sudo. Installing builds and tools on the VM is part of its purpose.

### Provisioning

`contrib/setup_dev_vm.sh` (task 1.7) installs what the website needs, without changing what the other projects use:

  - **Go**: the VM has Go 1.26.10 in `/usr/local/go`, pinned by the setup script of doenerstag. It stays. The `toolchain go1.27.3` line in `go.mod` makes the Go command download and use 1.27.3 for this repository (`GOTOOLCHAIN=auto`, the default).
  - **Node.js**: the VM has Node.js 22 in `/usr/bin/node`, also used by doenerstag. Node.js 26 is installed into `/opt/node-v26` from the official tarball. `contrib/vm-env.sh` puts it first in `PATH`; the scripts of this repository source it.
  - **Podman** 5.4 from Debian, beside Docker. It runs as root (`sudo podman`), like on the web server.
  - **The system libraries of the Playwright browsers** (Chromium and Firefox); `make e2e` installs the browsers themselves.

**Podman beside Docker**: Docker sets the policy of the FORWARD chain to DROP, which also drops the traffic of Podman's bridge `podman0`. Containers on the bridge can't reach the internet, and published ports only answer on the VM itself (traffic from `localhost` doesn't pass the FORWARD chain). So `make image` builds with the network of the host, and the end-to-end tests run on the VM against `https://localhost`. The firewall is not changed. If Pebble (sprint 5) or a test from the workstation needs the bridge, an exception in Docker's chain `DOCKER-USER` would be needed; that is decided then.

### Repository on the VM

The VM has its own clone in `~/src/www-c0de` (with `receive.denyCurrentBranch = updateInstead`), not a shared folder. The workstation pushes the branch it tests to it:

```sh
GIT_SSH_COMMAND="ssh -i ~/.ssh/id_ed25519_claude" \
  git push ssh://doener@192.168.178.101/home/doener/src/www-c0de sprint-1
```

### Running the site on the VM

Ports 80 and 443 are free on the VM (doenerstag uses 8443, mokapi 8080), so the container runs there as on the web server:

| Command (in `~/src/www-c0de`) | What it does |
|---|---|
| `make site binary` | Builds the site and the static binary |
| `make image` | Builds the image `localhost/www-c0de:dev` with `sudo podman build -f Containerfile` |
| `make run`, `make stop` | Runs the image with `sudo podman run`, ports 80/443 published to 8080/8443 in the container, TLS mode `internal`, volume `www-c0de-data` |
| `make e2e` | Runs the Playwright tests against `https://localhost` (Caddy's local CA is trusted by the tests) |
| `make test lint` | All unit tests and checks, as in CI |

From sprint 5 on, the VM also runs:

  - **Pebble**, the ACME test server of Let's Encrypt, in a container. The site gets its certificates from it, so the ACME flow, the volume `/data` and renewals are tested without touching Let's Encrypt.
  - **The systemd unit** `container-c0de` from `contrib/systemd/`, with the image from ghcr.io, before it is installed on the web server.

A container that isn't needed for a test is stopped afterwards; the VM's memory is shared with the other projects.

## GitHub Actions

| Workflow | Trigger | Jobs |
|---|---|---|
| `build.yml` | every push and pull request | Linux: whitespace, lint, typecheck, Vitest, site build with the link check, Go vet and tests, static binary, image build (not pushed). Windows: Vitest and Go tests. |
| `e2e.yml` | every push and pull request | Builds the image, runs it with TLS mode `internal`, runs Playwright (Chromium and Firefox) with axe-core and, from sprint 4 on, Lighthouse CI. |
| `release.yml` | tag `v*` | Builds and tests everything, creates the GitHub release with the `linux/amd64` binary and its SHA-256 checksum, pushes the image to `ghcr.io/joernott/www-c0de` with the tags of the version and `latest` (with the `GITHUB_TOKEN`, permission `packages: write`). |

The runners build the image with Docker; the VM and the web server run it with Podman. Both use the same `Containerfile`, and the image is a standard OCI image.

Renovate (`renovate.json`) needs the Renovate GitHub App on the repository. It updates npm packages, Go modules, the base images of the `Containerfile`, the GitHub Actions, Node.js (`.nvmrc`) and Go (`go.mod`), and, from sprint 3 on, the tags of the documentation sources in `sources.yaml`. TypeScript is held below 6.1 until typescript-eslint supports 7.0.

### Releasing a version

  1. The sprint branch is merged into `main` and CI is green.
  2. The tag `vX.Y.Z` is created on the commit of `main` and pushed. `release.yml` publishes the binary and the image.
  3. On the web server, `systemctl restart container-c0de` pulls `latest` and starts it. Details follow in `docs/operations.md` (task 5.9).
