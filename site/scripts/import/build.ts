// Turns the documentation of the sources into the pages and the navigation of the site.
//
// The pages are planned once from the English files. Sections are identified by their
// position (the n-th ## heading of a file, the m-th ### heading in it), so a translation with
// headings in its own language maps to the same pages. Every heading of every file is mapped
// to the page and the anchor where it ends up; links are rewritten with this map.
import { existsSync, readFileSync } from 'node:fs'
import { join, posix } from 'node:path'
import GithubSlugger from 'github-slugger'
import { pathIn, type Language } from '../../.vitepress/theme/language.ts'
import type { Chapter, Localized, MainTab, Navigation } from '../../.vitepress/theme/navigation.ts'
import {
  firstParagraph,
  headings,
  pngSize,
  rewriteLinks,
  sectionRange,
  shiftHeadings,
  sizeImages,
  type Heading,
} from './markdown.ts'
import { version, type Config, type TabSpec } from './sources.ts'

export interface Page {
  file: string // relative to the site folder, e.g. de/c0de/math/abs.md
  content: string
  link?: string // the link of the page without the language, e.g. /c0de/math/abs
  function?: true // the page of a library function
}

export interface Image {
  from: string // absolute path in the source
  to: string // relative to the public folder of the site
}

export interface Output {
  pages: Page[]
  images: Image[]
  navigation: Navigation
}

export class ImportError extends Error {}

const groupTitles = {
  guide: { en: 'Guide', de: 'Anleitung' },
  handbook: { en: 'Handbooks', de: 'Handbücher' },
  functions: { en: 'Functions', de: 'Funktionen' },
  chapters: { en: 'Chapters', de: 'Kapitel' },
} satisfies Record<string, Localized>

// A part of a file, identified by the positions of its headings.
type Part =
  | { kind: 'file'; without: number[] } // the whole file without some ## sections
  | { kind: 'section'; section: number } // a ## section
  | { kind: 'function'; section: number; index: number } // a ### section in a ## section
  | { kind: 'intro'; section: number } // the text of a ## section before its first ###
  | { kind: 'include' } // a whole file with its headings one level down

interface FilePart {
  file: string
  part: Part
}

interface Planned {
  link: string
  tab: TabSpec
  group?: 'guide' | 'handbook'
  function?: true
  // A chapter is one part of a file; an overview page has a title of its own and is made of
  // the introduction of the library and an included file.
  content: FilePart[]
  overview: boolean
}

// A file of a source in one language. Untranslated files are the English ones.
interface SourceFile {
  source: string
  file: string // relative to the docs folder
  folder: string // the folder of the source
  repoPath: string // relative to the folder of the source
  lines: string[]
  headings: Heading[]
  translated: boolean
}

interface Target {
  link: string
  anchor?: string
}

// A block of lines of a page, the file they come from and their positions in it.
interface Block {
  lines: string[]
  file: SourceFile
  from: number[] // the position in the file of every line
  title?: Heading // the heading that is the title of the page
  shift: number // how far the headings were moved
}

export function build(
  config: Config,
  folders: Record<string, string>,
  languages: Language[],
): Output {
  const english = new Files(config, folders, 'en')
  const planned = plan(config, english)
  const functions = new Set(planned.filter((p) => p.function).map((p) => p.link))
  const pages: Page[] = []
  const images = new Map<string, Image>()
  const labels = new Map<string, Localized>()
  for (const language of languages) {
    const files = language === 'en' ? english : new Files(config, folders, language)
    for (const page of render(config, planned, files, language, images)) {
      pages.push({
        file: fileOf(pathIn(page.link, language)),
        content: page.content,
        link: page.link,
        ...(functions.has(page.link) && { function: true as const }),
      })
      const label = labels.get(page.link) ?? { en: page.title }
      label[language] = page.title
      labels.set(page.link, label)
    }
  }
  return { pages, images: [...images.values()], navigation: navigation(config, planned, labels) }
}

// fileOf returns the source file of a page path (/c0de/ is c0de/index.md).
const fileOf = (path: string) =>
  path.endsWith('/') ? `${path.slice(1)}index.md` : `${path.slice(1)}.md`

class Files {
  private cache = new Map<string, SourceFile>()
  private config: Config
  private folders: Record<string, string>
  private language: Language

  constructor(config: Config, folders: Record<string, string>, language: Language) {
    this.config = config
    this.folders = folders
    this.language = language
  }

