import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { checkSite } from './check-links.ts'

let site: string
const write = (file: string, content: string) => {
  mkdirSync(dirname(join(site, file)), { recursive: true })
  writeFileSync(join(site, file), content)
}

beforeEach(() => {
  site = mkdtempSync(join(tmpdir(), 'site-'))
  write(
    'index.html',
    '<h1 id="home">Home</h1><a href="/c0de/">c0de</a><a href="/c0de/math/abs#example">ABS</a>',
  )
  write('c0de/index.html', '<a href="#top" id="top">top</a><img src="/img/a.png">')
  write('c0de/math/abs.html', '<h2 id="example">Example</h2><a href="https://example.com/">ext</a>')
  write('img/a.png', 'png')
  write('assets/style.css', 'body { background: url(/img/a.png) }')
})
afterEach(() => rmSync(site, { recursive: true, force: true }))

describe('checkSite', () => {
  it('accepts a site whose links all lead somewhere', () => {
    expect(checkSite(site)).toEqual([])
  })

  it('finds links to missing pages and anchors', () => {
    write(
      'index.html',
      '<a href="/c0de/gone">x</a><a href="/c0de/math/abs#gone">y</a><img src="/img/b.png">',
    )
    expect(checkSite(site)).toEqual([
      'index.html: /c0de/gone leads to nothing',
      'index.html: /c0de/math/abs#gone leads to a missing anchor',
      'index.html: /img/b.png leads to nothing',
    ])
  })

  it('finds resources from other sites', () => {
    write(
      'index.html',
      '<link rel="stylesheet" href="https://fonts.example.com/a.css"><script src="//cdn.example.com/x.js"></script><link rel="canonical" href="https://c0de.at/">',
    )
    write('assets/style.css', '@font-face { src: url("https://fonts.example.com/a.woff2") }')
    expect(checkSite(site)).toEqual([
      'index.html: <script> loads //cdn.example.com/x.js from another site',
      'index.html: <stylesheet> loads https://fonts.example.com/a.css from another site',
      `${join('assets', 'style.css')}: loads https://fonts.example.com/a.woff2 from another site`,
    ])
  })
})
