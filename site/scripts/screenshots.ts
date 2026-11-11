// Lists the screenshots of the tutorials (task 7.1): every mark
// <!-- screenshot: <id> | <description> --> of the pages in tutorials/ and de/tutorials/, with the
// pages that show it and whether its file public/tutorials/screenshots/<id>.webp exists. The list
// is written to tutorials/screenshots.yaml, so the screenshots can be taken (again) in the game.
//
// Usage: node scripts/screenshots.ts [--check]   (--check fails if the list is out of date)
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import { stringify } from 'yaml'
import { parseMark, webpSize } from '../.vitepress/screenshots.ts'

const site = join(dirname(fileURLToPath(import.meta.url)), '..')

export interface Screenshot {
  id: string
  description: string
  pages: string[]
  file: string
  size?: string
}

export function collect(siteFolder: string): Screenshot[] {
  const byId = new Map<string, Screenshot>()
  for (const folder of ['tutorials', join('de', 'tutorials')]) {
    const root = join(siteFolder, folder)
    if (!existsSync(root)) continue
    for (const name of readdirSync(root, { recursive: true, encoding: 'utf-8' }).sort()) {
      if (!name.endsWith('.md')) continue
      const page = relative(siteFolder, join(root, name)).replaceAll('\\', '/')
      for (const line of readFileSync(join(root, name), 'utf-8').split('\n')) {
        const mark = parseMark(line)
        if (!mark) continue
        const file = `public/tutorials/screenshots/${mark.id}.webp`
        const entry = byId.get(mark.id) ?? {
          id: mark.id,
          description: mark.description,
          pages: [],
          file,
        }
        if (!entry.pages.includes(page)) entry.pages.push(page)
        // the English description wins: German pages may translate theirs
        if (!page.startsWith('de/')) entry.description = mark.description
        byId.set(mark.id, entry)
      }
    }
  }
  const screenshots = [...byId.values()].sort((a, b) => a.id.localeCompare(b.id))
  for (const screenshot of screenshots) {
    const file = join(siteFolder, screenshot.file)
    if (existsSync(file)) {
      const { width, height } = webpSize(readFileSync(file))
      screenshot.size = `${width}x${height}`
    }
  }
  return screenshots
}

export function listing(screenshots: Screenshot[]): string {
  const missing = screenshots.filter((s) => !s.size).length
  return (
    '# The screenshots of the tutorials, written by scripts/screenshots.ts from the marks\n' +
    '# <!-- screenshot: <id> | <description> --> of the pages. Take them as described in\n' +
    '# docs/tutorials.md ("Screenshots") and save them as the file; the page shows them then.\n' +
    `# ${screenshots.length} screenshots, ${missing} missing.\n` +
    stringify(screenshots.map((s) => ({ ...s, size: s.size ?? 'missing' })))
  )
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const target = join(site, 'tutorials', 'screenshots.yaml')
  const text = listing(collect(site))
  if (process.argv.includes('--check')) {
    if (!existsSync(target) || readFileSync(target, 'utf-8') !== text) {
      console.error('tutorials/screenshots.yaml is out of date: run npm run screenshots')
      process.exit(1)
    }
  } else {
    writeFileSync(target, text)
    console.log(text.split('\n')[3])
  }
}
