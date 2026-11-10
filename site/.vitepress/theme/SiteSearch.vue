<script setup lang="ts">
import { computed, ref, shallowRef, watch } from 'vue'
import { useData, useRouter } from 'vitepress'
import MiniSearch from 'minisearch'
import searchIndex from '@localSearchIndex'
import { useBinder } from './binder'

// The search field of the page: a combobox that searches the full text of all pages of the
// current language in the browser. The index is built by VitePress' local search and loaded
// when the field is used for the first time.
interface Result {
  id: string // the link of the section, e.g. /c0de/math/abs#example
  title: string
  titles: string[]
}

const { localeIndex } = useData()
const router = useRouter()
const { t } = useBinder()

const query = ref('')
const open = ref(false)
const active = ref(0)
const engine = shallowRef<MiniSearch<Result>>()
let loading: Promise<void> | undefined

async function load() {
  loading ??= (async () => {
    const data = await searchIndex[localeIndex.value]?.()
    if (data) {
      engine.value = MiniSearch.loadJSON<Result>(data.default, {
        fields: ['title', 'titles', 'text'],
        storeFields: ['title', 'titles'],
        searchOptions: { fuzzy: 0.2, prefix: true, boost: { title: 4, text: 2, titles: 1 } },
      })
    }
  })()
  return loading
}

// Another language has another index.
watch(localeIndex, () => {
  loading = undefined
  engine.value = undefined
})

const results = computed(() => {
  const q = query.value.trim()
  if (!engine.value || q.length < 2) return []
  return (engine.value.search(q) as unknown as Result[]).slice(0, 12)
})

watch(results, () => (active.value = 0))

function go(result: Result | undefined) {
  if (!result) return
  open.value = false
  query.value = ''
  router.go(result.id)
}

function onKey(event: KeyboardEvent) {
  if (event.key === 'ArrowDown') {
    active.value = Math.min(active.value + 1, results.value.length - 1)
    open.value = true
  } else if (event.key === 'ArrowUp') {
    active.value = Math.max(active.value - 1, 0)
  } else if (event.key === 'Enter') {
    go(results.value[active.value])
  } else if (event.key === 'Escape') {
    open.value = false
    return
  } else {
    return
  }
  event.preventDefault()
}
</script>

<template>
  <div
    class="search"
    @focusout="(e) => !($el as HTMLElement).contains(e.relatedTarget as Node) && (open = false)"
  >
    <label for="search-field" class="sr-only">{{ t.search }}</label>
    <input
      id="search-field"
      v-model="query"
      type="search"
      class="search-field"
      role="combobox"
      autocomplete="off"
      aria-autocomplete="list"
      aria-controls="search-results"
      :aria-expanded="open && results.length > 0"
      :aria-activedescendant="open && results.length ? `search-result-${active}` : undefined"
      :placeholder="t.search"
      @focus="load"
      @input="open = true"
      @keydown="onKey"
    />
    <ul
      v-show="open && query.trim().length >= 2"
      id="search-results"
      class="search-results"
      role="listbox"
      :aria-label="t.searchResults"
    >
      <li
        v-for="(r, i) in results"
        :id="`search-result-${i}`"
        :key="r.id"
        role="option"
        class="search-result"
        :class="{ 'search-result-active': i === active }"
        :aria-selected="i === active"
        @mousedown.prevent="go(r)"
        @mousemove="active = i"
      >
        <span class="search-result-path">{{ r.titles.join(' › ') }}</span>
        <span class="search-result-title">{{ r.title }}</span>
      </li>
      <li v-if="results.length === 0" class="search-empty" role="presentation">
        {{ t.searchNothing }}
      </li>
    </ul>
  </div>
</template>
