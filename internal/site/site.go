// Package site holds the website built by VitePress, embedded into the binary.
//
// The site build (npm run build in site/) writes its output into the folder dist next to
// this file. Without a build, the folder only holds .gitkeep and the server has no pages.
package site

import (
	"embed"
	"io/fs"
)

//go:embed all:dist
var dist embed.FS

// FS returns the built website, with index.html at its root.
func FS() fs.FS {
	sub, err := fs.Sub(dist, "dist")
	if err != nil {
		// fs.Sub only fails for an invalid path, and "dist" is valid.
		panic(err)
	}
	return sub
}
