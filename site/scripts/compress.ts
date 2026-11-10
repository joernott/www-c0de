// Writes compressed copies (.br, .zst, .gz) of the text files of the built site, which Caddy
// sends to browsers that accept them (file_server precompressed). A copy is only kept if it
// is smaller than the file.
//
// Usage: node scripts/compress.ts [<folder of the built site>]
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { brotliCompressSync, constants, gzipSync, zstdCompressSync } from 'node:zlib'

const compressible = /\.(html|js|mjs|css|json|xml|svg|txt)$/
const minimum = 1024 // smaller files aren't worth it

const encodings: [string, (data: Buffer) => Buffer][] = [
  [
    '.br',
    (data) =>
      brotliCompressSync(data, {
        params: { [constants.BROTLI_PARAM_QUALITY]: constants.BROTLI_MAX_QUALITY },
      }),
  ],
  [
    '.zst',
    (data) => zstdCompressSync(data, { params: { [constants.ZSTD_c_compressionLevel]: 19 } }),
  ],
  ['.gz', (data) => gzipSync(data, { level: 9 })],
]

export function compress(site: string): { files: number; before: number; after: number } {
  const result = { files: 0, before: 0, after: 0 }
  for (const name of readdirSync(site, { recursive: true, encoding: 'utf-8' })) {
    const file = join(site, name)
    if (!compressible.test(name) || !statSync(file).isFile()) continue
    const data = readFileSync(file)
    if (data.length < minimum) continue
    result.files++
    result.before += data.length
    let best = data.length
    for (const [extension, encode] of encodings) {
      const encoded = encode(data)
      if (encoded.length < data.length) {
        writeFileSync(file + extension, encoded)
        best = Math.min(best, encoded.length)
      }
    }
    result.after += best
  }
  return result
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const site =
    process.argv[2] ?? fileURLToPath(new URL('../../internal/site/dist/', import.meta.url))
  const { files, before, after } = compress(site)
  const kb = (n: number) => `${Math.round(n / 1024)} KB`
  console.log(`compressed ${files} files: ${kb(before)} -> ${kb(after)} (smallest encoding)`)
}
