// unzip reads the files of a zip archive (stored or deflated, as zipfile of Python writes
// them), which is all the models of c0de need (c0de-models-<version>.zip).
import { inflateRawSync } from 'node:zlib'

export function unzip(data: Buffer): Map<string, Buffer> {
  // The end of central directory record: its signature, searched from the end (after the
  // record there can only be a comment of at most 64 KiB).
  let end = data.length - 22
  while (end >= 0 && data.readUInt32LE(end) !== 0x06054b50) end--
  if (end < 0) throw new Error('not a zip archive')
  const count = data.readUInt16LE(end + 10)
  let entry = data.readUInt32LE(end + 16)
  const files = new Map<string, Buffer>()
  for (let i = 0; i < count; i++) {
    if (data.readUInt32LE(entry) !== 0x02014b50) throw new Error('broken zip directory')
    const method = data.readUInt16LE(entry + 10)
    const compressed = data.readUInt32LE(entry + 20)
    const nameLength = data.readUInt16LE(entry + 28)
    const extraLength = data.readUInt16LE(entry + 30)
    const commentLength = data.readUInt16LE(entry + 32)
    const local = data.readUInt32LE(entry + 42)
    const name = data.toString('utf-8', entry + 46, entry + 46 + nameLength)
    entry += 46 + nameLength + extraLength + commentLength
    if (name.endsWith('/')) continue
    const start = local + 30 + data.readUInt16LE(local + 26) + data.readUInt16LE(local + 28)
    const content = data.subarray(start, start + compressed)
    if (method === 0) files.set(name, Buffer.from(content))
    else if (method === 8) files.set(name, inflateRawSync(content))
    else throw new Error(`${name}: unknown compression method ${method}`)
  }
  return files
}
