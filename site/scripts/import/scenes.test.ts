import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import {
  isProgram,
  normalize,
  programHash,
  programView,
  type ModelsManifest,
} from '../../.vitepress/programs.ts'
import { collect, fences } from './scenes.ts'

const program = 'PROGRAM sign\nNOOP\n'

let site: string
const write = (file: string, content: string) => {
  mkdirSync(dirname(join(site, file)), { recursive: true })
  writeFileSync(join(site, file), content)
}

beforeEach(() => {
  site = mkdtempSync(join(tmpdir(), 'scenes-'))
})

afterEach(() => rmSync(site, { recursive: true, force: true }))

describe('programs', () => {
  it('are the same program with other line ends and trailing spaces', () => {
    expect(normalize('PROGRAM a  \r\nNOOP\r\n\r\n')).toBe('PROGRAM a\nNOOP')
    expect(programHash('PROGRAM a  \r\nNOOP\r\n')).toBe(programHash('PROGRAM a\nNOOP'))
    expect(programHash('PROGRAM a\nNOOP')).toMatch(/^[0-9a-f]{16}$/)
  })

  it('start with PROGRAM; everything else is a fragment', () => {
    expect(isProgram('\n  PROGRAM a\nNOOP')).toBe(true)
    expect(isProgram('CALL PRINT\n    PARAMETER value "a" ;')).toBe(false)
  })
})

describe('fences', () => {
  it('finds the c0de blocks of a page, also indented ones', () => {
    const markdown = [
      '# Page',
      '```c0de',
      'PROGRAM a',
      '```',
      '1. A list',
      '   ```c0de',
      '   PROGRAM b',
      '       CALL x',
      '   ```',
      '```text',
      'PROGRAM c',
      '```',
    ].join('\n')
    expect(fences(markdown)).toEqual(['PROGRAM a\n', 'PROGRAM b\n    CALL x\n'])
  })
})

describe('collect', () => {
  it('finds the program files and the complete programs of the pages', () => {
    write('tutorials/programs/learning/sign.c0de', program)
    write(
      'tutorials/learning/sign.md',
      '```c0de\nPROGRAM sign\nNOOP\n```\n```c0de\nCALL CLS\n```\n',
    )
    write('c0de/guide/examples.md', '```c0de\nPROGRAM other\n```\n')
    write('node_modules/x/README.md', '```c0de\nPROGRAM not_ours\n```\n')
    const programs = collect(site)
    expect([...programs.values()].sort()).toEqual(['PROGRAM other\n', program])
    expect(programs.get(programHash(program))).toBe(program)
  })
})

describe('programView', () => {
  const manifest: ModelsManifest = { base: '/models/1.0.0/' }
  const html = '<div class="language-c0de"><pre>…</pre></div>\n'
  const publicFolder = () => join(site, 'public')

  beforeEach(() => {
    write(`public/models/1.0.0/programs/${programHash(program)}.glb`, 'glTF')
  })

  it('puts programs with a scene into ProgramView', () => {
    expect(programView(html, program, undefined, publicFolder(), manifest)).toBe(
      `<ProgramView scene="/models/1.0.0/programs/${programHash(program)}">\n${html}</ProgramView>\n`,
    )
  })

  it('uses the screenshot of a program file as poster', () => {
    write('public/tutorials/screenshots/first-program-sign.webp', 'RIFF')
    const file = join(site, 'tutorials', 'programs', 'learning', 'first-program-sign.c0de')
    expect(programView(html, program, file, publicFolder(), manifest)).toContain(
      ' poster="/tutorials/screenshots/first-program-sign.webp">',
    )
  })

  it('leaves fragments, programs without scene and sites without models alone', () => {
    expect(programView(html, 'CALL CLS\n', undefined, publicFolder(), manifest)).toBe(html)
    expect(programView(html, 'PROGRAM new\n', undefined, publicFolder(), manifest)).toBe(html)
    expect(programView(html, program, undefined, publicFolder(), undefined)).toBe(html)
  })
})
