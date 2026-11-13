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
  | { functions: true }

export interface TabSpec {
  id: string
  label: string
  color: string
  link: string
  source: string
  overview?: { text?: Localized; include?: string; list?: string[] }
  library?: { file: string; section: string }
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
  renameSync(temporary, folder)
  rmSync(archive)
  return folder
}
