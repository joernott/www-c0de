<script setup lang="ts">
import { computed } from 'vue'
import { useBinder } from './binder'
import { neighbours } from './navigation'
import { texts } from './texts'

// The links to the previous and the next page at the bottom of the page.
const { route, t, navigation, link, label } = useBinder()

const home = { en: texts.en.home, de: texts.de.home }
const pages = computed(() => neighbours(navigation.value, home, route.path))
</script>

<template>
  <nav v-if="pages.previous || pages.next" class="page-nav" :aria-label="t.pages">
    <a v-if="pages.previous" :href="link(pages.previous.link)" class="page-nav-link" rel="prev">
      <span class="page-nav-hint">← {{ t.previous }}</span>
      <span class="page-nav-title">{{ label(pages.previous.label) }}</span>
    </a>
    <span v-else />
    <a
      v-if="pages.next"
      :href="link(pages.next.link)"
      class="page-nav-link page-nav-next"
      rel="next"
    >
      <span class="page-nav-hint">{{ t.next }} →</span>
      <span class="page-nav-title">{{ label(pages.next.label) }}</span>
    </a>
  </nav>
</template>
