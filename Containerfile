# The image of c0de.at: the static binary with the embedded website on an empty base.
#
# Build: podman build -f Containerfile --build-arg VERSION=<version> -t www-c0de .
# Run:   podman run -p 80:8080 -p 443:8443 -p 443:8443/udp -v www-c0de-data:/data www-c0de

FROM docker.io/library/node:26.13.0-trixie-slim AS site
WORKDIR /src/site
COPY site/package.json site/package-lock.json ./
RUN npm ci
COPY site/ ./
RUN mkdir -p ../internal/site/dist && npm run build

FROM docker.io/library/golang:1.27.3-trixie AS server
WORKDIR /src
COPY go.mod go.sum ./
RUN go mod download
COPY cmd/ cmd/
COPY internal/ internal/
COPY --from=site /src/internal/site/dist/ internal/site/dist/
ARG VERSION=dev
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 \
    go build -trimpath -ldflags "-s -w -X main.version=${VERSION}" -o /out/c0de-www ./cmd/c0de-www \
    && mkdir -p /out/data

FROM scratch
ARG VERSION=dev
LABEL org.opencontainers.image.title="www-c0de" \
      org.opencontainers.image.description="The website c0de.at: the documentation of the Minecraft mod c0de, served by Caddy" \
      org.opencontainers.image.source="https://github.com/joernott/www-c0de" \
      org.opencontainers.image.url="https://c0de.at" \
      org.opencontainers.image.licenses="BSD-3-Clause" \
      org.opencontainers.image.version="${VERSION}"
COPY --from=server /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/ca-certificates.crt
COPY --from=server /out/c0de-www /c0de-www
COPY --from=server --chown=65532:65532 /out/data /data
USER 65532:65532
# The process is unprivileged, so it listens on high ports; the container runtime publishes
# them as 80 and 443. Caddy redirects to the standard HTTPS port nevertheless.
ENV C0DE_DATA=/data \
    C0DE_HTTP_PORT=8080 \
    C0DE_HTTPS_PORT=8443 \
    HOME=/data
VOLUME /data
EXPOSE 8080/tcp 8443/tcp 8443/udp
# The binary checks the health check on 127.0.0.1:8081 (scratch has no curl).
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s CMD ["/c0de-www", "health"]
ENTRYPOINT ["/c0de-www"]
CMD ["run"]
