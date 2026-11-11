// Tests the programs of the tutorials (task 6.5) with the program runner of c0de at the tag in
// sources.yaml, so a new release of c0de that breaks a tutorial fails before it is published.
//
// Every program is a file tutorials/programs/<name>.c0de; <name>.options.yaml next to it sets the
// function, its parameters and the input, <name>.expected.yaml the parts of the report that
// the run must produce (see docs/runner.md of minecraft-c0de). Without expected values, the
// program must be valid and run to its end. Further runs of the same program are cases:
// <name>.<case>.options.yaml with <name>.<case>.expected.yaml. Programs that include c0de/minecraft are only
// validated, because that library needs the game. Programs that include c0de_net need the
// runner library of c0de net; if its release has none, they are skipped.
//
// Usage: node scripts/test-programs.ts [<program>...]   (needs Java 21 or newer)
import { spawnSync } from 'node:child_process'
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, relative, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { readConfig, version, type Source } from './import/sources.ts'

const site = join(dirname(fileURLToPath(import.meta.url)), '..')
export const programsFolder = join(site, 'tutorials', 'programs')

export interface ProgramRun {
  program: string
  case?: string
  options?: string
  expected?: string
  // The libraries of other mods the program includes (c0de_net/http needs c0de net).
  needs: string[]
}

// plan lists the programs of a folder with their option and expected files.
export function plan(folder: string): ProgramRun[] {
  const runs: ProgramRun[] = []
  for (const name of readdirSync(folder, { recursive: true, encoding: 'utf-8' }).sort()) {
    if (!name.endsWith('.c0de')) continue
    const program = join(folder, name)
    const base = program.slice(0, -'.c0de'.length)
    const text = readFileSync(program, 'utf-8')
    const needs = /^\s*INCLUDE c0de_net\//m.test(text) ? ['c0de_net'] : []
    runs.push({
      program,
      ...(existsSync(`${base}.options.yaml`) && { options: `${base}.options.yaml` }),
      ...(existsSync(`${base}.expected.yaml`) && { expected: `${base}.expected.yaml` }),
      needs,
    })
    const prefix = `${base.slice(base.lastIndexOf(sep) + 1)}.`
    for (const file of readdirSync(dirname(program)).sort()) {
      const match = file.startsWith(prefix)
        ? /^([a-z0-9-]+)\.expected\.yaml$/.exec(file.slice(prefix.length))
        : null
      if (!match) continue
      const options = `${base}.${match[1]}.options.yaml`
      runs.push({
        program,
        case: match[1]!,
        ...(existsSync(options) && { options }),
        expected: join(dirname(program), file),
        needs,
      })
    }
  }
  return runs
}

// args returns the arguments of the runner for a program.
export function args(run: ProgramRun): string[] {
  return [
    ...(run.options ? ['--options', run.options] : []),
    ...(run.expected ? ['--expected', run.expected] : []),
    run.program,
  ]
}

// download returns the cached jar of a release, or undefined if the release has none.
async function download(source: Source, jar: string, cache: string): Promise<string | undefined> {
  const file = join(cache, jar)
  if (existsSync(file)) return file
  const url = `https://github.com/${source.repository}/releases/download/${source.tag}/${jar}`
  const response = await fetch(url)
  if (response.status === 404) return undefined
  if (!response.ok) throw new Error(`downloading ${url}: ${response.status} ${response.statusText}`)
  mkdirSync(cache, { recursive: true })
  writeFileSync(file, Buffer.from(await response.arrayBuffer()))
  return file
}

async function main(selected: string[]) {
  const config = readConfig(join(site, 'sources.yaml'))
  const cache = join(site, '.cache', 'runner')
  const c0de = config.sources.c0de!
  const runner = await download(c0de, `c0de-runner-${version(c0de)}.jar`, cache)
  if (!runner) {
    throw new Error(`c0de ${c0de.tag} has no program runner (c0de-runner-${version(c0de)}.jar)`)
  }
  const libraries: Record<string, string | undefined> = {}
  const net = config.sources.c0de_net
  if (net) {
    libraries.c0de_net = await download(net, `c0de-net-runner-${version(net)}.jar`, cache)
  }

  const runs = plan(programsFolder).filter(
    (run) => selected.length === 0 || selected.some((s) => run.program.endsWith(s)),
  )
  let failed = 0
  let skipped = 0
  for (const run of runs) {
    const name = relative(site, run.program) + (run.case ? ` (${run.case})` : '')
    const missing = run.needs.filter((library) => !libraries[library])
    if (missing.length > 0) {
      console.log(`skip  ${name}: no runner library of ${missing.join(', ')} in its release`)
      skipped++
      continue
    }
    const classpath = [runner, ...run.needs.map((library) => libraries[library]!)].join(
      process.platform === 'win32' ? ';' : ':',
    )
    const result = spawnSync(
      'java',
      ['-cp', classpath, 'de.joernott.c0de.core.runner.Main', ...args(run)],
      { encoding: 'utf-8' },
    )
    if (result.error) throw result.error
    if (result.status === 0) {
      console.log(`ok    ${name}`)
    } else {
      failed++
      console.log(`FAIL  ${name}\n${result.stderr}${result.stdout}`)
    }
  }
  console.log(
    `${runs.length - failed - skipped} of ${runs.length} programs ok, ${failed} failed, ${skipped} skipped (c0de ${c0de.tag})`,
  )
  if (failed > 0) process.exit(1)
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main(process.argv.slice(2)).catch((error: unknown) => {
    console.error(error)
    process.exit(1)
  })
}
