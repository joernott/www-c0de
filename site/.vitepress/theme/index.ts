import type { Theme } from 'vitepress'
import BinderLayout from './BinderLayout.vue'
import ModList from './ModList.vue'
import TabOverview from './TabOverview.vue'
import './style.css'

// The ring binder theme. It replaces the default theme of VitePress completely.
export default {
  Layout: BinderLayout,
  // components for the Markdown of the home page
  enhanceApp({ app }) {
    app.component('ModList', ModList)
    app.component('TabOverview', TabOverview)
  },
} satisfies Theme
