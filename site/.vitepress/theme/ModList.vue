<script setup lang="ts">
import { useBinder } from './binder'

// The mods whose documentation is on the site, with their current versions and where to get
// them (for the home page).
const { t, navigation, link, label } = useBinder()
</script>

<template>
  <ul class="mods">
    <li v-for="mod in navigation.mods" :key="mod.id" class="mod">
      <h3 class="mod-name">
        {{ mod.name }} <span class="mod-version">{{ mod.version }}</span>
      </h3>
      <p>{{ label(mod.description) }}</p>
      <p class="mod-links">
        <a :href="`https://modrinth.com/mod/${mod.modrinth}`">{{ t.download }}</a>
        <a :href="`https://github.com/${mod.repository}`">{{ t.sourceCode }}</a>
        <a :href="link(mod.link)">{{ t.documentation }}</a>
      </p>
    </li>
  </ul>
</template>
