# Development environment

This document describes how the website c0de.at is developed, built and tested. It uses the same Windows workstation and development VM as the mods [c0de](https://github.com/joernott/minecraft-c0de/blob/main/docs/development_environment.md) and [c0de net](https://github.com/joernott/minecraft-c0de-net/blob/main/docs/development_environment.md).

## Overview

| Place | Purpose |
|---|---|
| Windows workstation | Writing code and content, the VitePress development server with hot reload, unit tests (Vitest, Go), building the site and the Linux binary |
| Development VM (`doener@192.168.178.183`, Debian 13, 8 cores, 16 GB) | Container builds and runs with Docker, the container on ports 80/443 as on the web server, end-to-end tests with Playwright, ACME tests with Pebble, the systemd unit |
| GitHub Actions | Build and test of every push, end-to-end tests, releases (GitHub release and image on ghcr.io) |

## Versions

The current stable version of every tool and package is used. Renovate keeps them up to date with pull requests; CI must be green before one is merged. Versions at the start (2026-11-10):

| Tool or package | Version | Where it is pinned |
|---|---|---|
| Go | 1.27.3 | `go.mod` (`go` and `toolchain` lines) |
| Caddy | 2.11.9 | `go.mod` |
| Node.js | 26 (LTS "Lithium", 26.13.0) | `.nvmrc`, `package.json` (`engines`) |
| Java | 21 or newer | the program runner of c0de: `make test-programs` (task 6.5) and the layouts of the 3D views when the site is built (task 8.3); in CI `actions/setup-java`, in the image the JRE of `eclipse-temurin` (`Containerfile`) |
| VitePress | 1.6.4 | `site/package.json` |
| Vue.js | 3.5 | `site/package.json` |
| Tailwind CSS | 4.3 (with `@tailwindcss/postcss`) | `site/package.json` |
| TypeScript | 6.0 (typescript-eslint 8.72 supports TypeScript below 6.1 only; 7.0 follows when it does) | `site/package.json` |
| vue-tsc | 3.3 | `site/package.json` |
| Vitest | 5.1 | `site/package.json` |
| ESLint, typescript-eslint, eslint-plugin-vue | 10.14, 8.72, 10.12 | `site/package.json` |
| Prettier | 3.9 | `site/package.json` |
| `<model-viewer>`, three.js | 4.4.0, 0.183.2 (the version model-viewer asks for) | `site/package.json` |
| Playwright, axe-core for Playwright | 1.65, 4.14 | `e2e/package.json` |
| Lighthouse CI | 0.16 | `e2e/package.json` |
| Docker | 29.8 | on the VM (installed for doenerstag) |
| Podman | as on the web server | on the web server only |

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
| `npm run content` (in `site/`) | Imports the documentation of the mods at the tags in `site/sources.yaml` (downloaded once into `site/.cache/`) and writes the pages, the images and `.vitepress/navigation.json`; then the 3D scenes of all programs (task 8.3, see below); `dev` and `build` run it first |
| `node scripts/import/main.ts --local c0de=../../minecraft-c0de --local c0de_net=../../minecraft-c0de-net` (in `site/`) | Imports the documentation from the working copies instead, to see changes of the mods before their release; the 3D scenes then use their builds too: the models of `python scripts/export_models.py` (`build/models`) and the runners of `./gradlew :core:runnerJar` (c0de) and `./gradlew :runner:jar` (c0de net) |
| `npm run check-links` (in `site/`) | Checks the built site: every internal link and anchor resolves, nothing is loaded from other sites; `build` runs it last |
| `npm run build` (in `site/`) | Imports the documentation, builds the site into `internal/site/dist` (where the Go binary embeds it) and checks its links |
| `npm test`, `npm run lint`, `npm run typecheck` (in `site/`) | Vitest, ESLint and Prettier, vue-tsc |
| `go test ./cmd/... ./internal/...` | Go tests of the server (`./...` would also find Go code in `site/node_modules`) |
| `CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -trimpath -o dist/c0de-www ./cmd/c0de-www` | Builds the static Linux binary with the built site |
| `C0DE_TLS=off C0DE_HTTP_PORT=8089 C0DE_BIND=127.0.0.1 C0DE_DATA=$TEMP/c0de-www go run ./cmd/c0de-www` | Runs the server with the built site on Windows over HTTP (`http://127.0.0.1:8089`) for a quick check of the binary |
| `scripts/check-whitespace.sh` | Whitespace of all files |
| `E2E_BASE_URL=http://127.0.0.1:8089 npx playwright test --project chromium` (in `e2e/`) | End-to-end tests against the binary running on Windows (Chromium only; install it once with `npx playwright install chromium`) |
| `npm run lighthouse` (in `e2e/`) | Lighthouse CI against the same server (`E2E_BASE_URL`), with minimum scores for performance, accessibility, best practices and SEO; reports in `e2e/lighthouse/` |
| `npm run images` (in `e2e/`) | Generates `site/public/images/screenshot.webp` from the screenshot of the imported c0de repository and the link preview image `site/public/og-image.png` |
| `npx playwright test screenshots` (in `e2e/`) | Screenshots of the important pages in light and dark mode at several window sizes, saved in `e2e/test-results/`, for reviewing the design |

## Development VM

The VM is shared with doenerstag, c0de and c0de net. SSH: `ssh -i ~/.ssh/id_ed25519_claude doener@192.168.178.183`, with passwordless sudo. Installing builds and tools on the VM is part of its purpose. Its address comes from DHCP and has changed before (.101 until 2026-11-13); if SSH times out, ask for the current one.

### Provisioning

`contrib/setup_dev_vm.sh` (task 1.7) installs what the website needs, without changing what the other projects use:

  - **Go**: the VM has Go 1.26.10 in `/usr/local/go`, pinned by the setup script of doenerstag. It stays. The `toolchain go1.27.3` line in `go.mod` makes the Go command download and use 1.27.3 for this repository (`GOTOOLCHAIN=auto`, the default).
  - **Node.js**: the VM has Node.js 22 in `/usr/bin/node`, also used by doenerstag. Node.js 26 is installed into `/opt/node-v26` from the official tarball. `contrib/vm-env.sh` puts it first in `PATH`; the scripts of this repository source it.
  - **Docker** is already installed; the user `doener` is in the group `docker`. The VM uses Docker, not Podman (decision of 2026-11-10); the operator adapts the web server to Podman. Podman 5.4 was installed in sprint 1 and stays unused.
  - **The system libraries of the Playwright browsers** (Chromium and Firefox); `make e2e` installs the browsers themselves.


### Repository on the VM

The VM has its own clone in `~/src/www-c0de` (with `receive.denyCurrentBranch = updateInstead`), not a shared folder. The workstation pushes the branch it tests to it:

```sh
GIT_SSH_COMMAND="ssh -i ~/.ssh/id_ed25519_claude" \
  git push ssh://doener@192.168.178.183/home/doener/src/www-c0de sprint-1
```

### Running the site on the VM

Ports 80 and 443 are free on the VM (doenerstag uses 8443, mokapi 8080), so the container runs there as on the web server:

| Command (in `~/src/www-c0de`) | What it does |
|---|---|
| `make site binary` | Builds the site and the static binary |
| `make image` | Builds the image `localhost/www-c0de:dev` with `docker build -f Containerfile` |
| `make run`, `make stop` | Runs the image with `docker run`, ports 80/443 published to 8080/8443 in the container, TLS mode `internal`, volume `www-c0de-data` |
| `make e2e` | Runs the Playwright tests against `https://localhost` (Caddy's local CA is trusted by the tests) |
| `make test lint` | All unit tests and checks, as in CI |
| `make test-programs` | Runs the programs of the tutorials with the program runner of the c0de release in `site/sources.yaml` (downloaded into `site/.cache/runner`). Programs that talk to the API of c0de.at run against a test service (`site/scripts/test-service.ts`, task 9.6.1): the server of this repository, built with Go, with the internal certificate authority of Caddy for c0de.at, a proxy that connects the requests of the runner for c0de.at to it, and a fake GitHub with the tags of `sources.yaml` |

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

The runners and the VM build and run the image with Docker; the web server runs it with Podman. Both use the same `Containerfile`, and the image is a standard OCI image.

Renovate (`renovate.json`) needs the Renovate GitHub App on the repository. It updates npm packages, Go modules, the base images of the `Containerfile`, the GitHub Actions, Node.js (`.nvmrc`) and Go (`go.mod`), and, from sprint 3 on, the tags of the documentation sources in `sources.yaml`. TypeScript is held below 6.1 until typescript-eslint supports 7.0.

### Releasing a version

  1. The sprint branch is merged into `main` and CI is green.
  2. The tag `vX.Y.Z` is created on the commit of `main` and pushed. `release.yml` publishes the binary and the image.
  3. On the web server, `systemctl restart container-c0de` pulls `latest` and starts it. Details follow in `docs/operations.md` (task 5.9).
