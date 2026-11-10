// VitePress empties its output folder before a build. The folder is embedded into the Go
// binary and must exist in a fresh checkout, so it keeps a committed .gitkeep, which is
// restored here.
import { writeFileSync } from 'node:fs'

writeFileSync(new URL('../../internal/site/dist/.gitkeep', import.meta.url), '')
