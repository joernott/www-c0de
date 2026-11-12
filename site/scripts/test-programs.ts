// Tests the programs of the tutorials (task 6.5) with the program runner of c0de at the tag in
// sources.yaml, so a new release of c0de that breaks a tutorial fails before it is published.
//
// Every program is a file tutorials/programs/<name>.c0de; <name>.options.yaml next to it sets the
// function, its parameters and the input, <name>.expected.yaml the parts of the report that
// the run must produce (see docs/runner.md of minecraft-c0de). Without expected values, the
// program must be valid and run to its end. Further runs of the same program are cases:
// <name>.<case>.options.yaml with <name>.<case>.expected.yaml. Programs that include c0de/minecraft are only
// validated, because that library needs the game. Programs that include c0de_net need the
// runner library of c0de net; if its release has none, they are skipped. Programs that talk to
// the API of c0de.at run against a test service (test-service.ts), which needs Go.
//
// Usage: node scripts/test-programs.ts [<part of a file name>...]   (needs Java 21 or newer)
import { spawn } from 'node:child_process'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, join, relative, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { readConfig } from './import/sources.ts'
import { javaArgs, needs as needsOf, runner as getRunner } from './runner.ts'
import { startTestService, usesApi, type TestService } from './test-service.ts'

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
    const needs = needsOf(text)
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

// java runs java and returns its exit code and output.
function java(args: string[]): Promise<{ status: number | null; stdout: string; stderr: string }> {
  return new Promise((resolve, reject) => {
    const child = spawn('java', args)
    let stdout = ''
    let stderr = ''
    child.stdout.on('data', (data: Buffer) => (stdout += data.toString('utf-8')))
    child.stderr.on('data', (data: Buffer) => (stderr += data.toString('utf-8')))
    child.on('error', reject)
    child.on('close', (status) => resolve({ status, stdout, stderr }))
  })
}

async function main(selected: string[]) {
  const config = readConfig(join(site, 'sources.yaml'))
  const c0de = config.sources.c0de!
  const runner = await getRunner(config, join(site, '.cache', 'runner'))

  const runs = plan(programsFolder).filter(
    (run) =>
      selected.length === 0 || selected.some((s) => run.program.replaceAll('\\', '/').includes(s)),
  )
  const api = new Set(runs.filter((run) => usesApi(readFileSync(run.program, 'utf-8'))))
  let service: TestService | undefined
  if (api.size > 0) {
    const releases = Object.fromEntries(
      Object.values(config.sources).map((source) => [source.repository, source.tag]),
    )
    service = await startTestService(join(site, '..'), releases)
  }
  let failed = 0
  let skipped = 0
  try {
    for (const run of runs) {
      const name = relative(site, run.program) + (run.case ? ` (${run.case})` : '')
      const missing = run.needs.filter((library) => !runner.libraries[library])
      if (missing.length > 0) {
        console.log(`skip  ${name}: no runner library of ${missing.join(', ')} in its release`)
        skipped++
        continue
      }
      const jvm = api.has(run) ? service!.jvm : []
      // not spawnSync: the proxy of the test service runs in this process
      let result = await java(javaArgs(runner, run.needs, args(run), jvm))
      // A public service (the weather of Open-Meteo) sometimes doesn't answer in time: such a
      // run (REQUEST_TIMEOUT, 1004) gets two more tries.
      for (let retry = 1; retry <= 2 && result.status !== 0; retry++) {
        if (!/^\s*code: 1004$/m.test(result.stdout)) break
        console.log(`retry ${name}: no answer in time`)
        await new Promise((resolve) => setTimeout(resolve, 5000 * retry))
        result = await java(javaArgs(runner, run.needs, args(run), jvm))
      }
      if (result.status === 0) {
        console.log(`ok    ${name}`)
      } else {
        failed++
        console.log(`FAIL  ${name}\n${result.stderr}${result.stdout}`)
      }
    }
  } finally {
    await service?.stop()
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
