import { existsSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { slug } from 'github-slugger'
import { defineConfigWithTheme, type HeadConfig } from 'vitepress'
import { c0deDark, c0deLanguage, c0deLight } from './c0de-highlighting'
import { programView, readManifest } from './programs'
import { screenshotHtml } from './screenshots'
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
  // Vite would inline small files (like font subsets) as data: URLs, which the
  // Content-Security-Policy of the server blocks; every asset stays a file of the site.
  // The meshopt decoder of three.js is replaced by a stub (see meshopt-stub.ts).
  vite: {
    build: { assetsInlineLimit: 0 },
    resolve: {
      alias: [
        {
          find: /^three\/examples\/jsm\/libs\/meshopt_decoder\.module\.js$/,
          replacement: fileURLToPath(new URL('./meshopt-stub.ts', import.meta.url)),
        },
      ],
    },
  },
  // <model-viewer> of the 3D views of the programs is a web component.
  vue: { template: { compilerOptions: { isCustomElement: (tag) => tag === 'model-viewer' } } },
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
    // The screenshot marks of the tutorials become images once their files exist (task 7.1);
    // programs with a 3D scene get the switch between text and 3D (task 8.4).
    config: (md) => {
      const render = md.renderer.rules.html_block!
      const publicFolder = fileURLToPath(new URL('../public', import.meta.url))
      md.renderer.rules.html_block = (tokens, index, options, env, self) => {
        const html = render(tokens, index, options, env, self)
        return screenshotHtml(html, publicFolder)
      }
      const manifest = readManifest(fileURLToPath(new URL('.', import.meta.url)))
      const fence = md.renderer.rules.fence!
      md.renderer.rules.fence = (tokens, index, options, env, self) => {
        // The fence of VitePress reads included files (<<< @/...) into the token first.
        const html = fence(tokens, index, options, env, self)
        const token = tokens[index]!
        if (token.info.trim().split(/\s/)[0] !== 'c0de') return html
        const file = (token as { src?: string[] }).src?.[0]
        return programView(html, token.content, file, publicFolder, manifest)
      }
    },
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
  transformHead({ pageData, siteData, assets }): HeadConfig[] {
    // The Latin fonts (also for German) are loaded with the page, before the text is laid
    // out; otherwise the text would move when they arrive late (Lighthouse: layout shift).
    const fonts = assets
      .filter((asset) =>
        /\/(source-sans-3|jetbrains-mono)-latin-wght-normal\.[^/]*\.woff2$/.test(asset),
      )
      .map((href): HeadConfig => [
        'link',
        { rel: 'preload', href, as: 'font', type: 'font/woff2', crossorigin: '' },
      ])
    if (pageData.isNotFound || pageData.frontmatter.notFound) {
      return [...fonts, ['meta', { name: 'robots', content: 'noindex' }]]
    }
    const path = pathOf(pageData.relativePath)
    const language = languageOf(path)
    const title =
      pageData.frontmatter.titleTemplate === false ? pageData.title : `${pageData.title} | c0de`
    const description = pageData.description || siteData.description
    const meta = (property: string, content: string): HeadConfig => ['meta', { property, content }]
    return [
      ...fonts,
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
