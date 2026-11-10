<script setup lang="ts">
import { useBinder } from './binder'
import PageNav from './PageNav.vue'
import RingSpine from './RingSpine.vue'
import SiteSearch from './SiteSearch.vue'
import SmallScreenMenu from './SmallScreenMenu.vue'
import TabColumn from './TabColumn.vue'

// The open ring binder: the spine with the rings on the left, the page in the middle and
// the tabs at its right edge. Smaller screens get the page with a menu above it.
const { t, notFound, source, untranslated, otherLanguage, otherPath, link } = useBinder()
</script>

<template>
  <div class="binder">
    <RingSpine />
    <div class="paper">
      <header class="paper-header">
        <SmallScreenMenu />
        <span v-if="source" class="page-source">{{ source }}</span>
        <SiteSearch />
        <a
          :href="otherPath"
          class="language-switch"
          :hreflang="otherLanguage"
          :lang="otherLanguage"
        >
          {{ t.otherLanguage }}
        </a>
      </header>
      <main class="paper-content">
        <div v-if="notFound" class="content">
          <h1>{{ t.notFoundTitle }}</h1>
          <p>{{ t.notFound }}</p>
          <p>
            <a :href="link('/')">{{ t.backHome }}</a>
          </p>
        </div>
        <template v-else>
          <p v-if="untranslated" class="untranslated" role="note">{{ t.untranslated }}</p>
          <Content class="content" :lang="untranslated ? 'en' : undefined" />
        </template>
      </main>
      <PageNav v-if="!notFound" />
      <footer class="paper-footer">
        <a :href="link('/legal-notice')">{{ t.legalNotice }}</a>
        <a :href="link('/privacy')">{{ t.privacy }}</a>
      </footer>
    </div>
    <TabColumn />
  </div>
</template>
