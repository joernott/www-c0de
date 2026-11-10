<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from 'vue'
import { useBinder } from './binder'

// The tabs at the right edge of the page: the house tab stays on top, the main tabs and the
// chapter tabs of the selected main tab scroll when they don't fit.
const { route, t, navigation, tab, chapter, atHome, link, label } = useBinder()

const scroller = ref<HTMLElement>()
const canScrollUp = ref(false)
const canScrollDown = ref(false)

function updateScrollButtons() {
  const el = scroller.value
  if (!el) return
  canScrollUp.value = el.scrollTop > 1
  canScrollDown.value = el.scrollTop + el.clientHeight < el.scrollHeight - 1
}

function scrollTabs(direction: 1 | -1) {
  const el = scroller.value
  if (!el) return
  el.scrollBy({ top: direction * el.clientHeight * 0.75, behavior: 'smooth' })
}

// The tab of the current page is scrolled to the middle of the column, so its neighbours
// are visible too. Only the column scrolls; scrollIntoView could move the page as well.
async function showCurrentTab() {
  await nextTick()
  const el = scroller.value
  const current = el?.querySelector<HTMLElement>('[aria-current="page"]')
  if (el && current) {
    el.scrollTop = current.offsetTop - (el.clientHeight - current.offsetHeight) / 2
  }
  updateScrollButtons()
}

onMounted(() => {
  showCurrentTab()
  new ResizeObserver(updateScrollButtons).observe(scroller.value!)
})
watch(() => route.path, showCurrentTab)

const isCurrentMain = (id: string) => tab.value?.id === id && !chapter.value
</script>

<template>
  <nav class="tabs" :aria-label="t.tabs">
    <div class="tabs-edge" aria-hidden="true" />
    <a
      :href="link('/')"
      class="tab tab-main tab-home"
      :class="{ 'tab-current': atHome }"
      :aria-current="atHome ? 'page' : undefined"
      style="--tab: var(--tab-home)"
    >
      <svg class="tab-house" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3 11.5 12 4l9 7.5V20a1 1 0 0 1-1 1h-5.5v-6h-5v6H4a1 1 0 0 1-1-1z" />
      </svg>
      <span>{{ t.home }}</span>
    </a>

    <div class="tabs-scroll-wrap">
      <button
        :style="{ visibility: canScrollUp ? 'visible' : 'hidden' }"
        type="button"
        class="tabs-scroll tabs-scroll-up"
        :aria-label="t.scrollUp"
        @click="scrollTabs(-1)"
      >
        ▲
      </button>
      <div ref="scroller" class="tabs-scroller" @scroll.passive="updateScrollButtons">
        <ul class="tabs-list">
          <li v-for="main in navigation.tabs" :key="main.id">
            <a
              :href="link(main.link)"
              class="tab tab-main"
              :class="{
                'tab-current': isCurrentMain(main.id),
                'tab-selected': tab?.id === main.id,
              }"
              :style="{ '--tab': `var(--tab-${main.color})` }"
              :aria-current="isCurrentMain(main.id) ? 'page' : undefined"
              :title="label(main.label)"
            >
              <span>{{ label(main.label) }}</span>
            </a>
            <ul v-if="tab?.id === main.id" class="tabs-chapters">
              <li
                v-for="(c, index) in main.chapters"
                :key="c.link"
                :class="{
                  'tabs-group-start':
                    index > 0 &&
                    c.group === 'handbook' &&
                    main.chapters[index - 1]?.group !== 'handbook',
                }"
              >
                <a
                  :href="link(c.link)"
                  class="tab tab-chapter"
                  :class="{ 'tab-current': chapter?.link === c.link }"
                  :style="{ '--tab': `var(--tab-${main.color})` }"
                  :aria-current="chapter?.link === c.link ? 'page' : undefined"
                  :title="label(c.label)"
                >
                  <svg
                    v-if="c.group === 'handbook'"
                    class="tab-book"
                    viewBox="0 0 24 24"
                    :aria-label="t.handbooks"
                    role="img"
                  >
                    <path
                      d="M5 3.5A1.5 1.5 0 0 1 6.5 2H19v16H6.5a1.5 1.5 0 0 0 0 3H19v1H6.5A2.5 2.5 0 0 1 4 19.5V5a1.5 1.5 0 0 1 1-1.5z"
                    />
                  </svg>
                  <span>{{ label(c.label) }}</span>
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <button
        :style="{ visibility: canScrollDown ? 'visible' : 'hidden' }"
        type="button"
        class="tabs-scroll tabs-scroll-down"
        :aria-label="t.scrollDown"
        @click="scrollTabs(1)"
      >
        ▼
      </button>
    </div>
  </nav>
</template>
