import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { parseMark, screenshotHtml, webpSize } from '../.vitepress/screenshots.ts'
import { collect, listing } from './screenshots.ts'

// The header of a lossless WebP image of the given size (enough for webpSize).
function webp(width: number, height: number): Buffer {
  const data = Buffer.alloc(30)
  data.write('RIFF', 0, 'ascii')
  data.writeUInt32LE(22, 4)
  data.write('WEBP', 8, 'ascii')
  data.write('VP8L', 12, 'ascii')
  data.writeUInt32LE(10, 16)
  data[20] = 0x2f
  data.writeUInt32LE((width - 1) | ((height - 1) << 14), 21)
  return data
}

let site: string
const write = (file: string, content: string | Buffer) => {
  mkdirSync(dirname(join(site, file)), { recursive: true })
  writeFileSync(join(site, file), content)
}

beforeEach(() => {
  site = mkdtempSync(join(tmpdir(), 'screenshots-'))
  write(
    'tutorials/learning/sign.md',
    '# Sign\n\n<!-- screenshot: sign-sheet | The program on its sheet -->\n\nText\n',
  )
  write(
    'de/tutorials/learning/sign.md',
    '# Schild\n\n<!-- screenshot: sign-sheet | Das Programm auf seinem Blatt -->\n',
  )
  write('tutorials/learning/more.md', '<!-- screenshot: more-display | The display -->\n')
  write('public/tutorials/screenshots/sign-sheet.webp', webp(1280, 720))
})

afterEach(() => rmSync(site, { recursive: true, force: true }))

describe('marks', () => {
  it('parses a mark on a line of its own', () => {
    expect(parseMark('<!-- screenshot: a-b | The sheet -->')).toEqual({
      id: 'a-b',
      description: 'The sheet',
    })
    expect(parseMark('<!-- a comment -->')).toBeUndefined()
  })

  it('reads the size of a WebP image', () => {
    expect(webpSize(webp(1280, 720))).toEqual({ width: 1280, height: 720 })
  })

  it('shows existing screenshots and keeps the mark of missing ones', () => {
    const publicFolder = join(site, 'public')
    expect(screenshotHtml('<!-- screenshot: sign-sheet | The "sheet" -->\n', publicFolder)).toBe(
      '<img class="screenshot" src="/tutorials/screenshots/sign-sheet.webp" alt="The &quot;sheet&quot;" width="1280" height="720" loading="lazy">\n',
    )
    const missing = '<!-- screenshot: more-display | The display -->\n'
    expect(screenshotHtml(missing, publicFolder)).toBe(missing)
  })
})

describe('collect', () => {
  it('lists every screenshot once with its pages and size', () => {
    const screenshots = collect(site)
    expect(screenshots).toEqual([
      {
        id: 'more-display',
        description: 'The display',
        pages: ['tutorials/learning/more.md'],
        file: 'public/tutorials/screenshots/more-display.webp',
      },
      {
        id: 'sign-sheet',
        description: 'The program on its sheet',
        pages: ['tutorials/learning/sign.md', 'de/tutorials/learning/sign.md'],
        file: 'public/tutorials/screenshots/sign-sheet.webp',
        size: '1280x720',
      },
    ])
    expect(listing(screenshots)).toContain('# 2 screenshots, 1 missing.')
  })
})
