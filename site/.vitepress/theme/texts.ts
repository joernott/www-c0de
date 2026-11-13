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
  download: string
  downloadCurseForge: string
  sourceCode: string
  documentation: string
  chapterCount: (n: number) => string
  noLessons: string
  programView: string
  programText: string
  program3d: string
  program3dAlt: (program: string) => string
  program3dHelp: string
  program3dLoading: string
  program3dFailed: string
  programLine: (line: number) => string
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
    download: 'Download on Modrinth',
    downloadCurseForge: 'Download on CurseForge',
    sourceCode: 'Source code on GitHub',
    documentation: 'Documentation',
    chapterCount: (n) => (n === 1 ? '1 chapter' : `${n} chapters`),
    noLessons: 'The lessons of this path are being written.',
    programView: 'Show the program',
    programText: 'Text',
    program3d: '3D',
    program3dAlt: (program) => `The program ${program} on its sheet, as 3D model`,
    program3dHelp:
      'Drag to turn the sheet, scroll or pinch to zoom; point at a block to read its text. With the keyboard: the arrow keys turn it.',
    program3dLoading: 'Loading the 3D model …',
    program3dFailed: 'The 3D model could not be loaded.',
    programLine: (line) => `Line ${line}`,
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
    download: 'Download bei Modrinth',
    downloadCurseForge: 'Download bei CurseForge',
    sourceCode: 'Quellcode bei GitHub',
    documentation: 'Dokumentation',
    chapterCount: (n) => (n === 1 ? '1 Kapitel' : `${n} Kapitel`),
    noLessons: 'Die Lektionen dieses Pfads werden gerade geschrieben.',
    programView: 'Das Programm zeigen',
    programText: 'Text',
    program3d: '3D',
    program3dAlt: (program) => `Das Programm ${program} auf seinem Blatt, als 3D-Modell`,
    program3dHelp:
      'Ziehen dreht das Blatt, Scrollen oder Zwei-Finger-Zoom vergrößert; zeig auf einen Block, um seinen Text zu lesen. Mit der Tastatur: Die Pfeiltasten drehen es.',
    program3dLoading: 'Das 3D-Modell wird geladen …',
    program3dFailed: 'Das 3D-Modell konnte nicht geladen werden.',
    programLine: (line) => `Zeile ${line}`,
  },
}
