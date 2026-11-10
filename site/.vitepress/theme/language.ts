// The languages of the site. English has no prefix, every other language has its code as
// the first part of the path (/c0de/math/ and /de/c0de/math/).

export const languages = ['en', 'de'] as const
export type Language = (typeof languages)[number]

export const defaultLanguage: Language = 'en'

// languageOf returns the language of a path of the site.
export function languageOf(path: string): Language {
  const first = path.split('/')[1]
  return languages.find((l) => l !== defaultLanguage && l === first) ?? defaultLanguage
}

// pathOf returns the path of a page from its source file, relative to the site folder
// (c0de/math/abs.md is /c0de/math/abs, de/c0de/math/index.md is /de/c0de/math/).
export function pathOf(relativePath: string): string {
  return '/' + relativePath.replace(/\.md$/, '').replace(/(^|\/)index$/, '$1')
}

// pathIn returns the path of the same page in another language.
export function pathIn(path: string, language: Language): string {
  const current = languageOf(path)
  const withoutPrefix = current === defaultLanguage ? path : path.slice(current.length + 1) || '/'
  return language === defaultLanguage ? withoutPrefix : `/${language}${withoutPrefix}`
}
