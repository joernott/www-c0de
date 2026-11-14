// The screenshot world of the tutorials (task 12.3). Reads the screenshot marks of the English
// tutorial pages, finds the program each one shows (the program the page includes last before
// the mark) and writes:
//
//   - docs/screenshots.md, the to-do list: every screenshot with its page, its program, its sheet
//     and the code,
//   - docs/screenshots.yaml, the same as data, with every program also in the YAML format of the
//     c0de disk,
//   - contrib/screenshots/out/c0de_screenshots/, a datapack that builds the world on a server:
//     every program on its own sheet (sheet 0 stays empty, one empty sheet between two programs)
//     and the same devices north of every sheet (contrib/screenshots/README.md).
//
// The blocks come from contrib/screenshots/SheetBlocks.java, which places them like the c0de disk
// with the classes of the program runner; npm run content downloads the runners.
//
// Usage: node scripts/screenshot-world.ts
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { basename, delimiter, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parse, stringify } from 'yaml'
import { parseMark } from '../.vitepress/screenshots.ts'

const site = join(dirname(fileURLToPath(import.meta.url)), '..')
const root = join(site, '..')
const contrib = join(root, 'contrib', 'screenshots')
const out = join(contrib, 'out', 'c0de_screenshots')
const namespace = 'c0de_screenshots'
const codeY = -3
const sheetWidth = 32
// The pack format of Minecraft 1.21.1, the version of the screenshots
const packFormat = 48
// Ticks between two sheets of the build, and how long a sheet stays loaded for its validation
const step = 10
const loaded = 100

// Screenshots of menus and books of the game need no program; one shows the empty sheet 0.
const noProgram = new Set([
  'before-you-start-new-world',
  'before-you-start-creative-tab',
  'next-steps-handbook',
])
const emptySheet = new Set(['before-you-start-sheet'])

interface Shot {
  id: string
  description: string
  page: string
  title: string
  program?: string // the file of the program in site/
}

interface Program {
  file: string
  name: string
  function?: string
  sheet: number
  code: string
  disk?: string // the YAML of the c0de disk; none for a program with errors
  blocks: { x: number; z: number; block: string }[]
}

// The English tutorial pages in the order of tutorials.yaml.
function pages(): string[] {
  const config = parse(readFileSync(join(site, 'tutorials', 'tutorials.yaml'), 'utf-8')) as {
    chapters: { link: string; lessons?: string[] }[]
  }
  return config.chapters.flatMap((chapter) =>
    (chapter.lessons ?? []).map((lesson) => `${chapter.link.replace(/^\/|\/$/g, '')}/${lesson}.md`),
  )
}

function shots(page: string): Shot[] {
  const lines = readFileSync(join(site, page), 'utf-8').split('\n')
  const title = lines.find((line) => line.startsWith('# '))!.slice(2)
  const programs: [number, string][] = []
  lines.forEach((line, i) => {
    const include = /^<<<\s*@\/(tutorials\/programs\/\S+\.c0de)/.exec(line)
    if (include) programs.push([i, include[1]!])
  })
  const found: Shot[] = []
  lines.forEach((line, i) => {
    const mark = parseMark(line)
    if (!mark) return
    const before = programs.filter(([j]) => j < i)
    const after = programs.filter(([j]) => j > i)
    const program = before.length > 0 ? before.at(-1)![1] : after[0]?.[1]
    const shown = noProgram.has(mark.id) || emptySheet.has(mark.id) ? undefined : program
    found.push({ ...mark, page, title, program: shown })
  })
  return found
}

function runnerClasspath(): { classpath: string; tag: string } {
  const sources = parse(readFileSync(join(site, 'sources.yaml'), 'utf-8')) as {
    sources: Record<string, { tag: string }>
  }
  const version = (id: string) => sources.sources[id]!.tag.replace(/^v/, '')
  const jars = [
    join(site, '.cache', 'runner', `c0de-runner-${version('c0de')}.jar`),
    join(site, '.cache', 'runner', `c0de-net-runner-${version('c0de_net')}.jar`),
  ]
  for (const jar of jars) {
    if (!existsSync(jar)) throw new Error(`${jar} is missing: run npm run content first`)
  }
  return { classpath: jars.join(delimiter), tag: sources.sources.c0de!.tag }
}

function helper(classpath: string, args: string[]): string[][] {
  const output = execFileSync(
    'java',
    ['-Dstdout.encoding=UTF-8', '-cp', classpath, join(contrib, 'SheetBlocks.java'), ...args],
    {
      cwd: site,
      encoding: 'utf-8',
      maxBuffer: 64 * 1024 * 1024,
      stdio: ['ignore', 'pipe', 'inherit'],
    },
  )
  return output
    .split('\n')
    .filter((line) => line.trim() !== '')
    .map((line) => line.replace(/\r$/, '').split('\t'))
}

