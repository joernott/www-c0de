// The navigation of the ring binder: main tabs for the language and every library, each
// with its chapter tabs. The import (sprint 3) writes it into .vitepress/navigation.json;
// links are the English paths, other languages add their prefix (see language.ts).

import { defaultLanguage, languageOf, type Language } from './language'

// A text in every language of the site; missing languages fall back to English.
export type Localized = { en: string } & Partial<Record<Language, string>>

export interface Chapter {
  label: Localized
  link: string
  // The c0de tab separates the chapters of the guide from the handbooks.
  group?: 'guide' | 'handbook'
  // The pages of a chapter that has more than one (the lessons of a tutorial path): their
  // links start with the link of the chapter, which stays selected while they are read.
  pages?: Page[]
}

export interface MainTab {
  id: string
  label: Localized
  // The name of the tab color in the theme (style.css: --tab-<color>).
  color: string
  // The overview page of the tab; every link of the tab starts with it.
  link: string
  chapters: Chapter[]
}

// A mod whose documentation is on the site, for the home page.
export interface Mod {
  id: string
  name: string
  version: string
  repository: string // owner/name on GitHub
  modrinth: string // the Modrinth project
  description: Localized
  link: string // the overview page of its first tab
}

export interface Navigation {
  tabs: MainTab[]
  mods: Mod[]
}

// A page in reading order, for the links to the previous and the next page.
export interface Page {
  label: Localized
  link: string
}

export function localize(text: Localized, language: Language): string {
  return text[language] ?? text.en
}

// normalize returns the English path of a page without .html, index and language prefix.
export function normalize(path: string): string {
  const language = languageOf(path)
  let p = language === defaultLanguage ? path : path.slice(language.length + 1) || '/'
  p = p.replace(/\.html$/, '').replace(/(^|\/)index$/, '$1')
  return p.startsWith('/') ? p : `/${p}`
}

// activeTab returns the main tab a page belongs to: the one with the longest link that the
// page starts with (/c0de/math/abs belongs to c0de/math, not to c0de).
export function activeTab(navigation: Navigation, path: string): MainTab | undefined {
  const page = normalize(path)
  let best: MainTab | undefined
  for (const tab of navigation.tabs) {
    if (page.startsWith(tab.link) && (!best || tab.link.length > best.link.length)) {
      best = tab
    }
  }
  return best
}

// activeChapter returns the chapter a page belongs to: the chapter itself, or the chapter with
// pages whose link is the longest one that the page starts with.
export function activeChapter(tab: MainTab | undefined, path: string): Chapter | undefined {
  const page = normalize(path)
  const exact = tab?.chapters.find((c) => c.link === page)
  if (exact) {
    return exact
  }
  let best: Chapter | undefined
  for (const chapter of tab?.chapters ?? []) {
    if (
      chapter.pages?.some((p) => p.link === page) &&
      (!best || chapter.link.length > best.link.length)
    ) {
      best = chapter
    }
  }
  return best
}

// pages returns all pages of the navigation in reading order: the home page, then every
// main tab with its overview page and its chapters, each followed by its own pages.
export function pages(navigation: Navigation, home: Localized): Page[] {
  const result: Page[] = [{ label: home, link: '/' }]
  for (const tab of navigation.tabs) {
    result.push({ label: tab.label, link: tab.link })
    for (const chapter of tab.chapters) {
      result.push({ label: chapter.label, link: chapter.link }, ...(chapter.pages ?? []))
    }
  }
  return result
}

// neighbours returns the pages before and after a page in reading order.
export function neighbours(
  navigation: Navigation,
  home: Localized,
  path: string,
): { previous?: Page; next?: Page } {
  const all = pages(navigation, home)
  const index = all.findIndex((p) => p.link === normalize(path))
  if (index < 0) {
    return {}
  }
  return { previous: all[index - 1], next: all[index + 1] }
}
