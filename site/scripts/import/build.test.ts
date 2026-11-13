import { cpSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { afterEach, describe, expect, it } from 'vitest'
import { build, ImportError, type Output } from './build.ts'
import { readConfig } from './sources.ts'

const fixtures = fileURLToPath(new URL('./fixtures/', import.meta.url))
const config = readConfig(join(fixtures, 'sources.yaml'))

function run(folder = join(fixtures, 'mod')): Output {
  return build(config, { mod: folder }, ['en', 'de'])
}

const page = (output: Output, file: string) => {
  const found = output.pages.find((p) => p.file === file)
  if (!found) throw new Error(`no page ${file} in ${output.pages.map((p) => p.file).join(', ')}`)
  return found.content
}

describe('pages', () => {
  const output = run()

  it('makes one page per chapter and overview in every language', () => {
    expect(output.pages.map((p) => p.file).sort()).toEqual(
      [
        'mod/index.md',
        'mod/guide/start.md',
        'mod/reference/functions.md',
        'lib/a/index.md',
        'lib/a/foo.md',
        'lib/a/bar_baz.md',
      ]
        .flatMap((f) => [f, `de/${f}`])
        .sort(),
    )
  })

  it('makes a function a page of its own, starting with a level 1 heading', () => {
    const foo = page(output, 'lib/a/foo.md')
    expect(foo).toContain('\n# FOO\n')
    expect(foo).toContain('title: "FOO"')
    expect(foo).toContain('description: "Does foo."')
    expect(foo).toContain('source: "The Mod 1.2.3"')
  })

  it('leaves the library out of the handbook it comes from', () => {
    const functions = page(output, 'mod/reference/functions.md')
    expect(functions).toContain('## Built-in functions')
    expect(functions).not.toContain('FOO\n')
    expect(functions).not.toContain('Does foo')
  })

  it('rewrites links to the pages and anchors where the headings end up', () => {
    const start = page(output, 'mod/guide/start.md')
    expect(start).toContain('[FOO](/lib/a/foo)')
    expect(start).toContain('[BAR_BAZ](/lib/a/bar_baz)')
    expect(start).toContain('[built-in functions](/mod/reference/functions#built-in-functions)')
    expect(start).toContain('[first steps](/mod/guide/start#first-steps)')
    expect(page(output, 'mod/reference/functions.md')).toContain('[lib/a](/lib/a/)')
    expect(page(output, 'lib/a/bar_baz.md')).toContain('[FOO](/lib/a/foo)')
  })

  it('links files that are not imported to GitHub and keeps external links', () => {
    const start = page(output, 'mod/guide/start.md')
    expect(start).toContain('[README](https://github.com/someone/mod/blob/v1.2.3/README.md)')
    expect(start).toContain('[manual](https://example.com/manual)')
  })

  it('leaves code alone', () => {
    const start = page(output, 'mod/guide/start.md')
    expect(start).toContain('`[not a link](nowhere.md)`')
    expect(start).toContain('// [also not a link](nowhere.md)')
  })

  it('copies images to the public folder', () => {
    expect(page(output, 'lib/a/foo.md')).toContain(
      '![FOO recipe](/img/mod/reference/images/foo.png)',
    )
    expect(output.images.map((i) => i.to)).toEqual(['img/mod/reference/images/foo.png'])
  })

  it('adds a contents list to pages with more than one ## section', () => {
    expect(page(output, 'mod/guide/start.md')).toMatch(/\[\[toc\]\]\n\n## First steps/)
    expect(page(output, 'lib/a/foo.md')).not.toContain('[[toc]]')
  })

  it('lists the chapters on the overview pages', () => {
    const overview = page(output, 'mod/index.md')
    expect(overview).toContain('# mod\n\nThe mod.')
    expect(overview).toContain('## Guide\n\n- [Start](/mod/guide/start): The start of the guide.')
    expect(overview).toContain('## Handbooks\n\n- [Functions](/mod/reference/functions)')
    const library = page(output, 'lib/a/index.md')
    expect(library).toContain('The library lib/a and its functions.')
    expect(library).toContain('## Functions\n\n- [FOO](/lib/a/foo): Does foo.')
  })

  it('names the mods with their versions for the home page', () => {
    expect(output.navigation.mods).toEqual([
      {
        id: 'mod',
        name: 'The Mod',
        version: '1.2.3',
        repository: 'someone/mod',
        modrinth: 'abc123',
        curseforge: 'the-mod',
        description: { en: 'A mod.', de: 'Eine Mod.' },
        link: '/mod/',
      },
    ])
  })

  it('writes the navigation with the labels of every language', () => {
    expect(output.navigation.tabs.map((t) => t.link)).toEqual(['/mod/', '/lib/a/'])
    expect(output.navigation.tabs[0]!.chapters).toEqual([
      { label: { en: 'Start', de: 'Anfang' }, link: '/mod/guide/start', group: 'guide' },
      {
        label: { en: 'Functions', de: 'Functions' },
        link: '/mod/reference/functions',
        group: 'handbook',
      },
    ])
  })
})

describe('translations', () => {
  const output = run()

  it('uses the translation and its links within the language', () => {
    const start = page(output, 'de/mod/guide/start.md')
    expect(start).toContain('# Anfang')
    expect(start).not.toContain('untranslated')
    expect(start).toContain('[FOO](/de/lib/a/foo)')
    expect(start).toContain('[ersten Schritten](/de/mod/guide/start#erste-schritte)')
    expect(start).toContain('[README](https://github.com/someone/mod/blob/v1.2.3/README.md)')
  })

  it('shows untranslated pages in English and says so', () => {
    const foo = page(output, 'de/lib/a/foo.md')
    expect(foo).toContain('untranslated: true')
    expect(foo).toContain('Does foo.')
    expect(foo).toContain('![FOO recipe](/img/mod/reference/images/foo.png)')
  })

  it('uses the overview text of the language', () => {
    expect(page(output, 'de/mod/index.md')).toContain('# mod\n\nDie Mod.')
    expect(page(output, 'de/mod/index.md')).toContain(
      '## Anleitung\n\n- [Anfang](/de/mod/guide/start)',
    )
  })
})

describe('errors', () => {
  let copy: string
  afterEach(() => rmSync(copy, { recursive: true, force: true }))

  const broken = (file: string, content: string) => {
    copy = mkdtempSync(join(tmpdir(), 'import-'))
    cpSync(join(fixtures, 'mod'), copy, { recursive: true })
    mkdirSync(dirname(join(copy, file)), { recursive: true })
    writeFileSync(join(copy, file), content)
    return () => run(copy)
  }

  it('fails on a link to a file that does not exist', () => {
    expect(broken('docs/guide/01-start.md', '# Start\n\n[gone](gone.md)\n')).toThrow(
      /docs\/guide\/01-start.md:3: the link gone.md leads to a file that doesn't exist/,
    )
  })

  it('fails on a link to an unknown anchor', () => {
    expect(
      broken('docs/guide/01-start.md', '# Start\n\n[FOO](../reference/functions.md#fooo)\n'),
    ).toThrow(/unknown anchor #fooo/)
  })

  it('fails on an image that does not exist', () => {
    expect(broken('docs/guide/01-start.md', '# Start\n\n![missing](images/missing.png)\n')).toThrow(
      ImportError,
    )
  })

  it('fails on a translation with fewer sections than the original', () => {
    const translatedFunctions = '# Funktionen\n\n## Eingebaute Funktionen\n\n### LEN\n'
    expect(broken('docs/de/reference/functions.md', translatedFunctions)).toThrow(
      /section 2 is missing/,
    )
  })
})
