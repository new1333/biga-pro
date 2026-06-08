<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { EChartsOption, EChartsType } from 'echarts'
import { useData } from 'vitepress'

/**
 * Markdown 用法：
 *
 * <VizECharts
 *   height="320"
 *   aria-label="示例图表"
 *   :option="{
 *     xAxis: { type: 'category', data: ['T1', 'T2'] },
 *     yAxis: { type: 'value' },
 *     series: [{ type: 'line', data: [1, 2] }]
 *   }"
 * />
 *
 * 示例配置只用于说明 ECharts 接入方式，不代表真实数据。
 */

type DataSource = {
  name: string
  url?: string
  asOf?: string
  updatedAt?: string
  license?: string
}

const vizEChartsExampleOption: EChartsOption = {
  xAxis: { type: 'category', data: ['T1', 'T2'] },
  yAxis: { type: 'value' },
  series: [{ type: 'line', data: [1, 2] }]
}

const { isDark } = useData()

const props = withDefaults(
  defineProps<{
    option?: EChartsOption
    theme?: 'light' | 'dark' | string
    height?: number | string
    renderer?: 'canvas' | 'svg'
    autoresize?: boolean
    loading?: boolean
    ariaLabel?: string
    source?: DataSource
  }>(),
  {
    option: () => ({}),
    theme: undefined,
    height: 360,
    renderer: 'canvas',
    autoresize: true,
    loading: false,
    ariaLabel: '图表',
    source: undefined
  }
)

const resolvedTheme = computed(() => {
  if (props.theme) return props.theme
  return isDark.value ? 'dark' : 'light'
})

const chartEl = ref<HTMLElement | null>(null)
const normalizedHeight = computed(() =>
  typeof props.height === 'number' ? `${props.height}px` : props.height
)

let chart: EChartsType | null = null
let echartsModule: typeof import('echarts') | null = null
let resizeObserver: ResizeObserver | null = null
let mounted = false

async function renderChart() {
  if (!mounted || !chartEl.value) return
  echartsModule ??= await import('echarts')
  if (!mounted || !chartEl.value) return

  chart ??= echartsModule.init(chartEl.value, resolvedTheme.value, { renderer: props.renderer })
  chart.setOption(
    {
      aria: { enabled: true, label: { description: props.ariaLabel } },
      ...props.option
    },
    true
  )

  if (props.loading) chart.showLoading()
  else chart.hideLoading()

  if (props.autoresize && !resizeObserver && typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(() => chart?.resize())
    resizeObserver.observe(chartEl.value)
  }
}

function disposeChart() {
  resizeObserver?.disconnect()
  resizeObserver = null
  chart?.dispose()
  chart = null
}

watch(
  () => [props.option, props.loading, props.ariaLabel],
  () => void nextTick(renderChart),
  { deep: true }
)

watch(
  [resolvedTheme, () => props.renderer],
  () => {
    disposeChart()
    void nextTick(renderChart)
  }
)

onMounted(() => {
  mounted = true
  void nextTick(renderChart)
})

onBeforeUnmount(() => {
  mounted = false
  disposeChart()
})
</script>

<template>
  <figure class="viz-echarts">
    <div
      ref="chartEl"
      class="viz-echarts__canvas"
      :style="{ height: normalizedHeight }"
      role="img"
      :aria-label="ariaLabel"
    />
    <p v-if="source" class="viz-echarts__source">
      数据来源：{{ source.name }}<span v-if="source.asOf">（截至 {{ source.asOf }}）</span>
    </p>
  </figure>
</template>

<style scoped>
.viz-echarts {
  margin: 24px 0;
  padding: 18px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  background: var(--vp-c-bg-soft);
}

.viz-echarts__canvas {
  width: 100%;
  min-height: 240px;
}

.viz-echarts__source {
  margin: 10px 0 0;
  color: var(--vp-c-text-2);
  font-size: 13px;
  line-height: 1.6;
}
</style>
