import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { args, plan } from './test-programs.ts'

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
