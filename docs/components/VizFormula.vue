<script setup lang="ts">
/**
 * Markdown 用法：
 *
 * <VizFormula
 *   formula="市盈率 = 股价 / 每股收益"
 *   caption="市盈率（PE）用于观察股价相对于盈利的估值水平。"
 *   :variables="[
 *     { symbol: '股价', label: '每股市场价格', unit: '元' },
 *     { symbol: '每股收益', label: 'EPS，每一股对应的净利润', unit: '元' }
 *   ]"
 * />
 *
 * 示例公式用于说明组件结构，不构成估值结论。
 */

type DataSource = {
  name: string
  url?: string
  asOf?: string
  updatedAt?: string
  license?: string
}

type FormulaVariable = {
  symbol: string
  label: string
  unit?: string
}

const vizFormulaExampleData = {
  formula: '市盈率 = 股价 / 每股收益',
  variables: [
    { symbol: '股价', label: '每股市场价格', unit: '元' },
    { symbol: '每股收益', label: 'EPS，每一股对应的净利润', unit: '元' }
  ],
  caption: '示例公式，仅用于展示组件结构'
}

withDefaults(
  defineProps<{
    formula?: string
    display?: 'block' | 'inline'
    engine?: 'katex' | 'mathjax' | 'plain'
    variables?: FormulaVariable[]
    steps?: string[]
    precision?: number
    caption?: string
    source?: DataSource
  }>(),
  {
    formula: '',
    display: 'block',
    engine: 'plain',
    variables: () => [],
    steps: () => [],
    precision: undefined,
    caption: '',
    source: undefined
  }
)
</script>

<template>
  <span v-if="display === 'inline'" class="viz-formula viz-formula--inline">
    <code>{{ formula }}</code>
  </span>

  <figure v-else class="viz-formula">
    <pre class="viz-formula__formula"><code>{{ formula || '请通过 formula 传入公式' }}</code></pre>
    <figcaption v-if="caption" class="viz-formula__caption">{{ caption }}</figcaption>

    <dl v-if="variables.length" class="viz-formula__variables">
      <div v-for="item in variables" :key="item.symbol">
        <dt>{{ item.symbol }}</dt>
        <dd>{{ item.label }}<span v-if="item.unit">（{{ item.unit }}）</span></dd>
      </div>
    </dl>

    <details v-if="steps.length" class="viz-formula__steps">
      <summary>查看推导步骤</summary>
      <ol>
        <li v-for="step in steps" :key="step">{{ step }}</li>
      </ol>
    </details>

    <p v-if="source" class="viz-formula__source">
      来源：{{ source.name }}<span v-if="source.asOf">（截至 {{ source.asOf }}）</span>
    </p>
  </figure>
</template>

<style scoped>
.viz-formula {
  margin: 22px 0;
}

.viz-formula--inline code {
  color: var(--vp-c-brand-1);
}

.viz-formula__formula {
  margin: 0;
  padding: 16px;
  overflow-x: auto;
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font-size: 16px;
  line-height: 1.7;
}

.viz-formula__caption,
.viz-formula__source {
  margin: 8px 0 0;
  color: var(--vp-c-text-2);
  font-size: 13px;
  line-height: 1.6;
}

.viz-formula__variables {
  display: grid;
  gap: 8px;
  margin: 14px 0 0;
}

.viz-formula__variables div {
  display: grid;
  grid-template-columns: minmax(80px, 140px) 1fr;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 10px;
  background: var(--vp-c-bg-soft);
}

.viz-formula__variables dt {
  color: var(--vp-c-brand-1);
  font-weight: 700;
}

.viz-formula__variables dd {
  margin: 0;
  color: var(--vp-c-text-1);
}

.viz-formula__steps {
  margin-top: 12px;
  color: var(--vp-c-text-1);
}
</style>
