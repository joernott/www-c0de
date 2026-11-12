// The program runner of c0de and the runner libraries of the other mods, downloaded from the
// releases at the tags in sources.yaml and cached in .cache/runner. The tests of the tutorial
// programs (test-programs.ts) run them, the import (import/scenes.ts) lays programs out with them.
import { existsSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { version, type Config, type Source } from './import/sources.ts'

export interface Runner {
  // the jar of the runner of c0de
  jar: string
  // the runner libraries of the other mods by source name; undefined if the release has none
  libraries: Record<string, string | undefined>
}

// download returns the cached jar of a release, or undefined if the release has none.
export async function download(
  source: Source,
  jar: string,
  cache: string,
): Promise<string | undefined> {
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

// localJar returns the newest jar of a local build whose name starts with prefix.
function localJar(folder: string, prefix: string): string | undefined {
  if (!existsSync(folder)) return undefined
  const jars = readdirSync(folder)
    .filter((name) => name.startsWith(prefix) && name.endsWith('.jar'))
    .sort()
  return jars.length > 0 ? join(folder, jars.at(-1)!) : undefined
}

// The jars of local working copies (main.ts --local): ./gradlew :core:runnerJar in c0de,
// ./gradlew :runner:jar in c0de net.
const localJars: Record<string, [string, string]> = {
  c0de: [join('core', 'build', 'runner'), 'c0de-runner-'],
  c0de_net: [join('runner', 'build', 'libs'), 'c0de-net-runner-'],
}

// runner returns the runner and its libraries, from the local working copies in local or
// downloaded from the releases.
export async function runner(
  config: Config,
  cache: string,
  local: Map<string, string> = new Map(),
): Promise<Runner> {
  const jarOf = async (name: string, jar: string) => {
    const folder = local.get(name)
    if (folder) {
      const [path, prefix] = localJars[name]!
      const file = localJar(join(folder, path), prefix)
      if (!file) throw new Error(`${name}: no ${prefix}*.jar in ${join(folder, path)}`)
      return file
    }
    return download(config.sources[name]!, jar, cache)
  }
  const c0de = config.sources.c0de!
  const jar = await jarOf('c0de', `c0de-runner-${version(c0de)}.jar`)
  if (!jar)
    throw new Error(`c0de ${c0de.tag} has no program runner (c0de-runner-${version(c0de)}.jar)`)
  const libraries: Record<string, string | undefined> = {}
  const net = config.sources.c0de_net
  if (net) libraries.c0de_net = await jarOf('c0de_net', `c0de-net-runner-${version(net)}.jar`)
  return { jar, libraries }
}

// needs returns the libraries of other mods that a program includes.
export const needs = (program: string): string[] =>
  /^\s*INCLUDE c0de_net\//m.test(program) ? ['c0de_net'] : []

// javaArgs returns the arguments of java that start the runner with the given libraries.
export function javaArgs(runner: Runner, libraries: string[], args: string[]): string[] {
  const classpath = [runner.jar, ...libraries.map((library) => runner.libraries[library]!)].join(
    process.platform === 'win32' ? ';' : ':',
  )
  return ['-cp', classpath, 'de.joernott.c0de.core.runner.Main', ...args]
}
