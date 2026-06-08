<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'

/**
 * Markdown 用法：
 *
 * <VizMermaid
 *   title="示例流程图"
 *   fallback-text="流程图暂时无法渲染"
 *   code="flowchart TD; A[开始] --> B[结束];"
 * />
 *
 * 示例代码只用于说明 Mermaid 渲染结构。
 */

type DataSource = {
  name: string
  url?: string
  asOf?: string
  updatedAt?: string
  license?: string
}

const vizMermaidExampleData = {
  title: '示例流程图',
  code: 'flowchart TD; A[开始] --> B[结束];',
  fallbackText: '流程图暂时无法渲染'
}

const props = withDefaults(
  defineProps<{
    code?: string
    title?: string
    caption?: string
    theme?: 'default' | 'neutral' | 'dark'
    zoomable?: boolean
    fallbackText?: string
    source?: DataSource
  }>(),
  {
    code: '',
    title: '',
    caption: '',
    theme: 'neutral',
    zoomable: true,
    fallbackText: '图示暂时无法渲染',
    source: undefined
  }
)

const svg = ref('')
const errorMessage = ref('')
const renderId = computed(() => `mermaid-${Math.random().toString(36).slice(2)}`)

async function renderMermaid() {
  if (!props.code || typeof window === 'undefined') return
  errorMessage.value = ''

  try {
    const mermaid = (await import('mermaid')).default
    mermaid.initialize({
      startOnLoad: false,
      theme: props.theme,
      securityLevel: 'strict'
    })
    const result = await mermaid.render(renderId.value, props.code)
    svg.value = result.svg
  } catch (error) {
    svg.value = ''
    errorMessage.value = error instanceof Error ? error.message : props.fallbackText
  }
}

watch(
  () => [props.code, props.theme],
  () => void nextTick(renderMermaid)
)

onMounted(() => void nextTick(renderMermaid))
</script>

<template>
  <figure class="viz-mermaid" :class="{ 'viz-mermaid--zoomable': zoomable }">
    <figcaption v-if="title" class="viz-mermaid__title">{{ title }}</figcaption>
    <div v-if="svg" class="viz-mermaid__canvas" v-html="svg" />
    <pre v-else class="viz-mermaid__fallback"><code>{{ errorMessage || fallbackText }}</code></pre>
    <p v-if="caption" class="viz-mermaid__caption">{{ caption }}</p>
    <p v-if="source" class="viz-mermaid__source">
      来源：{{ source.name }}<span v-if="source.asOf">（截至 {{ source.asOf }}）</span>
    </p>
  </figure>
</template>

<style scoped>
.viz-mermaid {
  margin: 24px 0;
  padding: 18px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  background: var(--vp-c-bg-soft);
}

.viz-mermaid__title {
  margin-bottom: 12px;
  color: var(--vp-c-text-1);
  font-weight: 700;
}

.viz-mermaid__canvas {
  overflow: auto;
  padding: 12px;
  border-radius: 10px;
  background: var(--vp-c-bg);
}

.viz-mermaid--zoomable .viz-mermaid__canvas :deep(svg) {
  max-width: none;
}

.viz-mermaid__fallback {
  margin: 0;
  padding: 14px;
  overflow-x: auto;
  border: 1px dashed var(--vp-c-divider);
  border-radius: 10px;
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg);
}

.viz-mermaid__caption,
.viz-mermaid__source {
  margin: 10px 0 0;
  color: var(--vp-c-text-2);
  font-size: 13px;
  line-height: 1.6;
}
</style>
