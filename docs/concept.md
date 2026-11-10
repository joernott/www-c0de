# Concept

The website c0de.at hosts the documentation and the tutorials of the Minecraft mod [c0de](https://github.com/joernott/minecraft-c0de) and its companion mods, currently [c0de net](https://github.com/joernott/minecraft-c0de-net).

This repository contains everything needed to build and run the website:

  - the frontend, built with Vue.js and Tailwind CSS,
  - a web server based on Caddy with Let's Encrypt support, built as a single static Go binary for Linux that contains the whole site,
  - a container image that runs this binary, run with Podman on the web server.

The decisions taken during the [review](concept_review.md) are listed in the [implementation plan](implementation_plan.md#decisions).

## Content

### Sources

The documentation is not written in this repository. It is generated from the Markdown documentation in the repositories of the mods:

| Repository | Files | Content |
|---|---|---|
| minecraft-c0de | `docs/guide/*.md` | The guide: getting started, the language, running programs, tools, libraries, examples |
| minecraft-c0de | `docs/reference/*.md` | The handbooks: data, statements, tools, triggers, devices, functions (built-in functions, input and output, and the libraries c0de/math, c0de/strings, c0de/time and c0de/minecraft) |
| minecraft-c0de-net | `docs/reference/net.md` | The handbook of c0de net with the library c0de_net/http |

The same files are the source of the in-game Patchouli books. They stay the single source of the documentation: errors found on the website are corrected in the mod repositories, never in the generated pages.

The site shows the documentation of the **latest released version** of each mod. The import reads each repository at a release tag, which is pinned in the file `sources.yaml` of this repository (c0de `v0.3.0`, c0de net `v0.1.0` at the time of writing). When a mod is released, Renovate opens a pull request with the new tag; merging it and releasing the site publishes the new documentation. Every imported page shows the version of the mod it describes.

Written in this repository, in all languages of the site, are:

  - the home page,
  - the legal notice and the privacy policy,
  - the texts of the theme (tab labels, search, navigation),
  - the tutorials (second step).

### Languages

The site starts in **English and German**. More languages are added when someone provides the translated documentation in the mod repositories; the site then only needs the translations of its own pages.

  - English is the default language and has no prefix. Every other language has its code as prefix: `/c0de/math/` and `/de/c0de/math/`.
  - The German translations of the documentation are planned and written in the mod repositories themselves, not here. They are kept in a folder per language with the same file names as the English originals: `docs/de/guide/01-getting-started.md`, `docs/de/reference/functions.md`. If the mods decide on a different layout, the import follows it. The import takes every language it finds at the tag.
  - A page that isn't translated yet is shown in English under its translated URL, with a note that the translation is missing. So every language has the complete navigation.
  - A language switch at the top of every page leads to the same page in the other language. The site doesn't redirect by the language of the browser.
  - The search only searches the pages of the current language.

Until the mods are translated, the German site has German pages of its own (home page, legal pages, theme), but the documentation of the mods in English.

### URL structure

| URL | Content | Source |
|---|---|---|
| `/` | Home page | this repository |
| `/c0de/` | The c0de language: guide and handbooks, except the library sections of the functions handbook | minecraft-c0de |
| `/c0de/math/`, `/c0de/strings/`, `/c0de/time/`, `/c0de/minecraft/` | The libraries c0de/math, c0de/strings, c0de/time and c0de/minecraft | sections of `docs/reference/functions.md` in minecraft-c0de |
| `/c0de_net/http/` | The library c0de_net/http, including the installation and settings of c0de net | minecraft-c0de-net |
| `/tutorials/` | Tutorials (second step) | this repository |
| `/legal-notice`, `/privacy` | Legal notice and privacy policy | this repository |
| `/de/…` | The same pages in German | |

The folder of a library is its full name, as written after INCLUDE (`c0de/minecraft` → `/c0de/minecraft/`). Libraries of further mods get their folders the same way (e.g. a future `c0de_net/smtp` → `/c0de_net/smtp/`), so adding a mod as source needs no new URL rules. Every chapter (see [Tabs](#tabs)) is one page. Its URL is derived from the file name without the number prefix and without `.md` (`docs/guide/01-getting-started.md` → `/c0de/guide/getting-started`) or, for a chapter that is a section of a file, from its heading like a GitHub anchor (`### MID` → `/c0de/strings/mid`, `### HTTP_GET` → `/c0de_net/http/http_get`). A library's overview page is its folder (`/c0de/strings/`). URLs are lowercase and have no `.html` extension.

Links between the imported files are rewritten to the URLs of the site, within the same language. A link to a section that became a page of its own leads to that page (`functions.md#mid` → `/c0de/strings/mid`); other anchors are kept as they are on GitHub. Links to files that are not imported (e.g. the concept of the mod) point to the file on GitHub at the imported tag. Images are copied with the pages.

## Design: the ring binder

The website looks like an open ring binder lying on a desk. It is designed for desktop browsers first.

  - **Rings**: the left side of the viewport shows the spine of the binder with its rings. They are decoration only.
  - **Pages**: the content is shown on the paper page to the right of the rings. Every chapter is one page. A contents list at the top of the page links to its sections, and the bottom links to the previous and the next chapter, like turning the pages of the binder.
  - **Tabs**: colored tabs at the right margin of the page lead to the parts and chapters of the site.

### Tabs

There are two levels of tabs.

**Main tabs** are always visible. From top to bottom:

| Tab | Color |
|---|---|
| Home (a house) | neutral |
| c0de, the language | the green of the greenbar paper |
| c0de/math, c0de/strings, c0de/time, c0de/minecraft | one color per library |
| c0de_net/http, and the libraries of further mods | one color per library |
| Tutorials (second step) | own color |

**Chapter tabs** belong to a main tab. When a main tab is selected, its chapter tabs appear directly below it, in a lighter shade of its color, and push the following main tabs down. The tab of the current chapter is drawn in front of the page edge, the others behind it.

| Main tab | Chapter tabs |
|---|---|
| Home | none |
| c0de | the six chapters of the guide (Getting started, Language, Running programs, Tools, Libraries, Examples), then, after a gap and marked with a book symbol, the handbooks (Data, Statements, Tools, Triggers, Devices, Functions) |
| a library | one per function (every `###` section of the library's section), in the order of the source. Further `##` sections of the source that aren't the library itself become chapter tabs too, in the order of the source: c0de_net/http has Getting started, its nine functions and types (HTTP_CONNECTION … HTTP_PUT), Errors and Examples. |

Selecting a library's main tab shows its overview page: the introduction of the library and a list of its functions with links. The c0de libraries have between 12 (c0de/time) and 22 (c0de/minecraft) functions. The "Functions" handbook of the c0de tab (built-in functions, input and output) stays one chapter.

The number of tabs depends on the selected tab and grows with every library. When the tabs don't fit beside the page, the column of tabs scrolls: with the mouse wheel over the tabs, and with arrow buttons that appear at its top and bottom end. The house tab stays at the top, and the selected tab is always scrolled into view.

**Smaller screens**: tablets and phones get a simple, readable layout: the rings are hidden, and the tabs become a menu above the page. It is not optimized beyond that.

### Other elements

**Code**: programs in the documentation (` ```c0de ` code blocks) are highlighted with the colors of the blocks in the game.

**Search**: a search field on the home page and at the top of every page searches the full text of all pages of the current language. The index is built with the site; the search runs in the browser.

**Color scheme**: the site has a light and a dark mode (a dark desk with gray paper) and follows the setting of the operating system, with CSS only and without a switch on the page. The colors of the tabs have enough contrast in both modes.

**Accessibility**: the tabs are links with a text label (the house tab has the label "Home"), all functions can be used with the keyboard, the colors have enough contrast, and the rings are hidden from screen readers. Animations respect the setting "reduce motion".

**Privacy**: the site uses no cookies, no tracking and no external resources. Fonts are hosted on the site itself.

## Architecture

### Frontend

The frontend is built with **Vue.js 3** and **Tailwind CSS**, using the static site generator **VitePress**:

  - VitePress renders every Markdown page to a static HTML page at build time. The pages can be read without JavaScript, load fast and can be indexed by search engines. Vue then takes over in the browser for navigation between pages and the search.
  - The ring binder is a custom Vue theme that replaces the default theme of VitePress completely. It is styled with Tailwind CSS.
  - VitePress provides the Markdown pipeline (with Shiki for code highlighting, which gets a grammar for c0de), the languages (locales), the local full-text search and the sitemap.

The import (see [Sources](#sources)) is a Node.js script that runs before the build. It fetches the sources, rewrites them as described in [URL structure](#url-structure) and writes them into the VitePress source folder, where they are not committed.

### Web server

The web server is **Caddy 2**, used as a Go library:

  - The program `c0de-www` is Caddy with its standard modules and a small module of this repository that serves the built site from the binary (`go:embed`). The configuration (Caddyfile) is also embedded.
  - It is built with `CGO_ENABLED=0` as a static binary for `linux/amd64`. The binary is the whole website.
  - Settings are environment variables: the domain (default `c0de.at`), the data folder for certificates and logs, and the TLS mode (`acme` for Let's Encrypt, `internal` for tests with Caddy's local certificate authority).

Caddy provides:

  - certificates from Let's Encrypt, renewed automatically,
  - redirects from HTTP to HTTPS and from `www.c0de.at` to `c0de.at`,
  - HTTP/2 and HTTP/3,
  - compressed files (Brotli, Zstandard and gzip are created at build time),
  - caching: files with a hash in the name are cached forever, HTML pages are revalidated,
  - security headers: HSTS, Content-Security-Policy, X-Content-Type-Options, Referrer-Policy,
  - URLs without `.html` and a 404 page in the ring binder style, in the language of the requested URL,
  - an access log in the volume `/data` with the full IP addresses, rotated daily and kept for three months. The privacy policy describes it.

### Container

The container image (OCI format, `linux/amd64`) is built in stages: Node.js builds the site, Go builds the binary, and the final image is `scratch` with the binary and the CA certificates (needed to talk to Let's Encrypt). It runs with Podman and Docker alike.

  - It runs as an unprivileged user and listens on ports 80/tcp, 443/tcp and 443/udp (HTTP/3).
  - The volume `/data` keeps the certificates, the ACME account and the access logs. It must survive updates of the container, otherwise every start requests new certificates and hits the rate limits of Let's Encrypt.
  - The image is published to the GitHub Container Registry as `ghcr.io/joernott/www-c0de`, tagged with its version and `latest`.

### Versions and releases

The website has its own version (semantic versioning, from Git tags like the mods). A release builds the binary and the image, attaches the binary to the GitHub release and publishes the image with the tags of its version and `latest`.

### Operation

The site runs on the operator's own Linux web server (amd64). The server has several IP addresses; c0de.at gets a dedicated IPv4 address, on which ports 80 and 443 are free. There is no IPv6 address for now.

  - The systemd service `container-c0de` runs the container with Podman as root (not rootless), so it can publish the ports 80 and 443. It pulls the image `latest` before it starts the container and publishes the ports 80/tcp, 443/tcp and 443/udp on the dedicated address only. A new version is deployed by publishing a release and restarting the service.
  - The operator runs the DNS server: `c0de.at` and `www.c0de.at` get A records pointing to the dedicated address, no AAAA records.

Nothing in the image or its configuration depends on that server: the domain, the data folder and the TLS mode are set from outside, and the address is a setting of the service. The site can move to another Linux host, container or VM by moving the volume `/data` and the service definition. The repository contains the systemd unit as an example (`contrib/systemd/container-c0de.service`).

## Tutorials

Tutorials follow in a second step and are shown under `/tutorials/`, with their own main tab. They are written in this repository as Markdown, in English and German, so they can use the same layout and code highlighting. Their concept is written when that step starts.

## Legal pages

A website run from Germany or Austria needs a legal notice (Impressum) and a privacy policy, in both languages of the site. Both are linked from the bottom of every page. The operator is Jörn Ott; the data of the legal notice is taken from [www.ott-consult.de](https://www.ott-consult.de). The privacy policy describes the access log: the full IP address, time, requested URL, status, referrer and browser of every request, kept for three months for the operation and security of the server.
