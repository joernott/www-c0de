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
- **Privacy**: no cookies, no tracking, no external resources, self-hosted fonts (embedding Google Fonts has led to fines in Germany). Access logs are kept (answered Q7) for a limited time and described in the privacy policy.
- **VitePress** as the Vue-based site generator (answered Q3).
- **Operation**: the container runs on the operator's amd64 web server, started by the systemd service `container-c0de` with Podman, which pulls `latest` before starting (answered Q5). The image is published with the tags of its version and `latest`; nothing in it depends on that server.
- **Caddy as a Go library** with an own module that serves the embedded site, configured with environment variables, TLS mode `internal` for tests.
- **Caddy features**: HTTP→HTTPS, `www` → apex redirect, HTTP/2 and HTTP/3, precompressed files, cache headers, security headers, 404 page.
- **Container**: `scratch` image, unprivileged user, ports 80/443 (+UDP for HTTP/3), published on ghcr.io.
- **Versions**: the website has its own semantic version and releases.
- **Legal pages**: legal notice and privacy policy, linked from every page.

## 3. Open questions

Answered questions are kept with their answer; the decisions are recorded in the [implementation plan](implementation_plan.md#decisions).

1. ✅ **Library URLs**: *answered*: the full library name, `/c0de/minecraft/`, `/c0de_net/http/`. This makes it easy to add the libraries of further mods.
2. **Tabs**: is one tab for the guide, one per handbook and one per library (13 tabs plus tutorials) the right granularity? Alternatives: one tab per guide chapter (18 tabs, too many for small screens), or only "Guide" and "Reference" for c0de (7 tabs, but long chapters).
3. ✅ **VitePress**: *answered*: VitePress is used.
4. **Documentation version**: only the latest release of each mod, as proposed? Or also a preview of the next version (e.g. `/next/`) from the `main` branches? Should a new mod release update the website automatically (a workflow that bumps the tag and releases the site), or do you bump the tag by hand?
5. ✅ **Hosting**: *answered*: the operator's own Linux web server (amd64). The systemd service `container-c0de` runs the container with Podman and pulls the latest image before starting it; a restart deploys a new version. The site may move to another Linux container or VM later.
   1. **Ports**: does the web server already serve other sites on ports 80/443 (e.g. www.ott-consult.de)? If so, Caddy can't take these ports itself: it would run behind the existing web server on a high port, and the certificate for c0de.at would come from that server instead of Caddy. Does Podman run as root or rootless? Rootless Podman can only bind ports below 1024 if `net.ipv4.ip_unprivileged_port_start` is lowered.
   2. **DNS**: are the records of `c0de.at` and `www.c0de.at` under your control, and does the server have an IPv6 address?
6. **License**: BSD 3-Clause like the mods?
7. ✅ **Legal notice, privacy and logging**: *answered*: the operator is Jörn Ott, the data of the legal notice is taken from www.ott-consult.de. Access logs are kept.
   1. **Log retention**: how long should the access logs be kept? Proposal: 14 days, after which Caddy deletes the rotated files. Full IP addresses, or the last octet removed (Caddy can do that when writing the log)? Both affect what the privacy policy has to say.
8. **Dark mode**: follow the system setting (dark desk, gray paper) as proposed, light only, or with a switch on the page?
9. **Small screens**: are the narrow ring strip and the row of tabs above the page the right adaptation for phones?
10. **Language**: English only, as the documentation of the mods? (The mod has German translations of the blocks, but not of the documentation.)
11. **Colors**: any wishes for the colors? Proposal: the c0de tabs in the green of the greenbar paper, the libraries in the colors of their blocks or distinct colors from a palette that keeps enough contrast in light and dark mode.
12. **Home page**: what should it show? Proposal: what c0de is, a screenshot, a short example program, links to Modrinth and GitHub for both mods with the current versions, and an overview of the chapters.
