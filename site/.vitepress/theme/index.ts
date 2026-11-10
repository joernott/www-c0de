import type { Theme } from 'vitepress'
import BinderLayout from './BinderLayout.vue'
import './style.css'

// The ring binder theme. It replaces the default theme of VitePress completely.
export default {
  Layout: BinderLayout,
} satisfies Theme
