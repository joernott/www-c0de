# Concept review (2026-11-10)

This file lists the content changes made to [concept.md](concept.md) during the review and the questions that are still open. Spelling and grammar fixes are not listed. Every decision below is a proposal. Revert it in the concept if it does not match your intent.

## 1. Errors and ambiguities that were fixed

| # | Problem in the original | Resolution |
|---|---|---|
| 1 | "documentation and tutorials for the c0de web site" | Documentation and tutorials of the mod c0de and its companion mods. |
| 2 | "a web server as a single static go binary, based on caddy and a docker container" reads as if the container were part of the binary. | Three parts: frontend, web server binary that contains the site, container that runs the binary. |
| 3 | "It uses vue,js and the Tailwind CSS framework" – "it" referred to the binary. | The frontend uses Vue.js and Tailwind CSS. |
| 4 | The libraries "will have their own folders like https://c0de.at/minecraft", but c0de/minecraft (like c0de/math, c0de/strings, c0de/time) is a library of the mod c0de itself, documented in the same functions handbook as the built-in functions. | The four libraries of c0de get their own folders, built from the sections of the functions handbook. Built-in functions and input/output stay under `/c0de/`. A library's folder is its full name: `/c0de/minecraft/`, `/c0de_net/http/` (answered Q1). |
| 5 | "Their contents will be generated from the documentation" didn't say from which version. The repositories contain the documentation of unreleased work on their sprint branches. | The site shows the latest release; the import reads the repositories at tags pinned in `sources.yaml` (Q4). |
| 6 | "Colored tabs … indicate the chapters", but the mod's documentation has no single list of chapters: there are 6 guide chapters and 6 handbooks, one of which contains 4 libraries. One tab per file would make 17 tabs, too many for the right margin. | Two levels of tabs: main tabs for home, the language and every library are always visible; the chapter tabs of the selected main tab appear below it, and the tab column scrolls (answered Q2). |
| 7 | "Let's Encrypt support" in a static binary in a container: certificates and the ACME account must be stored somewhere that survives updates, and a `scratch` image has no CA certificates. | Volume `/data`, CA certificates in the image. |

## 2. Gaps that were filled (new design decisions)

- **Single source**: the website never contains corrections of its own; the Markdown in the mod repositories is the source of the website and of the Patchouli books.
- **URLs**: lowercase, without number prefix and `.html`, links and images rewritten, anchors kept as on GitHub, links to files that are not imported point to GitHub.
- **Page navigation**: every chapter is one page with a contents list at the top and links to the previous and next chapter at the bottom.
- **Desktop first** (answered Q9): smaller screens get a simple layout without rings and with the tabs as a menu above the page.
- **c0de code highlighting**: the ` ```c0de ` code blocks of the documentation are highlighted in the colors of the blocks.
- **Search**: full-text search in the browser, index built with the site, per language.
- **Languages** (answered Q10): English and German; translations of the documentation come from the mod repositories, the site translates its own pages.
- **Color scheme** (answered Q8): light and dark mode, following the operating system.
- **Accessibility**: text labels on tabs, keyboard use, contrast, decorative rings hidden from screen readers, reduced motion.
- **Privacy**: no cookies, no tracking, no external resources, self-hosted fonts (embedding Google Fonts has led to fines in Germany). Access logs with full IP addresses are rotated daily and kept for three months (answered Q7.1); the privacy policy describes them.
- **VitePress** as the Vue-based site generator (answered Q3).
- **Operation**: the container runs on the operator's amd64 web server, started by the systemd service `container-c0de` with Podman, which pulls `latest` before starting (answered Q5). The image is published with the tags of its version and `latest`; nothing in it depends on that server.
- **Caddy as a Go library** with an own module that serves the embedded site, configured with environment variables, TLS mode `internal` for tests.
- **Caddy features**: HTTP→HTTPS, `www` → apex redirect, HTTP/2 and HTTP/3, precompressed files, cache headers, security headers, 404 page.
- **Container**: `scratch` image, unprivileged user, ports 80/443 (+UDP for HTTP/3), published on ghcr.io; Podman publishes the ports on the dedicated IPv4 address of the site (answered Q5.1).
- **Versions**: the website has its own semantic version and releases. It shows the latest release of each mod; Renovate proposes the new tag when a mod is released (answered Q4).
- **License**: BSD 3-Clause, like the mods (answered Q6).
- **Legal pages**: legal notice and privacy policy, linked from every page.

## 3. Open questions

Answered questions are kept with their answer; the decisions are recorded in the [implementation plan](implementation_plan.md#decisions).

1. ✅ **Library URLs**: *answered*: the full library name, `/c0de/minecraft/`, `/c0de_net/http/`. This makes it easy to add the libraries of further mods.
2. ✅ **Tabs**: *answered*: a tab for home, one for the language and one for each library are always visible. The chapter tabs of the selected tab appear below it. The number of tabs has no limit, so the tabs can be scrolled.
   1. **Chapters of a library**: the c0de libraries are one `##` section each in the functions handbook, with one `###` section per function (c0de/strings has about 25). The c0de net handbook has four `##` sections. Proposal: the chapters of a library are the `##` sections of its source, so the c0de libraries are one page each (with a contents list of their functions) and have no chapter tabs, while c0de_net/http has four. The alternative, one chapter tab per function, gives the c0de libraries up to 25 chapter tabs.
3. ✅ **VitePress**: *answered*: VitePress is used.
4. ✅ **Documentation version**: *answered*: the latest release of each mod. Renovate proposes the new tag in a pull request when a mod is released.
5. ✅ **Hosting**: *answered*: the operator's own Linux web server (amd64). The systemd service `container-c0de` runs the container with Podman and pulls the latest image before starting it; a restart deploys a new version. The site may move to another Linux container or VM later.
   1. ✅ **Ports**: *answered*: c0de.at gets a dedicated IP address on the server, on which ports 80 and 443 are free.
   2. ✅ **DNS**: *answered*: the operator runs the DNS server. No IPv6 address for now.
6. ✅ **License**: *answered*: BSD 3-Clause, like the mods.
7. ✅ **Legal notice, privacy and logging**: *answered*: the operator is Jörn Ott, the data of the legal notice is taken from www.ott-consult.de. Access logs are kept.
   1. ✅ **Log retention**: *answered*: rotated daily, kept for three months, with the full IP addresses.
8. ✅ **Dark mode**: *answered*: light and dark mode, following the setting of the operating system.
9. ✅ **Small screens**: *answered*: desktop browsers first.
10. ✅ **Language**: *answered*: English and German at the start. More languages follow when the translated documentation is provided in the mod repositories.
    1. **Translations in the mod repositories**: proposal: a folder per language with the same file names as the English originals (`docs/de/guide/…`, `docs/de/reference/…`), and untranslated pages shown in English with a note. Today the mods have no German documentation, so the German site starts with German home and legal pages but English documentation. Should the German translation of the c0de and c0de net documentation be planned in those repositories (which could also give German Patchouli books in the game)?
11. ✅ **Colors**: *answered*: as proposed.
12. ✅ **Home page**: *answered*: as proposed.
