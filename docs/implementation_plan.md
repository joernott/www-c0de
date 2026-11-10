# Implementation plan

This plan implements the [concept](concept.md) of the website c0de.at in sprints. Each sprint has a goal, numbered tasks and a result that can be demonstrated. The rules are the same as in [c0de](https://github.com/joernott/minecraft-c0de/blob/main/docs/implementation_plan.md).

## Principles

  - **The binary is the website.** From sprint 1 on, every result is shown in the static binary and in the container, not only in the development server of VitePress.
  - **The mods' documentation is the single source.** Nothing imported is edited by hand. If a page looks wrong because of its Markdown, the fix goes to the mod repository; if it looks wrong because of the import or the theme, the fix goes here.
  - **Thin server.** Caddy does the work. The own Go code is limited to embedding the site and the configuration.
  - **No external resources.** Fonts, scripts, images and the search index are part of the site from the first page on.
  - **Desktop first, two languages from the start.** Every feature is built for desktop browsers and in English and German.
  - **Every sprint ends with a working website.** CI is green, and the result of the sprint can be shown in the browser.

## Branching and commits

  - `sprint-0` contains the concept and this plan and shares its commit with `main`.
  - Every sprint n gets a branch `sprint-n`, created from the tip of `sprint-(n-1)`. It contains exactly the commits of that sprint.
  - Commit messages start with the task they close: `Task 1.3: Serve the embedded site with Caddy`. A commit that closes several tasks names all of them.
  - A defect found in a later sprint is fixed on the branch of the sprint that found it; the commit message names the sprint whose work it corrects.
  - At the end of a sprint, the branch is merged into `main` once CI is green.
  - Every prompt is logged in [zz_prompts.md](zz_prompts.md).

## Tracking

  - Completed tasks are marked with ✅ in the column "Done" of their sprint table. A sprint is marked as done in the sprint overview when all of its tasks are done.
  - If an additional task turns out to be necessary to complete a task, it is added below that task with the next level number: an additional task for 1.1 becomes 1.1.1, a second one 1.1.2, an additional task for 1.1.1 becomes 1.1.1.1.

## Definition of done

A task is done when
  - it works in the static binary and in the container, not only in the development server,
  - the texts it adds to the theme and to the own pages exist in English and German,
  - tests cover it: Go tests for the server, Vitest for the import and the theme logic, Playwright for what is visible in the browser (run on the development VM),
  - CI is green,
  - the concept is updated if the implementation required a decision that the concept doesn't cover yet.

## Sprint overview

| Sprint | Goal | Result | Done |
|---|---|---|:---:|
| 0 | Concept and plan | Reviewed concept, implementation plan, development environment plan | ✅ |
| 1 | Project skeleton | A placeholder page is served by the static binary and the container on the VM; CI builds everything | ✅ |
| 2 | The ring binder | The theme with rings, pages and two levels of tabs works in desktop browsers, in light and dark mode, in English and German, with placeholder content || ✅ |
| 3 | Documentation import | The documentation of c0de and c0de net is on the site, with navigation, code highlighting and search |  |
| 4 | Home page and site content | Home page, legal pages, metadata for search engines, in English and German |  |
| 5 | Production and release 0.1.0 | c0de.at is online with certificates from Let's Encrypt |  |
| 6 | Tutorials | Concept and first tutorials (planned when the step starts) |  |

## Sprint 0: Concept and plan

| Task | Description | Done |
|---|---|:---:|
| 0.1 | Review the concept (`docs/concept.md`, `docs/concept_review.md`). | ✅ |
| 0.2 | Write the implementation plan (this document). | ✅ |
| 0.3 | Answer the open questions of the review (see [Decisions](#decisions)) and update the concept. Add the license. | ✅ |
| 0.4 | Write the development environment plan (`docs/development_environment.md`): Windows workstation, development VM, GitHub Actions, versions of Go, Node.js, Caddy and VitePress. | ✅ |

## Sprint 1: Project skeleton

**Goal:** the static binary serves a placeholder page built with VitePress, Vue.js and Tailwind CSS. The container runs it on the VM, and CI builds and tests every push.

| Task | Description | Done |
|---|---|:---:|
| 1.1 | Repository layout (`site/` for the frontend, `cmd/c0de-www/` and `internal/` for the server, `e2e/` for Playwright, `contrib/` for containers, systemd and the VM, `scripts/`), README with build instructions, `.editorconfig`, `.gitattributes`, `.gitignore`, `.nvmrc` (Node.js 26), `scripts/check-whitespace.sh`. | ✅ |
| 1.2 | VitePress project in `site/` with TypeScript (6.0, because typescript-eslint doesn't support 7.0 yet), Tailwind CSS 4 through PostCSS and an empty custom theme that replaces the default theme; locales `en` (root) and `de` (`/de/`); placeholder home page in both languages; ESLint, Prettier and `vue-tsc`; Vitest. | ✅ |
| 1.3 | Go module `github.com/joernott/www-c0de`: `c0de-www` is Caddy with its standard modules plus the module `caddy.fs.embedded` that serves the embedded site (`go:embed` of `internal/site/dist`, where VitePress builds it) as Caddy file system, and the embedded Caddyfile template. Settings from environment variables: domain, data folder, TLS mode (`acme`, `internal`, `off`), ports, bind address. Go tests start the server on free ports and fetch pages over HTTP and HTTPS. | ✅ |
| 1.4 | `Makefile` for the VM and CI: `site`, `binary` (`CGO_ENABLED=0`, `-trimpath`, version from Git tags in `c0de-www version`), `image`, `run`, `e2e`, `test`, `lint`, `clean`. The build checks that the binary is static. On Windows, the same steps run with npm and Go directly (see the development environment). | ✅ |
| 1.5 | `Containerfile` (stages Node.js → Go → `scratch` with CA certificates, unprivileged user listening on 8080/8443, which are published as 80/443 and 443/udp, volume `/data`) and `make run` for the VM with TLS mode `internal`. The image is built and run with Podman and Docker. | ✅ |
| 1.6 | GitHub Actions workflow `build.yml`: whitespace check, lint, Vitest, Go tests (Linux and Windows), site, binary and image (not pushed). Renovate for npm, Go modules, container images and GitHub Actions. | ✅ |
| 1.7 | Development VM: `contrib/setup_dev_vm.sh` installs Node.js 26 into `/opt/node-v26` (`contrib/vm-env.sh`), Podman and the Playwright browsers, without changing the Go and Node.js of doenerstag (Go 1.27.3 comes through the `toolchain` line of `go.mod`); clone in `~/src/www-c0de` with `receive.denyCurrentBranch = updateInstead`. Run it on the VM. | ✅ |
| 1.7.1 | Use Docker instead of Podman on the VM (decision of 2026-11-10): `make image`, `make run` and the setup script use Docker; the web server keeps Podman. | ✅ |
| 1.8 | Playwright setup with a first end-to-end test against the container on the VM (page loads over HTTPS, HTTP redirects to HTTPS); workflow `e2e.yml` runs it in CI. | ✅ |

## Sprint 2: The ring binder

**Goal:** the custom theme shows the open ring binder with rings, pages and two levels of tabs, in desktop browsers, in light and dark mode and in English and German, with placeholder content for every tab.

| Task | Description | Done |
|---|---|:---:|
| 2.1 | Design tokens in Tailwind: colors of desk, paper, rings, the c0de tab and the library tabs with their lighter chapter shades, for light and dark mode; fonts (self-hosted), spacing. Logo and favicon from the c0de logo. | ✅ |
| 2.2 | Layout component: desk, binder spine with rings and punch holes (SVG, hidden from screen readers), page area. | ✅ |
| 2.3 | Main tabs from a navigation configuration: house tab, c0de tab, one tab per library, each in its color, with text labels. | ✅ |
| 2.4 | Chapter tabs: the chapter tabs of the selected main tab appear below it and push the following main tabs down; the current chapter tab is drawn in front of the page edge; the c0de chapter tabs show the guide chapters, a gap and the handbooks with a book symbol. | ✅ |
| 2.5 | Scrolling the tabs: when they don't fit beside the page, the column scrolls with the mouse wheel and with arrow buttons at both ends; the house tab stays on top; the selected tab is scrolled into view. Playwright tests with many tabs and low windows. | ✅ |
| 2.6 | Page content: typography for headings, paragraphs, lists, tables, images and code blocks; anchors on headings; contents list at the top of a page; previous/next chapter at the bottom. | ✅ |
| 2.7 | Light and dark mode following the operating system, with CSS only; reduced motion. | ✅ |
| 2.8 | Languages: language switch to the same page in the other language, all texts of the theme in English and German, `lang` attribute and `hreflang` links. | ✅ |
| 2.9 | Smaller screens: simple layout without rings, tabs as a menu above the page. | ✅ |
| 2.10 | 404 page in the ring binder style and in the language of the URL, footer with the links to the legal pages. | ✅ |
| 2.11 | Accessibility: landmarks, keyboard navigation (including the tab column), focus styles, contrast in both modes; Playwright tests with axe-core and screenshots at several desktop window sizes, light and dark. | ✅ |

## Sprint 3: Documentation import

**Goal:** the guide and all handbooks of c0de and c0de net are on the site, at the URLs of the concept, generated from the mod repositories at their release tags.

| Task | Description | Done |
|---|---|:---:|
| 3.1 | `sources.yaml` with repository, tag, files and libraries of each source. `scripts/import-docs` fetches each source at its tag (shallow clone into a cache folder) or, for development, reads a local working copy (`--local ../minecraft-c0de`). The output in `site/` is not committed. |  |
| 3.2 | Page mapping and link rewriting: file, `##` or `###` section → chapter page and URL, links between imported files within a language, anchors, links to files that are not imported (→ GitHub at the tag), images copied with the pages. The import fails on a link it cannot resolve. Vitest with fixtures. |  |
| 3.3 | Split the functions handbook: built-in functions and input/output stay one chapter under `/c0de/`; the sections c0de/math, c0de/strings, c0de/time and c0de/minecraft become the folders of the libraries (`/c0de/math/` …) with an overview page from the introduction of the section and one page per function (`/c0de/math/abs`); links to a function (`functions.md#abs`) are rewritten to its page. |  |
| 3.4 | Import the c0de net handbook to `/c0de_net/http/`: overview page, then the chapters Getting started, one per function and type, Errors and Examples. The library folders are derived from the library names in `sources.yaml`, so further mods need no change of the import. |  |
| 3.5 | Navigation from the import: main tabs, chapter tabs and their order, contents lists, previous/next; front matter with title, description and mod version of every page. |  |
| 3.6 | Translations: the import reads the translated documentation of every source (`docs/<language>/…`, or the layout the mods choose); a page without translation is published in English under the translated URL with a note. Tested with a fixture that has a partial German translation. |  |
| 3.7 | Shiki grammar and theme for ` ```c0de ` code blocks in the colors of the blocks (taken from the block textures of c0de), for light and dark mode. |  |
| 3.8 | Full-text search with the local search of VitePress, one index per language, styled for the ring binder. |  |
| 3.9 | Link check of the built site in CI (all internal links and anchors resolve in every language, no external resources are loaded). |  |
| 3.10 | Updating the sources: Renovate opens a pull request with the new tag when c0de or c0de net is released. |  |
| 3.11 | Review of all imported pages in the browser; defects in the Markdown are fixed in the mod repositories, defects of the import or theme here. |  |

## Sprint 4: Home page and site content

**Goal:** the site has a home page and everything a public website needs besides the documentation, in English and German.

| Task | Description | Done |
|---|---|:---:|
| 4.1 | Home page: what c0de is, screenshot, example program, links to Modrinth and GitHub with the current versions of both mods, overview of the chapters. |  |
| 4.2 | Legal notice with the operator's data from www.ott-consult.de; privacy policy describing the access log (full IP address, time, URL, status, referrer and browser, kept for three months for operation and security) and the absence of cookies and tracking. |  |
| 4.3 | Search engines: page titles and descriptions, canonical URLs, `hreflang` alternates, `sitemap.xml`, `robots.txt`, Open Graph image. |  |
| 4.4 | Lighthouse check of performance, accessibility, best practices and SEO in CI, with minimum scores. |  |

## Sprint 5: Production and release 0.1.0

**Goal:** c0de.at is online, served by the container with certificates from Let's Encrypt.

| Task | Description | Done |
|---|---|:---:|
| 5.1 | Production Caddyfile: redirects (HTTP → HTTPS, `www.c0de.at` → `c0de.at`), precompressed files (created in the site build), cache headers, security headers (HSTS, Content-Security-Policy without `unsafe-inline`, X-Content-Type-Options, Referrer-Policy, Permissions-Policy). Go tests for every header and redirect. |  |
| 5.2 | Access log in `/data/log` with the full IP addresses, rotated daily and compressed, files older than three months deleted. If Caddy's log rolling can't rotate by time, the rotation is done by a separate mechanism, documented in the concept. |  |
| 5.3 | ACME test on the VM: Pebble (the test server of Let's Encrypt) in `compose.yaml`; the container gets a certificate from it, keeps it in `/data` across restarts and renews it. |  |
| 5.4 | Hardening of the container: the process runs unprivileged and listens on high ports, which Podman publishes as 80/tcp, 443/tcp and 443/udp; read-only root file system, health check, memory limit. |  |
| 5.5 | Release workflow `release.yml`: on a tag `v*`, the `linux/amd64` binary with checksum becomes a GitHub release, the image is pushed to `ghcr.io/joernott/www-c0de` with the tags of the version and `latest`. |  |
| 5.6 | Systemd unit `contrib/systemd/container-c0de.service`: pulls `ghcr.io/joernott/www-c0de:latest` with Podman, then runs the container with the volume `/data` and publishes the ports on a configurable IP address. The container settings are tested with Docker on the development VM; the operator adapts the web server to Podman. |  |
| 5.7 | Web server: dedicated IPv4 address for c0de.at, unit installed as `container-c0de`, firewall for 80/tcp, 443/tcp and 443/udp on that address, A records for `c0de.at` and `www.c0de.at` (no AAAA). |  |
| 5.8 | Release 0.1.0: tag, restart `container-c0de`, check the certificate, the redirects and the headers from outside (SSL Labs, securityheaders.com) and the pages in the browser. |  |
| 5.9 | Documentation: README, development environment, `docs/operations.md` (deploying by restarting the service, going back to an earlier version, updating the documentation after a mod release, backing up `/data`, moving the site to another host). |  |

## Sprint 6: Tutorials

**Goal:** the first tutorials are on the site under `/tutorials/`. The tasks are planned when the concept of the tutorials is written.

| Task | Description | Done |
|---|---|:---:|
| 6.1 | Write the concept of the tutorials: audience, structure, format of the pages, languages, use of screenshots and example programs, how tutorials are tested against new versions of c0de. |  |
| 6.2 | Plan the remaining tasks of this sprint. |  |

## Risks

| Risk | Mitigation |
|---|---|
| The Caddy API for file system modules changes between versions. | The module is small and covered by Go tests; Renovate updates of Caddy run the whole test suite. |
| VitePress inserts inline scripts, which a strict Content-Security-Policy blocks. | The custom theme doesn't use the appearance switch of VitePress (dark mode is CSS only); remaining inline scripts are allowed with hashes generated at build time (task 5.1). |
| The Markdown of the mods uses constructs that look right on GitHub and in Patchouli, but not on the site. | Task 3.11 reviews every page; the import fails on unresolved links (3.2) and the link check runs in CI (3.9). |
| The dynamic tab column becomes hard to use with many libraries and chapters (c0de/minecraft alone has 22 function tabs). | Only the chapters of the selected main tab are shown (2.4), the column scrolls (2.5), Playwright tests with many tabs and low windows (2.5, 2.11). |
| The German site shows mostly English documentation until the mods are translated. | Every untranslated page says so (3.6). The German translations are planned in the mod repositories. |
| A lost `/data` volume or repeated tests against the production endpoint hit the rate limits of Let's Encrypt. | ACME is tested against Pebble (5.3); the volume is documented and backed up (5.9). |
| An unprivileged process can't bind to ports 80 and 443 in a `scratch` image. | The process listens on high ports, which Podman (running as root on the server) publishes as 80 and 443 (5.4). |
| `latest` is pulled on every restart, so a broken release goes live on the next restart of the service. | Releases only after CI and the end-to-end tests on the VM are green; the previous version stays on ghcr.io and can be started by its tag (5.9). |
| Three months of access logs with full IP addresses fill the volume. | The logs are compressed when rotated and deleted after three months (5.2). |
| The website shows documentation that doesn't match the version players have installed. | The import uses release tags only (3.1); the version of every mod is shown on its pages. |

## Decisions

Answers to the open questions of the [concept review](concept_review.md) (task 0.3).

| Question | Decision |
|---|---|
| Q1 Library URLs | The folder of a library is its full name: `/c0de/minecraft/`, `/c0de_net/http/` (2026-11-10). Libraries of further mods are added the same way. |
| Q2 Tabs | Main tabs for home, the language and every library are always visible. The chapter tabs of the selected main tab appear below it. There is no limit to the number of tabs; the tab column scrolls (2026-11-10). |
| Q2.1 Chapters of a library | One chapter tab per function, plus the other sections of the source (e.g. Getting started, Errors, Examples); the main tab shows the library's overview page (2026-11-10). |
| Q3 Frontend | VitePress with Vue.js and Tailwind CSS (2026-11-10). |
| Q4 Documentation version | The latest release of each mod (2026-11-10). Renovate proposes the new tag. |
| Q5 Hosting | The operator's own Linux web server, amd64 only. The systemd service `container-c0de` runs the container with Podman and pulls the latest image before starting it; restarting it deploys a new version. The site must be able to move to another Linux container or VM (2026-11-10). |
| Q5.1 Ports | c0de.at gets a dedicated IP address on the server, on which ports 80 and 443 are free (2026-11-10). |
| Q5.1a Podman | Podman runs as root on the server, not rootless (2026-11-10). |
| Containers on the VM | Docker, not Podman; the operator handles Podman on the web server (2026-11-10). |
| Q5.2 DNS | The operator runs the DNS server; IPv4 only for now (2026-11-10). |
| Q6 License | BSD 3-Clause, like the mods ([LICENSE](../LICENSE)) (2026-11-10). |
| Q7 Legal notice and logs | Operator Jörn Ott, legal notice data from www.ott-consult.de. Access logs are kept (2026-11-10). |
| Q7.1 Log retention | Rotated daily, kept for three months, with the full IP addresses (2026-11-10). |
| Q8 Color scheme | Light and dark mode (2026-11-10). |
| Q9 Small screens | Desktop browsers first (2026-11-10). |
| Q10 Languages | English and German at the start; more languages when translated documentation is provided in the mod repositories (2026-11-10). |
| Q10.1 Translations | The German translations of the documentation are planned in the mod repositories themselves; the site imports them (2026-11-10). |
| Q11 Colors | As proposed: the c0de tab in the green of the greenbar paper, distinct colors for the libraries with enough contrast in both modes (2026-11-10). |
| Q12 Home page | As proposed: what c0de is, a screenshot, an example program, links to Modrinth and GitHub with the current versions, an overview of the chapters (2026-11-10). |
