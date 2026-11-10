<script setup lang="ts">
import { computed } from 'vue'
import { useData, useRoute, withBase } from 'vitepress'
import { languageOf, pathIn } from './language'

// A placeholder layout until the ring binder is built in sprint 2.
const { page } = useData()
const route = useRoute()

const language = computed(() => languageOf(route.path))
const other = computed(() =>
  language.value === 'de'
    ? { href: pathIn(route.path, 'en'), label: 'English', lang: 'en' }
    : { href: pathIn(route.path, 'de'), label: 'Deutsch', lang: 'de' },
)
const notFound = computed(() =>
  language.value === 'de' ? 'Diese Seite gibt es nicht.' : 'This page does not exist.',
)
</script>

<template>
  <div class="min-h-screen bg-desk text-ink">
    <main class="mx-auto max-w-3xl bg-paper px-8 py-10 shadow-lg">
      <nav class="mb-6 text-right text-sm">
        <a :href="withBase(other.href)" :hreflang="other.lang" :lang="other.lang" class="underline">
          {{ other.label }}
        </a>
      </nav>
      <p v-if="page.isNotFound" class="text-lg">{{ notFound }}</p>
      <Content v-else class="content" />
    </main>
  </div>
</template>
