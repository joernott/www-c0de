// Builds the 3D scene of a program (task 8.3): the sheet of the c0de dimension with its floor,
// the cursor rail and the line numbers, and every block of the program at its place, as one
// binary glTF file (GLB). The blocks come from the models of c0de (c0de-models-<version>.zip,
// see scripts/export_models.py of minecraft-c0de), the places from the layout that the program
// runner prints (--layout, docs/runner.md of minecraft-c0de).
//
// Every model is in the file once: all blocks with the same model are nodes that share its mesh.
// The floor is one mesh of its own: the tops of each line as stripes of the same texture, and
// the outer sides. (Instancing, EXT_mesh_gpu_instancing, would be smaller still, but
// <model-viewer> measures the scene without the instances and complains about them.) The
// textures stay files of their own next to the scenes (../textures/...), so the browser loads
// each of them once for all programs and the Content-Security-Policy needs no blob: URLs.
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { deflateSync, crc32 } from 'node:zlib'

// The layout of a program, as `c0de-runner --layout` prints it.
export interface Layout {
  program: string
  lines: {
    z: number
    state: 'valid' | 'incomplete' | 'invalid' | 'neutral'
    blocks: { x: number; block: string; state?: string; text: string }[]
  }[]
}

// index.json of the models
export interface ModelIndex {
  version: string
  blocks: Record<string, { model: string; states?: Record<string, { model: string; y?: number }> }>
  sheet: {
    width: number
    cursor_x: number
    line_number_x: number
    line_number_colors: Record<string, string>
  }
}

// A glTF file of the models, with its buffer.
interface Gltf {
  scene?: number
  scenes: { nodes: number[] }[]
  nodes: { mesh?: number; children?: number[]; [key: string]: unknown }[]
  meshes: { primitives: Primitive[] }[]
  materials?: Material[]
  textures?: { sampler?: number; source: number }[]
  images?: { uri: string }[]
  samplers?: object[]
  bufferViews: { buffer: number; byteOffset?: number; byteLength: number; target?: number }[]
  accessors: Accessor[]
  buffers: { uri?: string; byteLength: number }[]
}

interface Primitive {
  attributes: Record<string, number>
  indices?: number
  material?: number
  mode?: number
}

interface Material {
  name?: string
  pbrMetallicRoughness?: { baseColorTexture?: { index: number }; [key: string]: unknown }
  [key: string]: unknown
}

interface Accessor {
  bufferView?: number
  byteOffset?: number
  componentType: number
  count: number
  type: string
  min?: number[]
  max?: number[]
  normalized?: boolean
}

export interface Models {
  index: ModelIndex
  // the glTF file of a model, by its path in the index (models/<name>.gltf)
  gltf(path: string): Gltf
}

// models reads the models from a folder with the content of c0de-models-<version>.zip.
export function models(folder: string): Models {
  const cache = new Map<string, Gltf>()
  return {
    index: JSON.parse(readFileSync(join(folder, 'index.json'), 'utf-8')) as ModelIndex,
    gltf(path) {
      let gltf = cache.get(path)
      if (!gltf) {
        gltf = JSON.parse(readFileSync(join(folder, path), 'utf-8')) as Gltf
        cache.set(path, gltf)
      }
      return gltf
    },
  }
}

// The floor of the sheet is one block below the code (y -1); index.json describes it.
export function floorBlock(index: ModelIndex, x: number, z: number): string {
  const last = index.sheet.width - 1
  if (x === index.sheet.cursor_x) return 'c0de:cursor_c0de_bedrock'
  if (x === 0 || x === last) return 'c0de:black_c0de_bedrock'
  if (z % 2 === 1) return 'c0de:light_green_c0de_bedrock'
  return x === 2 || x === last - 2 ? 'c0de:black_c0de_bedrock' : 'c0de:white_c0de_bedrock'
}

