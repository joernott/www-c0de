<script setup lang="ts">
import { useBinder } from './binder'

// The main tabs of the binder with the number of their chapters (for the home page).
const { t, navigation, link, label } = useBinder()
</script>

<template>
  <ul class="tab-overview">
    <li
      v-for="tab in navigation.tabs"
      :key="tab.id"
      :style="{ '--tab': `var(--tab-${tab.color})` }"
    >
      <a :href="link(tab.link)">{{ label(tab.label) }}</a>
      <span class="tab-overview-count">{{ t.chapterCount(tab.chapters.length) }}</span>
    </li>
  </ul>
</template>
