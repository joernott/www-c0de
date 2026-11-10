import { defineConfig } from 'vitepress'

// The site is built straight into the folder that the Go binary embeds.
export default defineConfig({
  outDir: '../internal/site/dist',
  lang: 'en',
  title: 'c0de',
  description: 'Documentation and tutorials of c0de, the programming language in Minecraft',
  cleanUrls: true,
  lastUpdated: false,
  // Dark mode follows the operating system with CSS only (concept: color scheme), so the
  // script of VitePress' appearance switch isn't needed.
  appearance: false,
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
})
