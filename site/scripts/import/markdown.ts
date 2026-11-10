// Line-based helpers for the Markdown of the mods: headings outside of code blocks, their
// anchors as GitHub creates them, sections, and the links of a line.
import GithubSlugger, { slug } from 'github-slugger'

export interface Heading {
  level: number
  text: string
  // The anchor as on GitHub, unique within its file.
  anchor: string
  line: number
}

const headingPattern = /^(#{1,6})\s+(.*?)\s*#*\s*$/
const fencePattern = /^\s*(```|~~~)/

// codeLines returns for every line whether it is inside a fenced code block (fences count
// as code too).
export function codeLines(lines: string[]): boolean[] {
  let inside = false
  return lines.map((line) => {
    if (fencePattern.test(line)) {
      inside = !inside
      return true
    }
    return inside
  })
}

// plainText returns the text of inline Markdown as it is rendered (links become their text).
export function plainText(markdown: string): string {
  return (
    markdown
      .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
      .replace(/\[((?:[^[\]]|\[[^\]]*\])*)\]\([^)]*\)/g, '$1')
      .replace(/`([^`]*)`/g, '$1')
      // Underscores only mark emphasis at word boundaries (GET_PRESSURE_PLATE is a name).
      .replace(/\*\*(.*?)\*\*|(?<!\w)__(.*?)__(?!\w)/g, '$1$2')
      .replace(/\*(\S.*?)\*|(?<!\w)_(\S.*?)_(?!\w)/g, '$1$2')
      .trim()
  )
}

export function headings(lines: string[]): Heading[] {
  const slugger = new GithubSlugger()
  const code = codeLines(lines)
  const result: Heading[] = []
  lines.forEach((line, index) => {
    const match = code[index] ? null : headingPattern.exec(line)
    if (match) {
      const text = plainText(match[2]!)
      result.push({ level: match[1]!.length, text, anchor: slugger.slug(text), line: index })
    }
  })
  return result
}

// anchorOf returns the anchor of a heading text without making it unique.
export const anchorOf = (text: string) => slug(plainText(text))

export interface Range {
  start: number
  end: number // exclusive
}

// sectionRange returns the lines of a heading and its content up to the next heading of the
// same or a higher level.
export function sectionRange(all: Heading[], heading: Heading, lineCount: number): Range {
  const next = all.find((h) => h.line > heading.line && h.level <= heading.level)
  return { start: heading.line, end: next ? next.line : lineCount }
}

// shiftHeadings moves the headings of the lines by "by" levels (negative: up, e.g. ## to #).
export function shiftHeadings(lines: string[], by: number): string[] {
  if (by === 0) return lines
  const code = codeLines(lines)
  return lines.map((line, index) => {
    const match = code[index] ? null : headingPattern.exec(line)
    if (!match) return line
    const level = Math.min(6, Math.max(1, match[1]!.length + by))
    return `${'#'.repeat(level)} ${match[2]}`
  })
}

// rewriteLinks calls rewrite for every link and image outside of code and replaces its
// target with the result.
export function rewriteLinks(
  lines: string[],
  rewrite: (target: string, image: boolean, line: number) => string,
): string[] {
  const code = codeLines(lines)
  return lines.map((line, index) => {
    if (code[index]) return line
    // Inline code may contain brackets; it is left alone.
    return line
      .split(/(`[^`]*`)/)
      .map((part) =>
        part.startsWith('`')
          ? part
          : part.replace(
              /(!?)\[((?:[^[\]]|\[[^\]]*\])*)\]\(([^)\s]+)(\s+"[^"]*")?\)/g,
              (_all, bang: string, text: string, target: string, title = '') =>
                `${bang}[${text}](${rewrite(target, bang === '!', index)}${title})`,
            ),
      )
      .join('')
  })
}

// firstParagraph returns the plain text of the first paragraph after the first heading.
export function firstParagraph(lines: string[]): string {
  const code = codeLines(lines)
  const paragraph: string[] = []
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!.trim()
    if (code[i] || headingPattern.test(line) || line.startsWith('!') || line.startsWith('|')) {
      if (paragraph.length) break
      continue
    }
    if (line === '') {
      if (paragraph.length) break
      continue
    }
    paragraph.push(line)
  }
  return plainText(paragraph.join(' '))
}
