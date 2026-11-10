// Checks the built site (npm run check-links, after npm run build):
//   - every internal link and image leads to a file of the site, and its anchor exists,
//   - no page or stylesheet loads anything from another site (concept: privacy).
//
// Usage: node scripts/check-links.ts [<folder of the built site>]
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

function files(folder: string, extension: string): string[] {
  return readdirSync(folder, { recursive: true, encoding: 'utf-8' })
    .filter((f) => f.endsWith(extension))
    .map((f) => join(folder, f))
}

// target returns the file a path of the site is served from (Caddy tries {path}, {path}.html
// and {path}/index.html), or undefined.
function target(site: string, path: string): string | undefined {
  const file = join(site, decodeURIComponent(path))
  for (const candidate of [file, `${file}.html`, join(file, 'index.html')]) {
    if (existsSync(candidate) && statSync(candidate).isFile()) return candidate
  }
  return undefined
}

const ids = new Map<string, Set<string>>()
function idsOf(file: string): Set<string> {
  let result = ids.get(file)
  if (!result) {
    result = new Set([...readFileSync(file, 'utf-8').matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]!))
    ids.set(file, result)
  }
  return result
}

// Elements that make the browser load something.
const loading = /<(script|img|iframe|source|video|audio|embed)\b[^>]*\ssrc="([^"]*)"/g
const loadingLinks =
  /<link\b[^>]*\brel="(stylesheet|preload|modulepreload|prefetch|icon|manifest)"[^>]*\bhref="([^"]*)"/g
const external = /^(https?:)?\/\//

export function checkSite(site: string): string[] {
  const errors: string[] = []
  for (const page of files(site, '.html')) {
    const name = relative(site, page).split(sep).join('/')
    const html = readFileSync(page, 'utf-8')
    for (const [, tag, url] of [...html.matchAll(loading), ...html.matchAll(loadingLinks)]) {
      if (external.test(url!)) errors.push(`${name}: <${tag}> loads ${url} from another site`)
    }
    for (const match of html.matchAll(/<(?:a|img)\b[^>]*\s(?:href|src)="([^"]*)"/g)) {
      const url = match[1]!.replace(/&amp;/g, '&')
      if (url === '' || /^[a-z][a-z0-9+.-]*:/i.test(url) || url.startsWith('//')) continue
      const [path, anchor] = url.split('#') as [string, string | undefined]
      const file = path === '' ? page : path.startsWith('/') ? target(site, path) : undefined
      if (!file) {
        errors.push(`${name}: ${url} leads to nothing`)
      } else if (anchor && !idsOf(file).has(decodeURIComponent(anchor))) {
        errors.push(`${name}: ${url} leads to a missing anchor`)
      }
    }
  }
  for (const css of files(site, '.css')) {
    for (const match of readFileSync(css, 'utf-8').matchAll(
      /url\(\s*['"]?((?:https?:)?\/\/[^'")]+)/g,
    )) {
      errors.push(`${relative(site, css)}: loads ${match[1]} from another site`)
    }
  }
  return errors
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const site =
    process.argv[2] ?? fileURLToPath(new URL('../../internal/site/dist/', import.meta.url))
  const errors = checkSite(site)
  for (const error of errors) console.error(error)
  console.log(`link check: ${files(site, '.html').length} pages, ${errors.length} errors`)
  process.exit(errors.length ? 1 : 0)
}
