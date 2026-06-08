<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { getGlossaryTerm } from '../.vitepress/theme/term-glossary'

/**
 * Markdown 用法：
 *
 * <InvestTerm
 *   id="pe"
 *   term="市盈率"
 *   definition="市盈率（PE）是股价相对于每股收益的倍数，用来观察估值高低。"
 * />
 *
 * 示例数据只用于术语展示，不构成投资判断。
 */

type DataSource = {
  name: string
  url?: string
  asOf?: string
  updatedAt?: string
  license?: string
}

type TermMode = 'tooltip' | 'inline' | 'card' | 'link'
type TermLevel = 'beginner' | 'intermediate' | 'advanced'
type TooltipPlacement = 'above' | 'below'

const props = withDefaults(
  defineProps<{
    id?: string
    term?: string
    definition?: string
    aliases?: string[]
    mode?: TermMode
    level?: TermLevel
    href?: string
    source?: DataSource
    related?: string[]
  }>(),
  {
    id: '',
    definition: '',
    aliases: () => [],
    mode: 'tooltip',
    href: '',
    source: undefined,
    related: () => []
  }
)

const levelTextMap: Record<TermLevel, string> = {
  beginner: '入门',
  intermediate: '进阶',
  advanced: '高级'
}

const glossaryTerm = computed(() => getGlossaryTerm(props.id))

const resolvedTerm = computed(() => props.term || glossaryTerm.value?.name || props.id || '')

const resolvedDefinition = computed(() => props.definition || glossaryTerm.value?.description || '')

const resolvedAliases = computed(() => {
  if (props.aliases.length) return props.aliases
  return glossaryTerm.value?.aliases ?? []
})

const resolvedLevel = computed<TermLevel>(() => props.level || glossaryTerm.value?.difficulty || 'beginner')

const triggerRef = ref<HTMLElement | null>(null)
const bubbleRef = ref<HTMLElement | null>(null)
const isTooltipVisible = ref(false)
const isTooltipReady = ref(false)
const tooltipPlacement = ref<TooltipPlacement>('above')
const tooltipStyle = ref({
  top: '-9999px',
  left: '0px'
})

const TOOLTIP_GAP = 10
const VIEWPORT_MARGIN = 12
const MAX_TOOLTIP_Z_INDEX = '2147483647'

let rafId = 0
let hasViewportListeners = false

const tooltipId = computed(() => {
  const raw = props.id || resolvedTerm.value
  const normalized = raw.toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-|-$/g, '')
  return `invest-term-${normalized || 'item'}`
})

const sourceText = computed(() => {
  if (!props.source) return ''
  return [props.source.name, props.source.asOf ? `截至 ${props.source.asOf}` : '']
    .filter(Boolean)
    .join(' · ')
})

function updateTooltipPosition() {
  if (typeof window === 'undefined' || !triggerRef.value || !bubbleRef.value) return

  const triggerRect = triggerRef.value.getBoundingClientRect()
  const bubbleRect = bubbleRef.value.getBoundingClientRect()
  const bubbleWidth = bubbleRect.width
  const bubbleHeight = bubbleRect.height
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight

  const centeredLeft = triggerRect.left + (triggerRect.width / 2) - (bubbleWidth / 2)
  const maxLeft = Math.max(VIEWPORT_MARGIN, viewportWidth - bubbleWidth - VIEWPORT_MARGIN)
  const left = Math.min(Math.max(centeredLeft, VIEWPORT_MARGIN), maxLeft)

  const topAbove = triggerRect.top - bubbleHeight - TOOLTIP_GAP
  const topBelow = triggerRect.bottom + TOOLTIP_GAP
  const canPlaceAbove = topAbove >= VIEWPORT_MARGIN
  const maxTop = Math.max(VIEWPORT_MARGIN, viewportHeight - bubbleHeight - VIEWPORT_MARGIN)

  tooltipPlacement.value = canPlaceAbove ? 'above' : 'below'
  tooltipStyle.value = {
    top: `${Math.min(Math.max(canPlaceAbove ? topAbove : topBelow, VIEWPORT_MARGIN), maxTop)}px`,
    left: `${left}px`
  }
  isTooltipReady.value = true
}

function scheduleTooltipPosition() {
  if (typeof window === 'undefined') return
  if (rafId) window.cancelAnimationFrame(rafId)
  rafId = window.requestAnimationFrame(() => {
    rafId = 0
    updateTooltipPosition()
  })
}

function addViewportListeners() {
  if (typeof window === 'undefined' || hasViewportListeners) return
  window.addEventListener('resize', scheduleTooltipPosition)
  window.addEventListener('scroll', scheduleTooltipPosition, true)
  hasViewportListeners = true
}

function removeViewportListeners() {
  if (typeof window === 'undefined' || !hasViewportListeners) return
  window.removeEventListener('resize', scheduleTooltipPosition)
  window.removeEventListener('scroll', scheduleTooltipPosition, true)
  hasViewportListeners = false
}

