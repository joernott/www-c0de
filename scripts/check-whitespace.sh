#!/usr/bin/env bash
# Checks the text files of the repository for tabs used as indentation, trailing whitespace
# and a missing final newline. Go files, the Makefile and the Caddyfile template are indented
# with tabs, as gofmt, make and Caddy expect.
#
# Usage: scripts/check-whitespace.sh
set -euo pipefail
cd "$(dirname "$0")/.."

tab=$'\t'
cr=$'\r'
status=0
report() {
    echo "::error file=$1::$2"
    status=1
}
while IFS= read -r -d '' file; do
    case "$file" in
        *.go | Makefile | *.tmpl) ;;
        *)
            if grep -n "^${tab}" "$file" >/dev/null; then
                report "$file" "indentation with tabs (line $(grep -n "^${tab}" "$file" | head -1 | cut -d: -f1))"
            fi
            ;;
    esac
    if grep -nE "[[:blank:]]${cr}?\$" "$file" >/dev/null; then
        report "$file" "trailing whitespace (line $(grep -nE "[[:blank:]]${cr}?\$" "$file" | head -1 | cut -d: -f1))"
    fi
    if [ -s "$file" ] && [ -n "$(tail -c1 "$file")" ]; then
        report "$file" "missing newline at the end of the file"
    fi
done < <(git ls-files -z -- '*.md' '*.go' '*.ts' '*.mts' '*.vue' '*.js' '*.mjs' '*.css' '*.html' \
    '*.json' '*.yml' '*.yaml' '*.sh' 'Makefile' 'Containerfile' '.editorconfig' '.gitattributes' \
    '.gitignore' '.nvmrc' '*.service' '*.tmpl')

exit $status
