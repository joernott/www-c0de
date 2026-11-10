# Builds and tests the website on Linux (the development VM and CI). On Windows, the same
# steps run with npm and Go directly, see docs/development_environment.md.

VERSION ?= $(shell git describe --tags --always --dirty 2>/dev/null || echo dev)
IMAGE ?= localhost/www-c0de:dev
CONTAINER ?= sudo podman
NAME ?= www-c0de

# Node.js 26 on the development VM, beside the Node.js of the other projects (ignored where
# the folder doesn't exist).
export PATH := /opt/node-v26/bin:$(PATH)

.PHONY: all site binary image run stop test lint e2e clean

all: lint test binary

site/node_modules: site/package-lock.json
	cd site && npm ci
	touch site/node_modules

site: site/node_modules
	cd site && npm run build

binary: site
	CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -trimpath \
		-ldflags "-s -w -X main.version=$(VERSION)" -o dist/c0de-www ./cmd/c0de-www
	@go version -m dist/c0de-www | grep -q 'CGO_ENABLED=0' || { echo "dist/c0de-www is not static"; exit 1; }
	@echo "dist/c0de-www $(VERSION) (static)"

image:
	$(CONTAINER) build -f Containerfile --build-arg VERSION=$(VERSION) -t $(IMAGE) .

# Runs the image like on the web server, with certificates from Caddy's local CA.
run:
	$(CONTAINER) run -d --rm --name $(NAME) \
		-p 80:8080 -p 443:8443 -p 443:8443/udp \
		-v $(NAME)-data:/data \
		-e C0DE_DOMAIN=localhost -e C0DE_TLS=internal \
		$(IMAGE)

stop:
	$(CONTAINER) stop --ignore $(NAME)

test: site/node_modules
	go test ./...
	cd site && npm test

lint: site/node_modules
	scripts/check-whitespace.sh
	@test -z "$$(gofmt -l .)" || { gofmt -l .; echo "gofmt: the files above are not formatted"; exit 1; }
	go vet ./...
	cd site && npm run lint && npm run typecheck

e2e:
	cd e2e && npm ci && npm test

clean:
	rm -rf dist
	find internal/site/dist -mindepth 1 ! -name .gitkeep -delete
