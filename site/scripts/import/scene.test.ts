import { describe, expect, it } from 'vitest'
import {
  blockText,
  buildScene,
  digitsPng,
  floorBlock,
  glyphs,
  glyphsPng,
  lineColor,
  type Layout,
  type ModelIndex,
  type Models,
} from './scene.ts'

// A cube of one unit with one texture, enough to be copied into a scene and to be a floor.
function cube(texture: string) {
  const sides: [number[], number[][]][] = [
    [
      [0, 1, 0],
      [
        [0, 1, 0],
        [0, 1, 1],
        [1, 1, 1],
        [1, 1, 0],
      ],
    ],
    [
      [0, -1, 0],
      [
        [0, 0, 0],
        [1, 0, 0],
        [1, 0, 1],
        [0, 0, 1],
      ],
    ],
    [
      [0, 0, -1],
      [
        [1, 1, 0],
        [1, 0, 0],
        [0, 0, 0],
        [0, 1, 0],
      ],
    ],
    [
      [0, 0, 1],
      [
        [0, 1, 1],
        [0, 0, 1],
        [1, 0, 1],
        [1, 1, 1],
      ],
    ],
    [
      [-1, 0, 0],
      [
        [0, 1, 0],
        [0, 0, 0],
        [0, 0, 1],
        [0, 1, 1],
      ],
    ],
    [
      [1, 0, 0],
      [
        [1, 1, 1],
        [1, 0, 1],
        [1, 0, 0],
        [1, 1, 0],
      ],
    ],
  ]
  const positions = new Float32Array(sides.flatMap(([, corners]) => corners.flat()))
  const normals = new Float32Array(
    sides.flatMap(([normal]) => [normal, normal, normal, normal].flat()),
  )
  const indices = new Uint16Array(sides.flatMap((_, i) => [0, 1, 2, 0, 2, 3].map((j) => 4 * i + j)))
  const buffer = Buffer.concat([positions, normals, indices].map((a) => Buffer.from(a.buffer)))
  return {
    scenes: [{ nodes: [0] }],
    nodes: [{ mesh: 0 }],
    meshes: [{ primitives: [{ attributes: { POSITION: 0, NORMAL: 1 }, indices: 2, material: 0 }] }],
    materials: [{ name: texture, pbrMetallicRoughness: { baseColorTexture: { index: 0 } } }],
    textures: [{ sampler: 0, source: 0 }],
    images: [{ uri: `../textures/c0de/block/${texture}.png` }],
    samplers: [{ magFilter: 9728 }],
    bufferViews: [
      { buffer: 0, byteOffset: 0, byteLength: 288, target: 34962 },
      { buffer: 0, byteOffset: 288, byteLength: 288, target: 34962 },
      { buffer: 0, byteOffset: 576, byteLength: 72, target: 34963 },
    ],
    accessors: [
      {
        bufferView: 0,
        componentType: 5126,
        count: 24,
        type: 'VEC3',
        min: [0, 0, 0],
        max: [1, 1, 1],
      },
      { bufferView: 1, componentType: 5126, count: 24, type: 'VEC3' },
      { bufferView: 2, componentType: 5123, count: 36, type: 'SCALAR' },
    ],
    buffers: [
      {
        uri: `data:application/octet-stream;base64,${buffer.toString('base64')}`,
        byteLength: buffer.length,
      },
    ],
  }
}

