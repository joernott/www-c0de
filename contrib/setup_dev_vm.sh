#!/usr/bin/env bash
# Provisions the development VM for www-c0de, without changing the tools of the other
# projects on it (doenerstag keeps Go in /usr/local/go and Node.js in /usr/bin):
#
#   - Podman from Debian, run as root like on the web server,
#   - Node.js 26 in /opt/node-v26 (see contrib/vm-env.sh),
#   - the clone ~/src/www-c0de, to which the workstation pushes the branch it tests.
#
# Go 1.27 needs no installation: the toolchain line of go.mod makes the installed Go
# download it. The Playwright browsers are installed by "make e2e" (e2e/).
#
# Usage: contrib/setup_dev_vm.sh   (as the user doener, which has passwordless sudo)
set -euo pipefail

NODE_VERSION="${NODE_VERSION:-26.13.0}"
NODE_DIR=/opt/node-v26
REPO_DIR="$HOME/src/www-c0de"
REPO_URL=https://github.com/joernott/www-c0de.git

echo "== Podman"
if ! command -v podman >/dev/null; then
    sudo apt-get update
    sudo DEBIAN_FRONTEND=noninteractive apt-get install -y podman
fi
podman --version

echo "== Node.js $NODE_VERSION in $NODE_DIR"
if [ "$("$NODE_DIR/bin/node" --version 2>/dev/null)" != "v$NODE_VERSION" ]; then
    tmp="$(mktemp -d)"
    trap 'rm -rf "$tmp"' EXIT
    archive="node-v$NODE_VERSION-linux-x64.tar.xz"
    curl -fsSL -o "$tmp/$archive" "https://nodejs.org/dist/v$NODE_VERSION/$archive"
    curl -fsSL -o "$tmp/SHASUMS256.txt" "https://nodejs.org/dist/v$NODE_VERSION/SHASUMS256.txt"
    (cd "$tmp" && grep " $archive\$" SHASUMS256.txt | sha256sum -c -)
    sudo rm -rf "$NODE_DIR"
    sudo mkdir -p "$NODE_DIR"
    sudo tar -xJf "$tmp/$archive" -C "$NODE_DIR" --strip-components=1
fi
"$NODE_DIR/bin/node" --version

echo "== Repository in $REPO_DIR"
if [ ! -d "$REPO_DIR/.git" ]; then
    mkdir -p "$(dirname "$REPO_DIR")"
    git clone "$REPO_URL" "$REPO_DIR"
fi
git -C "$REPO_DIR" config receive.denyCurrentBranch updateInstead
echo "Push branches from the workstation with:"
echo "  git push ssh://$USER@$(hostname -I | cut -d' ' -f1)$REPO_DIR <branch>"
