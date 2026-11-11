<script setup lang="ts">
import { useBinder } from './binder'

// The lessons of a tutorial path, for its overview page: the pages of the current chapter.
const { t, chapter, link, label } = useBinder()
</script>

<template>
  <ol v-if="chapter?.pages?.length" class="lessons">
    <li v-for="lesson in chapter.pages" :key="lesson.link">
      <a :href="link(lesson.link)">{{ label(lesson.label) }}</a>
    </li>
  </ol>
  <p v-else class="lessons-empty">{{ t.noLessons }}</p>
</template>
