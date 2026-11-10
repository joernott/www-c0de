<script setup lang="ts">
import { ref, watch } from 'vue'
import { useBinder } from './binder'

// On tablets and phones, the tabs become a menu above the page. It is a <details> element,
// so it also works without JavaScript.
const { route, t, navigation, tab, chapter, link, label } = useBinder()

const menu = ref<HTMLDetailsElement>()
watch(
  () => route.path,
  () => menu.value?.removeAttribute('open'),
)
</script>

<template>
  <details ref="menu" class="menu">
    <summary class="menu-button">
      {{ t.menu }}<span v-if="tab"> · {{ label(chapter?.label ?? tab.label) }}</span>
    </summary>
    <nav class="menu-panel" :aria-label="t.tabs">
      <ul>
        <li>
          <a :href="link('/')" class="menu-main" style="--tab: var(--tab-home)">{{ t.home }}</a>
        </li>
        <li v-for="main in navigation.tabs" :key="main.id">
          <a
            :href="link(main.link)"
            class="menu-main"
            :style="{ '--tab': `var(--tab-${main.color})` }"
            :aria-current="tab?.id === main.id && !chapter ? 'page' : undefined"
          >
            {{ label(main.label) }}
          </a>
          <ul v-if="tab?.id === main.id" class="menu-chapters">
            <li v-for="c in main.chapters" :key="c.link">
              <a :href="link(c.link)" :aria-current="chapter?.link === c.link ? 'page' : undefined">
                {{ label(c.label) }}
              </a>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  </details>
</template>
