// Highlighting of c0de programs in the text notation of the documentation (```c0de blocks).
// The colors are those of the blocks in the game (block reference of the c0de concept),
// darker on light paper and lighter on dark paper, so they keep enough contrast.
import type { MarkdownOptions } from 'vitepress'

// The types of Shiki, as VitePress uses them (Shiki itself is a dependency of VitePress).
type LanguageRegistration = Extract<NonNullable<MarkdownOptions['languages']>[number], object>
type ThemeRegistration = Extract<
  NonNullable<MarkdownOptions['theme']>,
  { name?: string; type?: string }
>

const words = (list: string) => `\\b(?:${list.split(' ').join('|')})\\b`

export const c0deLanguage: LanguageRegistration = {
  name: 'c0de',
  scopeName: 'source.c0de',
  repository: {},
  patterns: [
    { name: 'comment.line.c0de', match: '//.*$' },
    { name: 'comment.block.c0de', match: '\\bCOMMENT\\("(?:[^"\\\\]|\\\\.)*"\\)' },
    { name: 'string.quoted.double.c0de', match: '"(?:[^"\\\\]|\\\\.)*"' },
    { name: 'string.quoted.single.c0de', match: "'(?:[^'\\\\]|\\\\.)'" },
    { name: 'constant.numeric.c0de', match: '(?<![\\w/])\\d+(?:\\.\\d+)?(?![\\w])' },
    { name: 'constant.language.c0de', match: words('TRUE FALSE') },
    { name: 'keyword.other.noop.c0de', match: words('NOOP') },
    { name: 'keyword.other.structure.c0de', match: words('PROGRAM FUNCTION CALL') },
    { name: 'keyword.other.include.c0de', match: words('INCLUDE EXIT') },
    { name: 'keyword.control.block.c0de', match: words('BEGIN END BREAK') },
    { name: 'keyword.control.flow.c0de', match: words('IF ELSE FOR EACH WHILE REPEAT') },
    { name: 'keyword.other.parameter.c0de', match: words('PARAMETER RESULT RETURN') },
    { name: 'keyword.other.assign.c0de', match: words('ASSIGN') },
    { name: 'storage.type.declaration.c0de', match: words('VARIABLE CONSTANT') },
    { name: 'entity.other.tag.c0de', match: words('TAG') },
    {
      name: 'storage.type.c0de',
      match: words('BOOLEAN INTEGER FLOAT CHAR STRING ARRAY HASH STRUCT TIME ERROR'),
    },
    {
      name: 'keyword.operator.c0de',
      match: `${words('NOT AND OR XOR')}|[;()+\\-*/\\\\^=≠<>≤≥⊕⊻&|¬←→]`,
    },
    {
      name: 'variable.other.label.c0de',
      match: '[A-Za-z][\\w/]*(?:\\[[^\\]]*\\]|\\.[A-Za-z]\\w*)*',
    },
  ],
}

// The colors of the scopes: [scope, light, dark, font style].
const colors: [string, string, string, string?][] = [
  ['comment', '#1e7b1e', '#6fd36f', 'italic'],
  ['string, constant', '#5c6670', '#b4bcc4'],
  ['variable.other.label', '#5c6670', '#b4bcc4'],
  ['keyword.other.noop', '#6b7178', '#8f959c'],
  ['keyword.other.structure', '#4d4d4d', '#c7c7c7', 'bold'],
  ['keyword.other.include', '#111111', '#f2f2f2', 'bold'],
  ['keyword.control.block', '#8a5a00', '#ffb733', 'bold'],
  ['keyword.control.flow', '#1e7b1e', '#6fd36f', 'bold'],
  ['keyword.other.parameter', '#8f1f8f', '#e48ae4', 'bold'],
  ['keyword.other.assign', '#00737a', '#4fd6d6', 'bold'],
  ['storage.type.declaration', '#1d4fbf', '#8cb4ff', 'bold'],
  ['entity.other.tag', '#6b3f16', '#d9a877', 'bold'],
  ['storage.type', '#c62828', '#ff8a80'],
  ['keyword.operator', '#8b0000', '#ec7070'],
]

function theme(
  name: string,
  type: 'light' | 'dark',
  foreground: string,
  background: string,
): ThemeRegistration {
  return {
    name,
    type,
    colors: { 'editor.foreground': foreground, 'editor.background': background },
    settings: [
      { settings: { foreground, background } },
      ...colors.map(([scope, light, dark, fontStyle]) => ({
        scope: scope.split(', '),
        settings: { foreground: type === 'light' ? light : dark, ...(fontStyle && { fontStyle }) },
      })),
    ],
  }
}

export const c0deLight = theme('c0de-light', 'light', '#1d232a', '#f3f1e8')
export const c0deDark = theme('c0de-dark', 'dark', '#e8e4da', '#1d1d22')
