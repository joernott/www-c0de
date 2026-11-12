// The tutorials (task 6.3): their tab is written in this repository, in tutorials/tutorials.yaml.
// Its chapter tabs are the paths (and the libraries of "Libraries in practice"); the lessons of a
// path are pages of its chapter. Every chapter has an overview page (index.md in its folder),
// every lesson a page in its folder, in every language of the site; their titles are the first
// "# " headings of the pages.
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { parse } from 'yaml'
import type { Language } from '../../.vitepress/theme/language.ts'
import type { Chapter, Localized, MainTab, Page } from '../../.vitepress/theme/navigation.ts'
import { ImportError, type Page as ImportedPage } from './build.ts'

export interface TutorialsSpec {
  tab: { id: string; label: Localized; color: string; link: string }
  chapters: { link: string; label: Localized; lessons?: string[] }[]
}

// The file of a page of the site in a language: tutorials/x/ is tutorials/x/index.md,
// tutorials/x/y is tutorials/x/y.md; other languages are in their folder (de/tutorials/...).
export function pageFile(site: string, link: string, language: Language, base: Language): string {
  const file = link.endsWith('/') ? `${link}index.md` : `${link}.md`
  return join(site, ...(language === base ? [] : [language]), file)
}

function title(file: string): string {
  const heading = readFileSync(file, 'utf-8')
    .split('\n')
    .find((line) => line.startsWith('# '))
  if (!heading) {
    throw new ImportError(`${file}: the page has no "# " heading`)
  }
  return heading.slice(2).trim()
}

// tutorialsTab reads tutorials/tutorials.yaml of the site and checks that every page exists in
// every language.
export function tutorialsTab(site: string, languages: Language[]): MainTab {
  const file = join(site, 'tutorials', 'tutorials.yaml')
  const spec = parse(readFileSync(file, 'utf-8')) as TutorialsSpec
  const base = languages[0]!

  const labels = (link: string): Localized => {
    const label: Partial<Record<Language, string>> = {}
    for (const language of languages) {
      const page = pageFile(site, link, language, base)
      if (!existsSync(page)) {
        throw new ImportError(`${file}: the page ${link} has no file ${page}`)
      }
      label[language] = title(page)
    }
    return label as Localized
  }

  for (const link of [spec.tab.link, ...spec.chapters.map((c) => c.link)]) {
    if (!link.startsWith(spec.tab.link) || !link.endsWith('/')) {
      throw new ImportError(`${file}: ${link} must end with / and start with ${spec.tab.link}`)
    }
    labels(link)
  }
  return {
    id: spec.tab.id,
    label: spec.tab.label,
    color: spec.tab.color,
    link: spec.tab.link,
    chapters: spec.chapters.map((chapter): Chapter => {
      const pages = (chapter.lessons ?? []).map((lesson): Page => ({
        label: labels(chapter.link + lesson),
        link: chapter.link + lesson,
      }))
      return { label: chapter.label, link: chapter.link, ...(pages.length > 0 && { pages }) }
    }),
  }
}

// The recipes of "Libraries in practice" are the lessons below this link.
const RECIPES = '/tutorials/libraries/'

const usedIn: Localized = { en: 'Used in the tutorials', de: 'In den Tutorials' }

// recipesOf reads the recipes of the tutorials and returns, for every page they link to (by its
// link without the language), the recipes that link to it, in the order of the tutorials.
export function recipesOf(
  site: string,
  languages: Language[],
): Map<string, { link: string; titles: Localized }[]> {
  const spec = parse(
    readFileSync(join(site, 'tutorials', 'tutorials.yaml'), 'utf-8'),
  ) as TutorialsSpec
  const base = languages[0]!
  const result = new Map<string, { link: string; titles: Localized }[]>()
  for (const chapter of spec.chapters.filter((c) => c.link.startsWith(RECIPES))) {
    for (const lesson of chapter.lessons ?? []) {
      const link = chapter.link + lesson
      const titles: Partial<Record<Language, string>> = {}
      const targets = new Set<string>()
      for (const language of languages) {
        const file = pageFile(site, link, language, base)
        if (!existsSync(file)) continue
        titles[language] = title(file)
        for (const match of readFileSync(file, 'utf-8').matchAll(/\]\((\/[^)\s#]*)/g)) {
          const target = match[1]!.replace(/\/$/, '')
          const prefix = languages.find((l) => l !== base && target.startsWith(`/${l}/`))
          targets.add(prefix ? target.slice(prefix.length + 1) : target)
        }
      }
      for (const target of targets) {
        const list = result.get(target) ?? []
        list.push({ link, titles: titles as Localized })
        result.set(target, list)
      }
    }
  }
  return result
}

// addRecipes lists on the page of every library function the recipes that use it (task 9.7),
// and fails if a function has none: every function of every library must appear in a recipe.
export function addRecipes(site: string, languages: Language[], pages: ImportedPage[]) {
  const recipes = recipesOf(site, languages)
  const base = languages[0]!
  const missing = new Set<string>()
  for (const page of pages) {
    if (!page.function || !page.link) continue
    const used = recipes.get(page.link)
    if (!used) {
      missing.add(page.link)
      continue
    }
    const language = languages.find((l) => l !== base && page.file.startsWith(`${l}/`)) ?? base
    const prefix = language === base ? '' : `/${language}`
    const items = used.map((r) => `- [${r.titles[language] ?? r.titles[base]}](${prefix}${r.link})`)
    page.content = `${page.content.trimEnd()}\n\n## ${usedIn[language]}\n\n${items.join('\n')}\n`
  }
  if (missing.size > 0) {
    throw new ImportError(
      `these functions appear in no recipe of the tutorials (${RECIPES}): ${[...missing].sort().join(', ')}`,
    )
  }
}
