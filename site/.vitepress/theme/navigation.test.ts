import { describe, expect, it } from 'vitest'
import {
  activeChapter,
  activeTab,
  localize,
  neighbours,
  normalize,
  type Navigation,
} from './navigation'

const navigation: Navigation = {
  tabs: [
    {
      id: 'c0de',
      label: { en: 'c0de' },
      color: 'c0de',
      link: '/c0de/',
      chapters: [
        {
          label: { en: 'Getting started', de: 'Erste Schritte' },
          link: '/c0de/guide/getting-started',
          group: 'guide',
        },
        { label: { en: 'Data', de: 'Daten' }, link: '/c0de/reference/data', group: 'handbook' },
      ],
    },
    {
      id: 'c0de/math',
      label: { en: 'c0de/math' },
      color: 'lib1',
      link: '/c0de/math/',
      chapters: [
        { label: { en: 'ABS' }, link: '/c0de/math/abs' },
        { label: { en: 'SGN' }, link: '/c0de/math/sgn' },
      ],
    },
  ],
}
const home = { en: 'Home', de: 'Start' }

describe('normalize', () => {
  it.each([
    ['/', '/'],
    ['/index.html', '/'],
    ['/c0de/math/abs.html', '/c0de/math/abs'],
    ['/c0de/math/', '/c0de/math/'],
    ['/c0de/math/index', '/c0de/math/'],
    ['/de/c0de/math/abs', '/c0de/math/abs'],
    ['/de/', '/'],
    ['/de', '/'],
  ])('%s is %s', (path, expected) => {
    expect(normalize(path)).toBe(expected)
  })
})

describe('activeTab', () => {
  it.each([
    ['/', undefined],
    ['/legal-notice', undefined],
    ['/c0de/', 'c0de'],
    ['/c0de/guide/getting-started', 'c0de'],
    ['/c0de/math/', 'c0de/math'],
    ['/c0de/math/abs', 'c0de/math'],
    ['/de/c0de/math/abs', 'c0de/math'],
    ['/c0de/mathematics', 'c0de'],
  ])('%s belongs to %s', (path, id) => {
    expect(activeTab(navigation, path)?.id).toBe(id)
  })
})

describe('activeChapter', () => {
  it('finds the chapter in every language', () => {
    const tab = activeTab(navigation, '/de/c0de/math/sgn')
    expect(activeChapter(tab, '/de/c0de/math/sgn')?.link).toBe('/c0de/math/sgn')
  })

  it('finds no chapter on the overview page', () => {
    const tab = activeTab(navigation, '/c0de/math/')
    expect(activeChapter(tab, '/c0de/math/')).toBeUndefined()
  })
})

describe('neighbours', () => {
  it('runs through the tabs in reading order', () => {
    expect(neighbours(navigation, home, '/').previous).toBeUndefined()
    expect(neighbours(navigation, home, '/').next?.link).toBe('/c0de/')
    const { previous, next } = neighbours(navigation, home, '/c0de/reference/data')
    expect(previous?.link).toBe('/c0de/guide/getting-started')
    expect(next?.link).toBe('/c0de/math/')
    expect(neighbours(navigation, home, '/c0de/math/sgn').next).toBeUndefined()
  })

  it('has no neighbours for pages outside the navigation', () => {
    expect(neighbours(navigation, home, '/privacy')).toEqual({})
  })
})

describe('localize', () => {
  it('falls back to English', () => {
    expect(localize({ en: 'ABS' }, 'de')).toBe('ABS')
    expect(localize({ en: 'Data', de: 'Daten' }, 'de')).toBe('Daten')
  })
})
