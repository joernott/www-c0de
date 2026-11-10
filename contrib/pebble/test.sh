#!/usr/bin/env bash
# The ACME test: runs the image with Pebble (compose.yaml) and checks that it gets
# certificates for c0de.test and www.c0de.test, serves them, redirects www, and keeps them
# in /data across a restart. Everything is removed afterwards.
#
# Usage: contrib/pebble/test.sh   (IMAGE=<image>, default localhost/www-c0de:dev)
set -euo pipefail
cd "$(dirname "$0")"

compose=(docker compose -f compose.yaml)
work="$(mktemp -d)"
cleanup() {
    "${compose[@]}" down -v >/dev/null 2>&1 || true
    rm -rf "$work"
}
trap cleanup EXIT

fail() {
    echo "FAIL: $*"
    "${compose[@]}" logs site | tail -30
    exit 1
}

obtained() {
    "${compose[@]}" logs site 2>&1 | grep '"msg":"certificate obtained successfully"' | grep -c "\"identifier\":\"$1\"" || true
}

"${compose[@]}" up -d --quiet-pull

echo "== certificates from Pebble"
for _ in $(seq 60); do
    [ "$(obtained c0de.test)" -ge 1 ] && [ "$(obtained www.c0de.test)" -ge 1 ] && break
    sleep 2
done
[ "$(obtained c0de.test)" -ge 1 ] || fail "no certificate for c0de.test"
[ "$(obtained www.c0de.test)" -ge 1 ] || fail "no certificate for www.c0de.test"

echo "== the served certificate chains to the root of Pebble"
curl -fsSk https://127.0.0.1:15000/roots/0 >"$work/root.pem"
resolve=(--resolve c0de.test:18443:127.0.0.1 --resolve www.c0de.test:18443:127.0.0.1)
curl -fsS --cacert "$work/root.pem" "${resolve[@]}" -o /dev/null https://c0de.test:18443/ \
    || fail "the certificate of c0de.test is not valid"

echo "== www redirects to the domain"
location="$(curl -sS --cacert "$work/root.pem" "${resolve[@]}" -o /dev/null -w '%{http_code} %{redirect_url}' https://www.c0de.test:18443/c0de/)"
[ "$location" = "301 https://c0de.test/c0de/" ] || fail "www answers $location"

echo "== the certificates survive a restart"
"${compose[@]}" restart site >/dev/null
for _ in $(seq 30); do
    curl -fsS --cacert "$work/root.pem" "${resolve[@]}" -o /dev/null https://c0de.test:18443/ 2>/dev/null && break
    sleep 1
done
curl -fsS --cacert "$work/root.pem" "${resolve[@]}" -o /dev/null https://c0de.test:18443/ \
    || fail "no valid certificate after the restart"
[ "$(obtained c0de.test)" -eq 1 ] || fail "the restart obtained a new certificate"

echo "== the access log is written to /data"
"${compose[@]}" exec -T site /c0de-www health || fail "the health check fails"
docker run --rm -v www-c0de-acme_data:/data busybox:1.37 sh -c 'test -s /data/log/access.log' \
    || fail "no access log in /data/log"

echo "ACME test passed"
