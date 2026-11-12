<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue'
import type { ModelViewerElement } from '@google/model-viewer'
import { useBinder } from './binder'

// A program as text and as a 3D model of its sheet (task 8.4); see .vitepress/programs.ts. The
// text is the default and all there is without JavaScript or WebGL. The 3D view loads
// <model-viewer> only when the reader switches to it; the choice is kept for the next pages.
const props = defineProps<{ scene: string; poster?: string }>()
const { t } = useBinder()

interface Labels {
  program: string
  width: number
  lines: number
  blocks: [number, number, string][]
}

const preference = 'c0de-program-view'
const available = ref(false)
const view = ref<'text' | '3d'>('text')
const loaded = ref(false)
const failed = ref(false)
const reducedMotion = ref(false)
const labels = ref<Labels>()
const viewer = ref<ModelViewerElement>()
const tip = ref<{ text: string; x: number; y: number }>()

// The camera looks at the part of the sheet that the program uses (from the edge to its last
// block), from the south and above, at a distance that fits it into the view; zooming out shows
// the whole sheet.
const camera = computed(() => {
  if (!labels.value) return undefined
  const used = Math.max(12, ...labels.value.blocks.map(([x]) => x + 2))
  const depth = labels.value.lines
  const radius = Math.max(1.25 * used, 1.2 * depth) * 1.25
  const round = (v: number) => Math.round(v * 100) / 100
  return {
    target: `${round(used / 2)}m 0m ${round(depth / 2)}m`,
    orbit: `0deg 50deg ${round(radius)}m`,
    max: `auto 85deg ${round(Math.max(radius, 1.25 * labels.value.width * 1.1) * 1.5)}m`,
  }
})

function webgl(): boolean {
  try {
    return !!document.createElement('canvas').getContext('webgl2')
  } catch {
    return false
  }
}

onMounted(() => {
  available.value = webgl()
  reducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  let stored: string | null = null
  try {
    stored = localStorage.getItem(preference)
  } catch {
    // no storage: the text stays the default
  }
  if (available.value && stored === '3d') void show('3d', false)
})

async function show(next: 'text' | '3d', remember = true) {
  view.value = next
  if (remember) {
    try {
      localStorage.setItem(preference, next)
    } catch {
      // the choice is only kept for this page
    }
  }
  if (next !== '3d' || loaded.value) return
  try {
    const [, response] = await Promise.all([
      import('@google/model-viewer'),
      fetch(`${props.scene}.json`),
    ])
    if (!response.ok) throw new Error(`${response.status}`)
    labels.value = (await response.json()) as Labels
    loaded.value = true
    await nextTick()
  } catch {
    failed.value = true
  }
}

// label returns the text of the block (or the number of the line) under a point of the view.
function label(clientX: number, clientY: number): string | undefined {
  const hit = viewer.value?.positionAndNormalFromPoint(clientX, clientY)
  if (!hit || !labels.value) return undefined
  // a point on the surface, moved a little into the block it belongs to
  const x = Math.floor(hit.position.x - hit.normal.x * 0.01)
  const y = Math.floor(hit.position.y - hit.normal.y * 0.01)
  const z = Math.floor(hit.position.z - hit.normal.z * 0.01)
  if (y >= 0) return labels.value.blocks.find(([bx, bz]) => bx === x && bz === z)?.[2]
  if (x === 2 && labels.value.blocks.some(([, bz]) => bz === z)) return t.value.programLine(z)
  return undefined
}

function point(event: PointerEvent) {
  const text = label(event.clientX, event.clientY)
  const box = viewer.value?.getBoundingClientRect()
  tip.value =
    text && box ? { text, x: event.clientX - box.left, y: event.clientY - box.top } : undefined
}
</script>

<template>
  <div class="program-view">
    <div v-if="available" class="program-view-switch" role="group" :aria-label="t.programView">
      <button type="button" :aria-pressed="view === 'text'" @click="show('text')">
        {{ t.programText }}
      </button>
      <button type="button" :aria-pressed="view === '3d'" @click="show('3d')">
        {{ t.program3d }}
      </button>
    </div>
    <div v-show="view === 'text'">
      <slot />
    </div>
    <div v-if="view === '3d'" class="program-view-3d">
      <p v-if="failed" class="program-view-note">{{ t.program3dFailed }}</p>
      <template v-else-if="loaded && labels">
        <model-viewer
          ref="viewer"
          :src="`${scene}.glb`"
          :poster="poster"
          :alt="t.program3dAlt(labels.program)"
          camera-controls
          :camera-target="camera?.target"
          :camera-orbit="camera?.orbit"
          min-camera-orbit="auto 0deg 2m"
          :max-camera-orbit="camera?.max"
          field-of-view="30deg"
          interaction-prompt="none"
          shadow-intensity="0"
          :interpolation-decay="reducedMotion ? 1000 : 50"
          @pointermove="point"
          @pointerdown="point"
          @pointerleave="tip = undefined"
        >
          <span
            v-if="tip"
            class="program-view-tip"
            :style="{ left: `${tip.x}px`, top: `${tip.y}px` }"
            >{{ tip.text }}</span
          >
        </model-viewer>
        <p class="program-view-note">{{ t.program3dHelp }}</p>
      </template>
      <p v-else class="program-view-note">{{ t.program3dLoading }}</p>
    </div>
  </div>
</template>