function showTooltip() {
  if (isTooltipVisible.value) {
    scheduleTooltipPosition()
    return
  }

  isTooltipReady.value = false
  isTooltipVisible.value = true
}

function hideTooltip() {
  isTooltipVisible.value = false
  isTooltipReady.value = false
}

watch(isTooltipVisible, async (visible) => {
  if (!visible) {
    removeViewportListeners()
    if (typeof window !== 'undefined' && rafId) {
      window.cancelAnimationFrame(rafId)
      rafId = 0
    }
    return
  }

  addViewportListeners()
  await nextTick()
  updateTooltipPosition()
})

onBeforeUnmount(() => {
  removeViewportListeners()
  if (typeof window !== 'undefined' && rafId) {
    window.cancelAnimationFrame(rafId)
  }
})
</script>

<template>
  <span v-if="mode === 'tooltip'" class="invest-term">
    <span
      ref="triggerRef"
      class="invest-term__trigger"
      tabindex="0"
      :aria-describedby="tooltipId"
      :aria-expanded="isTooltipVisible"
      @mouseenter="showTooltip"
      @mouseleave="hideTooltip"
      @focus="showTooltip"
      @blur="hideTooltip"
    >
      <slot>{{ resolvedTerm }}</slot>
    </span>
    <Teleport to="body">
      <span
        v-show="isTooltipVisible"
        :id="tooltipId"
        ref="bubbleRef"
        class="invest-term__bubble"
        :class="{
          'invest-term__bubble--visible': isTooltipVisible && isTooltipReady,
          'invest-term__bubble--below': tooltipPlacement === 'below'
        }"
        :style="{
          ...tooltipStyle,
          zIndex: MAX_TOOLTIP_Z_INDEX,
          visibility: isTooltipReady ? 'visible' : 'hidden'
        }"
        role="tooltip"
      >
        <strong>{{ resolvedTerm }}</strong>
        <span v-if="resolvedDefinition">{{ resolvedDefinition }}</span>
        <span v-if="resolvedAliases.length" class="invest-term__muted">别名：{{ resolvedAliases.join('、') }}</span>
      </span>
    </Teleport>
  </span>

  <span v-else-if="mode === 'inline'" class="invest-term-inline">
    <strong>{{ resolvedTerm }}</strong>
    <span v-if="resolvedDefinition">：{{ resolvedDefinition }}</span>
    <a v-if="href" :href="href">详情</a>
  </span>

  <a v-else-if="mode === 'link' && href" class="invest-term-link" :href="href">
    <slot>{{ resolvedTerm }}</slot>
  </a>

  <article v-else class="invest-term-card">
    <header>
      <div>
        <h3>{{ resolvedTerm }}</h3>
        <p v-if="resolvedAliases.length">{{ resolvedAliases.join(' / ') }}</p>
      </div>
      <span>{{ levelTextMap[resolvedLevel] }}</span>
    </header>
    <p>{{ resolvedDefinition || '暂无术语解释，请通过 definition 传入。' }}</p>
    <footer v-if="href || related.length || sourceText">
      <a v-if="href" :href="href">术语详情</a>
      <span v-if="related.length">相关：{{ related.join('、') }}</span>
      <span v-if="sourceText">来源：{{ sourceText }}</span>
    </footer>
  </article>
</template>

<style scoped>
.invest-term {
  position: relative;
  display: inline-flex;
}

.invest-term__trigger,
.invest-term-link {
  border-bottom: 1px dashed var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
  cursor: help;
  text-decoration: none;
}

.invest-term__bubble {
  position: fixed;
  display: grid;
  width: min(320px, calc(100vw - 24px));
  gap: 6px;
  padding: 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  background: var(--vp-c-bg-elv);
  box-shadow: var(--vp-shadow-3);
  color: var(--vp-c-text-1);
  font-size: 13px;
  line-height: 1.6;
  opacity: 0;
  pointer-events: none;
  transform: translateY(4px);
  transition: opacity 0.16s ease, transform 0.16s ease;
}

.invest-term__bubble--visible {
  opacity: 1;
  transform: translateY(0);
}

.invest-term__bubble--below {
  transform: translateY(-4px);
}

.invest-term__bubble--visible.invest-term__bubble--below {
  transform: translateY(0);
}

.invest-term__muted,
.invest-term-inline {
  color: var(--vp-c-text-2);
  font-size: 13px;
}

.invest-term-card {
  margin: 20px 0;
  padding: 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  background: var(--vp-c-bg-soft);
}

.invest-term-card header {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.invest-term-card h3,
.invest-term-card p {
  margin: 0;
}

.invest-term-card header p,
.invest-term-card footer {
  color: var(--vp-c-text-2);
  font-size: 13px;
}

.invest-term-card header span {
  height: fit-content;
  border-radius: 999px;
  padding: 4px 10px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  font-size: 12px;
}

.invest-term-card > p {
  margin-top: 12px;
  line-height: 1.7;
}

.invest-term-card footer {
  display: grid;
  gap: 6px;
  margin-top: 12px;
}
</style>
