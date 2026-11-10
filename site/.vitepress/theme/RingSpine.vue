<script setup lang="ts">
// The spine of the open binder: the inside of the cover, the ring mechanism and the rings,
// which reach over the left edge of the paper into its punched holes. Decoration only.
const rings = ['14%', '38%', '62%', '86%']
</script>

<template>
  <div class="spine" aria-hidden="true">
    <div class="spine-cover" />
    <div class="spine-mechanism" />
    <svg
      v-for="(top, i) in rings"
      :key="top"
      class="spine-ring"
      :style="{ top }"
      viewBox="0 0 112 48"
      width="112"
      height="48"
    >
      <defs>
        <linearGradient :id="`ring-metal-${i}`" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="var(--color-metal-light)" />
          <stop offset="0.45" stop-color="var(--color-metal)" />
          <stop offset="1" stop-color="var(--color-metal-dark)" />
        </linearGradient>
      </defs>
      <!-- the punched hole in the paper -->
      <circle cx="84" cy="24" r="11" class="spine-hole" />
      <!-- the shadow of the ring on the paper -->
      <rect x="22" y="22" width="60" height="13" rx="6.5" class="spine-shadow" />
      <!-- the ring, from the mechanism into the hole -->
      <rect x="14" y="17.5" width="72" height="13" rx="6.5" :fill="`url(#ring-metal-${i})`" />
      <ellipse cx="84" cy="24" rx="3.5" ry="6" class="spine-ring-end" />
    </svg>
  </div>
</template>
