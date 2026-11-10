# Concept review (2026-11-10)

This file lists the content changes made to [concept.md](concept.md) during the review and the questions that are still open. Spelling and grammar fixes are not listed. Every decision below is a proposal. Revert it in the concept if it does not match your intent.

## 1. Errors and ambiguities that were fixed

| # | Problem in the original | Resolution |
|---|---|---|
| 1 | "documentation and tutorials for the c0de web site" | Documentation and tutorials of the mod c0de and its companion mods. |
| 2 | "a web server as a single static go binary, based on caddy and a docker container" reads as if the container were part of the binary. | Three parts: frontend, web server binary that contains the site, container that runs the binary. |
| 3 | "It uses vue,js and the Tailwind CSS framework" – "it" referred to the binary. | The frontend uses Vue.js and Tailwind CSS. |
| 4 | The libraries "will have their own folders like https://c0de.at/minecraft", but c0de/minecraft (like c0de/math, c0de/strings, c0de/time) is a library of the mod c0de itself, documented in the same functions handbook as the built-in functions. | The four libraries of c0de get their own folders, built from the sections of the functions handbook. Built-in functions and input/output stay under `/c0de/`. c0de_net/http gets `/http/` (Q1). |
| 5 | "Their contents will be generated from the documentation" didn't say from which version. The repositories contain the documentation of unreleased work on their sprint branches. | The site shows the latest release; the import reads the repositories at tags pinned in `sources.yaml` (Q4). |
| 6 | "Colored tabs … indicate the chapters", but the mod's documentation has no single list of chapters: there are 6 guide chapters and 6 handbooks, one of which contains 4 libraries. One tab per file would make 17 tabs, too many for the right margin. | One tab for the guide, one per handbook, one per library (Q2). |
| 7 | "Let's Encrypt support" in a static binary in a container: certificates and the ACME account must be stored somewhere that survives updates, and a `scratch` image has no CA certificates. | Volume `/data`, CA certificates in the image. |

## 2. Gaps that were filled (new design decisions)

- **Single source**: the website never contains corrections of its own; the Markdown in the mod repositories is the source of the website and of the Patchouli books.
- **URLs**: lowercase, without number prefix and `.html`, links and images rewritten, anchors kept as on GitHub, links to files that are not imported point to GitHub.
- **Page navigation**: previous/next page links at the bottom of every page, a contents list on the first page of a chapter.
- **Small screens**: the rings shrink to a strip, the tabs move to a scrollable row above the page (Q9).
- **c0de code highlighting**: the ` ```c0de ` code blocks of the documentation are highlighted in the colors of the blocks.
- **Search**: full-text search in the browser, index built with the site.
- **Accessibility**: text labels on tabs, keyboard use, contrast, decorative rings hidden from screen readers, reduced motion.
- **Privacy**: no cookies, no tracking, no external resources, self-hosted fonts (embedding Google Fonts has led to fines in Germany), access log without IP addresses.
- **VitePress** as the Vue-based site generator (Q3).
- **Caddy as a Go library** with an own module that serves the embedded site, configured with environment variables, TLS mode `internal` for tests.
- **Caddy features**: HTTP→HTTPS, `www` → apex redirect, HTTP/2 and HTTP/3, precompressed files, cache headers, security headers, 404 page.
- **Container**: `scratch` image, unprivileged user, ports 80/443 (+UDP for HTTP/3), published on ghcr.io.
- **Versions**: the website has its own semantic version and releases.
- **Legal pages**: legal notice and privacy policy, linked from every page.

## 3. Open questions

1. **Library URLs**: the original names `/minecraft`. Should a library folder be the last part of the library name (`/math/`, `/minecraft/`, `/http/`) as proposed, or the full name (`/c0de/math/`, `/c0de_net/http/`)? The full name avoids collisions with future libraries and mirrors `INCLUDE`, but mixes libraries into the `/c0de/` folder.
2. **Tabs**: is one tab for the guide, one per handbook and one per library (13 tabs plus tutorials) the right granularity? Alternatives: one tab per guide chapter (18 tabs, too many for small screens), or only "Guide" and "Reference" for c0de (7 tabs, but long chapters).
3. **VitePress**: is VitePress acceptable as the way to use Vue.js? It prerenders the pages (search engines, speed, no JavaScript needed to read) and brings Markdown, search and sitemap. The alternative is a single-page app with Vite and Vue Router and an own Markdown pipeline: more code, and the pages are only rendered in the browser.
4. **Documentation version**: only the latest release of each mod, as proposed? Or also a preview of the next version (e.g. `/next/`) from the `main` branches? Should a new mod release update the website automatically (a workflow that bumps the tag and releases the site), or do you bump the tag by hand?
5. **Hosting**: on which server does the container run (provider, architecture amd64 or arm64)? Is something else already listening on ports 80/443 there (then Caddy would run behind that proxy, and the Let's Encrypt part moves to that proxy)? How should new versions be deployed: by hand with `docker compose pull && docker compose up -d`, or by GitHub Actions over SSH? Is the DNS of `c0de.at` and `www.c0de.at` under your control?
6. **License**: BSD 3-Clause like the mods?
7. **Legal notice, privacy and logging**: who is the operator named in the legal notice (name, address, e-mail)? Should the server keep access logs at all, and if so, without IP addresses and for how long?
8. **Dark mode**: follow the system setting (dark desk, gray paper) as proposed, light only, or with a switch on the page?
9. **Small screens**: are the narrow ring strip and the row of tabs above the page the right adaptation for phones?
10. **Language**: English only, as the documentation of the mods? (The mod has German translations of the blocks, but not of the documentation.)
11. **Colors**: any wishes for the colors? Proposal: the c0de tabs in the green of the greenbar paper, the libraries in the colors of their blocks or distinct colors from a palette that keeps enough contrast in light and dark mode.
12. **Home page**: what should it show? Proposal: what c0de is, a screenshot, a short example program, links to Modrinth and GitHub for both mods with the current versions, and an overview of the chapters.
