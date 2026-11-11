// The screenshots of the tutorials (task 7.1). A lesson marks a screenshot with a comment on a
// line of its own:
//
//   <!-- screenshot: first-program-sheet | The program sign on its sheet, seen from the south -->
//
// When the file public/tutorials/screenshots/<id>.webp exists, the comment becomes the image,
// with its width and height (so the page doesn't shift) and the description as alternative
// text; without the file, it stays an invisible comment. scripts/screenshots.ts lists all marks.
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

export const screenshotMark = /^<!--\s*screenshot:\s*([a-z0-9-]+)\s*\|\s*(.*?)\s*-->\s*$/

export interface Mark {
  id: string
  description: string
}

export function parseMark(line: string): Mark | undefined {
  const match = screenshotMark.exec(line.trim())
  return match ? { id: match[1]!, description: match[2]! } : undefined
}

// webpSize reads the width and height of a WebP image from its header (lossy VP8, lossless
// VP8L or extended VP8X).
export function webpSize(data: Buffer): { width: number; height: number } {
  if (data.toString('ascii', 0, 4) !== 'RIFF' || data.toString('ascii', 8, 12) !== 'WEBP') {
    throw new Error('not a WebP image')
  }
  const chunk = data.toString('ascii', 12, 16)
  if (chunk === 'VP8 ') {
    return { width: data.readUInt16LE(26) & 0x3fff, height: data.readUInt16LE(28) & 0x3fff }
  }
  if (chunk === 'VP8L') {
    const bits = data.readUInt32LE(21)
    return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 }
  }
  if (chunk === 'VP8X') {
    return { width: data.readUIntLE(24, 3) + 1, height: data.readUIntLE(27, 3) + 1 }
  }
  throw new Error(`unknown WebP chunk ${chunk}`)
}

const escape = (text: string) =>
  text.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;')

// screenshotHtml returns the image of a mark, or the mark itself if the screenshot is missing.
export function screenshotHtml(html: string, publicFolder: string): string {
  const mark = parseMark(html)
  if (!mark) return html
  const file = join(publicFolder, 'tutorials', 'screenshots', `${mark.id}.webp`)
  if (!existsSync(file)) return html
  const { width, height } = webpSize(readFileSync(file))
  return (
    `<img class="screenshot" src="/tutorials/screenshots/${mark.id}.webp" alt="${escape(mark.description)}" ` +
    `width="${width}" height="${height}" loading="lazy">\n`
  )
}
