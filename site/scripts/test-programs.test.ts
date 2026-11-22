import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { args, compareMailboxes, compareRender, parseArgs, plan } from './test-programs.ts'

let folder: string

beforeEach(() => {
  folder = mkdtempSync(join(tmpdir(), 'programs-'))
  mkdirSync(join(folder, 'net'))
  writeFileSync(join(folder, 'adder.c0de'), 'PROGRAM adder\n')
  writeFileSync(join(folder, 'adder.options.yaml'), 'function: sum\n')
  writeFileSync(join(folder, 'adder.expected.yaml'), 'results: {result: 3}\n')
  writeFileSync(join(folder, 'adder.zero.options.yaml'), 'function: zero\n')
  writeFileSync(join(folder, 'adder.zero.expected.yaml'), 'results: {result: 0}\n')
  writeFileSync(
    join(folder, 'net', 'weather.c0de'),
    'PROGRAM weather\nNOOP\nINCLUDE c0de_net/http\n',
  )
  writeFileSync(join(folder, 'notes.md'), 'not a program\n')
})

afterEach(() => rmSync(folder, { recursive: true, force: true }))

describe('plan', () => {
  it('finds the programs with their options and expected values', () => {
    expect(plan(folder)).toEqual([
      {
        program: join(folder, 'adder.c0de'),
        options: join(folder, 'adder.options.yaml'),
        expected: join(folder, 'adder.expected.yaml'),
        needs: [],
      },
      {
        program: join(folder, 'adder.c0de'),
        case: 'zero',
        options: join(folder, 'adder.zero.options.yaml'),
        expected: join(folder, 'adder.zero.expected.yaml'),
        needs: [],
      },
      { program: join(folder, 'net', 'weather.c0de'), needs: ['c0de_net'] },
    ])
  })
})

describe('args', () => {
  it('passes the options and the expected values to the runner', () => {
    const [adder, , weather] = plan(folder)
    expect(args(adder!)).toEqual([
      '--options',
      join(folder, 'adder.options.yaml'),
      '--expected',
      join(folder, 'adder.expected.yaml'),
      join(folder, 'adder.c0de'),
    ])
    expect(args(weather!)).toEqual([join(folder, 'net', 'weather.c0de')])
  })
})

describe('parseArgs', () => {
  it('separates the selected programs from the local working copies', () => {
    const { selected, local } = parseArgs(['--local', 'c0de=../c0de', 'commands', 'dice'])
    expect(selected).toEqual(['commands', 'dice'])
    expect([...local.keys()]).toEqual(['c0de'])
    expect(local.get('c0de')).toMatch(/c0de$/)
  })

  it('refuses --local without a source and a folder', () => {
    expect(() => parseArgs(['--local', 'c0de'])).toThrow(/usage/)
  })
})

describe('received', () => {
  it('finds the expected mailboxes of a program and of its cases', () => {
    writeFileSync(join(folder, 'adder.received.yaml'), 'steve@example.com: {INBOX: []}\n')
    writeFileSync(join(folder, 'adder.zero.received.yaml'), 'steve@example.com: {INBOX: []}\n')
    const [adder, zero] = plan(folder)
    expect(adder!.received).toBe(join(folder, 'adder.received.yaml'))
    expect(zero!.received).toBe(join(folder, 'adder.zero.received.yaml'))
  })
})

describe('render', () => {
  it('finds the expected blocks of a program and of its cases', () => {
    writeFileSync(join(folder, 'adder.render.yaml'), '---\nlayers: []\n')
    writeFileSync(join(folder, 'adder.zero.render.yaml'), '---\nlayers: []\n')
    const [adder, zero] = plan(folder)
    expect(adder!.render).toBe(join(folder, 'adder.render.yaml'))
    expect(zero!.render).toBe(join(folder, 'adder.zero.render.yaml'))
  })

  it('knows the programs that need c0de paint', () => {
    writeFileSync(join(folder, 'net', 'hut.c0de'), 'PROGRAM hut\nINCLUDE c0de_paint/cpaint\n')
    expect(plan(folder).find((run) => run.program.endsWith('hut.c0de'))!.needs).toEqual([
      'c0de_paint',
    ])
  })
})

describe('compareRender', () => {
  const blocks = '---\nposition: {x: 0, y: 64, z: 0}\nlayers:\n  - y: 64\n'
  it('accepts the same blocks with other line endings', () => {
    expect(compareRender(blocks, blocks.replaceAll('\n', '\r\n') + '\n')).toEqual([])
  })

  it('reports the first line that differs', () => {
    expect(compareRender(blocks, blocks.replace('y: 64\n', 'y: 65\n'))).toEqual([
      'render line 4: expected "  - y: 64", got "  - y: 65"',
    ])
    expect(compareRender(blocks, '')).toEqual(['render line 1: expected "---", got ""'])
  })
})

describe('compareMailboxes', () => {
  const message = {
    from: 'Farm <steve@example.com>',
    to: ['alex@example.com'],
    cc: [],
    subject: 'Wheat',
    text: 'Ready',
    flags: ['\\Seen'],
  }
  const read = (user: string, folder: string) =>
    Promise.resolve(user === 'alex@example.com' && folder === 'INBOX' ? [message] : [])

  it('accepts the given parts of every message', async () => {
    expect(
      await compareMailboxes(
        { 'alex@example.com': { INBOX: [{ subject: 'Wheat', flags: ['\\Seen'] }] } },
        read,
      ),
    ).toEqual([])
  })

  it('reports other values and other numbers of messages', async () => {
    const problems = await compareMailboxes(
      {
        'alex@example.com': { INBOX: [{ subject: 'Carrots' }] },
        'sam@example.com': { INBOX: [{ subject: 'Wheat' }] },
      },
      read,
    )
    expect(problems).toHaveLength(2)
    expect(problems[0]).toMatch(/alex@example.com INBOX message 1: subject is "Wheat"/)
    expect(problems[1]).toMatch(/sam@example.com INBOX: 0 messages instead of 1/)
  })
})
