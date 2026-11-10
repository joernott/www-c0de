import { existsSync, readFileSync } from 'node:fs'
import { slug } from 'github-slugger'
import { defineConfigWithTheme, type HeadConfig } from 'vitepress'
import { c0deDark, c0deLanguage, c0deLight } from './c0de-highlighting'
import { languageOf, languages, pathIn, pathOf } from './theme/language'
import type { ThemeConfig } from './theme/binder'
import type { Navigation } from './theme/navigation'

const origin = 'https://c0de.at'

// The navigation is written by the import of the documentation (npm run content).
const navigationFile = new URL('./navigation.json', import.meta.url)
if (!existsSync(navigationFile)) {
  throw new Error('.vitepress/navigation.json is missing: run "npm run content" (the import) first')
}
const navigation: Navigation = JSON.parse(readFileSync(navigationFile, 'utf-8'))

// The site is built straight into the folder that the Go binary embeds.
export default defineConfigWithTheme<ThemeConfig>({
  outDir: '../internal/site/dist',
  lang: 'en',
  title: 'c0de',
  description: 'Documentation and tutorials of c0de, the programming language in Minecraft',
  // The Markdown files of the scripts (test fixtures of the import) are not pages.
  srcExclude: ['scripts/**'],
  cleanUrls: true,
  lastUpdated: false,
  // Dark mode follows the operating system with CSS only (concept: color scheme), so the
  // script of VitePress' appearance switch isn't needed.
  appearance: false,
  head: [['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }]],
  // Anchors as on GitHub (TO_JSON is #to_json), so the links of the mods keep working.
  markdown: {
    languages: [c0deLanguage],
    theme: { light: c0deLight, dark: c0deDark },
    anchor: { slugify: slug },
    headers: { slugify: slug },
    toc: { slugify: slug },
  },
  // The full-text search builds one index per language; SiteSearch.vue is its field.
  themeConfig: { navigation, search: { provider: 'local' } },
  locales: {
    root: {
      lang: 'en',
      label: 'English',
      title: 'c0de',
      description: 'Documentation and tutorials of c0de, the programming language in Minecraft',
    },
    de: {
      lang: 'de',
      label: 'Deutsch',
      title: 'c0de',
      description: 'Dokumentation und Tutorials zu c0de, der Programmiersprache in Minecraft',
    },
  },
  // The sitemap lists every page except the not-found pages.
  sitemap: {
    hostname: origin,
    transformItems: (items) => items.filter((item) => !/(^|\/)not-found$/.test(item.url)),
  },
  // Every page names itself and its versions in the other languages for search engines, and
  // describes itself for link previews (Open Graph).
  transformHead({ pageData, siteData }): HeadConfig[] {
    if (pageData.isNotFound || pageData.frontmatter.notFound) {
      return [['meta', { name: 'robots', content: 'noindex' }]]
    }
    const path = pathOf(pageData.relativePath)
    const language = languageOf(path)
    const title =
      pageData.frontmatter.titleTemplate === false ? pageData.title : `${pageData.title} | c0de`
    const description = pageData.description || siteData.description
    const meta = (property: string, content: string): HeadConfig => ['meta', { property, content }]
    return [
      ['link', { rel: 'canonical', href: origin + path }],
      ...languages.map((l): HeadConfig => [
        'link',
        { rel: 'alternate', hreflang: l, href: origin + pathIn(path, l) },
      ]),
      ['link', { rel: 'alternate', hreflang: 'x-default', href: origin + pathIn(path, 'en') }],
      meta('og:type', 'website'),
      meta('og:site_name', 'c0de'),
      meta('og:title', title),
      meta('og:description', description),
      meta('og:url', origin + path),
      meta('og:image', `${origin}/og-image.png`),
      meta('og:image:width', '1200'),
      meta('og:image:height', '630'),
      meta('og:image:alt', 'c0de – the programming language made of blocks in Minecraft'),
      meta('og:locale', language === 'de' ? 'de_DE' : 'en_US'),
      ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ]
  },
})
