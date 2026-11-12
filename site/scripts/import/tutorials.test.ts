import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import type { Page } from './build.ts'
import { addRecipes, recipesOf } from './tutorials.ts'

let site: string
const write = (file: string, content: string) => {
  mkdirSync(dirname(join(site, file)), { recursive: true })
  writeFileSync(join(site, file), content)
}

beforeEach(() => {
  site = mkdtempSync(join(tmpdir(), 'tutorials-'))
  write(
    'tutorials/tutorials.yaml',
    [
      'tab: { id: tutorials, label: { en: Tutorials, de: Tutorials }, color: tutorials, link: /tutorials/ }',
      'chapters:',
      '  - link: /tutorials/learning/',
      '    label: { en: Learning, de: Lernen }',
      '    lessons: [first]',
      '  - link: /tutorials/libraries/c0de/math/',
      '    label: { en: c0de/math, de: c0de/math }',
      '    lessons: [dice, circle]',
    ].join('\n'),
  )
  write('tutorials/learning/first.md', '# First\n\n[RANDOM](/c0de/math/random)\n')
  write('de/tutorials/learning/first.md', '# Erstes\n')
  write(
    'tutorials/libraries/c0de/math/dice.md',
    '# Rolling dice\n\nUses [RANDOM](/c0de/math/random) and [INT](/c0de/math/int#example).\n',
  )
  write(
    'de/tutorials/libraries/c0de/math/dice.md',
    '# Würfeln\n\nNutzt [RANDOM](/de/c0de/math/random) und [INT](/de/c0de/math/int).\n',
  )
  write('tutorials/libraries/c0de/math/circle.md', '# Drawing a circle\n\n[SIN](/c0de/math/sin/)\n')
  write('de/tutorials/libraries/c0de/math/circle.md', '# Einen Kreis zeichnen\n')
})

afterEach(() => rmSync(site, { recursive: true, force: true }))

const page = (file: string, link: string): Page => ({
  file,
  link,
  content: `# ${link}\n\nText.\n`,
  function: true,
})

describe('recipesOf', () => {
  it('collects the links of the recipes in both languages, not those of other lessons', () => {
    const recipes = recipesOf(site, ['en', 'de'])
    expect(recipes.get('/c0de/math/random')).toEqual([
      {
        link: '/tutorials/libraries/c0de/math/dice',
        titles: { en: 'Rolling dice', de: 'Würfeln' },
      },
    ])
    expect(recipes.get('/c0de/math/int')?.map((r) => r.link)).toEqual([
      '/tutorials/libraries/c0de/math/dice',
    ])
    expect(recipes.get('/c0de/math/sin')?.map((r) => r.titles.de)).toEqual(['Einen Kreis zeichnen'])
  })
})

describe('addRecipes', () => {
  it('lists the recipes on the pages of the functions, in their language', () => {
    const pages = [
      page('c0de/math/random.md', '/c0de/math/random'),
      page('de/c0de/math/random.md', '/c0de/math/random'),
      { file: 'c0de/guide.md', link: '/c0de/guide', content: '# Guide\n' },
    ]
    addRecipes(site, ['en', 'de'], pages)
    expect(pages[0]!.content).toBe(
      '# /c0de/math/random\n\nText.\n\n## Used in the tutorials\n\n- [Rolling dice](/tutorials/libraries/c0de/math/dice)\n',
    )
    expect(pages[1]!.content).toContain(
      '## In den Tutorials\n\n- [Würfeln](/de/tutorials/libraries/c0de/math/dice)\n',
    )
    expect(pages[2]!.content).toBe('# Guide\n')
  })

  it('fails for a function that no recipe uses', () => {
    expect(() =>
      addRecipes(site, ['en', 'de'], [page('c0de/math/exp.md', '/c0de/math/exp')]),
    ).toThrow(
      'these functions appear in no recipe of the tutorials (/tutorials/libraries/): /c0de/math/exp',
    )
  })
})
