// The texts of the theme in every language of the site.
import type { Language } from './language'

export interface Texts {
  home: string
  tabs: string
  handbooks: string
  scrollUp: string
  scrollDown: string
  menu: string
  previous: string
  next: string
  pages: string
  otherLanguage: string
  notFoundTitle: string
  notFound: string
  backHome: string
  legalNotice: string
  privacy: string
  untranslated: string
  search: string
  searchResults: string
  searchNothing: string
}

export const texts: Record<Language, Texts> = {
  en: {
    home: 'Home',
    tabs: 'Chapters',
    handbooks: 'Handbooks',
    scrollUp: 'Scroll the tabs up',
    scrollDown: 'Scroll the tabs down',
    menu: 'Menu',
    previous: 'Previous page',
    next: 'Next page',
    pages: 'Turn the page',
    otherLanguage: 'Diese Seite auf Deutsch',
    notFoundTitle: 'Page not found',
    notFound: 'This page does not exist.',
    backHome: 'Back to the home page',
    legalNotice: 'Legal notice',
    privacy: 'Privacy',
    untranslated: 'This page is not translated yet.',
    search: 'Search',
    searchResults: 'Search results',
    searchNothing: 'Nothing found',
  },
  de: {
    home: 'Start',
    tabs: 'Kapitel',
    handbooks: 'Handbücher',
    scrollUp: 'Reiter nach oben blättern',
    scrollDown: 'Reiter nach unten blättern',
    menu: 'Menü',
    previous: 'Vorige Seite',
    next: 'Nächste Seite',
    pages: 'Umblättern',
    otherLanguage: 'This page in English',
    notFoundTitle: 'Seite nicht gefunden',
    notFound: 'Diese Seite gibt es nicht.',
    backHome: 'Zurück zur Startseite',
    legalNotice: 'Impressum',
    privacy: 'Datenschutz',
    untranslated: 'Diese Seite ist noch nicht übersetzt. Sie wird auf Englisch angezeigt.',
    search: 'Suchen',
    searchResults: 'Suchergebnisse',
    searchNothing: 'Nichts gefunden',
  },
}
