<script setup lang="ts">
import { computed } from 'vue'

/**
 * Markdown 用法：
 *
 * <InvestMetricBadge label="市盈率（PE）" :value="12.5" unit="倍" tone="neutral" />
 *
 * 示例数据只用于说明指标展示，不构成买卖判断。
 */

type DataSource = {
  name: string
  url?: string
  asOf?: string
  updatedAt?: string
  license?: string
}

const investMetricBadgeExampleData = {
  label: '市盈率（PE）',
  value: 12.5,
  unit: '倍',
  tone: 'neutral',
  trend: 'unknown'
}

const props = withDefaults(
  defineProps<{
    label?: string
    value?: string | number
    unit?: string
    tone?: 'neutral' | 'positive' | 'negative' | 'warning'
    trend?: 'up' | 'down' | 'flat' | 'unknown'
    precision?: number
    tooltip?: string
    source?: DataSource
  }>(),
  {
    label: '',
    value: '--',
    unit: '',
    tone: 'neutral',
    trend: 'unknown',
    precision: undefined,
    tooltip: '',
    source: undefined
  }
)

const displayValue = computed(() => {
  if (typeof props.value === 'number' && typeof props.precision === 'number') {
    return props.value.toFixed(props.precision)
  }
  return props.value
})

const trendSymbol = computed(() => {
  if (props.trend === 'up') return '↑'
  if (props.trend === 'down') return '↓'
  if (props.trend === 'flat') return '→'
  return ''
})
</script>

<template>
  <span class="metric-badge" :data-tone="tone" :title="tooltip">
    <span class="metric-badge__label">{{ label }}</span>
    <strong>{{ displayValue }}<small v-if="unit">{{ unit }}</small></strong>
    <span v-if="trendSymbol" class="metric-badge__trend">{{ trendSymbol }}</span>
  </span>
</template>

<style scoped>
.metric-badge {
  display: inline-grid;
  gap: 4px;
  min-width: 112px;
  padding: 10px 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
}

.metric-badge[data-tone='positive'] {
  border-color: rgba(22, 163, 74, 0.35);
  background: rgba(22, 163, 74, 0.1);
}

.metric-badge[data-tone='negative'] {
  border-color: rgba(239, 68, 68, 0.35);
  background: rgba(239, 68, 68, 0.1);
}

.metric-badge[data-tone='warning'] {
  border-color: rgba(245, 158, 11, 0.45);
  background: rgba(245, 158, 11, 0.1);
}

.metric-badge__label {
  color: var(--vp-c-text-2);
  font-size: 12px;
}

.metric-badge strong {
  font-size: 18px;
}

.metric-badge small {
  margin-left: 2px;
  color: var(--vp-c-text-2);
  font-size: 12px;
}

.metric-badge__trend {
  color: var(--vp-c-text-2);
  font-size: 12px;
}
</style>
