<script setup lang="ts">
/**
 * Markdown 用法：
 *
 * <InvestFinancialReport
 *   symbol="000001.SZ"
 *   company-name="示例公司"
 *   period="2024-Q2"
 *   unit="亿元"
 *   :columns="[
 *     { key: 'item', label: '项目' },
 *     { key: 'value', label: '数值' }
 *   ]"
 *   :rows="[{ item: '营业收入', value: '--' }]"
 * />
 *
 * 示例数据只用于表格结构展示，不代表真实财报。
 */

type DataSource = {
  name: string
  url?: string
  asOf?: string
  updatedAt?: string
  license?: string
}

type ReportColumn = {
  key: string
  label: string
}

type HighlightRule = {
  field: string
  operator: string
  value: number
  tone: string
}

const investFinancialReportExampleData = {
  symbol: '000001.SZ',
  companyName: '示例公司',
  period: '2024-Q2',
  columns: [
    { key: 'item', label: '项目' },
    { key: 'value', label: '数值' }
  ],
  rows: [{ item: '营业收入', value: '--' }]
}

const props = withDefaults(
  defineProps<{
    symbol?: string
    companyName?: string
    period?: string
    reportType?: 'balance-sheet' | 'income' | 'cash-flow' | 'metrics'
    unit?: string
    columns?: ReportColumn[]
    rows?: Record<string, unknown>[]
    highlightRules?: HighlightRule[]
    source?: DataSource
    audited?: boolean
  }>(),
  {
    symbol: '',
    companyName: '',
    period: '',
    reportType: 'metrics',
    unit: '',
    columns: () => [],
    rows: () => [],
    highlightRules: () => [],
    source: undefined,
    audited: false
  }
)

function compare(actual: number, operator: string, expected: number) {
  if (operator === '>') return actual > expected
  if (operator === '>=') return actual >= expected
  if (operator === '<') return actual < expected
  if (operator === '<=') return actual <= expected
  if (operator === '=') return actual === expected
  return false
}

function rowTone(row: Record<string, unknown>) {
  const rule = props.highlightRules.find((item) => {
    const value = row[item.field]
    return typeof value === 'number' && compare(value, item.operator, item.value)
  })
  return rule?.tone || 'neutral'
}
</script>

<template>
  <section class="invest-report">
    <header class="invest-report__header">
      <div>
        <h3>{{ companyName || '财报数据' }}</h3>
        <p>{{ symbol }}<span v-if="period"> · {{ period }}</span><span v-if="unit"> · 单位：{{ unit }}</span></p>
      </div>
      <div class="invest-report__badges">
        <span>{{ reportType }}</span>
        <span>{{ audited ? '已审计' : '未标注审计' }}</span>
      </div>
    </header>

    <div v-if="!columns.length || !rows.length" class="invest-report__empty">暂无财报数据</div>

    <div v-else class="invest-report__scroller">
      <table>
        <thead>
          <tr>
            <th v-for="column in columns" :key="column.key">{{ column.label }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, index) in rows" :key="index" :data-tone="rowTone(row)">
            <td v-for="column in columns" :key="column.key">
              {{ row[column.key] ?? '--' }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <p v-if="source" class="invest-report__source">
      数据来源：{{ source.name }}<span v-if="source.asOf">（截至 {{ source.asOf }}）</span>
    </p>
  </section>
</template>

<style scoped>
.invest-report {
  margin: 24px 0;
  padding: 18px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  background: var(--vp-c-bg-soft);
}

.invest-report__header {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 14px;
}

.invest-report h3,
.invest-report p {
  margin: 0;
}

.invest-report__header p,
.invest-report__source {
  margin-top: 4px;
  color: var(--vp-c-text-2);
  font-size: 13px;
}

.invest-report__badges {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: flex-end;
}

.invest-report__badges span {
  height: fit-content;
  border-radius: 999px;
  padding: 4px 10px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  font-size: 12px;
}

.invest-report__scroller {
  overflow-x: auto;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
}

.invest-report table {
  width: 100%;
  min-width: 520px;
  border-collapse: collapse;
  background: var(--vp-c-bg);
}

.invest-report th,
.invest-report td {
  padding: 11px 12px;
  border-bottom: 1px solid var(--vp-c-divider);
  text-align: left;
}

.invest-report th {
  background: var(--vp-c-bg-soft);
}

.invest-report tr[data-tone='positive'] {
  background: rgba(22, 163, 74, 0.08);
}

.invest-report tr[data-tone='negative'],
.invest-report tr[data-tone='warning'] {
  background: rgba(245, 158, 11, 0.1);
}

.invest-report__empty {
  padding: 14px;
  border: 1px dashed var(--vp-c-divider);
  border-radius: 10px;
  color: var(--vp-c-text-2);
  text-align: center;
}
</style>