function writeFunction(path: string, commands: string[]) {
  const file = join(out, 'data', namespace, 'function', `${path}.mcfunction`)
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, commands.join('\n') + '\n')
}

const run = (command: string) => `execute in c0de:c0de run ${command}`

// The devices north of a sheet: the blocks that start programs in a row at z = -3, from x + 5
// on, and the display wall behind them at z = -6.
function devices(sheet: number, program?: Program): string[] {
  const x = sheet * sheetWidth + 5
  const bound = program ? `{program:"${program.name}",function:"${program.function ?? ''}"}` : ''
  const items = [
    '{Slot:0b,id:"c0de:variable_item",count:64}',
    '{Slot:1b,id:"c0de:constant_item",count:64}',
    '{Slot:2b,id:"c0de:literal_item",count:64}',
    '{Slot:3b,id:"c0de:c0de_disk",count:1}',
  ].join(',')
  return [
    run(`setblock ${x} ${codeY} -3 c0de:trigger_block${bound}`),
    run(`setblock ${x} ${codeY + 1} -3 minecraft:stone_button[face=floor,facing=south]`),
    run(`setblock ${x + 1} ${codeY} -3 c0de:debug_trigger_block${bound}`),
    run(`setblock ${x + 1} ${codeY + 1} -3 c0de:laptop[facing=south]`),
    run(`setblock ${x + 2} ${codeY} -3 c0de:timer_block${bound}`),
    // A lever that is on pauses the timer block
    run(`setblock ${x + 2} ${codeY + 1} -3 minecraft:lever[face=floor,facing=south,powered=true]`),
    run(`setblock ${x + 3} ${codeY} -3 c0de:io_block`),
    run(`setblock ${x + 4} ${codeY} -3 c0de:disk_drive[facing=south]`),
    run(`setblock ${x + 5} ${codeY} -3 minecraft:gray_shulker_box[facing=up]{Items:[${items}]}`),
    // 4 × 3 display blocks facing the sheet, in a frame of iron blocks
    run(`fill ${x} ${codeY} -6 ${x + 5} ${codeY + 4} -6 minecraft:iron_block`),
    run(`fill ${x + 1} ${codeY + 1} -6 ${x + 4} ${codeY + 3} -6 c0de:display_block[facing=south]`),
  ]
}

// The area of a sheet that is loaded while it is built: the devices and all lines.
function area(sheet: number, lastZ: number): string {
  const x = sheet * sheetWidth
  return `${x} -6 ${x + sheetWidth - 1} ${Math.max(lastZ, 0)}`
}