// The digits of the line numbers: 5 x 7 pixels each, in cells of 6 x 8 pixels side by side in
// one texture (digits.png); a line number is drawn like in the game, 1/24 block per pixel.
const DIGITS = [
  '01110 10001 10011 10101 11001 10001 01110',
  '00100 01100 00100 00100 00100 00100 01110',
  '01110 10001 00001 00010 00100 01000 11111',
  '11110 00001 00001 01110 00001 00001 11110',
  '00010 00110 01010 10010 11111 00010 00010',
  '11111 10000 11110 00001 00001 10001 01110',
  '00110 01000 10000 11110 10001 10001 01110',
  '11111 00001 00010 00100 01000 01000 01000',
  '01110 10001 10001 01110 10001 10001 01110',
  '01110 10001 10001 01111 00001 00010 01100',
]
const CELL_WIDTH = 6
const CELL_HEIGHT = 8
const PIXEL = 1 / 24
export const DIGITS_TEXTURE = 'digits.png'

// digitsPng draws the texture of the digits: white on transparent.
export function digitsPng(): Buffer {
  const width = CELL_WIDTH * DIGITS.length
  const rows: Buffer[] = []
  for (let y = 0; y < CELL_HEIGHT; y++) {
    const row = Buffer.alloc(1 + width * 4) // filter byte 0, then RGBA
    DIGITS.forEach((digit, d) => {
      const bits = digit.split(' ')[y] ?? ''
      for (let x = 0; x < bits.length; x++) {
        if (bits[x] === '1')
          row.fill(255, 1 + (d * CELL_WIDTH + x) * 4, 1 + (d * CELL_WIDTH + x + 1) * 4)
      }
    })
    rows.push(row)
  }
  const chunk = (type: string, data: Buffer) => {
    const head = Buffer.alloc(8)
    head.writeUInt32BE(data.length, 0)
    head.write(type, 4, 'ascii')
    const crc = Buffer.alloc(4)
    crc.writeUInt32BE(crc32(Buffer.concat([head.subarray(4), data])), 0)
    return Buffer.concat([head, data, crc])
  }
  const header = Buffer.alloc(13)
  header.writeUInt32BE(width, 0)
  header.writeUInt32BE(CELL_HEIGHT, 4)
  header[8] = 8 // bit depth
  header[9] = 6 // RGBA
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', header),
    chunk('IDAT', deflateSync(Buffer.concat(rows))),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

// linear converts a color #RRGGBB of sRGB into the linear RGBA of glTF.
function linear(hex: string): number[] {
  const channel = (i: number) => {
    const c = parseInt(hex.slice(1 + 2 * i, 3 + 2 * i), 16) / 255
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  }
  return [channel(0), channel(1), channel(2), 1].map((c) => Math.round(c * 1e4) / 1e4)
}

// The color of the number of a line, like LineNumbers of c0de: a faint shade of the floor for
// NOOP and COMMENT lines, otherwise the state of the line.
export function lineColor(index: ModelIndex, line: Layout['lines'][number]): string {
  const colors = index.sheet.line_number_colors
  if (line.state === 'neutral') {
    return line.z % 2 === 0 ? colors.neutral_on_black! : colors.neutral_on_green!
  }
  return colors[line.state]!
}

// The texts that the reader sees when pointing at a block: its x, its line and its text.
export interface Labels {
  program: string
  width: number
  lines: number
  blocks: [number, number, string][]
}

// embedded returns the buffers of a glTF file, which the models embed as data: URIs.
function embedded(gltf: Gltf, path: string): Buffer[] {
  return gltf.buffers.map((buffer) => {
    const match = /^data:[^;]*;base64,(.*)$/.exec(buffer.uri ?? '')
    if (!match) throw new Error(`${path}: the buffer must be embedded`)
    return Buffer.from(match[1]!, 'base64')
  })
}

const SIDES: Record<string, string> = {
  '0,1,0': 'up',
  '0,-1,0': 'down',
  '0,0,-1': 'north',
  '0,0,1': 'south',
  '-1,0,0': 'west',
  '1,0,0': 'east',
}

// faces returns the material of every side of a cube model (up, down, north, …), found by the
// normals of its primitives.
function faces(gltf: Gltf, path: string): Record<string, number> {
  const buffers = embedded(gltf, path)
  const sides: Record<string, number> = {}
  for (const mesh of gltf.meshes) {
    for (const primitive of mesh.primitives) {
      const normal = gltf.accessors[primitive.attributes.NORMAL!]!
      const view = gltf.bufferViews[normal.bufferView!]!
      const data = buffers[view.buffer]!
      const start = (view.byteOffset ?? 0) + (normal.byteOffset ?? 0)
      for (let i = 0; i < normal.count; i++) {
        const direction = [0, 4, 8].map((o) => Math.round(data.readFloatLE(start + i * 12 + o)))
        const side = SIDES[direction.join(',')]
        if (side && primitive.material !== undefined) sides[side] ??= primitive.material
      }
    }
  }
  return sides
}

class Writer {
  readonly json: Required<
    Pick<Gltf, 'scenes' | 'nodes' | 'meshes' | 'bufferViews' | 'accessors'>
  > & {
    materials: Material[]
    textures: { sampler?: number; source: number }[]
    images: { uri: string }[]
    samplers: object[]
  } = {
    scenes: [{ nodes: [] }],
    nodes: [],
    meshes: [],
    bufferViews: [],
    accessors: [],
    materials: [],
    textures: [],
    images: [],
    samplers: [],
  }
  private readonly chunks: Buffer[] = []
  private length = 0
  private readonly imageIndex = new Map<string, number>()
  private readonly samplerIndex = new Map<string, number>()
  private readonly textureIndex = new Map<string, number>()
  private readonly materialIndex = new Map<string, number>()
  // the meshes of the models, by model path
  private readonly meshIndex = new Map<string, number[]>()

  private readonly models: Models

  constructor(models: Models) {
    this.models = models
  }

  // bufferView appends data to the binary chunk (aligned to 4 bytes) and returns its view.
  bufferView(data: Buffer, target?: number): number {
    const padding = (4 - (this.length % 4)) % 4
    if (padding > 0) this.push(Buffer.alloc(padding))
    this.json.bufferViews.push({
      buffer: 0,
      byteOffset: this.length,
      byteLength: data.length,
      ...(target && { target }),
    })
    this.push(data)
    return this.json.bufferViews.length - 1
  }

  private push(data: Buffer) {
    this.chunks.push(data)
    this.length += data.length
  }

  accessor(accessor: Accessor): number {
    this.json.accessors.push(accessor)
    return this.json.accessors.length - 1
  }

  floats(values: number[], type: 'VEC2' | 'VEC3' | 'VEC4', target?: number): number {
    const size = { VEC2: 2, VEC3: 3, VEC4: 4 }[type]
    const data = Buffer.from(new Float32Array(values).buffer)
    const min: number[] = []
    const max: number[] = []
    for (let i = 0; i < size; i++) {
      const column = values.filter((_, j) => j % size === i)
      min.push(Math.min(...column))
      max.push(Math.max(...column))
    }
    return this.accessor({
      bufferView: this.bufferView(data, target),
      componentType: 5126,
      count: values.length / size,
      type,
      min,
      max,
    })
  }

  private dedupe<T>(map: Map<string, number>, list: T[], value: T): number {
    const key = JSON.stringify(value)
    let index = map.get(key)
    if (index === undefined) {
      index = list.push(value) - 1
      map.set(key, index)
    }
    return index
  }

  texture(uri: string, sampler: object): number {
    const source = this.dedupe(this.imageIndex, this.json.images, { uri })
    const s = this.dedupe(this.samplerIndex, this.json.samplers, sampler)
    return this.dedupe(this.textureIndex, this.json.textures, { sampler: s, source })
  }

  material(material: Material): number {
    return this.dedupe(this.materialIndex, this.json.materials, material)
  }

  // modelMaterial copies a material of a model, optionally with another sampler for its texture.
  modelMaterial(gltf: Gltf, index: number, sampler?: object): number {
    const material = structuredClone(gltf.materials![index]!)
    const base = material.pbrMetallicRoughness?.baseColorTexture
    if (base) {
      const texture = gltf.textures![base.index]!
      const own = texture.sampler === undefined ? {} : gltf.samplers![texture.sampler]!
      base.index = this.texture(gltf.images![texture.source]!.uri, sampler ?? own)
    }
    return this.material(material)
  }

  // meshes copies the meshes of a model once and returns them.
  meshes(path: string): number[] {
    const known = this.meshIndex.get(path)
    if (known) return known
    const gltf = this.models.gltf(path)
    const buffers = embedded(gltf, path)
    const accessors = new Map<number, number>()
    const copyAccessor = (index: number) => {
      let copied = accessors.get(index)
      if (copied === undefined) {
        const accessor = gltf.accessors[index]!
        const view = gltf.bufferViews[accessor.bufferView!]!
        const start = (view.byteOffset ?? 0) + (accessor.byteOffset ?? 0)
        const data = buffers[view.buffer]!.subarray(
          start,
          start + (view.byteLength - (accessor.byteOffset ?? 0)),
        )
        copied = this.accessor({
          ...accessor,
          bufferView: this.bufferView(Buffer.from(data), view.target),
          byteOffset: undefined,
        })
        accessors.set(index, copied)
      }
      return copied
    }
    const copyMaterial = (index: number) => this.modelMaterial(gltf, index)
    const meshes: number[] = []
    const visit = (node: number) => {
      const { mesh, children, ...rest } = gltf.nodes[node]!
      if (Object.keys(rest).some((key) => key !== 'name')) {
        throw new Error(`${path}: nodes with transformations are not supported`)
      }
      if (mesh !== undefined) {
        this.json.meshes.push({
          primitives: gltf.meshes[mesh]!.primitives.map((primitive) => ({
            attributes: Object.fromEntries(
              Object.entries(primitive.attributes).map(([name, index]) => [
                name,
                copyAccessor(index),
              ]),
            ),
            ...(primitive.indices !== undefined && { indices: copyAccessor(primitive.indices) }),
            ...(primitive.material !== undefined && { material: copyMaterial(primitive.material) }),
            ...(primitive.mode !== undefined && { mode: primitive.mode }),
          })),
        })
        meshes.push(this.json.meshes.length - 1)
      }
      children?.forEach(visit)
    }
    gltf.scenes[gltf.scene ?? 0]!.nodes.forEach(visit)
    this.meshIndex.set(path, meshes)
    return meshes
  }

  node(node: Gltf['nodes'][number]) {
    this.json.nodes.push(node)
    this.json.scenes[0]!.nodes.push(this.json.nodes.length - 1)
  }

  glb(): Buffer {
    const bin = Buffer.concat(this.chunks)
    const json = {
      asset: { version: '2.0', generator: 'c0de.at scripts/import/scene.ts' },
      scene: 0,
      ...this.json,
      buffers: [{ byteLength: bin.length }],
    }
    for (const key of ['materials', 'textures', 'images', 'samplers'] as const) {
      if (json[key].length === 0) delete (json as Partial<typeof json>)[key]
    }
    const pad = (data: Buffer, fill: number) =>
      Buffer.concat([data, Buffer.alloc((4 - (data.length % 4)) % 4, fill)])
    const jsonChunk = pad(Buffer.from(JSON.stringify(json)), 0x20)
    const binChunk = pad(bin, 0)
    const header = Buffer.alloc(12)
    header.write('glTF', 0, 'ascii')
    header.writeUInt32LE(2, 4)
    header.writeUInt32LE(12 + 8 + jsonChunk.length + 8 + binChunk.length, 8)
    const chunkHeader = (length: number, type: string) => {
      const head = Buffer.alloc(8)
      head.writeUInt32LE(length, 0)
      head.write(type, 4, 'ascii')
      return head
    }
    return Buffer.concat([
      header,
      chunkHeader(jsonChunk.length, 'JSON'),
      jsonChunk,
      chunkHeader(binChunk.length, 'BIN\0'),
      binChunk,
    ])
  }
}

// Quads collects the faces of a primitive that the scene draws itself.
interface Quads {
  position: number[]
  normal: number[]
  uv: number[]
  indices: number[]
}

// quad adds a face with four corners, counter-clockwise seen from where the normal points.
function quad(
  q: Quads,
  normal: number[],
  a: number[],
  b: number[],
  c: number[],
  d: number[],
  uv: number[],
) {
  const first = q.position.length / 3
  q.position.push(...a, ...b, ...c, ...d)
  for (let i = 0; i < 4; i++) q.normal.push(...normal)
  q.uv.push(...uv)
  q.indices.push(first, first + 1, first + 2, first, first + 2, first + 3)
}

function primitive(writer: Writer, q: Quads, material: number): Primitive {
  return {
    attributes: {
      POSITION: writer.floats(q.position, 'VEC3', 34962),
      NORMAL: writer.floats(q.normal, 'VEC3', 34962),
      TEXCOORD_0: writer.floats(q.uv, 'VEC2', 34962),
    },
    indices: writer.accessor({
      bufferView: writer.bufferView(Buffer.from(new Uint16Array(q.indices).buffer), 34963),
      componentType: 5123,
      count: q.indices.length,
      type: 'SCALAR',
    }),
    material,
  }
}

// model returns the model of a block in a block state and its rotation around y (degrees,
// clockwise seen from above).
function model(index: ModelIndex, block: string, state?: string): { path: string; y: number } {
  const entry = index.blocks[block]
  if (!entry) throw new Error(`no model for the block ${block}`)
  const states = entry.states ?? {}
  // The layout names the property that selects the model (operator=add); the other
  // properties of the block (valid=true) don't change it, so the first state that has all
  // properties of the layout is the one.
  const wanted = state ? state.split(',') : []
  const match = Object.entries(states).find(([key]) =>
    wanted.every((p) => key.split(',').includes(p)),
  )
  if (state && !match) throw new Error(`no model for the block ${block} in the state ${state}`)
  return { path: match?.[1].model ?? entry.model, y: match?.[1].y ?? 0 }
}

// buildScene returns the scene of a program as GLB and the texts of its blocks.
export function buildScene(layout: Layout, models: Models): { glb: Buffer; labels: Labels } {
  const { index } = models
  const writer = new Writer(models)
  const lines = Math.max(0, ...layout.lines.map((line) => line.z + 1)) + 1 // one empty line after the program

  // The floor: per line, the tops of neighboring blocks of the same kind are one stripe whose
  // texture repeats; the outer sides are drawn block by block.
  const repeat = { magFilter: 9728, minFilter: 9728, wrapS: 10497, wrapT: 10497 }
  const floor = new Map<number, Quads>()
  const quads = (material: number) => {
    let q = floor.get(material)
    if (!q) floor.set(material, (q = { position: [], normal: [], uv: [], indices: [] }))
    return q
  }
  const side = (block: string, face: string) => {
    const path = model(index, block).path
    const gltf = models.gltf(path)
    const material = faces(gltf, path)[face]
    if (material === undefined) throw new Error(`${path} has no side ${face}`)
    return writer.modelMaterial(gltf, material, repeat)
  }
  const width = index.sheet.width
  for (let z = 0; z < lines; z++) {
    for (let x = 0; x < width;) {
      const block = floorBlock(index, x, z)
      let end = x + 1
      while (end < width && floorBlock(index, end, z) === block) end++
      // u along x, v along z, like the tops of the models
      const l = end - x
      quad(
        quads(side(block, 'up')),
        [0, 1, 0],
        [x, 0, z],
        [x, 0, z + 1],
        [end, 0, z + 1],
        [end, 0, z],
        [0, 0, 0, 1, l, 1, l, 0],
      )
      x = end
    }
    // west and east
    const uv = [0, 0, 0, 1, 1, 1, 1, 0]
    quad(
      quads(side(floorBlock(index, 0, z), 'west')),
      [-1, 0, 0],
      [0, 0, z],
      [0, -1, z],
      [0, -1, z + 1],
      [0, 0, z + 1],
      uv,
    )
    quad(
      quads(side(floorBlock(index, width - 1, z), 'east')),
      [1, 0, 0],
      [width, 0, z + 1],
      [width, -1, z + 1],
      [width, -1, z],
      [width, 0, z],
      uv,
    )
  }
  for (let x = 0; x < width; x++) {
    const uv = [0, 0, 0, 1, 1, 1, 1, 0]
    quad(
      quads(side(floorBlock(index, x, 0), 'north')),
      [0, 0, -1],
      [x + 1, 0, 0],
      [x + 1, -1, 0],
      [x, -1, 0],
      [x, 0, 0],
      uv,
    )
    quad(
      quads(side(floorBlock(index, x, lines - 1), 'south')),
      [0, 0, 1],
      [x, 0, lines],
      [x, -1, lines],
      [x + 1, -1, lines],
      [x + 1, 0, lines],
      uv,
    )
  }
  writer.json.meshes.push({
    primitives: [...floor].map(([material, q]) => primitive(writer, q, material)),
  })
  writer.node({ mesh: writer.json.meshes.length - 1, name: 'floor' })

  // The blocks: a node per block with the meshes of its model, turned by y degrees clockwise
  // around the center of the block (turned around its origin and moved back).
  const labels: Labels = { program: layout.program, width, lines, blocks: [] }
  for (const line of layout.lines) {
    for (const block of line.blocks) {
      const m = model(index, block.block, block.state)
      const angle = (-m.y * Math.PI) / 180
      const [sin, cos] = [Math.sin(angle), Math.cos(angle)]
      // where the center (0.5, 0, 0.5) goes with a rotation around +y: (cx + sz, cz - sx)
      const [rx, rz] = [0.5 * cos + 0.5 * sin, 0.5 * cos - 0.5 * sin]
      const round = (v: number) => Math.round(v * 1e6) / 1e6
      const transform = {
        translation: [round(block.x + 0.5 - rx), 0, round(line.z + 0.5 - rz)],
        ...(m.y !== 0 && {
          rotation: [0, round(Math.sin(angle / 2)), 0, round(Math.cos(angle / 2))],
        }),
      }
      for (const mesh of writer.meshes(m.path)) writer.node({ mesh, ...transform })
      labels.blocks.push([block.x, line.z, block.text])
    }
  }

  // The line numbers: one quad per digit, lying on the floor at x 2, readable from the south;
  // one primitive per color.
  const digits = writer.texture(`../textures/${DIGITS_TEXTURE}`, {
    magFilter: 9728,
    minFilter: 9728,
    wrapS: 33071,
    wrapT: 33071,
  })
  const byColor = new Map<string, Quads>()
  for (const line of layout.lines) {
    const color = lineColor(index, line)
    let q = byColor.get(color)
    if (!q) byColor.set(color, (q = { position: [], normal: [], uv: [], indices: [] }))
    const text = String(line.z)
    const textWidth = (text.length * CELL_WIDTH - 1) * PIXEL
    const height = CELL_HEIGHT * PIXEL
    const x0 = index.sheet.line_number_x + 0.5 - textWidth / 2
    // the glyphs are 7 of the 8 pixels high: centered on the line
    const z0 = line.z + 0.5 - ((CELL_HEIGHT - 1) * PIXEL) / 2
    const y = 0.002 // just above the floor
    for (let i = 0; i < text.length; i++) {
      const left = x0 + i * CELL_WIDTH * PIXEL
      const right = left + CELL_WIDTH * PIXEL
      const u0 = (Number(text[i]) * CELL_WIDTH) / (CELL_WIDTH * DIGITS.length)
      const u1 = u0 + CELL_WIDTH / (CELL_WIDTH * DIGITS.length)
      quad(
        q,
        [0, 1, 0],
        [left, y, z0],
        [left, y, z0 + height],
        [right, y, z0 + height],
        [right, y, z0],
        [u0, 0, u0, 1, u1, 1, u1, 0],
      )
    }
  }
  if (byColor.size > 0) {
    const primitives = [...byColor].map(([color, q]) =>
      primitive(
        writer,
        q,
        writer.material({
          name: `line number ${color}`,
          pbrMetallicRoughness: {
            baseColorTexture: { index: digits },
            baseColorFactor: linear(color),
            metallicFactor: 0,
            roughnessFactor: 1,
          },
          alphaMode: 'MASK',
          alphaCutoff: 0.5,
        }),
      ),
    )
    writer.json.meshes.push({ primitives })
    writer.node({ mesh: writer.json.meshes.length - 1, name: 'line numbers' })
  }
  return { glb: writer.glb(), labels }
}
