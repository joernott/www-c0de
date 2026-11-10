import { describe, expect, it } from 'vitest'
import { languageOf, pathIn } from './language'

describe('languageOf', () => {
  it.each([
    ['/', 'en'],
    ['/c0de/math/abs', 'en'],
    ['/de/', 'de'],
    ['/de', 'de'],
    ['/de/c0de/math/abs', 'de'],
    ['/design', 'en'],
  ])('%s is %s', (path, language) => {
    expect(languageOf(path)).toBe(language)
  })
})

describe('pathIn', () => {
  it.each([
    ['/', 'de', '/de/'],
    ['/c0de/math/abs', 'de', '/de/c0de/math/abs'],
    ['/de/c0de/math/abs', 'en', '/c0de/math/abs'],
    ['/de/', 'en', '/'],
    ['/de', 'en', '/'],
    ['/de/c0de/', 'de', '/de/c0de/'],
    ['/c0de/', 'en', '/c0de/'],
  ] as const)('%s in %s is %s', (path, language, expected) => {
    expect(pathIn(path, language)).toBe(expected)
  })
})
