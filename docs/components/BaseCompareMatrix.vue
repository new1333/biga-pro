<script setup lang="ts">
/**
 * Markdown 用法：
 *
 * <BaseCompareMatrix
 *   :columns="[{ key: 'stock', label: '股票' }, { key: 'etf', label: 'ETF' }]"
 *   :rows="[{ key: 'risk', label: '风险', values: { stock: '较高', etf: '分散' } }]"
 * />
 *
 * 示例数据只用于说明对比矩阵结构，不构成具体产品优劣结论。
 */

type DataSource = {
  name: string
  url?: string
  asOf?: string
  updatedAt?: string
  license?: string
}

type CompareColumn = {
  key: string
  label: string
}

type CompareRow = {
  key: string
  label: string
  values: Record<string, unknown>
}

const baseCompareMatrixExampleData = {
  columns: [
    { key: 'stock', label: '股票' },
    { key: 'etf', label: 'ETF' }
  ],
  rows: [{ key: 'risk', label: '风险特征', values: { stock: '个股风险', etf: '组合分散' } }]
}

withDefaults(
  defineProps<{
    columns?: CompareColumn[]
    rows?: CompareRow[]
    highlightColumn?: string
    compact?: boolean
    stickyFirstColumn?: boolean
    source?: DataSource
  }>(),
  {
    columns: () => [],
    rows: () => [],
    highlightColumn: '',
    compact: false,
    stickyFirstColumn: true,
    source: undefined
  }
)
</script>

<template>
  <div class="base-compare" :class="{ 'base-compare--compact': compact }">
    <div v-if="!columns.length || !rows.length" class="base-compare__empty">
      暂无对比数据
    </div>

    <div v-else class="base-compare__scroller">
      <table class="base-compare__table">
        <thead>
          <tr>
            <th :class="{ 'base-compare__sticky': stickyFirstColumn }">对比维度</th>
            <th
              v-for="column in columns"
              :key="column.key"
              :class="{ 'base-compare__highlight': column.key === highlightColumn }"
            >
              {{ column.label }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rows" :key="row.key">
            <th :class="{ 'base-compare__sticky': stickyFirstColumn }">{{ row.label }}</th>
            <td
              v-for="column in columns"
              :key="column.key"
              :class="{ 'base-compare__highlight': column.key === highlightColumn }"
            >
              {{ row.values[column.key] ?? '--' }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <p v-if="source" class="base-compare__source">
      数据来源：{{ source.name }}<span v-if="source.asOf">（截至 {{ source.asOf }}）</span>
    </p>
  </div>
</template>

<style scoped>
.base-compare {
  margin: 24px 0;
}

.base-compare__scroller {
  overflow-x: auto;
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
}

.base-compare__table {
  width: 100%;
  min-width: 560px;
  border-collapse: collapse;
  background: var(--vp-c-bg);
}

.base-compare th,
.base-compare td {
  padding: 12px 14px;
  border-bottom: 1px solid var(--vp-c-divider);
  text-align: left;
  vertical-align: top;
}

.base-compare--compact th,
.base-compare--compact td {
  padding: 8px 10px;
  font-size: 13px;
}

.base-compare thead th {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
}

.base-compare__sticky {
  position: sticky;
  left: 0;
  z-index: 1;
  background: var(--vp-c-bg-soft);
}

.base-compare__highlight {
  background: rgba(47, 111, 221, 0.08);
}

.base-compare__empty {
  padding: 16px;
  border: 1px dashed var(--vp-c-divider);
  border-radius: 12px;
  color: var(--vp-c-text-2);
  text-align: center;
}

.base-compare__source {
  margin: 8px 0 0;
  color: var(--vp-c-text-2);
  font-size: 13px;
}
</style>
