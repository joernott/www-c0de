# Concept

The website c0de.at hosts the documentation and the tutorials of the Minecraft mod [c0de](https://github.com/joernott/minecraft-c0de) and its companion mods, currently [c0de net](https://github.com/joernott/minecraft-c0de-net).

This repository contains everything needed to build and run the website:

  - the frontend, built with Vue.js and Tailwind CSS,
  - a web server based on Caddy with Let's Encrypt support, built as a single static Go binary for Linux that contains the whole site,
  - a Docker container that runs this binary.

Proposals added during the [review](concept_review.md) are marked with *(proposal, Qn)*, where Qn is the open question in the review that decides them.

## Content

### Sources

The documentation is not written in this repository. It is generated from the Markdown documentation in the repositories of the mods:

| Repository | Files | Content |
|---|---|---|
| minecraft-c0de | `docs/guide/*.md` | The guide: getting started, the language, running programs, tools, libraries, examples |
| minecraft-c0de | `docs/reference/*.md` | The handbooks: data, statements, tools, triggers, devices, functions (built-in functions, input and output, and the libraries c0de/math, c0de/strings, c0de/time and c0de/minecraft) |
| minecraft-c0de-net | `docs/reference/net.md` | The handbook of c0de net with the library c0de_net/http |

The same files are the source of the in-game Patchouli books. They stay the single source of the documentation: errors found on the website are corrected in the mod repositories, never in the generated pages.

The site shows the documentation of the **latest released version** of each mod. The import reads each repository at a release tag, which is pinned in the file `sources.yaml` of this repository (c0de `v0.3.0`, c0de net `v0.1.0` at the time of writing). A new release of a mod updates its tag, which leads to a new build of the site *(proposal, Q4)*. Every imported page shows the version of the mod it describes.

Written in this repository are:

  - the home page,
  - the legal notice and the privacy policy,
  - the tutorials (second step).

### URL structure

| URL | Content | Source |
|---|---|---|
| `/` | Home page | this repository |
| `/c0de/` | The c0de language: guide and handbooks, except the library sections of the functions handbook | minecraft-c0de |
| `/math/`, `/strings/`, `/time/`, `/minecraft/` | The libraries c0de/math, c0de/strings, c0de/time and c0de/minecraft | sections of `docs/reference/functions.md` in minecraft-c0de |
| `/http/` | The library c0de_net/http, including the installation and settings of c0de net | minecraft-c0de-net |
| `/tutorials/` | Tutorials (second step) | this repository |
| `/legal-notice`, `/privacy` | Legal notice and privacy policy | this repository |

The folder of a library is the last part of its name *(proposal, Q1)*. Within a folder, every source file becomes one page. Its URL is the file name without the number prefix and without `.md` (`docs/guide/01-getting-started.md` → `/c0de/guide/getting-started`). URLs are lowercase and have no `.html` extension.

Links between the imported files are rewritten to the URLs of the site. Anchors are kept as they are on GitHub, so `functions.md#mid` keeps working as `#mid`. Links to files that are not imported (e.g. the concept of the mod) point to the file on GitHub at the imported tag. Images are copied with the pages.

The site is in English only, like the documentation of the mods *(proposal, Q10)*.

## Design: the ring binder

The website looks like an open ring binder lying on a desk.

  - **Rings**: the left side of the viewport shows the spine of the binder with its rings. They are decoration only.
  - **Pages**: the content is shown on the paper page to the right of the rings. A chapter can span several pages; the bottom of every page links to the previous and the next page, like turning the pages of the binder. The first page of a chapter lists its pages and sections.
  - **Tabs**: colored tabs at the right margin of the page mark the chapters. The tab of the current chapter is drawn in front of the page edge, the others behind it. From top to bottom:
    1. a tab with a house, which leads back to the home page,
    2. the tabs of the c0de language documentation, all in the same color,
    3. one tab per library, each in its own color,
    4. the tab of the tutorials (second step).

A chapter is a tab *(proposal, Q2)*:

| Tab | Color | Pages |
|---|---|---|
| Home (house) | neutral | Home page |
| Guide | c0de color | The six chapters of the guide |
| Data, Statements, Tools, Triggers, Devices | c0de color | One handbook each |
| Functions | c0de color | Built-in functions, input and output |
| math, strings, time, minecraft | one color per library | The section of the library in the functions handbook |
| http | own color | The c0de net handbook |
| Tutorials | own color | Tutorials (second step) |

This makes 13 tabs plus the tutorials, which fit on the right margin of a screen with a height of 800 pixels. On lower screens, the tabs get narrower.

**Small screens** *(proposal, Q9)*: below a width of 768 pixels, the rings shrink to a narrow strip on the left edge and the tabs become a row of colored tabs above the page that can be scrolled horizontally.

**Code**: programs in the documentation (` ```c0de ` code blocks) are highlighted with the colors of the blocks in the game.

**Search**: a search field on the home page and at the top of every page searches the full text of all pages. The index is built with the site; the search runs in the browser.

**Color scheme** *(proposal, Q8)*: the site follows the light or dark setting of the operating system (a dark desk with gray paper), with CSS only and without a switch on the page.

**Accessibility**: the tabs are links with a text label (the house tab has the label "Home"), all functions can be used with the keyboard, the colors have enough contrast, and the rings are hidden from screen readers. Animations respect the setting "reduce motion".

**Privacy**: the site uses no cookies, no tracking and no external resources. Fonts are hosted on the site itself.

## Architecture

### Frontend

The frontend is built with **Vue.js 3** and **Tailwind CSS**, using the static site generator **VitePress** *(proposal, Q3)*:

  - VitePress renders every Markdown page to a static HTML page at build time. The pages can be read without JavaScript, load fast and can be indexed by search engines. Vue then takes over in the browser for navigation between pages and the search.
  - The ring binder is a custom Vue theme that replaces the default theme of VitePress completely. It is styled with Tailwind CSS.
  - VitePress provides the Markdown pipeline (with Shiki for code highlighting, which gets a grammar for c0de), the local full-text search and the sitemap.

The import (see [Sources](#sources)) is a Node.js script that runs before the build. It fetches the sources, rewrites them as described in [URL structure](#url-structure) and writes them into the VitePress source folder, where they are not committed.

### Web server

The web server is **Caddy 2**, used as a Go library:

  - The program `c0de-www` is Caddy with its standard modules and a small module of this repository that serves the built site from the binary (`go:embed`). The configuration (Caddyfile) is also embedded.
  - It is built with `CGO_ENABLED=0` as a static binary for `linux/amd64` *(and `linux/arm64`, Q5)*. The binary is the whole website.
  - Settings are environment variables: the domain (default `c0de.at`), the data folder for certificates, and the TLS mode (`acme` for Let's Encrypt, `internal` for tests with Caddy's local certificate authority).

Caddy provides:

  - certificates from Let's Encrypt, renewed automatically,
  - redirects from HTTP to HTTPS and from `www.c0de.at` to `c0de.at`,
  - HTTP/2 and HTTP/3,
  - compressed files (Brotli, Zstandard and gzip are created at build time),
  - caching: files with a hash in the name are cached forever, HTML pages are revalidated,
  - security headers: HSTS, Content-Security-Policy, X-Content-Type-Options, Referrer-Policy,
  - URLs without `.html` and a 404 page in the ring binder style,
  - an access log without IP addresses *(proposal, Q7)*.

### Container

The Docker image is built in stages: Node.js builds the site, Go builds the binary, and the final image is `scratch` with the binary and the CA certificates (needed to talk to Let's Encrypt).

  - It runs as an unprivileged user and listens on ports 80/tcp, 443/tcp and 443/udp (HTTP/3).
  - The volume `/data` keeps the certificates and the ACME account. It must survive updates of the container, otherwise every start requests new certificates and hits the rate limits of Let's Encrypt.
  - The image is published to the GitHub Container Registry as `ghcr.io/joernott/www-c0de`.

### Versions and releases

The website has its own version (semantic versioning, from Git tags like the mods). A release builds the binary and the image, attaches the binary to the GitHub release and publishes the image. Where and how the container is run is decided in Q5.

## Tutorials

Tutorials follow in a second step and are shown under `/tutorials/`, with their own tab. They are written in this repository as Markdown, so they can use the same layout and code highlighting. Their concept is written when that step starts.

## Legal pages

A website run from Germany or Austria needs a legal notice (Impressum) and a privacy policy. Both are linked from the bottom of every page. Their content is provided by the operator *(Q7)*.