  get(source: string, file: string): SourceFile {
    const key = `${source}:${file}`
    let result = this.cache.get(key)
    if (!result) {
      const folder = this.folders[source]!
      const docs = this.config.sources[source]!.docs
      const translated = posix.join(docs, this.language, file)
      const original = posix.join(docs, file)
      const repoPath =
        this.language !== 'en' && existsSync(join(folder, translated)) ? translated : original
      if (!existsSync(join(folder, repoPath))) {
        throw new ImportError(`${source}: ${repoPath} does not exist`)
      }
      const lines = readFileSync(join(folder, repoPath), 'utf-8').replace(/\r\n/g, '\n').split('\n')
      result = {
        source,
        file,
        folder,
        repoPath,
        lines,
        headings: headings(lines),
        translated: this.language === 'en' || repoPath === translated,
      }
      this.cache.set(key, result)
    }
    return result
  }
}

const sections = (f: SourceFile) => f.headings.filter((h) => h.level === 2)

function sectionIndex(f: SourceFile, name: string): number {
  const index = sections(f).findIndex((h) => h.text === name)
  if (index < 0) {
    throw new ImportError(`${f.repoPath}: there is no section "## ${name}"`)
  }
  return index
}

function sectionHeading(f: SourceFile, section: number): Heading {
  const heading = sections(f)[section]
  if (!heading) {
    throw new ImportError(
      `${f.repoPath}: section ${section + 1} is missing (a translation must have the same ## headings)`,
    )
  }
  return heading
}

function functionHeadings(f: SourceFile, section: number): Heading[] {
  const range = sectionRange(f.headings, sectionHeading(f, section), f.lines.length)
  return f.headings.filter((h) => h.level === 3 && h.line > range.start && h.line < range.end)
}

// pageName turns guide/01-getting-started.md into guide/getting-started.
const pageName = (file: string) => file.replace(/\.md$/, '').replace(/(^|\/)\d+-/g, '$1')

function plan(config: Config, english: Files): Planned[] {
  const result: Planned[] = []
  for (const tab of config.tabs) {
    const overview: FilePart[] = []
    if (tab.library) {
      const section = sectionIndex(english.get(tab.source, tab.library.file), tab.library.section)
      overview.push({ file: tab.library.file, part: { kind: 'intro', section } })
    }
    if (tab.overview?.include) {
      overview.push({ file: tab.overview.include, part: { kind: 'include' } })
    }
    result.push({ link: tab.link, tab, content: overview, overview: true })

    for (const spec of tab.chapters) {
      if ('functions' in spec) {
        const library = english.get(tab.source, tab.library!.file)
        const section = sectionIndex(library, tab.library!.section)
        functionHeadings(library, section).forEach((h, index) => {
          result.push({
            link: tab.link + h.anchor,
            tab,
            content: [{ file: tab.library!.file, part: { kind: 'function', section, index } }],
            overview: false,
            function: true,
          })
        })
      } else if ('section' in spec) {
        const f = english.get(tab.source, spec.file)
        const section = sectionIndex(f, spec.section)
        result.push({
          link: tab.link + sectionHeading(f, section).anchor,
          tab,
          group: spec.group,
          content: [{ file: spec.file, part: { kind: 'section', section } }],
          overview: false,
        })
      } else {
        const f = english.get(tab.source, spec.file)
        const without = (spec.without ?? []).map((name) => sectionIndex(f, name))
        result.push({
          link: tab.link + pageName(spec.file),
          tab,
          group: spec.group,
          content: [{ file: spec.file, part: { kind: 'file', without } }],
          overview: false,
        })
      }
    }
  }
  const seen = new Set<string>()
  for (const p of result) {
    if (seen.has(p.link)) {
      throw new ImportError(`two pages have the link ${p.link}`)
    }
    seen.add(p.link)
  }
  return result
}

const lineNumbers = (start: number, end: number) =>
  Array.from({ length: end - start }, (_, i) => start + i)

// block returns the lines of a part of a file. Chapters start with a level 1 heading, so
// sections and functions move their headings up; an included file moves them down.
function block(f: SourceFile, part: Part): Block {
  const make = (from: number[], shift: number, title?: Heading): Block => ({
    lines: shiftHeadings(
      from.map((i) => f.lines[i]!),
      shift,
    ),
    file: f,
    from,
    title,
    shift,
  })
  switch (part.kind) {
    case 'file': {
      const excluded = part.without.map((s) =>
        sectionRange(f.headings, sectionHeading(f, s), f.lines.length),
      )
      const from = lineNumbers(0, f.lines.length).filter(
        (i) => !excluded.some((r) => i >= r.start && i < r.end),
      )
      return make(
        from,
        0,
        f.headings.find((h) => h.level === 1),
      )
    }
    case 'section': {
      const heading = sectionHeading(f, part.section)
      const range = sectionRange(f.headings, heading, f.lines.length)
      return make(lineNumbers(range.start, range.end), -1, heading)
    }
    case 'function': {
      const heading = functionHeadings(f, part.section)[part.index]
      if (!heading) {
        throw new ImportError(
          `${f.repoPath}: function ${part.index + 1} of section ${part.section + 1} is missing (a translation must have the same ### headings)`,
        )
      }
      const range = sectionRange(f.headings, heading, f.lines.length)
      return make(lineNumbers(range.start, range.end), -2, heading)
    }
    case 'intro': {
      const heading = sectionHeading(f, part.section)
      const first = functionHeadings(f, part.section)[0]
      const end = first ? first.line : sectionRange(f.headings, heading, f.lines.length).end
      // The heading of the library itself becomes the title of the overview page.
      return make(lineNumbers(heading.line + 1, end), 0, heading)
    }
    case 'include':
      return make(lineNumbers(0, f.lines.length), 1)
  }
}

