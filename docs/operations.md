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
