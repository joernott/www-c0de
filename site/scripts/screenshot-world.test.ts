import { describe, expect, it } from 'vitest'
import { order, place, type World } from './screenshot-world.ts'

const world: World = {
  programs: [
    { file: 'a.c0de', sheet: 2, built: '2026-11-14' },
    { file: 'b.c0de', sheet: 4, built: '2026-11-14' },
  ],
  shots: ['one', 'two'],
}

describe('place', () => {
  it('keeps the sheets of the built programs and puts new ones after the last sheet', () => {
    const placed = place(world, ['new.c0de', 'b.c0de', 'a.c0de', 'other.c0de'])
    expect(placed.programs).toEqual([
      { file: 'a.c0de', sheet: 2, built: '2026-11-14' },
      { file: 'b.c0de', sheet: 4, built: '2026-11-14' },
      { file: 'new.c0de', sheet: 6 },
      { file: 'other.c0de', sheet: 8 },
    ])
  })

  it('keeps the sheet of a program that no page shows anymore', () => {
    expect(place(world, ['b.c0de', 'c.c0de']).programs.map((p) => p.sheet)).toEqual([2, 4, 6])
  })

  it('starts at sheet 2 in a new world', () => {
    expect(place({ programs: [], shots: [] }, ['a.c0de']).programs).toEqual([
      { file: 'a.c0de', sheet: 2 },
    ])
  })
})

describe('order', () => {
  it('keeps the order of the known screenshots and adds new ones at the end', () => {
    const shots = [{ id: 'new' }, { id: 'two' }, { id: 'one' }, { id: 'later' }]
    const { shots: ordered, ids } = order(world, shots)
    expect(ids).toEqual(['one', 'two', 'new', 'later'])
    expect(ordered.map((s) => s.id)).toEqual(ids)
  })

  it('leaves out screenshots that no page shows anymore', () => {
    expect(order(world, [{ id: 'two' }]).ids).toEqual(['two'])
  })
})
