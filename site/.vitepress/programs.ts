// The 3D views of the programs (tasks 8.3 to 8.5). The import (scripts/import/scenes.ts) builds a
// scene of every complete program of the site: the files of the tutorials and the ```c0de blocks
// of all pages that start with PROGRAM. It names the scene after a hash of the program text and
// writes it to public/models/<version>/programs/<hash>.glb, with the texts of its blocks in
// <hash>.json. The Markdown renderer puts every code block that has a scene into ProgramView,
// which switches between the text and the 3D view.
import { createHash } from 'node:crypto'
import { existsSync, readFileSync } from 'node:fs'
import { basename, join } from 'node:path'

// normalize removes what doesn't change a program: line ends, spaces at the ends of lines and
// empty lines at the end.
export const normalize = (program: string) =>
  program
    .replaceAll('\r\n', '\n')
    .split('\n')
    .map((line) => line.trimEnd())
    .join('\n')
    .trim()

// isProgram tells complete programs from fragments: a program starts with PROGRAM.
export const isProgram = (program: string) => /^PROGRAM\b/.test(normalize(program))

export const programHash = (program: string) =>
  createHash('sha256').update(normalize(program)).digest('hex').slice(0, 16)

// The manifest of the scenes, written by the import.
export interface ModelsManifest {
  // the URL of the folder of the models version, e.g. /models/0.4.0/
  base: string
}

export const manifestFile = (vitepress: string) => join(vitepress, 'models.json')

export function readManifest(vitepress: string): ModelsManifest | undefined {
  const file = manifestFile(vitepress)
  return existsSync(file) ? (JSON.parse(readFileSync(file, 'utf-8')) as ModelsManifest) : undefined
}

const escape = (text: string) =>
  text.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;')

// programView wraps the HTML of a code block in ProgramView if the program has a scene. The
// poster is the screenshot of the program, if a tutorial has one with the name of its file.
export function programView(
  html: string,
  program: string,
  file: string | undefined,
  publicFolder: string,
  manifest: ModelsManifest | undefined,
): string {
  if (!manifest || !isProgram(program)) return html
  const hash = programHash(program)
  const scene = `${manifest.base}programs/${hash}`
  if (!existsSync(join(publicFolder, `${scene}.glb`))) return html
  const name = file ? basename(file, '.c0de') : undefined
  const poster =
    name && existsSync(join(publicFolder, 'tutorials', 'screenshots', `${name}.webp`))
      ? ` poster="/tutorials/screenshots/${escape(name)}.webp"`
      : ''
  return `<ProgramView scene="${escape(scene)}"${poster}>\n${html}</ProgramView>\n`
}
