import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

// The versions of the mods the site imports, from site/sources.yaml, so the tests don't break
// when Renovate updates a tag.
const sources = readFileSync(
  fileURLToPath(new URL('../../site/sources.yaml', import.meta.url)),
  'utf-8',
)

export function version(source: string): string {
  const block = sources.split(/\n  (?=\S)/).find((b) => b.startsWith(`${source}:`))
  const tag = block && /^\s+tag: v(\S+)$/m.exec(block)
  if (!tag) throw new Error(`site/sources.yaml has no tag for ${source}`)
  return tag[1]!
}