const index: ModelIndex = {
  version: '1.0.0',
  blocks: {
    'c0de:white_c0de_bedrock': { model: 'models/white.gltf' },
    'c0de:black_c0de_bedrock': { model: 'models/black.gltf' },
    'c0de:light_green_c0de_bedrock': { model: 'models/green.gltf' },
    'c0de:cursor_c0de_bedrock': { model: 'models/cursor.gltf' },
    'c0de:program_block': {
      model: 'models/program.gltf',
      states: {
        'valid=true': { model: 'models/program.gltf' },
        'valid=false': { model: 'models/program.gltf' },
      },
    },
    'c0de:label_block': { model: 'models/label.gltf' },
    'c0de:operator_block': {
      model: 'models/operator_none.gltf',
      states: {
        'operator=none': { model: 'models/operator_none.gltf' },
        'operator=add': { model: 'models/operator_add.gltf' },
      },
    },
    'c0de:laptop': {
      model: 'models/laptop.gltf',
      states: {
        'facing=north': { model: 'models/laptop.gltf' },
        'facing=east': { model: 'models/laptop.gltf', y: 90 },
      },
    },
  },
  sheet: {
    width: 32,
    cursor_x: 4,
    line_number_x: 2,
    line_number_colors: {
      valid: '#00AA00',
      incomplete: '#B0A000',
      invalid: '#AA0000',
      neutral_on_black: '#2A2A2A',
      neutral_on_green: '#B4CCB9',
    },
  },
}

const models: Models = {
  index,
  gltf: (path) => cube(path.replace(/^models\/(.*)\.gltf$/, '$1')),
}

const layout: Layout = {
  program: 'sum',
  lines: [
    {
      z: 0,
      state: 'valid',
      blocks: [
        { x: 5, block: 'c0de:program_block', text: 'PROGRAM' },
        { x: 6, block: 'c0de:label_block', text: 'sum' },
      ],
    },
    { z: 1, state: 'neutral', blocks: [] },
    {
      z: 10,
      state: 'invalid',
      blocks: [
        { x: 7, block: 'c0de:operator_block', state: 'operator=add', text: '+' },
        { x: 8, block: 'c0de:laptop', state: 'facing=east', text: 'LAPTOP' },
      ],
    },
  ],
}

// The parts of glTF that the tests look at.
interface Json {
  nodes: { mesh: number; name?: string; translation?: number[]; rotation?: number[] }[]
  meshes: { primitives: { attributes: Record<string, number>; material: number }[] }[]
  materials: {
    name: string
    pbrMetallicRoughness: { baseColorFactor?: number[]; baseColorTexture: { index: number } }
  }[]
  textures: { sampler: number; source: number }[]
  samplers: { wrapS?: number }[]
  accessors: { count: number; min?: number[]; max?: number[] }[]
  images: { uri: string }[]
  buffers: { byteLength: number }[]
  extensionsUsed?: string[]
}

// read returns the JSON of a GLB file.
function read(glb: Buffer): Json {
  expect(glb.toString('ascii', 0, 4)).toBe('glTF')
  expect(glb.readUInt32LE(4)).toBe(2)
  expect(glb.readUInt32LE(8)).toBe(glb.length)
  const jsonLength = glb.readUInt32LE(12)
  expect(glb.toString('ascii', 16, 20)).toBe('JSON')
  const json = JSON.parse(glb.toString('utf-8', 20, 20 + jsonLength)) as Json
  expect(glb.toString('ascii', 24 + jsonLength, 28 + jsonLength)).toBe('BIN\0')
  expect(json.buffers).toEqual([{ byteLength: glb.length - 28 - jsonLength }])
  return json
}

describe('the floor', () => {
  it('has the cursor rail, the edges and the tractor feed of the even lines', () => {
    expect(floorBlock(index, 4, 0)).toBe('c0de:cursor_c0de_bedrock')
    expect(floorBlock(index, 0, 1)).toBe('c0de:black_c0de_bedrock')
    expect(floorBlock(index, 31, 1)).toBe('c0de:black_c0de_bedrock')
    expect(floorBlock(index, 2, 0)).toBe('c0de:black_c0de_bedrock')
    expect(floorBlock(index, 29, 2)).toBe('c0de:black_c0de_bedrock')
    expect(floorBlock(index, 2, 1)).toBe('c0de:light_green_c0de_bedrock')
    expect(floorBlock(index, 10, 0)).toBe('c0de:white_c0de_bedrock')
  })

  it('colors the line numbers like the game', () => {
    expect(lineColor(index, { z: 3, state: 'valid', blocks: [] })).toBe('#00AA00')
    expect(lineColor(index, { z: 2, state: 'neutral', blocks: [] })).toBe('#2A2A2A')
    expect(lineColor(index, { z: 1, state: 'neutral', blocks: [] })).toBe('#B4CCB9')
  })
})

