// The 3D scenes of the programs (tasks 8.2 and 8.3, see .vitepress/programs.ts): the models of
// c0de from its release (c0de-models-<version>.zip) or a local build, the layout of every
// complete program from the program runner, and from both one GLB file per program.
import { spawn } from 'node:child_process'
import { createHash } from 'node:crypto'
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import { availableParallelism, tmpdir } from 'node:os'
import { basename, dirname, join, relative } from 'node:path'
import { parse } from 'yaml'
import {
  isProgram,
  manifestFile,
  normalize,
  programHash,
  type ModelsManifest,
} from '../../.vitepress/programs.ts'
import { download, javaArgs, needs, runner as getRunner, type Runner } from '../runner.ts'
import {
  buildScene,
  digitsPng,
  DIGITS_TEXTURE,
  glyphsPng,
  GLYPHS_TEXTURE,
  models as readModels,
  type Layout,
} from './scene.ts'
import { version, type Config } from './sources.ts'
import { unzip } from './zip.ts'

// The folders that are not pages of the site.
const notPages = new Set(['node_modules', 'scripts', 'public', '.vitepress', '.cache'])

// fences returns the ```c0de blocks of a Markdown text (also indented ones, in lists).
export function fences(markdown: string): string[] {
  const blocks: string[] = []
  const fence = /^( *)```c0de[^\n]*\n([\s\S]*?)^\1```/gm
  for (const match of markdown.matchAll(fence)) {
    const indent = match[1]!.length
    blocks.push(
      match[2]!
        .split('\n')
        .map((line) => line.replace(new RegExp(`^ {0,${indent}}`), ''))
        .join('\n'),
    )
  }
  return blocks
}

// collect returns the complete programs of the site by hash: the files of the tutorials and the
// ```c0de blocks of all pages.
export function collect(site: string): Map<string, string> {
  const programs = new Map<string, string>()
  const add = (text: string) => {
    if (isProgram(text)) programs.set(programHash(text), normalize(text) + '\n')
  }
  const walk = (folder: string) => {
    for (const entry of readdirSync(folder, { withFileTypes: true })) {
      const file = join(folder, entry.name)
      if (entry.isDirectory()) {
        if (!notPages.has(entry.name)) walk(file)
      } else if (entry.name.endsWith('.c0de')) {
        add(readFileSync(file, 'utf-8'))
      } else if (entry.name.endsWith('.md')) {
        fences(readFileSync(file, 'utf-8')).forEach(add)
      }
    }
  }
  walk(site)
  return programs
}

// modelsFolder returns the folder with the models of c0de: the export of a local working copy
// (python scripts/export_models.py writes build/models) or the zip of the release, unpacked
// in the cache.
export async function modelsFolder(
  config: Config,
  cache: string,
  local: string | undefined,
): Promise<string> {
  if (local) {
    const folder = join(local, 'build', 'models')
    if (!existsSync(join(folder, 'index.json'))) {
      throw new Error(`no models in ${folder}: run python scripts/export_models.py in ${local}`)
    }
    return folder
  }
  const c0de = config.sources.c0de!
  const name = `c0de-models-${version(c0de)}`
  const folder = join(cache, name)
  if (existsSync(join(folder, 'index.json'))) return folder
  const zip = await download(c0de, `${name}.zip`, cache)
  if (!zip) throw new Error(`c0de ${c0de.tag} has no models (${name}.zip)`)
  for (const [path, data] of unzip(readFileSync(zip))) {
    const file = join(folder, path)
    if (relative(folder, file).startsWith('..')) throw new Error(`${zip}: bad path ${path}`)
    mkdirSync(dirname(file), { recursive: true })
    writeFileSync(file, data)
  }
  return folder
}

// parseLayout reads the YAML of a layout. Its texts stay as the runner wrote them: the literal
// TRUE is no boolean and 1.50 no number (the failsafe schema reads every value as a string);
// only the places are numbers.
export function parseLayout(yaml: string): Layout {
  const layout = parse(yaml, { schema: 'failsafe' }) as Layout
  for (const line of layout.lines ?? []) {
    line.z = Number(line.z)
    for (const block of line.blocks ?? []) block.x = Number(block.x)
  }
  return layout
}

