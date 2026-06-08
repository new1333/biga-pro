<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { EChartsOption, EChartsType } from 'echarts'
import { useData } from 'vitepress'

/**
 * Markdown 用法：
 *
 * <VizChart
 *   type="line"
 *   title="示例趋势图"
 *   x-key="date"
 *   :y-keys="['value']"
 *   :data="[
 *     { date: '2024-Q1', value: 10 },
 *     { date: '2024-Q2', value: 12 }
 *   ]"
 * />
 *
 * 示例数据只用于说明图表结构，不代表真实行情。
 */

type DataSource = {
  name: string
  url?: string
  asOf?: string
  updatedAt?: string
  license?: string
}

type ChartType = 'line' | 'bar' | 'area' | 'pie' | 'scatter'

const vizChartExampleData = [
  { date: '2024-Q1', value: 10 },
  { date: '2024-Q2', value: 12 },
  { date: '2024-Q3', value: 11 }
]

const { isDark } = useData()

const darkColors = ['#60a5fa', '#4ade80', '#fbbf24', '#f87171', '#a78bfa', '#2dd4bf']
const lightColors = ['#2f6fdd', '#16a34a', '#f59e0b', '#ef4444', '#8b5cf6', '#14b8a6']

function resolveCssVar(name: string): string {
  if (typeof document === 'undefined') return '#666'
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || '#666'
}

const props = withDefaults(
  defineProps<{
    type?: ChartType
    data?: Record<string, unknown>[]
    xKey?: string
    yKeys?: string[]
    title?: string
    caption?: string
    height?: number | string
    source?: DataSource
    emptyText?: string
  }>(),
  {
    type: 'line',
    data: () => [],
    xKey: '',
    yKeys: () => [],
    title: '',
    caption: '',
    height: 320,
    source: undefined,
    emptyText: '暂无数据'
  }
)

const chartEl = ref<HTMLElement | null>(null)
const normalizedHeight = computed(() =>
  typeof props.height === 'number' ? `${props.height}px` : props.height
)

let chart: EChartsType | null = null
let echartsModule: typeof import('echarts') | null = null
let resizeObserver: ResizeObserver | null = null
let mounted = false

const hasData = computed(() => props.data.length > 0 && props.xKey && props.yKeys.length > 0)

function valueOf(row: Record<string, unknown>, key: string) {
  const value = row[key]
  return typeof value === 'number' && Number.isFinite(value) ? value : null
}

function buildOption(): EChartsOption {
  const dark = isDark.value
  const textColor = resolveCssVar('--vp-c-text-2')
  const dividerColor = resolveCssVar('--vp-c-divider')
  const seriesColors = dark ? darkColors : lightColors

  const baseTooltip = {
    backgroundColor: dark ? '#1e1e2e' : '#fff',
    borderColor: dark ? '#3a3a4a' : '#e5e7eb',
    textStyle: { color: dark ? '#e2e8f0' : '#334155' }
  }

  const primaryY = props.yKeys[0]

  if (props.type === 'pie') {
    return {
      title: props.title
        ? { text: props.title, left: 'center', textStyle: { color: textColor } }
        : undefined,
      color: seriesColors,
      tooltip: { trigger: 'item', ...baseTooltip },
      legend: { textStyle: { color: textColor } },
      series: [
        {
          type: 'pie',
          radius: ['35%', '65%'],
          data: props.data.map((row) => ({
            name: String(row[props.xKey] ?? ''),
            value: valueOf(row, primaryY)
          }))
        }
      ],
      aria: { enabled: true }
    }
  }

  return {
    title: props.title
      ? { text: props.title, left: 0, textStyle: { fontSize: 15, color: textColor } }
      : undefined,
    color: seriesColors,
    tooltip: { trigger: 'axis', ...baseTooltip },
    legend: { top: props.title ? 30 : 0, textStyle: { color: textColor } },
    grid: { left: 44, right: 18, top: props.title ? 70 : 40, bottom: 38 },
    xAxis: {
      type: 'category',
      data: props.data.map((row) => String(row[props.xKey] ?? '')),
      axisLabel: { color: textColor },
      axisLine: { lineStyle: { color: dividerColor } },
      axisTick: { lineStyle: { color: dividerColor } }
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: textColor },
      splitLine: { lineStyle: { color: dividerColor } },
      axisLine: { lineStyle: { color: dividerColor } }
    },
    series: props.yKeys.map((key) => ({
      name: key,
      type: props.type === 'area' ? 'line' : props.type,
      smooth: props.type === 'line' || props.type === 'area',
      areaStyle: props.type === 'area' ? {} : undefined,
      data: props.data.map((row) => valueOf(row, key))
    })),
    aria: { enabled: true }
  }
}

async function renderChart() {
  if (!mounted || !chartEl.value || !hasData.value) return
  echartsModule ??= await import('echarts')
  if (!mounted || !chartEl.value) return
  chart ??= echartsModule.init(chartEl.value)
  chart.setOption(buildOption(), true)

  if (!resizeObserver && typeof ResizeObserver !== 'undefined') {
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
  () => [props.type, props.data, props.xKey, props.yKeys, props.title],
  () => void nextTick(renderChart),
  { deep: true }
)

watch(isDark, () => {
  if (hasData.value) void nextTick(renderChart)
})

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
  <figure class="viz-chart">
    <div v-if="!hasData" class="viz-chart__empty">{{ emptyText }}</div>
    <div v-else ref="chartEl" class="viz-chart__canvas" :style="{ height: normalizedHeight }" />
    <figcaption v-if="caption" class="viz-chart__caption">{{ caption }}</figcaption>
    <p v-if="source" class="viz-chart__source">
      数据来源：{{ source.name }}<span v-if="source.asOf">（截至 {{ source.asOf }}）</span>
    </p>
  </figure>
</template>

<style scoped>
.viz-chart {
  margin: 24px 0;
  padding: 18px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  background: var(--vp-c-bg-soft);
}

.viz-chart__canvas {
  width: 100%;
  min-height: 240px;
}

.viz-chart__empty {
  display: grid;
  min-height: 180px;
  place-items: center;
  border: 1px dashed var(--vp-c-divider);
  border-radius: 10px;
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg);
}

.viz-chart__caption,
.viz-chart__source {
  margin: 10px 0 0;
  color: var(--vp-c-text-2);
  font-size: 13px;
  line-height: 1.6;
}
</style>
