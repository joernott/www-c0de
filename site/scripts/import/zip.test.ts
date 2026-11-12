import { deflateRawSync } from 'node:zlib'
import { describe, expect, it } from 'vitest'
import { unzip } from './zip.ts'

// zip writes an archive with the given files, the first one stored, the others deflated.
function zip(files: [string, string][]): Buffer {
  const locals: Buffer[] = []
  const central: Buffer[] = []
  let offset = 0
  files.forEach(([name, text], i) => {
    const data = Buffer.from(text)
    const method = i === 0 ? 0 : 8
    const content = method === 0 ? data : deflateRawSync(data)
    const nameBytes = Buffer.from(name)
    const local = Buffer.alloc(30)
    local.writeUInt32LE(0x04034b50, 0)
    local.writeUInt16LE(method, 8)
    local.writeUInt32LE(content.length, 18)
    local.writeUInt32LE(data.length, 22)
    local.writeUInt16LE(nameBytes.length, 26)
    locals.push(local, nameBytes, content)
    const entry = Buffer.alloc(46)
    entry.writeUInt32LE(0x02014b50, 0)
    entry.writeUInt16LE(method, 10)
    entry.writeUInt32LE(content.length, 20)
    entry.writeUInt32LE(data.length, 24)
    entry.writeUInt16LE(nameBytes.length, 28)
    entry.writeUInt32LE(offset, 42)
    central.push(entry, nameBytes)
    offset += 30 + nameBytes.length + content.length
  })
  const directory = Buffer.concat(central)
  const end = Buffer.alloc(22)
  end.writeUInt32LE(0x06054b50, 0)
  end.writeUInt16LE(files.length, 8)
  end.writeUInt16LE(files.length, 10)
  end.writeUInt32LE(directory.length, 12)
  end.writeUInt32LE(offset, 16)
  return Buffer.concat([...locals, directory, end])
}

describe('unzip', () => {
  it('reads stored and deflated files', () => {
    const files = unzip(
      zip([
        ['index.json', '{"version":"1.0.0"}'],
        ['models/cube.gltf', 'a model '.repeat(100)],
      ]),
    )
    expect([...files.keys()]).toEqual(['index.json', 'models/cube.gltf'])
    expect(files.get('index.json')!.toString()).toBe('{"version":"1.0.0"}')
    expect(files.get('models/cube.gltf')!.toString()).toBe('a model '.repeat(100))
  })

  it('refuses what is no zip archive', () => {
    expect(() => unzip(Buffer.from('not a zip archive, but long enough to look'))).toThrow(
      'not a zip archive',
    )
  })
})
