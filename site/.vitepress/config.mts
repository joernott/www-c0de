import { existsSync, readFileSync } from 'node:fs'
import { defineConfigWithTheme, type HeadConfig } from 'vitepress'
import { languages, pathIn, pathOf } from './theme/language'
import type { ThemeConfig } from './theme/binder'
import type { Navigation } from './theme/navigation'

const origin = 'https://c0de.at'

// The navigation is generated with the content (npm run content, the import in sprint 3).
const navigationFile = new URL('./navigation.json', import.meta.url)
if (!existsSync(navigationFile)) {
  throw new Error('.vitepress/navigation.json is missing: run "npm run content" first')
}
const navigation: Navigation = JSON.parse(readFileSync(navigationFile, 'utf-8'))

// The site is built straight into the folder that the Go binary embeds.
export default defineConfigWithTheme<ThemeConfig>({
  outDir: '../internal/site/dist',
  lang: 'en',
  title: 'c0de',
  description: 'Documentation and tutorials of c0de, the programming language in Minecraft',
  cleanUrls: true,
  lastUpdated: false,
  // Dark mode follows the operating system with CSS only (concept: color scheme), so the
  // script of VitePress' appearance switch isn't needed.
  appearance: false,
  head: [['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }]],
  themeConfig: { navigation },
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
  // Every page names itself and its versions in the other languages for search engines.
  transformHead({ pageData }): HeadConfig[] {
    if (pageData.isNotFound || pageData.frontmatter.notFound) {
      return [['meta', { name: 'robots', content: 'noindex' }]]
    }
    const path = pathOf(pageData.relativePath)
    return [
      ['link', { rel: 'canonical', href: origin + path }],
      ...languages.map((language): HeadConfig => [
        'link',
        { rel: 'alternate', hreflang: language, href: origin + pathIn(path, language) },
      ]),
      ['link', { rel: 'alternate', hreflang: 'x-default', href: origin + pathIn(path, 'en') }],
    ]
  },
})
