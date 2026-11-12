// Imports the documentation of the mods into the site (npm run content).
//
// Usage: node scripts/import/main.ts [--local <source>=<folder>]...
//
// Without --local, every source is downloaded at the tag in sources.yaml (and cached in
// .cache/sources). --local c0de=../../minecraft-c0de reads a working copy instead, e.g. to
// see changes of the documentation before they are released.
import { copyFileSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { languages } from '../../.vitepress/theme/language.ts'
import { build, ImportError } from './build.ts'
import { scenes } from './scenes.ts'
import { fetchSource, readConfig } from './sources.ts'
import { addRecipes, tutorialsTab } from './tutorials.ts'

const site = join(dirname(fileURLToPath(import.meta.url)), '..', '..')

// The folders written by the import; everything in them is replaced.
export const generated = [
  'c0de',
  'c0de_net',
  'de/c0de',
  'de/c0de_net',
  'public/img',
  'public/models',
]

async function main(args: string[]) {
  const config = readConfig(join(site, 'sources.yaml'))
  const local = new Map<string, string>()
  for (let i = 0; i < args.length; i++) {
    const match = args[i] === '--local' ? /^([^=]+)=(.+)$/.exec(args[++i] ?? '') : null
    if (!match || !config.sources[match[1]!]) {
      throw new ImportError(
        `usage: main.ts [--local <source>=<folder>]... (sources: ${Object.keys(config.sources).join(', ')})`,
      )
    }
    local.set(match[1]!, resolve(match[2]!))
  }

  const folders: Record<string, string> = {}
  for (const [name, source] of Object.entries(config.sources)) {
    folders[name] = local.get(name) ?? (await fetchSource(source, join(site, '.cache', 'sources')))
    console.log(
      `${name}: ${local.has(name) ? folders[name] : `${source.repository} ${source.tag}`}`,
    )
  }

  const output = build(config, folders, [...languages])
  // The tutorials are written in this repository; their tab comes after the tabs of the mods.
  output.navigation.tabs.push(tutorialsTab(site, [...languages]))
  // Every function of a library is used in a recipe; its page links to them (task 9.7).
  addRecipes(site, [...languages], output.pages)

  for (const folder of generated) {
    rmSync(join(site, folder), { recursive: true, force: true })
  }
  for (const page of output.pages) {
    const file = join(site, page.file)
    mkdirSync(dirname(file), { recursive: true })
    writeFileSync(file, page.content)
  }
  for (const image of output.images) {
    const file = join(site, 'public', image.to)
    mkdirSync(dirname(file), { recursive: true })
    copyFileSync(image.from, file)
  }
  writeFileSync(
    join(site, '.vitepress', 'navigation.json'),
    JSON.stringify(output.navigation, null, 2) + '\n',
  )
  const chapters = output.navigation.tabs.reduce((n, t) => n + t.chapters.length, 0)
  console.log(
    `imported ${output.pages.length} pages (${output.navigation.tabs.length} tabs, ${chapters} chapters, ${languages.length} languages) and ${output.images.length} images`,
  )
  // The 3D views of the programs need the program runner, so Java 21 or newer (task 8.3).
  await scenes(site, config, local)
}

main(process.argv.slice(2)).catch((error: unknown) => {
  console.error(error instanceof ImportError ? `import: ${error.message}` : error)
  process.exit(1)
})
