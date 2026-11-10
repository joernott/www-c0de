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

export function activeChapter(tab: MainTab | undefined, path: string): Chapter | undefined {
  const page = normalize(path)
  return tab?.chapters.find((c) => c.link === page)
}

// pages returns all pages of the navigation in reading order: the home page, then every
// main tab with its overview page and its chapters.
export function pages(navigation: Navigation, home: Localized): Page[] {
  const result: Page[] = [{ label: home, link: '/' }]
  for (const tab of navigation.tabs) {
    result.push({ label: tab.label, link: tab.link }, ...tab.chapters)
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
