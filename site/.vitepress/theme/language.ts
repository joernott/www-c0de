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

// pathIn returns the path of the same page in another language.
export function pathIn(path: string, language: Language): string {
  const current = languageOf(path)
  const withoutPrefix = current === defaultLanguage ? path : path.slice(current.length + 1) || '/'
  return language === defaultLanguage ? withoutPrefix : `/${language}${withoutPrefix}`
}
