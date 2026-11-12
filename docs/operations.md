# Operations

How c0de.at runs on the web server, how new versions get there, and what to do when something goes wrong. The development environment is described in [development_environment.md](development_environment.md).

## Overview

| Part | Where |
|---|---|
| Image | `ghcr.io/joernott/www-c0de:<version>` and `:latest`, published by the release workflow |
| Service | `container-c0de` (systemd), runs the image with Podman as root, see [contrib/systemd/container-c0de.service](../contrib/systemd/container-c0de.service) |
| Address | a dedicated IPv4 address of the server; ports 80/tcp, 443/tcp and 443/udp (HTTP/3) |
| Data | the Podman volume `c0de-data` (`/data` in the container): certificates and ACME account in `caddy/`, access logs in `log/` |
| Certificates | Let's Encrypt, for `c0de.at` and `www.c0de.at`, obtained and renewed by Caddy |

## Setting up the server

1. **DNS**: A records for `c0de.at` and `www.c0de.at` pointing to the dedicated address. No AAAA records (no IPv6 for now).
2. **Firewall**: allow 80/tcp, 443/tcp and 443/udp to the dedicated address. Port 80 is needed for the HTTP challenge of Let's Encrypt and the redirect to HTTPS.
3. **Image**: the first release creates the package `www-c0de` on GitHub. Packages of personal accounts are private at first: make it public (GitHub → Packages → www-c0de → Package settings → Change visibility), so Podman can pull it without a login.
4. **Service**:
   ```sh
   cp contrib/systemd/container-c0de.service /etc/systemd/system/
   systemctl edit container-c0de      # [Service] Environment=C0DE_ADDRESS=<the address>
   systemctl daemon-reload
   systemctl enable --now container-c0de
   ```
5. **Check**: `podman logs c0de` shows "certificate obtained successfully" for both names within a minute; then https://c0de.at answers and http://c0de.at and https://www.c0de.at redirect to it.

The container runs read-only, without capabilities, with `no-new-privileges` and 256 MB of memory. Inside, the server runs as an unprivileged user on the ports 8080, 8443 and 8081 (health check); Podman publishes 8080 and 8443 as 80 and 443.

## Behind a reverse proxy

If a reverse proxy in front of the server does the TLS (SSL offloading), the container serves plain HTTP only:

```sh
podman run -d --name c0de --read-only --cap-drop ALL --security-opt no-new-privileges --memory 256m     -p <address the proxy reaches>:8080:8080 -v /data/c0de/data:/data:U     ghcr.io/joernott/www-c0de:latest run --httponly --trusted-proxies <address of the proxy>
```

- `--httponly` (or `C0DE_TLS=off`): no certificates, no redirects; only port 8080 (and the health check on 8081 inside the container).
- `--trusted-proxies` (or `C0DE_TRUSTED_PROXIES`): the addresses or ranges of the proxy. Only from them the client address is taken from `X-Forwarded-For` and logged as `client_ip`, read from the right, so a client can't fake it. Without it, the log only has the address of the proxy.
- The data folder must belong to the user of the container, UID and GID 65532 (or let Podman set the owner with `:U`; with SELinux add `Z`). It then only holds the access logs.

The proxy has to:

