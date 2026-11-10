// Writes placeholder pages for every tab and chapter, and the navigation that lists them
// (.vitepress/navigation.json). The names are those of c0de 0.3.0 and c0de net 0.1.0. The
// import of the documentation (sprint 3) replaces this script; until then it lets the ring
// binder be built and tested with the real number of tabs.
import { mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const site = join(dirname(fileURLToPath(import.meta.url)), '..')

const guide = [
  ['getting-started', 'Getting started', 'Erste Schritte'],
  ['language', 'The language', 'Die Sprache'],
  ['running-programs', 'Running programs', 'Programme ausführen'],
  ['tools', 'Tools and items', 'Werkzeuge und Gegenstände'],
  ['libraries', 'Libraries', 'Bibliotheken'],
  ['examples', 'Examples', 'Beispiele'],
]
const handbooks = [
  ['data', 'Data', 'Daten'],
  ['statements', 'Statements', 'Anweisungen'],
  ['tools', 'Tools', 'Werkzeuge'],
  ['triggers', 'Triggers', 'Auslöser'],
  ['devices', 'Devices', 'Geräte'],
  ['functions', 'Functions', 'Funktionen'],
]
const libraries = [
  [
    'c0de/math',
    'lib1',
    'ABS SGN SQR EXP LOG SIN COS TAN ATN INT FIX ROUND TO_FLOAT DIV RANDOM RANDOMIZE',
  ],
  [
    'c0de/strings',
    'lib2',
    'LEFT RIGHT MID REPLACE INSTR UCASE LCASE SPACE FILL ASC CHR STR FORMAT VAL HEX OCT TO_JSON TO_YAML FROM_JSON FROM_YAML',
  ],
  [
    'c0de/time',
    'lib3',
    'NOW MILLISECOND SECOND MINUTE HOUR DAY MONTH YEAR WEEKDAY WEEK TIMER SLEEP',
  ],
  [
    'c0de/minecraft',
    'lib4',
    'TICKS BEEP SOUND SAY GET_BLOCK GET_INVENTORY GET_LEVER SET_LEVER GET_BUTTON PRESS_BUTTON GET_PRESSURE_PLATE GET_OPEN SET_OPEN MOVE_ITEMS DELETE_ITEMS PLACE_BLOCK REMOVE_BLOCK MINE_BLOCK SPAWN_ITEM SPAWN_ENTITY FIND_ENTITIES TELEPORT',
  ],
]
const http = {
  before: [['getting-started', 'Getting started', 'Erste Schritte']],
  functions:
    'HTTP_CONNECTION HTTP_GET HTTP_HEAD HTTP_OPTIONS HTTP_TRACE HTTP_DELETE HTTP_PATCH HTTP_POST HTTP_PUT',
  after: [
    ['errors', 'Errors', 'Fehler'],
    ['examples', 'Examples', 'Beispiele'],
  ],
}

const chapter = (link, en, de, group) => ({
  label: de ? { en, de } : { en },
  link,
  ...(group && { group }),
})
const functionChapters = (base, names) =>
  names.split(' ').map((name) => chapter(`${base}${name.toLowerCase()}`, name))

const navigation = {
  tabs: [
    {
      id: 'c0de',
      label: { en: 'c0de' },
      color: 'c0de',
      link: '/c0de/',
      chapters: [
        ...guide.map(([slug, en, de]) => chapter(`/c0de/guide/${slug}`, en, de, 'guide')),
        ...handbooks.map(([slug, en, de]) =>
          chapter(`/c0de/reference/${slug}`, en, de, 'handbook'),
        ),
      ],
    },
    ...libraries.map(([name, color, functions]) => ({
      id: name,
      label: { en: name },
      color,
      link: `/${name}/`,
      chapters: functionChapters(`/${name}/`, functions),
    })),
    {
      id: 'c0de_net/http',
      label: { en: 'c0de_net/http' },
      color: 'lib5',
      link: '/c0de_net/http/',
      chapters: [
        ...http.before.map(([slug, en, de]) => chapter(`/c0de_net/http/${slug}`, en, de)),
        ...functionChapters('/c0de_net/http/', http.functions),
        ...http.after.map(([slug, en, de]) => chapter(`/c0de_net/http/${slug}`, en, de)),
      ],
    },
  ],
}

const text = {
  en: {
    overview: (title) => `The overview of ${title}. It lists the chapters of this tab.`,
    placeholder: (title) =>
      `This page is a placeholder for **${title}**. The documentation of c0de replaces it in sprint 3.`,
    sections: ['Description', 'Parameters and results', 'Example', 'Notes'],
    table: ['Name', 'Type', 'Meaning'],
    rows: [
      ['`value`', 'INTEGER', 'the number to work with'],
      ['`result`', 'FLOAT', 'the result of the function'],
    ],
    list: [
      'A program is a list of lines.',
      'Each line starts with a keyword block.',
      'Blocks are read from west to east.',
    ],
    filler:
      'c0de programs are built from blocks on sheets of greenbar paper. The cursor reads them line by line, and every line does one step.',
  },
  de: {
    overview: (title) => `Die Übersicht über ${title}. Sie listet die Kapitel dieses Reiters auf.`,
    placeholder: (title) =>
      `Diese Seite ist ein Platzhalter für **${title}**. In Sprint 3 ersetzt sie die Dokumentation von c0de.`,
    sections: ['Beschreibung', 'Parameter und Ergebnisse', 'Beispiel', 'Hinweise'],
    table: ['Name', 'Typ', 'Bedeutung'],
    rows: [
      ['`value`', 'INTEGER', 'die Zahl, mit der gerechnet wird'],
      ['`result`', 'FLOAT', 'das Ergebnis der Funktion'],
    ],
    list: [
      'Ein Programm ist eine Liste von Zeilen.',
      'Jede Zeile beginnt mit einem Schlüsselwort-Block.',
      'Blöcke werden von Westen nach Osten gelesen.',
    ],
    filler:
      'c0de-Programme bestehen aus Blöcken auf Bögen aus Endlospapier. Der Cursor liest sie Zeile für Zeile, und jede Zeile ist ein Schritt.',
  },
}

const example = [
  '```c0de',
  'CALL c0de/math/ABS',
  '    PARAMETER value -5 ;',
  '    RESULT result distance',
  '```',
]

function chapterPage(title, language) {
  const t = text[language]
  const [description, parameters, exampleTitle, notes] = t.sections
  return [
    `# ${title}`,
    '',
    '[[toc]]',
    '',
    t.placeholder(title),
    '',
    `## ${description}`,
    '',
    t.filler,
    '',
    t.filler,
    '',
    `## ${parameters}`,
    '',
    `| ${t.table.join(' | ')} |`,
    '|---|---|---|',
    ...t.rows.map((row) => `| ${row.join(' | ')} |`),
    '',
    `## ${exampleTitle}`,
    '',
    ...example,
    '',
    `## ${notes}`,
    '',
    ...t.list.map((item) => `- ${item}`),
    '',
    `### ${title} 2`,
    '',
    t.filler,
    '',
  ].join('\n')
}

function overviewPage(tab, language) {
  const t = text[language]
  const prefix = language === 'en' ? '' : `/${language}`
  const label = (c) => c.label[language] ?? c.label.en
  return [
    `# ${tab.label.en}`,
    '',
    t.overview(tab.label.en),
    '',
    ...tab.chapters.map((c) => `- [${label(c)}](${prefix}${c.link})`),
    '',
  ].join('\n')
}

function write(path, content) {
  const file = join(site, path)
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, content)
}

for (const folder of ['c0de', 'c0de_net', 'de/c0de', 'de/c0de_net']) {
  rmSync(join(site, folder), { recursive: true, force: true })
}
for (const language of ['en', 'de']) {
  const prefix = language === 'en' ? '' : `${language}/`
  for (const tab of navigation.tabs) {
    write(`${prefix}${tab.link.slice(1)}index.md`, overviewPage(tab, language))
    for (const c of tab.chapters) {
      write(
        `${prefix}${c.link.slice(1)}.md`,
        chapterPage(c.label[language] ?? c.label.en, language),
      )
    }
  }
}
write('.vitepress/navigation.json', JSON.stringify(navigation, null, 2) + '\n')
console.log(
  `placeholder content: ${navigation.tabs.length} tabs, ${navigation.tabs.reduce((n, t) => n + t.chapters.length, 0)} chapters`,
)