function datapack(programs: Program[]) {
  rmSync(out, { recursive: true, force: true })
  mkdirSync(out, { recursive: true })
  writeFileSync(
    join(out, 'pack.mcmeta'),
    JSON.stringify(
      {
        pack: {
          pack_format: packFormat,
          description: 'The screenshot world of c0de.at (task 12.3)',
        },
      },
      null,
      2,
    ) + '\n',
  )
  const seconds = Math.ceil(((programs.length + 1) * step + loaded) / 20)
  const build = [
    `# Builds the devices of sheet 0 and all ${programs.length} programs with their devices; takes about ${seconds} seconds.`,
  ]
  const sheets: [number, Program | undefined][] = [
    [0, undefined],
    ...programs.map((p): [number, Program] => [p.sheet, p]),
  ]
  sheets.forEach(([sheet, program], i) => {
    const lastZ = Math.max(0, ...(program?.blocks.map((b) => b.z) ?? []))
    const blocks =
      program?.blocks.map((b) =>
        run(`setblock ${sheet * sheetWidth + b.x} ${codeY} ${b.z} ${b.block}`),
      ) ?? []
    writeFunction(`sheet/${sheet}/load`, [run(`forceload add ${area(sheet, lastZ)}`)])
    writeFunction(`sheet/${sheet}/place`, [...devices(sheet, program), ...blocks])
    writeFunction(`sheet/${sheet}/unload`, [run(`forceload remove ${area(sheet, lastZ)}`)])
    build.push(`schedule function ${namespace}:sheet/${sheet}/load ${i * step + 1}t`)
    build.push(`schedule function ${namespace}:sheet/${sheet}/place ${i * step + 5}t`)
    build.push(`schedule function ${namespace}:sheet/${sheet}/unload ${i * step + loaded}t`)
  })
  build.push(
    `tellraw @a {"text":"c0de screenshots: building ${programs.length} programs on sheets 2 to ${2 * programs.length}","color":"yellow"}`,
  )
  writeFunction('build', build)

  // check counts the blocks of every sheet whose line number isn't dark green: blocks that are
  // invalid or incomplete. The NOOP, COMMENT and type blocks have no such state. The counts are
  // the scores of sheet_<n> in the objective c0de_shots: scoreboard players list sheet_<n>.
  const unchecked = /^c0de:(noop_block|comment_block|type_\w+_block)$/
  const check = [
    'scoreboard objectives remove c0de_shots',
    'scoreboard objectives add c0de_shots dummy',
  ]
  programs.forEach((program, i) => {
    const lastZ = Math.max(...program.blocks.map((b) => b.z))
    const player = `sheet_${program.sheet}`
    const tests = program.blocks.flatMap((b) => {
      const id = b.block.replace(/[[{].*$/, '')
      if (unchecked.test(id)) return []
      const at = `${program.sheet * sheetWidth + b.x} ${codeY} ${b.z}`
      return [`invalid`, `incomplete`].map((score) =>
        run(
          `execute if block ${at} ${id}[${score === 'invalid' ? 'valid=false' : 'incomplete=true'}] run scoreboard players add ${player} c0de_shots 1`,
        ),
      )
    })
    writeFunction(`sheet/${program.sheet}/check`, [
      `scoreboard players set ${player} c0de_shots 0`,
      ...tests,
    ])
    writeFunction(`sheet/${program.sheet}/check_load`, [
      run(`forceload add ${area(program.sheet, lastZ)}`),
    ])
    check.push(`schedule function ${namespace}:sheet/${program.sheet}/check_load ${i * step + 1}t`)
    check.push(`schedule function ${namespace}:sheet/${program.sheet}/check ${i * step + 5}t`)
    check.push(`schedule function ${namespace}:sheet/${program.sheet}/unload ${i * step + 8}t`)
  })
  writeFunction('check', check)

  // Only one of the programs with the same name can be valid; activate makes it the one: it takes
  // the PROGRAM label of the others away and places its own again, which validates its sheet.
  for (const program of programs) {
    const others = programs.filter((p) => p.name === program.name && p !== program)
    if (others.length === 0) continue
    const stem = basename(program.file, '.c0de')
    const label = program.blocks.find((b) => b.x === 6 && b.z === 0)!.block
    const line0 = (sheet: number) => `${sheet * sheetWidth} 0 ${sheet * sheetWidth + 31} 0`
    const all = [program, ...others]
    writeFunction(`activate/${stem}`, [
      ...all.map((p) => run(`forceload add ${line0(p.sheet)}`)),
      `schedule function ${namespace}:activate/${stem}_free 5t`,
    ])
    writeFunction(`activate/${stem}_free`, [
      ...all.map((p) => run(`setblock ${p.sheet * sheetWidth + 6} ${codeY} 0 minecraft:air`)),
      `schedule function ${namespace}:activate/${stem}_set 5t`,
    ])
    writeFunction(`activate/${stem}_set`, [
      run(`setblock ${program.sheet * sheetWidth + 6} ${codeY} 0 ${label}`),
      `schedule function ${namespace}:activate/${stem}_done 20t`,
    ])
    writeFunction(`activate/${stem}_done`, [
      ...all.map((p) => run(`forceload remove ${line0(p.sheet)}`)),
      `tellraw @a {"text":"c0de screenshots: ${program.name} on sheet ${program.sheet} is active","color":"yellow"}`,
    ])
  }
}

function activate(program: Program, programs: Program[]): string | undefined {
  return programs.some((p) => p.name === program.name && p !== program)
    ? `/function ${namespace}:activate/${basename(program.file, '.c0de')}`
    : undefined
}

function todo(all: Shot[], programs: Program[]): string {
  const byFile = new Map(programs.map((p) => [p.file, p]))
  const md = [
    '# Screenshots: to-do list',
    '',
    'The screenshots of the tutorials (task 7.1.1), taken as [tutorials.md](tutorials.md#screenshots) describes. Written by `site/scripts/screenshot-world.ts` from the marks of the pages; the same as data is in `screenshots.yaml`, with every program also in the YAML format of the c0de disk.',
    '',
    'The world: every program is on its own sheet of the c0de dimension, built by the datapack of `contrib/screenshots/` (see its README). Sheet 0 is empty, and an empty sheet lies between two programs. North of every sheet, at z = -3 from x + 5 on: a trigger block with a stone button, a debug trigger block with a laptop, a timer block with a lever that is on (so it is paused), an I/O block, a disk drive and a gray shulker box with a stack of variable, constant and literal items and a disk; behind them, at z = -6, a display wall of 4 × 3 blocks in a frame of iron blocks. The three trigger blocks are set to the program and the function of its test.',
    '',
    `${all.length} screenshots, ${programs.length} programs on sheets 2 to ${2 * programs.length}.`,
    '',
  ]
  let page = ''
  for (const shot of all) {
    if (shot.page !== page) {
      page = shot.page
      md.push(`## ${shot.title}`, '', `\`site/${page}\``, '')
    }
    md.push(`### [ ] ${shot.id}`, '', shot.description, '')
    const program = shot.program ? byFile.get(shot.program) : undefined
    if (program) {
      md.push(
        `- Program **${program.name}**, function \`${program.function ?? '–'}\` (\`site/${program.file}\`)`,
        `- Sheet ${program.sheet}, x = ${program.sheet * sheetWidth}`,
      )
      const command = activate(program, programs)
      if (command) {
        md.push(`- Other sheets also have a program ${program.name}: run \`${command}\` first`)
      }
      md.push('', '```c0de', program.code.trimEnd(), '```', '')
    } else if (emptySheet.has(shot.id)) {
      md.push('- The empty sheet 0, x = 0', '')
    } else {
      md.push('- No program: a menu or a book of the game', '')
    }
  }
  return md.join('\n')
}

function data(all: Shot[], programs: Program[], tag: string): string {
  const byFile = new Map(programs.map((p) => [p.file, p]))
  const screenshots = all.map((shot) => {
    const program = shot.program ? byFile.get(shot.program) : undefined
    return {
      id: shot.id,
      file: `site/public/tutorials/screenshots/${shot.id}.webp`,
      page: `site/${shot.page}`,
      title: shot.title,
      description: shot.description,
      ...(program
        ? {
            program: program.name,
            program_file: `site/${program.file}`,
            function: program.function ?? null,
            sheet: program.sheet,
            x: program.sheet * sheetWidth,
            ...(activate(program, programs) ? { activate: activate(program, programs) } : {}),
            code: program.code,
          }
        : emptySheet.has(shot.id)
          ? { sheet: 0, x: 0 }
          : {}),
    }
  })
  return (
    '# The screenshots of the tutorials with their programs (task 12.3), written by\n' +
    '# site/scripts/screenshot-world.ts; docs/screenshots.md is the to-do list.\n' +
    stringify(
      {
        c0de: tag,
        screenshots,
        programs: programs.map((p) => ({
          file: `site/${p.file}`,
          name: p.name,
          function: p.function ?? null,
          sheet: p.sheet,
          x: p.sheet * sheetWidth,
          code: p.code,
          ...(p.disk ? { disk: p.disk } : {}),
        })),
      },
      { lineWidth: 0, blockQuote: 'literal' },
    )
  )
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const { classpath, tag } = runnerClasspath()
  const all = pages().flatMap(shots)
  const files = [...new Set(all.flatMap((s) => (s.program ? [s.program] : [])))]
  const blocks = new Map<string, Program['blocks']>()
  for (const [file, x, z, block] of helper(classpath, files)) {
    const list = blocks.get(file!) ?? []
    list.push({ x: Number(x), z: Number(z), block: block! })
    blocks.set(file!, list)
  }
  const disks = new Map(
    helper(classpath, ['--yaml', ...files]).map(([file, text]) => [
      file!,
      text!.replace(/\\(\\|n)/g, (_, c: string) => (c === 'n' ? '\n' : '\\')),
    ]),
  )
  const programs = files.map((file, i): Program => {
    const code = readFileSync(join(site, file), 'utf-8')
    const optionsFile = join(site, file.replace(/\.c0de$/, '.options.yaml'))
    const options = existsSync(optionsFile)
      ? ((parse(readFileSync(optionsFile, 'utf-8')) ?? {}) as { function?: string })
      : {}
    return {
      file,
      name: code.split('\n')[0]!.split(/\s+/)[1]!,
      function: options.function,
      sheet: 2 * (i + 1),
      code,
      disk: disks.get(file),
      blocks: blocks.get(file)!,
    }
  })
  datapack(programs)
  writeFileSync(join(root, 'docs', 'screenshots.md'), todo(all, programs))
  writeFileSync(join(root, 'docs', 'screenshots.yaml'), data(all, programs, tag))
  console.log(
    `${all.length} screenshots, ${programs.length} programs on sheets 2 to ${2 * programs.length}; datapack in contrib/screenshots/out/`,
  )
}