interface Rendered {
  link: string
  title: string
  content: string
}

function render(
  config: Config,
  planned: Planned[],
  files: Files,
  language: Language,
  images: Map<string, Image>,
): Rendered[] {
  const targets = new Map<string, Map<string, Target>>() // source:file -> anchor -> target
  const starts = new Map<string, Target>() // source:file -> the page that starts the file

  // mapHeadings records where the headings of a block end up on the page "link".
  const mapHeadings = (b: Block, link: string) => {
    const key = `${b.file.source}:${b.file.file}`
    const anchors = targets.get(key) ?? new Map<string, Target>()
    targets.set(key, anchors)
    const slugger = new GithubSlugger()
    const lines = new Set(b.from)
    if (b.title && !lines.has(b.title.line)) {
      // a title that isn't part of the lines (the heading of a library)
      anchors.set(b.title.anchor, { link })
    }
    for (const h of b.file.headings) {
      if (!lines.has(h.line)) continue
      const isTitle = h === b.title || h.level + b.shift === 1
      const anchor = slugger.slug(h.text)
      anchors.set(h.anchor, isTitle ? { link } : { link, anchor })
      if (isTitle && h.level === 1 && !starts.has(key)) {
        starts.set(key, { link })
      }
    }
  }

  // First pass: the blocks of every page and the map of the headings.
  const pages = planned.map((p) => {
    const blocks = p.content.map((c) => block(files.get(p.tab.source, c.file), c.part))
    for (const b of blocks) mapHeadings(b, p.link)
    const title = p.overview ? p.tab.label : (blocks[0]!.title?.text ?? p.tab.label)
    return { planned: p, blocks, title, untranslated: blocks.some((b) => !b.file.translated) }
  })
  // A file whose level 1 heading isn't imported starts at the first page made from it.
  for (const page of pages) {
    for (const b of page.blocks) {
      const key = `${b.file.source}:${b.file.file}`
      if (!starts.has(key)) starts.set(key, { link: page.planned.link })
    }
  }

  const resolve = (f: SourceFile, target: string, image: boolean, line: number): string => {
    const where = `${f.source}: ${f.repoPath}:${line + 1}`
    if (/^[a-z][a-z0-9+.-]*:/i.test(target) || target.startsWith('//')) {
      return target
    }
    const hash = target.indexOf('#')
    const path = hash < 0 ? target : target.slice(0, hash)
    const anchor = hash < 0 ? undefined : target.slice(hash + 1)
    const repoPath =
      path === '' ? f.repoPath : posix.normalize(posix.join(posix.dirname(f.repoPath), path))
    const source = config.sources[f.source]!
    if (image) {
      let found = repoPath
      if (!existsSync(join(f.folder, found)) && language !== 'en') {
        // A translation may use the images of the English documentation.
        found = found.replace(`${source.docs}/${language}/`, `${source.docs}/`)
      }
      if (!existsSync(join(f.folder, found))) {
        throw new ImportError(`${where}: the image ${target} doesn't exist`)
      }
      const to = `img/${f.source}/${posix.relative(source.docs, found)}`
      images.set(to, { from: join(f.folder, found), to })
      return `/${to}`
    }
    const docRelative = docFile(source.docs, repoPath, language)
    const key = `${f.source}:${docRelative}`
    if (docRelative !== undefined && starts.has(key)) {
      const found = anchor === undefined ? starts.get(key) : targets.get(key)?.get(anchor)
      if (!found) {
        throw new ImportError(`${where}: the link ${target} leads to the unknown anchor #${anchor}`)
      }
      return pathIn(found.link, language) + (found.anchor ? `#${found.anchor}` : '')
    }
    if (existsSync(join(f.folder, repoPath))) {
      return `https://github.com/${source.repository}/blob/${source.tag}/${repoPath}${anchor ? `#${anchor}` : ''}`
    }
    throw new ImportError(`${where}: the link ${target} leads to a file that doesn't exist`)
  }

  // Second pass: rewrite the links and write the pages.
  const rewritten = pages.map((page) => ({
    ...page,
    lines: page.blocks.map((b) =>
      sizeImages(
        rewriteLinks(b.lines, (target, image, i) => resolve(b.file, target, image, b.from[i]!)),
        (src) => {
          const image = images.get(src.replace(/^\//, ''))
          return image && pngSize(readFileSync(image.from))
        },
      ),
    ),
  }))
  return rewritten.map((page) => {
    const p = page.planned
    const lines = p.overview ? overview(page, rewritten, language) : withContents(page.lines[0]!)
    const source = config.sources[p.tab.source]!
    const description = shorten(firstParagraph(lines.slice(1)) || page.title)
    const frontmatter = [
      '---',
      `title: ${JSON.stringify(page.title)}`,
      `description: ${JSON.stringify(description)}`,
      `source: ${JSON.stringify(`${source.name} ${version(source)}`)}`,
      ...(page.untranslated && language !== 'en' ? ['untranslated: true'] : []),
      '---',
      '',
    ]
    return {
      link: p.link,
      title: page.title,
      content: [...frontmatter, ...lines].join('\n').replace(/\n+$/, '\n'),
    }
  })
}

// docFile returns the path of a repository file relative to the docs folder (without the
// language folder), or undefined if it isn't documentation.
function docFile(docs: string, repoPath: string, language: Language): string | undefined {
  const prefix = `${docs}/`
  if (!repoPath.startsWith(prefix)) return undefined
  const rest = repoPath.slice(prefix.length)
  return language !== 'en' && rest.startsWith(`${language}/`)
    ? rest.slice(language.length + 1)
    : rest
}

const shorten = (text: string) =>
  text.length > 160 ? `${text.slice(0, 157).replace(/\s+\S*$/, '')} …` : text

// withContents adds the contents list before the first ## heading of pages that have more
// than one.
function withContents(lines: string[]): string[] {
  const h2 = lines.map((l, i) => (/^## /.test(l) ? i : -1)).filter((i) => i >= 0)
  if (h2.length < 2) return lines
  return [...lines.slice(0, h2[0]), '[[toc]]', '', ...lines.slice(h2[0])]
}

interface RenderedPage {
  planned: Planned
  title: string
  lines: string[][] // one array per block
}

// overview returns the overview page of a tab: its title and text, the introduction of the
// library, the list of its chapters (only of the groups in overview.list, if given), and the
// included file.
function overview(page: RenderedPage, all: RenderedPage[], language: Language): string[] {
  const tab = page.planned.tab
  const localized = (t: Localized) => t[language] ?? t.en
  const parts = [...page.lines]
  const intro = tab.library ? parts.shift()! : []
  const included = parts.flat()
  const listed = tab.overview?.list

  const lines = [`# ${tab.label}`, '']
  if (tab.overview?.text) lines.push(localized(tab.overview.text), '')
  lines.push(...intro, '')
  const groups = new Map<keyof typeof groupTitles, string[]>()
  for (const c of all) {
    if (c.planned.tab !== tab || c.planned.overview) continue
    const link = pathIn(c.planned.link, language)
    const group = c.planned.group ?? (c.planned.function ? 'functions' : 'chapters')
    if (listed && !listed.includes(group)) continue
    const summary = shorten(firstParagraph(c.lines[0]!.slice(1)))
    groups.set(group, [
      ...(groups.get(group) ?? []),
      `- [${c.title}](${link})${summary ? `: ${summary}` : ''}`,
    ])
  }
  for (const [group, list] of groups) {
    lines.push(`## ${localized(groupTitles[group])}`, '', ...list, '')
  }
  lines.push(...included)
  return lines
}

function navigation(
  config: Config,
  planned: Planned[],
  labels: Map<string, Localized>,
): Navigation {
  return {
    mods: Object.entries(config.sources).map(([id, source]) => ({
      id,
      name: source.name,
      version: version(source),
      repository: source.repository,
      modrinth: source.modrinth,
      description: source.description,
      link: config.tabs.find((t) => t.source === id)?.link ?? '/',
    })),
    tabs: config.tabs.map((tab): MainTab => ({
      id: tab.id,
      label: { en: tab.label },
      color: tab.color,
      link: tab.link,
      chapters: planned
        .filter((p) => p.tab === tab && !p.overview)
        .map((p): Chapter => ({
          label: labels.get(p.link)!,
          link: p.link,
          ...(p.group && { group: p.group }),
        })),
    })),
  }
}
