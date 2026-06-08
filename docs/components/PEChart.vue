<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { EChartsType } from 'echarts'
import { useData } from 'vitepress'

/**
 * Markdown 用法：
 *
 * <PEChart
 *   title="市盈率趋势"
 *   :data="[
 *     { label: '2024-Q1', pe: 14.8, industryPe: 16.2 },
 *     { label: '2024-Q2', pe: 15.6, industryPe: 16.7 }
 *   ]"
 *   :source="{ name: '示例口径：页面作者整理', asOf: '2024-06-30' }"
 * />
 *
 * 示例数据说明：
 * 市盈率（PE，股价相对于每股收益的倍数）示例只用于展示组件数据结构，
 * 不代表任何真实证券、指数或投资建议。
 */

type DataSource = {
  name: string
  url?: string
  asOf?: string
  updatedAt?: string
  license?: string
}

type PEChartPoint = {
  label: string
  pe: number | null
  industryPe?: number | null
  marketPe?: number | null
  note?: string
}

type Renderer = 'canvas' | 'svg'

const peChartExampleData: PEChartPoint[] = [
  { label: '2024-Q1', pe: 14.8, industryPe: 16.2, marketPe: 15.4 },
  { label: '2024-Q2', pe: 15.6, industryPe: 16.7, marketPe: 15.9 },
  { label: '2024-Q3', pe: 13.9, industryPe: 15.8, marketPe: 14.7 }
]

const { isDark } = useData()

const darkSeriesColors = ['#60a5fa', '#4ade80', '#fbbf24']
const lightSeriesColors = ['#2f6fdd', '#16a34a', '#f59e0b']

function resolveCssVar(name: string): string {
  if (typeof document === 'undefined') return '#666'
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || '#666'
}

const props = withDefaults(
  defineProps<{
    data?: PEChartPoint[]
    title?: string
    caption?: string
    height?: number | string
    theme?: 'light' | 'dark' | string
    renderer?: Renderer
    emptyText?: string
    ariaLabel?: string
    source?: DataSource
    showLegend?: boolean
  }>(),
  {
    data: () => [],
    title: '市盈率（PE）趋势',
    caption: '',
    height: 320,
    theme: undefined,
    renderer: 'canvas',
    emptyText: '暂无市盈率数据',
    ariaLabel: '',
    source: undefined,
    showLegend: true
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
let isMounted = false

const hasPeData = computed(() =>
  props.data.some((point) =>
    [point.pe, point.industryPe, point.marketPe].some(isFiniteNumber)
  )
)

const chartAriaLabel = computed(() => {
  if (props.ariaLabel) return props.ariaLabel
  return `${props.title}，共 ${props.data.length} 个观察点`
})

const sourceText = computed(() => {
  if (!props.source) return ''
  return [
    props.source.name,
    props.source.asOf ? `截至 ${props.source.asOf}` : '',
    props.source.updatedAt ? `更新于 ${props.source.updatedAt}` : '',
    props.source.license ? `授权：${props.source.license}` : ''
  ]
    .filter(Boolean)
    .join(' · ')
})

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value)
}

function formatPeValue(value: unknown) {
  return isFiniteNumber(value) ? `${value.toFixed(2)} 倍` : '--'
}

function seriesData(key: keyof Pick<PEChartPoint, 'pe' | 'industryPe' | 'marketPe'>) {
  return props.data.map((point) => (isFiniteNumber(point[key]) ? point[key] : null))
}

function hasSeries(key: keyof Pick<PEChartPoint, 'pe' | 'industryPe' | 'marketPe'>) {
  return props.data.some((point) => isFiniteNumber(point[key]))
}

