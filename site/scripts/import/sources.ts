// sources.yaml and the repositories it names: each is downloaded as the GitHub archive of
// its tag into a cache folder, or read from a local working copy for development.
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, renameSync, rmSync, writeFileSync } from 'node:fs'
import { basename, join } from 'node:path'
import { parse } from 'yaml'
import type { Localized } from '../../.vitepress/theme/navigation.ts'

export interface Source {
  name: string
  repository: string // owner/name on GitHub
  modrinth: string // the Modrinth project
  curseforge: string // the slug of the CurseForge project
  description: Localized
  tag: string
  docs: string // the documentation folder in the repository
}

export type ChapterSpec =
  | { file: string; group?: 'guide' | 'handbook'; without?: string[] }
  | { file: string; section: string; group?: 'guide' | 'handbook' }
  // the ### sections of the library section, or of another ## section of the library file;
  // those are listed on the overview page under the heading of their section
  | { functions: true; section?: string }

export interface TabSpec {
  id: string
  label: string
  color: string
  link: string
  source: string
  overview?: { text?: Localized; include?: string; list?: string[] }
  // the file of the library and its ## section; without a section, the library is the whole
  // file, and its introduction is the text before the first ## section
  library?: { file: string; section?: string }
  chapters: ChapterSpec[]
}

export interface Config {
  sources: Record<string, Source>
  tabs: TabSpec[]
}

export function readConfig(file: string): Config {
  const config = parse(readFileSync(file, 'utf-8')) as Config
  for (const tab of config.tabs) {
    if (!config.sources[tab.source]) {
      throw new Error(`${file}: tab ${tab.id} names the unknown source ${tab.source}`)
    }
    if (!/^\/.*\/$/.test(tab.link)) {
      throw new Error(`${file}: the link of tab ${tab.id} must start and end with /`)
    }
    if (tab.chapters.some((c) => 'functions' in c) && !tab.library) {
      throw new Error(`${file}: tab ${tab.id} has functions, but no library section`)
    }
    if (
      tab.library &&
      !tab.library.section &&
      tab.chapters.some((c) => 'functions' in c && !c.section)
    ) {
      throw new Error(
        `${file}: tab ${tab.id} has functions without a section, but its library has none`,
      )
    }
  }
  return config
}

// version returns the version of a source from its tag (v0.3.0 is 0.3.0).
export const version = (source: Source) => source.tag.replace(/^v/, '')

// fetchSource returns the folder of a source at its tag, downloading it if needed.
export async function fetchSource(source: Source, cache: string): Promise<string> {
  const folder = join(cache, `${source.repository.replace('/', '_')}@${source.tag}`)
  if (existsSync(join(folder, '.complete'))) {
    return folder
  }
  const url = `https://github.com/${source.repository}/archive/refs/tags/${source.tag}.tar.gz`
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`downloading ${url}: ${response.status} ${response.statusText}`)
  }
  mkdirSync(cache, { recursive: true })
  const archive = `${folder}.tar.gz`
  const temporary = `${folder}.tmp`
  writeFileSync(archive, Buffer.from(await response.arrayBuffer()))
  rmSync(temporary, { recursive: true, force: true })
  mkdirSync(temporary)
  // tar is part of Linux and Windows; the archive has one top folder, which is stripped. The
  // paths are relative, because GNU tar (in Git Bash) reads "C:" as the name of a host.
  execFileSync(
    'tar',
    ['-xzf', basename(archive), '-C', basename(temporary), '--strip-components=1'],
    {
      cwd: cache,
    },
  )
  writeFileSync(join(temporary, '.complete'), url + '\n')
  rmSync(folder, { recursive: true, force: true })
  await renameWithRetry(temporary, folder)
  rmSync(archive)
  return folder
}

// renameWithRetry renames a folder, trying again for a few seconds: on Windows, a virus scanner
// that still reads the files just unpacked makes the rename fail with EPERM or EBUSY.
export async function renameWithRetry(from: string, to: string, tries = 10): Promise<void> {
  for (let attempt = 1; ; attempt++) {
    try {
      renameSync(from, to)
      return
    } catch (error) {
      const code = (error as NodeJS.ErrnoException).code
      if (attempt >= tries || (code !== 'EPERM' && code !== 'EBUSY')) throw error
      await new Promise((resolve) => setTimeout(resolve, 500 * attempt))
    }
  }
}