describe('buildScene', () => {
  const { glb, labels } = buildScene(layout, models)
  const json = read(glb)
  const material = (node: Json['nodes'][number]) =>
    json.materials[json.meshes[node.mesh]!.primitives[0]!.material]!.name
  const named = (name: string) => json.meshes[json.nodes.find((node) => node.name === name)!.mesh]!

  it('lists the texts of the blocks', () => {
    expect(labels).toEqual({
      program: 'sum',
      width: 32,
      lines: 12,
      blocks: [
        [5, 0, 'PROGRAM'],
        [6, 0, 'sum'],
        [7, 10, '+'],
        [8, 10, 'LAPTOP'],
      ],
    })
  })

  it('has every model once and a node for every block', () => {
    expect(json.extensionsUsed).toBeUndefined()
    const blocks = json.nodes.filter((node) => !node.name)
    expect(blocks.map((node) => [material(node), node.translation])).toEqual([
      ['program', [5, 0, 0]],
      ['label', [6, 0, 0]],
      ['operator_add', [7, 0, 10]],
      ['laptop', [9, 0, 10]],
    ])
    expect(json.meshes).toHaveLength(4 + 3) // the models, the floor, the texts, the line numbers
  })

  it('turns blocks around their center', () => {
    // 90 degrees clockwise seen from above: the corner of the block moves from north-west to
    // north-east (x + 1); the rotation is -90 degrees around +y
    const laptop = json.nodes.find((node) => node.rotation)!
    expect(laptop.translation).toEqual([9, 0, 10])
    const [qx, qy, qz, qw] = laptop.rotation!
    expect([qx, qz]).toEqual([0, 0])
    expect(qy).toBeCloseTo(-Math.SQRT1_2)
    expect(qw).toBeCloseTo(Math.SQRT1_2)
  })

  it('lays the floor of all lines as stripes with repeating textures', () => {
    const floor = named('floor')
    const names = floor.primitives.map((p) => json.materials[p.material]!.name)
    expect(names.sort()).toEqual(['black', 'cursor', 'green', 'white'])
    const bounds = floor.primitives.map((p) => json.accessors[p.attributes.POSITION!]!)
    expect(Math.min(...bounds.map((b) => b.min![0]!))).toBe(0)
    expect(Math.max(...bounds.map((b) => b.max![0]!))).toBe(32)
    expect(Math.min(...bounds.map((b) => b.min![1]!))).toBe(-1)
    expect(Math.max(...bounds.map((b) => b.max![2]!))).toBe(12)
    for (const p of floor.primitives) {
      const base = json.materials[p.material]!.pbrMetallicRoughness.baseColorTexture
      expect(json.samplers[json.textures[base.index]!.sampler]!.wrapS).toBe(10497)
    }
    // The 6 even lines are white at x 1, 3, 5-28 and 30: 4 stripes each. The north side of line 0
    // is drawn block by block: 27 white blocks. The last line (11) is green.
    const white = floor.primitives.find((p) => json.materials[p.material]!.name === 'white')!
    expect(json.accessors[white.attributes.POSITION!]!.count / 4).toBe(6 * 4 + 27)
  })

  it('shares textures and keeps them as files next to the scenes', () => {
    expect(json.images).toContainEqual({ uri: '../textures/c0de/block/program.png' })
    expect(json.images).toContainEqual({ uri: '../textures/digits.png' })
    expect(json.images).toContainEqual({ uri: '../textures/glyphs.png' })
    expect(new Set(json.images.map((i) => i.uri)).size).toBe(json.images.length)
  })

  it('draws the line numbers in the color of their line', () => {
    const numbers = named('line numbers')
    // valid (0), neutral on green (1), invalid (10)
    const quads = numbers.primitives.map((p) => json.accessors[p.attributes.POSITION!]!.count / 4)
    expect(quads).toEqual([1, 1, 2])
    const colors = numbers.primitives.map(
      (p) => json.materials[p.material]!.pbrMetallicRoughness.baseColorFactor,
    )
    expect(colors[0]).toEqual([0, 0.402, 0, 1])
  })
})