- get the certificates for `c0de.at` and `www.c0de.at`,
- redirect HTTP to HTTPS and `www.c0de.at` to `c0de.at` (the server doesn't in this mode),
- pass on the host name and set or append `X-Forwarded-For`,
- pass the headers of the answers unchanged: the server sends HSTS, the Content-Security-Policy and the other security headers itself.

### Checks after going live

After a change of the proxy or the server, check from outside:

```sh
cd e2e && E2E_BASE_URL=https://c0de.at npx playwright test --project chromium && E2E_BASE_URL=https://c0de.at npm run lighthouse
```

and the TLS setup with [SSL Labs](https://www.ssllabs.com/ssltest/) and the headers with [securityheaders.com](https://securityheaders.com). Behind nginx, two end-to-end tests fail by design: nginx redirects HTTP with 301 (Caddy: 308) and sends its own `Server` header.

The first check (2026-11-10, release 0.2.0 behind nginx 1.30.6) found three points in the configuration of nginx, which were fixed the same day; SSL Labs grades A+ since:

- **One HSTS header**: the server sends `max-age=31536000` on all its answers; nginx must not add a second one (with two, browsers ignore HSTS and SSL Labs grades A-). If nginx should send its own instead, it has to hide the one of the server with `proxy_hide_header Strict-Transport-Security;` and add its own with `always` (also for the not-found page), both in the `location` that proxies to the server: a `location` with `add_header` or `proxy_hide_header` of its own inherits none from the `server` block.
- **www is redirected** to `https://c0de.at/` by nginx.
- **HTTP/2** is on (`http2 on;`).

Optional: `server_tokens off;` hides the version of nginx.

## Deploying a new version

1. Push the tag `vX.Y.Z` on the commit of `main`. The release workflow tests everything and publishes the image (`X.Y.Z` and `latest`) and the GitHub release.
2. On the server: `systemctl restart container-c0de`. The service pulls `latest` and starts it. If the pull fails, it starts the image that is already there.
3. Check: `podman ps` shows the container as `healthy`; the pages show the new content.

The certificates are kept in the volume, so a restart doesn't request new ones.

### Going back to an earlier version

```sh
systemctl edit container-c0de      # [Service] Environment=C0DE_IMAGE=ghcr.io/joernott/www-c0de:<version>
systemctl restart container-c0de
```

Remove the override again (`systemctl revert container-c0de`) when a fixed version is released.

## Updating the documentation after a release of a mod

1. Renovate opens a pull request that changes the tag in `site/sources.yaml` (or change it by hand).
2. CI imports the documentation at the new tag. If a link of the new documentation can't be resolved, or a translation doesn't match the structure of the English files, the import stops with the file and line; fix it in the mod.
3. Merge the pull request, release a new version of the site and deploy it.

## The API

The server answers the API of the recipes of c0de net itself (`internal/api`, task 9.1): `/api/tutorial/echo` sends every request back as JSON, `/api/tutorial/todo` is a to-do list that all players share, and `/api/version` answers the latest released versions of c0de and c0de net (task 9.2). The list lives in the memory of the server, holds at most 100 entries and is emptied every day at 00:00 UTC and on every restart. Every client may send 60 requests a minute to the API; more get `429 Too Many Requests`.

- The rate limit counts by the address of the client, so behind a reverse proxy it needs `--trusted-proxies`: without it, all players share the limit of the proxy's address.
- nginx refuses TRACE itself with `405 Not Allowed` and never passes it on, so TRACE on c0de.at shows that (recipe 3.26 explains it); the echo answers TRACE when it is reached directly.
- The answers of the API are never cached (`Cache-Control: no-store`).
- `/api/version` reads the releases from the GitHub API (`api.github.com`, without a token: 60 requests an hour per address, the server needs 2 an hour) and keeps them for an hour. If GitHub can't be reached, it answers the last known versions and asks again after 5 minutes; after a restart without GitHub it answers `503` until GitHub is back. The server needs outgoing HTTPS for it.

## Logs

- **Access log**: `log/access.log` in the volume (JSON, one request per line); `podman volume inspect c0de-data` shows the folder on the server. A new file starts every day at 00:00 UTC; the old ones are compressed and deleted after 92 days, as the [privacy policy](../site/privacy.md) says. If the fields of the log change, the privacy policy has to change with them.
- **Server log**: `podman logs c0de` or `journalctl -u container-c0de` (start, certificates, errors).
- **Health**: `podman healthcheck run c0de` (exit code 0 when the server answers).

## Backup and moving the site

The volume holds everything that isn't in the image. Without it, Caddy requests new certificates, which is fine once, but repeated restarts with an empty volume run into the rate limits of Let's Encrypt.

```sh
podman volume export c0de-data --output c0de-data.tar      # backup
podman volume create c0de-data && podman volume import c0de-data c0de-data.tar      # restore
```

To move the site to another host, container or VM: restore the volume there, install the service with the new address, change the A records, and stop the service on the old host. Nothing in the image depends on the host.

## Settings

The service sets only the address and the image; the defaults of the image are those of production. The variables of the binary are listed in the [README](../README.md#running). `C0DE_ACME_CA` and `C0DE_ACME_CA_ROOT` are only for tests (`make acme-test` uses Pebble, the test server of Let's Encrypt).