// layout runs `c0de-runner --layout` on a program; layouts are cached by the program and the
// jars of the runner.
async function layout(program: string, runner: Runner, cache: string): Promise<Layout> {
  const libraries = needs(program)
  const key = createHash('sha256')
    .update([program, runner.jar, ...libraries.map((l) => runner.libraries[l] ?? '')].join('\0'))
    .digest('hex')
  const cached = join(cache, `${key}.yaml`)
  if (existsSync(cached)) return parseLayout(readFileSync(cached, 'utf-8'))
  const folder = mkdtempSync(join(tmpdir(), 'c0de-layout-'))
  try {
    const file = join(folder, 'program.c0de')
    writeFileSync(file, program)
    const args = javaArgs(
      runner,
      libraries.filter((library) => runner.libraries[library]),
      ['--layout', file],
    )
    const output = await new Promise<string>((resolve, reject) => {
      const java = spawn('java', args)
      let stdout = ''
      let stderr = ''
      java.stdout.on('data', (data: Buffer) => (stdout += data.toString('utf-8')))
      java.stderr.on('data', (data: Buffer) => (stderr += data.toString('utf-8')))
      java.on('error', reject)
      java.on('close', (code) =>
        code === 0 ? resolve(stdout) : reject(new Error(`exit ${code}: ${stderr}${stdout}`)),
      )
    })
    mkdirSync(cache, { recursive: true })
    writeFileSync(cached, output)
    return parseLayout(output)
  } finally {
    rmSync(folder, { recursive: true, force: true })
  }
}

// inParallel runs tasks with at most limit of them at the same time.
async function inParallel<T>(items: T[], limit: number, task: (item: T) => Promise<void>) {
  let next = 0
  const worker = async () => {
    while (next < items.length) await task(items[next++]!)
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker))
}

// scenes builds the scenes of all programs of the site into public/models/<version>/ and
// writes the manifest for the Markdown renderer.
export async function scenes(site: string, config: Config, local: Map<string, string>) {
  const cache = join(site, '.cache')
  const folder = await modelsFolder(config, join(cache, 'models'), local.get('c0de'))
  const models = readModels(folder)
  const runner = await getRunner(config, join(cache, 'runner'), local)
  const base = `/models/${models.index.version}/`
  const output = join(site, 'public', ...base.split('/').filter(Boolean))
  rmSync(join(site, 'public', 'models'), { recursive: true, force: true })
  cpSync(join(folder, 'textures'), join(output, 'textures'), { recursive: true })
  writeFileSync(join(output, 'textures', DIGITS_TEXTURE), digitsPng())
  writeFileSync(join(output, 'textures', GLYPHS_TEXTURE), glyphsPng())
  mkdirSync(join(output, 'programs'), { recursive: true })

  const programs = [...collect(site)]
  const failed: string[] = []
  let size = 0
  await inParallel(programs, availableParallelism(), async ([hash, program]) => {
    try {
      const { glb, labels } = buildScene(
        await layout(program, runner, join(cache, 'layouts')),
        models,
      )
      writeFileSync(join(output, 'programs', `${hash}.glb`), glb)
      writeFileSync(join(output, 'programs', `${hash}.json`), JSON.stringify(labels))
      size += glb.length
    } catch (error) {
      const name = /^PROGRAM\s+(\S+)/.exec(program)?.[1] ?? hash
      failed.push(`${name}: ${error instanceof Error ? error.message : String(error)}`.trim())
    }
  })
  const manifest: ModelsManifest = { base }
  writeFileSync(manifestFile(join(site, '.vitepress')), JSON.stringify(manifest, null, 2) + '\n')
  for (const failure of failed) console.warn(`no 3D view of ${failure}`)
  console.log(
    `built ${programs.length - failed.length} scenes of programs (${Math.round(size / 1024)} KiB, models ${models.index.version} from ${local.get('c0de') ? folder : basename(folder)})`,
  )
  return { programs: programs.length, failed: failed.length }
}