function buildOption() {
  const dark = isDark.value
  const textColor = resolveCssVar('--vp-c-text-2')
  const dividerColor = resolveCssVar('--vp-c-divider')
  const seriesColors = dark ? darkSeriesColors : lightSeriesColors

  const categories = props.data.map((point) => point.label)
  const series = []

  if (hasSeries('pe')) {
    series.push({
      name: '证券 PE',
      type: 'line',
      smooth: true,
      connectNulls: false,
      symbolSize: 7,
      data: seriesData('pe'),
      lineStyle: { width: 3 },
      emphasis: { focus: 'series' }
    })
  }

  if (hasSeries('industryPe')) {
    series.push({
      name: '行业 PE',
      type: 'line',
      smooth: true,
      connectNulls: false,
      symbol: 'circle',
      symbolSize: 5,
      data: seriesData('industryPe'),
      lineStyle: { width: 2, type: 'dashed' },
      emphasis: { focus: 'series' }
    })
  }

  if (hasSeries('marketPe')) {
    series.push({
      name: '市场 PE',
      type: 'line',
      smooth: true,
      connectNulls: false,
      symbol: 'diamond',
      symbolSize: 5,
      data: seriesData('marketPe'),
      lineStyle: { width: 2, type: 'dotted' },
      emphasis: { focus: 'series' }
    })
  }

  return {
    color: seriesColors,
    tooltip: {
      trigger: 'axis',
      valueFormatter: (value: unknown) => formatPeValue(value),
      backgroundColor: dark ? '#1e1e2e' : '#fff',
      borderColor: dark ? '#3a3a4a' : '#e5e7eb',
      textStyle: { color: dark ? '#e2e8f0' : '#334155' }
    },
    legend: {
      show: props.showLegend,
      top: 0,
      textStyle: { color: textColor }
    },
    grid: { left: 44, right: 18, top: props.showLegend ? 48 : 18, bottom: 42 },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: categories,
      axisLabel: { color: textColor },
      axisLine: { lineStyle: { color: dividerColor } },
      axisTick: { lineStyle: { color: dividerColor } }
    },
    yAxis: {
      type: 'value',
      name: '倍',
      nameTextStyle: { color: textColor },
      min: 0,
      axisLabel: {
        color: textColor,
        formatter: '{value}'
      },
      splitLine: { lineStyle: { color: dividerColor } },
      axisLine: { lineStyle: { color: dividerColor } }
    },
    series,
    aria: {
      enabled: true,
      label: {
        description: chartAriaLabel.value
      }
    }
  }
}

async function renderChart() {
  if (!isMounted || !chartEl.value || !hasPeData.value) return

  echartsModule ??= await import('echarts')
  if (!isMounted || !chartEl.value) return

  chart ??= echartsModule.init(chartEl.value, resolvedTheme.value, {
    renderer: props.renderer
  })
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
  () => [props.data, props.title, props.caption, props.showLegend],
  () => {
    if (!hasPeData.value) {
      chart?.clear()
      return
    }
    void nextTick(renderChart)
  },
  { deep: true }
)

watch(
  [resolvedTheme, () => props.renderer],
  () => {
    disposeChart()
    void nextTick(renderChart)
  }
)

watch(isDark, () => {
  if (hasPeData.value) void nextTick(renderChart)
})

onMounted(() => {
  isMounted = true
  void nextTick(renderChart)
})

onBeforeUnmount(() => {
  isMounted = false
  disposeChart()
})
</script>

<template>
  <figure class="pe-chart" role="group" :aria-label="chartAriaLabel">
    <figcaption v-if="title" class="pe-chart__title">{{ title }}</figcaption>

    <div v-if="!hasPeData" class="pe-chart__empty" role="note">
      {{ emptyText }}
    </div>
    <div
      v-else
      ref="chartEl"
      class="pe-chart__canvas"
      :style="{ height: normalizedHeight }"
      role="img"
      :aria-label="chartAriaLabel"
    />

    <p v-if="caption" class="pe-chart__caption">{{ caption }}</p>
    <p v-if="sourceText" class="pe-chart__source">数据来源：{{ sourceText }}</p>
  </figure>
</template>

<style scoped>
.pe-chart {
  margin: 24px 0;
  padding: 18px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  background: var(--vp-c-bg-soft);
}

.pe-chart__title {
  margin-bottom: 12px;
  color: var(--vp-c-text-1);
  font-size: 16px;
  font-weight: 700;
}

.pe-chart__canvas {
  width: 100%;
  min-height: 240px;
}

.pe-chart__empty {
  display: grid;
  min-height: 180px;
  place-items: center;
  border: 1px dashed var(--vp-c-divider);
  border-radius: 10px;
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg);
}

.pe-chart__caption,
.pe-chart__source {
  margin: 10px 0 0;
  color: var(--vp-c-text-2);
  font-size: 13px;
  line-height: 1.6;
}
</style>
