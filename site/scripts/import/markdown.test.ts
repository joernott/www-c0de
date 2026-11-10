import { describe, expect, it } from 'vitest'
import { firstParagraph, headings, plainText, rewriteLinks, shiftHeadings } from './markdown.ts'

describe('plainText', () => {
  it.each([
    ['[Data](data.md)', 'Data'],
    ['`c0de/math`', 'c0de/math'],
    ['**bold** and *italic* and _too_', 'bold and italic and too'],
    ['GET_PRESSURE_PLATE', 'GET_PRESSURE_PLATE'],
    ['__init__ is bold', 'init is bold'],
    ['![image](x.png) text', 'text'],
  ])('%s is %s', (markdown, text) => {
    expect(plainText(markdown)).toBe(text)
  })
})

describe('headings', () => {
  it('finds headings outside of code and makes GitHub anchors', () => {
    const lines = [
      '# Title',
      '',
      '```c0de',
      '# not a heading',
      '```',
      '## TO_JSON',
      '## Examples',
      '## Examples',
    ]
    expect(headings(lines).map((h) => `${h.level} ${h.anchor} ${h.line}`)).toEqual([
      '1 title 0',
      '2 to_json 5',
      '2 examples 6',
      '2 examples-1 7',
    ])
  })
})

describe('shiftHeadings', () => {
  it('moves headings up and down, but not in code', () => {
    expect(shiftHeadings(['### A', '```', '### code', '```', '#### B'], -2)).toEqual([
      '# A',
      '```',
      '### code',
      '```',
      '## B',
    ])
    expect(shiftHeadings(['# A', '## B'], 1)).toEqual(['## A', '### B'])
  })
})

describe('rewriteLinks', () => {
  it('rewrites links and images, but not in code', () => {
    const lines = ['See [a](a.md) and ![b](b.png "B") and `[c](c.md)`.', '```', '[d](d.md)', '```']
    const seen: string[] = []
    const result = rewriteLinks(lines, (target, image, line) => {
      seen.push(`${target} ${image} ${line}`)
      return target.toUpperCase()
    })
    expect(result[0]).toBe('See [a](A.MD) and ![b](B.PNG "B") and `[c](c.md)`.')
    expect(result[2]).toBe('[d](d.md)')
    expect(seen).toEqual(['a.md false 0', 'b.png true 0'])
  })
})

describe('firstParagraph', () => {
  it('skips headings, images and tables', () => {
    expect(
      firstParagraph(['# T', '', '![r](r.png)', '', 'The first', 'paragraph.', '', 'Second.']),
    ).toBe('The first paragraph.')
  })
})
