import type { Theme } from 'vitepress'
import BinderLayout from './BinderLayout.vue'
import LessonList from './LessonList.vue'
import ModList from './ModList.vue'
import ProgramView from './ProgramView.vue'
import TabOverview from './TabOverview.vue'
import './style.css'

// The ring binder theme. It replaces the default theme of VitePress completely.
export default {
  Layout: BinderLayout,
  // components for the Markdown of the home page and of the overview pages of the tutorials,
  // and the 3D views of the programs
  enhanceApp({ app }) {
    app.component('LessonList', LessonList)
    app.component('ModList', ModList)
    app.component('ProgramView', ProgramView)
    app.component('TabOverview', TabOverview)
  },
} satisfies Theme
