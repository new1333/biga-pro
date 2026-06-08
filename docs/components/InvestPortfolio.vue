<script setup lang="ts">
import { computed } from 'vue'

/**
 * Markdown 用法：
 *
 * <InvestPortfolio
 *   id="demo-portfolio"
 *   :holdings="[
 *     { symbol: 'ASSET-A', name: '示例资产 A', assetClass: 'stock', weight: 60, market: 'CN-A' },
 *     { symbol: 'CASH', name: '现金', assetClass: 'cash', weight: 40, market: 'CN-A' }
 *   ]"
 * />
 *
 * 示例组合只用于学习结构展示，不代表投资建议或收益承诺。
 */

type Market = 'CN-A' | 'HK' | 'US' | 'GLOBAL' | 'CRYPTO'
type AssetClass = 'stock' | 'etf' | 'fund' | 'bond' | 'reit' | 'crypto' | 'cash' | 'strategy'

type DataSource = {
  name: string
  url?: string
  asOf?: string
  updatedAt?: string
  license?: string
}

type Holding = {
  symbol: string
  name?: string
  assetClass: AssetClass
  weight: number
  market?: Market
}

type Metric = {
  label: string
  value: string | number
  unit?: string
}

const investPortfolioExampleData = {
  id: 'demo-portfolio',
  holdings: [
    { symbol: 'ASSET-A', name: '示例资产 A', assetClass: 'stock', weight: 60, market: 'CN-A' },
    { symbol: 'CASH', name: '现金', assetClass: 'cash', weight: 40, market: 'CN-A' }
  ]
}

const props = withDefaults(
  defineProps<{
    id?: string
    holdings?: Holding[]
    cash?: number
    currency?: string
    benchmark?: string
    metrics?: Metric[]
    scenario?: 'static' | 'rebalance' | 'backtest'
    readonly?: boolean
    riskNotice?: boolean
    source?: DataSource
  }>(),
  {
    id: '',
    holdings: () => [],
    cash: 0,
    currency: 'CNY',
    benchmark: '',
    metrics: () => [],
    scenario: 'static',
    readonly: true,
    riskNotice: true,
    source: undefined
  }
)

const totalWeight = computed(() => props.holdings.reduce((sum, item) => sum + item.weight, 0))
const scenarioText = computed(() => {
  if (props.scenario === 'rebalance') return '再平衡'
  if (props.scenario === 'backtest') return '回测'
  return '静态展示'
})
</script>

<template>
  <section class="invest-portfolio">
    <header class="invest-portfolio__header">
      <div>
        <h3>投资组合</h3>
        <p>{{ scenarioText }} · {{ currency }}<span v-if="benchmark"> · 基准：{{ benchmark }}</span></p>
      </div>
      <span class="invest-portfolio__readonly">{{ readonly ? '只读' : '可编辑' }}</span>
    </header>

    <p v-if="riskNotice" class="invest-portfolio__risk">
      组合展示用于学习与模拟，不代表真实投资建议，也不保证未来收益。
    </p>

    <div v-if="!holdings.length" class="invest-portfolio__empty">暂无持仓数据</div>

    <ul v-else class="invest-portfolio__holdings">
      <li v-for="holding in holdings" :key="`${holding.symbol}-${holding.assetClass}`">
        <div>
          <strong>{{ holding.name || holding.symbol }}</strong>
          <span>{{ holding.symbol }} · {{ holding.assetClass }}<template v-if="holding.market"> · {{ holding.market }}</template></span>
        </div>
        <div class="invest-portfolio__bar" aria-hidden="true">
          <span :style="{ width: `${Math.max(0, Math.min(100, holding.weight))}%` }" />
        </div>
        <b>{{ holding.weight }}%</b>
      </li>
    </ul>

    <dl v-if="metrics.length || cash" class="invest-portfolio__metrics">
      <div v-if="cash">
        <dt>现金</dt>
        <dd>{{ cash }} {{ currency }}</dd>
      </div>
      <div>
        <dt>权重合计</dt>
        <dd>{{ totalWeight }}%</dd>
      </div>
      <div v-for="metric in metrics" :key="metric.label">
        <dt>{{ metric.label }}</dt>
        <dd>{{ metric.value }}<span v-if="metric.unit">{{ metric.unit }}</span></dd>
      </div>
    </dl>

    <p v-if="source" class="invest-portfolio__source">
      数据来源：{{ source.name }}<span v-if="source.asOf">（截至 {{ source.asOf }}）</span>
    </p>
  </section>
</template>

<style scoped>
.invest-portfolio {
  margin: 24px 0;
  padding: 18px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  background: var(--vp-c-bg-soft);
}

.invest-portfolio__header {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.invest-portfolio h3,
.invest-portfolio p {
  margin: 0;
}

.invest-portfolio__header p,
.invest-portfolio__source {
  margin-top: 4px;
  color: var(--vp-c-text-2);
  font-size: 13px;
}

.invest-portfolio__readonly {
  height: fit-content;
  border-radius: 999px;
  padding: 4px 10px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  font-size: 12px;
}

.invest-portfolio__risk {
  margin-top: 14px;
  padding: 10px 12px;
  border-radius: 10px;
  background: rgba(245, 158, 11, 0.1);
  color: #a16207;
  line-height: 1.6;
}

.invest-portfolio__empty {
  margin-top: 14px;
  padding: 14px;
  border: 1px dashed var(--vp-c-divider);
  border-radius: 10px;
  color: var(--vp-c-text-2);
  text-align: center;
}

.invest-portfolio__holdings {
  display: grid;
  gap: 12px;
  margin: 16px 0 0;
  padding: 0;
  list-style: none;
}

.invest-portfolio__holdings li {
  display: grid;
  grid-template-columns: minmax(160px, 1fr) minmax(120px, 240px) auto;
  gap: 12px;
  align-items: center;
  padding: 12px;
  border-radius: 10px;
  background: var(--vp-c-bg);
}

.invest-portfolio__holdings span {
  display: block;
  color: var(--vp-c-text-2);
  font-size: 12px;
}

.invest-portfolio__bar {
  height: 10px;
  overflow: hidden;
  border-radius: 999px;
  background: var(--vp-c-bg-soft);
}

.invest-portfolio__bar span {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: var(--vp-c-brand-1);
}

.invest-portfolio__metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 10px;
  margin: 16px 0 0;
}

.invest-portfolio__metrics div {
  padding: 10px;
  border-radius: 10px;
  background: var(--vp-c-bg);
}

.invest-portfolio__metrics dt {
  color: var(--vp-c-text-2);
  font-size: 12px;
}

.invest-portfolio__metrics dd {
  margin: 4px 0 0;
  font-weight: 700;
}
</style>
