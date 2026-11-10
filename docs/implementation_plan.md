# Implementation plan

This plan implements the [concept](concept.md) of the website c0de.at in sprints. Each sprint has a goal, numbered tasks and a result that can be demonstrated. The rules are the same as in [c0de](https://github.com/joernott/minecraft-c0de/blob/main/docs/implementation_plan.md).

## Principles

  - **The binary is the website.** From sprint 1 on, every result is shown in the static binary and in the container, not only in the development server of VitePress.
  - **The mods' documentation is the single source.** Nothing imported is edited by hand. If a page looks wrong because of its Markdown, the fix goes to the mod repository; if it looks wrong because of the import or the theme, the fix goes here.
  - **Thin server.** Caddy does the work. The own Go code is limited to embedding the site and the configuration.
  - **No external resources.** Fonts, scripts, images and the search index are part of the site from the first page on.
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
  - tests cover it: Go tests for the server, Vitest for the import and the theme logic, Playwright for what is visible in the browser (run on the development VM),
  - CI is green,
  - the concept is updated if the implementation required a decision that the concept doesn't cover yet.

## Sprint overview

| Sprint | Goal | Result | Done |
|---|---|---|:---:|
| 0 | Concept and plan | Reviewed concept, implementation plan, development environment plan |  |
| 1 | Project skeleton | A placeholder page is served by the static binary and the container on the VM; CI builds everything |  |
| 2 | The ring binder | The theme with rings, pages and tabs works on all screen sizes, with placeholder content |  |
| 3 | Documentation import | The documentation of c0de and c0de net is on the site, with navigation, code highlighting and search |  |
| 4 | Home page and site content | Home page, legal pages, metadata for search engines |  |
| 5 | Production and release 0.1.0 | c0de.at is online with certificates from Let's Encrypt |  |
| 6 | Tutorials | Concept and first tutorials (planned when the step starts) |  |

## Sprint 0: Concept and plan

| Task | Description | Done |
|---|---|:---:|
| 0.1 | Review the concept (`docs/concept.md`, `docs/concept_review.md`). | ✅ |
| 0.2 | Write the implementation plan (this document). | ✅ |
| 0.3 | Answer the open questions of the review (see [Decisions](#decisions)) and update the concept. Add the license. |  |
| 0.4 | Write the development environment plan (`docs/development_environment.md`): Windows workstation, development VM, GitHub Actions, versions of Go, Node.js, Caddy and VitePress. |  |

## Sprint 1: Project skeleton

**Goal:** the static binary serves a placeholder page built with VitePress, Vue.js and Tailwind CSS. The container runs it on the VM, and CI builds and tests every push.

| Task | Description | Done |
|---|---|:---:|
| 1.1 | Repository layout (`site/` for the frontend, `cmd/c0de-www/` and `internal/` for the server, `contrib/` for Docker and the VM, `scripts/`), README with build instructions, `.editorconfig`, `.gitattributes`, `.gitignore`, `scripts/check-whitespace.sh`. |  |
| 1.2 | VitePress project in `site/` with TypeScript, Tailwind CSS 4 and an empty custom theme that replaces the default theme; placeholder home page; ESLint, Prettier and `vue-tsc`; Vitest. |  |
| 1.3 | Go module `github.com/joernott/www-c0de`: `c0de-www` is Caddy with its standard modules plus a module that serves the embedded site (`go:embed` of `site/.vitepress/dist`) as Caddy file system, and the embedded Caddyfile. Settings from environment variables: domain, data folder, TLS mode (`acme`, `internal`), HTTP-only mode for tests. Go tests start the server on free ports and fetch pages. |  |
| 1.4 | `Makefile`: `site`, `binary` (`CGO_ENABLED=0`, `-trimpath`, version from Git tags in `c0de-www version`), `image`, `test`, `lint`, `clean`. The build checks that the binary is static. |  |
| 1.5 | `Dockerfile` (stages Node.js → Go → `scratch` with CA certificates, unprivileged user, ports 80/443/tcp and 443/udp, volume `/data`) and `contrib/docker/compose.yaml` for the VM with TLS mode `internal`. |  |
| 1.6 | GitHub Actions workflow `build.yml`: whitespace check, lint, Vitest, Go tests (Linux and Windows), site, binary and image (not pushed). Renovate for npm, Go modules, Docker images and GitHub Actions. |  |
| 1.7 | Development VM: `contrib/setup_dev_vm.sh` installs Go, Node.js and the Playwright browsers on the doenerstag VM (Docker is already there); native clone in `~/src/www-c0de`. Run it on the VM. |  |
| 1.8 | Playwright setup with a first end-to-end test against the container on the VM (page loads over HTTPS, HTTP redirects to HTTPS); workflow `e2e.yml` runs it in CI. |  |

## Sprint 2: The ring binder

**Goal:** the custom theme shows the open ring binder with rings, pages and tabs. It works on all screen sizes and in light and dark mode, with placeholder content for every tab.

| Task | Description | Done |
|---|---|:---:|
| 2.1 | Design tokens in Tailwind: colors of desk, paper, rings, the c0de tabs and the library tabs (light and dark), fonts (self-hosted), spacing. Logo and favicon from the c0de logo. |  |
| 2.2 | Layout component: desk, binder spine with rings and punch holes (SVG, hidden from screen readers), page area. |  |
| 2.3 | Tabs: house tab, c0de tabs and library tabs from a navigation configuration; active tab in front of the page edge; text labels; tabs get narrower on low screens. |  |
| 2.4 | Page content: typography for headings, paragraphs, lists, tables, images and code blocks; anchors on headings; contents list on the first page of a chapter; previous/next links at the bottom. |  |
| 2.5 | Small screens: rings as narrow strip, tabs as scrollable row above the page (as decided in Q9). |  |
| 2.6 | Dark mode (as decided in Q8) and reduced motion. |  |
| 2.7 | 404 page in the ring binder style, footer with the links to the legal pages. |  |
| 2.8 | Accessibility: landmarks, keyboard navigation, focus styles, contrast; Playwright tests with axe-core and screenshots at phone, tablet and desktop widths. |  |

## Sprint 3: Documentation import

**Goal:** the guide and all handbooks of c0de and c0de net are on the site, at the URLs of the concept, generated from the mod repositories at their release tags.

| Task | Description | Done |
|---|---|:---:|
| 3.1 | `sources.yaml` with repository, tag and files of each source. `scripts/import-docs` fetches each source at its tag (shallow clone into a cache folder) or, for development, reads a local working copy (`--local ../minecraft-c0de`). The output in `site/` is not committed. |  |
| 3.2 | Page mapping and link rewriting: file → URL (without number prefix and `.md`), links between imported files, anchors, links to files that are not imported (→ GitHub at the tag), images copied with the pages. The import fails on a link it cannot resolve. Vitest with fixtures. |  |
| 3.3 | Split the functions handbook: built-in functions and input/output under `/c0de/`, the sections c0de/math, c0de/strings, c0de/time and c0de/minecraft as their own pages in their library folders; links into these sections are rewritten. |  |
| 3.4 | Import the c0de net handbook to `/http/`. |  |
| 3.5 | Navigation from the import: tabs, page order in a chapter, contents lists, previous/next; front matter with title and description of every page. |  |
| 3.6 | Shiki grammar and theme for ` ```c0de ` code blocks in the colors of the blocks (taken from the block textures of c0de). |  |
| 3.7 | Full-text search with the local search of VitePress, styled for the ring binder. |  |
| 3.8 | Link check of the built site in CI (all internal links and anchors resolve, no external resources are loaded). |  |
| 3.9 | Updating the sources: Renovate (or a workflow) proposes the new tag when c0de or c0de net is released (as decided in Q4). |  |
| 3.10 | Review of all imported pages in the browser; defects in the Markdown are fixed in the mod repositories, defects of the import or theme here. |  |

## Sprint 4: Home page and site content

**Goal:** the site has a home page and everything a public website needs besides the documentation.

| Task | Description | Done |
|---|---|:---:|
| 4.1 | Home page (as decided in Q12): what c0de is, screenshot, example program, links to Modrinth and GitHub with the current versions, overview of the chapters. |  |
| 4.2 | Legal notice and privacy policy with the content provided by the operator (Q7). |  |
| 4.3 | Search engines: page titles and descriptions, canonical URLs, `sitemap.xml`, `robots.txt`, Open Graph image. |  |
| 4.4 | Lighthouse check of performance, accessibility, best practices and SEO in CI, with minimum scores. |  |

## Sprint 5: Production and release 0.1.0

**Goal:** c0de.at is online, served by the container with certificates from Let's Encrypt.

| Task | Description | Done |
|---|---|:---:|
| 5.1 | Production Caddyfile: redirects (HTTP → HTTPS, `www.c0de.at` → `c0de.at`), precompressed files (created in the site build), cache headers, security headers (HSTS, Content-Security-Policy without `unsafe-inline`, X-Content-Type-Options, Referrer-Policy, Permissions-Policy), access log as decided in Q7. Go tests for every header and redirect. |  |
| 5.2 | ACME test on the VM: Pebble (the test server of Let's Encrypt) in `compose.yaml`; the container gets a certificate from it, keeps it in `/data` across restarts and renews it. |  |
| 5.3 | Hardening of the container: binding to ports 80/443 as unprivileged user, read-only root file system, health check, memory limit. |  |
| 5.4 | Release workflow `release.yml`: on a tag `v*`, the binaries (amd64, and arm64 if decided in Q5) with checksums become a GitHub release, the image is pushed to `ghcr.io/joernott/www-c0de`. |  |
| 5.5 | Production host (as decided in Q5): `compose.yaml` for production, firewall for 80/tcp, 443/tcp and 443/udp, DNS records for `c0de.at` and `www.c0de.at`, deployment by hand or by workflow. |  |
| 5.6 | Release 0.1.0: tag, deploy, check the certificate, the redirects and the headers from outside (SSL Labs, securityheaders.com) and the pages in the browser. |  |
| 5.7 | Documentation: README, development environment, `docs/operations.md` (deploying, updating the documentation after a mod release, renewing and backing up `/data`). |  |

## Sprint 6: Tutorials

**Goal:** the first tutorials are on the site under `/tutorials/`. The tasks are planned when the concept of the tutorials is written.

| Task | Description | Done |
|---|---|:---:|
| 6.1 | Write the concept of the tutorials: audience, structure, format of the pages, use of screenshots and example programs, how tutorials are tested against new versions of c0de. |  |
| 6.2 | Plan the remaining tasks of this sprint. |  |

## Risks

| Risk | Mitigation |
|---|---|
| The Caddy API for file system modules changes between versions. | The module is small and covered by Go tests; Renovate updates of Caddy run the whole test suite. |
| VitePress inserts inline scripts, which a strict Content-Security-Policy blocks. | The custom theme doesn't use the appearance switch of VitePress; remaining inline scripts are allowed with hashes generated at build time (task 5.1). |
| The Markdown of the mods uses constructs that look right on GitHub and in Patchouli, but not on the site. | Task 3.10 reviews every page; the import fails on unresolved links (3.2) and the link check runs in CI (3.8). |
| Thirteen tabs don't fit on low screens. | Narrower tabs on low screens (2.3), the row of tabs on small screens (2.5), screenshot tests at several sizes (2.8). |
| A lost `/data` volume or repeated tests against the production endpoint hit the rate limits of Let's Encrypt. | ACME is tested against Pebble (5.2); the volume is documented and backed up (5.7). |
| An unprivileged process can't bind to ports 80 and 443 in a `scratch` image. | Task 5.3: file capability `cap_net_bind_service` set in the build stage, or the ports are mapped by Docker to high ports in the container. |
| The website shows documentation that doesn't match the version players have installed. | The import uses release tags only (3.1); the version of every mod is shown on its pages. |

## Decisions

Answers to the open questions of the [concept review](concept_review.md) are added here in task 0.3.

| Question | Decision |
|---|---|
