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
import { ImportError } from './build.ts'

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