describe('the texts on the blocks', () => {
  const texts = (json: Json) => json.meshes[json.nodes.find((node) => node.name === 'texts')!.mesh]!

  it('are drawn on the top of the label, centered and readable from the south', () => {
    const json = read(buildScene(layout, models).glb)
    const [primitive, ...others] = texts(json).primitives
    expect(others).toEqual([]) // black: the label sum
    expect(json.materials[primitive!.material]!.pbrMetallicRoughness.baseColorFactor).toEqual([
      0, 0, 0, 1,
    ])
    const position = json.accessors[primitive!.attributes.POSITION!]!
    expect(position.count).toBe(3 * 4) // a quad per character
    // 3 glyphs of 8 pixels, 0.45 / 16 blocks per pixel: 0.675 wide, 0.45 high, around (6.5, 0.5)
    expect(position.min![0]).toBeCloseTo(6.1625)
    expect(position.max![0]).toBeCloseTo(6.8375)
    expect(position.min![1]).toBeCloseTo(0.502)
    expect(position.min![2]).toBeCloseTo(0.275)
    expect(position.max![2]).toBeCloseTo(0.725)
  })

  it('are the texts the game shows', () => {
    expect(blockText('c0de:label_block', 'c0de/math/DIV')).toEqual({
      text: 'DIV',
      color: '#000000',
    })
    expect(blockText('c0de:label_block', 'names["a/b"]')?.text).toBe('names["a/b"]')
    expect(blockText('c0de:literal_block', '" °C"')?.text).toBe('" °C"')
    expect(blockText('c0de:tag_block', 'TAG(json: "close_after")')).toEqual({
      text: 'json',
      color: '#ffffff',
    })
    expect(blockText('c0de:operator_block', '+')).toBeUndefined()
    expect(blockText('c0de:comment_block', 'a comment')).toBeUndefined()
    expect(blockText('c0de:literal_block', '')).toBeUndefined()
  })

  it('come from a texture of the glyphs of Unifont', () => {
    const all = glyphs()
    expect(all.get(0x41)?.width).toBe(8)
    expect(all.has(0xb0) && all.has(0x2295) && all.has(0xfffd)).toBe(true)
    const png = glyphsPng()
    expect([png.readUInt32BE(16), png.readUInt32BE(20)]).toEqual([
      32 * 16,
      Math.ceil(all.size / 32) * 16,
    ])
  })

  it('show characters missing from the part of Unifont as the replacement character', () => {
    const block = { x: 6, block: 'c0de:label_block', text: '\u{1F600}' }
    const scene = buildScene(
      { program: 'p', lines: [{ z: 0, state: 'valid', blocks: [block] }] },
      models,
    )
    const json = read(scene.glb)
    expect(json.accessors[texts(json).primitives[0]!.attributes.POSITION!]!.count).toBe(4)
  })
})

describe('digitsPng', () => {
  it('is a PNG of 10 digits of 6 x 8 pixels', () => {
    const png = digitsPng()
    expect(png.subarray(1, 4).toString('ascii')).toBe('PNG')
    expect(png.toString('ascii', 12, 16)).toBe('IHDR')
    expect([png.readUInt32BE(16), png.readUInt32BE(20)]).toEqual([60, 8])
  })
})
