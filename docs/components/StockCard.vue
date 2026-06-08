<script setup lang="ts">
import { computed } from 'vue'

/**
 * Markdown 用法：
 *
 * <StockCard
 *   symbol="000001.SZ"
 *   name="示例 A 股证券"
 *   market="CN-A"
 *   exchange="SZSE"
 *   :quote="{ price: 12.34, change: 0.12, changePct: 0.98, currency: 'CNY' }"
 *   :metrics="[
 *     { label: '市盈率（PE）', value: 12.5, unit: '倍' },
 *     { label: '总市值', value: '示例口径' }
 *   ]"
 * />
 *
 * 示例数据只说明字段格式，不代表真实证券行情或投资建议。
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

type Quote = {
  price?: number
  change?: number
  changePct?: number
  currency?: string
}

type Metric = {
  label: string
  value: string | number
  unit?: string
}

const stockCardExampleData = {
  symbol: '000001.SZ',
  name: '示例 A 股证券',
  market: 'CN-A',
  exchange: 'SZSE',
  assetClass: 'stock',
  status: 'normal',
  quote: { price: 12.34, change: 0.12, changePct: 0.98, currency: 'CNY' },
  metrics: [
    { label: '市盈率（PE）', value: 12.5, unit: '倍' },
    { label: '每股收益', value: 0.98, unit: '元' }
  ],
  tags: ['示例', 'A 股']
}

const props = withDefaults(
  defineProps<{
    symbol?: string
    name?: string
    market?: Market
    exchange?: string
    assetClass?: AssetClass
    status?: 'normal' | 'suspended' | 'delisted' | 'unknown'
    quote?: Quote
    metrics?: Metric[]
    tags?: string[]
    source?: DataSource
  }>(),
  {
    symbol: '',
    name: '',
    market: 'CN-A',
    exchange: '',
    assetClass: 'stock',
    status: 'unknown',
    quote: undefined,
    metrics: () => [],
    tags: () => [],
    source: undefined
  }
)

const statusTextMap = {
  normal: '正常交易',
  suspended: '停牌',
  delisted: '退市',
  unknown: '状态未知'
}

const assetClassTextMap: Record<AssetClass, string> = {
  stock: '股票',
  etf: 'ETF',
  fund: '基金',
  bond: '债券',
  reit: 'REITs',
  crypto: '加密资产',
  cash: '现金',
  strategy: '策略'
}

const displayName = computed(() => props.name || '未提供证券名称')
const displaySymbol = computed(() => props.symbol || '未提供代码')

const quoteTone = computed(() => {
  const change = props.quote?.change ?? props.quote?.changePct
  if (typeof change !== 'number' || change === 0) return 'neutral'
  return change > 0 ? 'positive' : 'negative'
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

function formatPrice(value?: number) {
  return typeof value === 'number' && Number.isFinite(value) ? value.toFixed(2) : '--'
}

function formatSigned(value?: number, suffix = '') {
  if (typeof value !== 'number' || !Number.isFinite(value)) return '--'
  const sign = value > 0 ? '+' : ''
  return `${sign}${value.toFixed(2)}${suffix}`
}
</script>

<template>
  <article class="stock-card" :aria-label="`${displayName} 信息卡`">
    <header class="stock-card__header">
      <div>
        <h3 class="stock-card__name">{{ displayName }}</h3>
        <p class="stock-card__symbol">{{ displaySymbol }}</p>
      </div>
      <div class="stock-card__badges">
        <span class="stock-card__badge">{{ market }}</span>
        <span v-if="exchange" class="stock-card__badge">{{ exchange }}</span>
        <span class="stock-card__badge">{{ assetClassTextMap[assetClass] }}</span>
      </div>
    </header>

    <section v-if="quote" class="stock-card__quote" :data-tone="quoteTone">
      <div>
        <span class="stock-card__quote-label">最新价</span>
        <strong class="stock-card__quote-price">
          {{ quote.currency || 'CNY' }} {{ formatPrice(quote.price) }}
        </strong>
      </div>
      <div class="stock-card__quote-change">
        <span>{{ formatSigned(quote.change) }}</span>
        <span>{{ formatSigned(quote.changePct, '%') }}</span>
      </div>
    </section>

    <dl v-if="metrics.length" class="stock-card__metrics">
      <div v-for="metric in metrics" :key="metric.label" class="stock-card__metric">
        <dt>{{ metric.label }}</dt>
        <dd>{{ metric.value }}<span v-if="metric.unit">{{ metric.unit }}</span></dd>
      </div>
    </dl>

    <footer class="stock-card__footer">
      <span class="stock-card__status" :data-status="status">
        {{ statusTextMap[status] }}
      </span>
      <div v-if="tags.length" class="stock-card__tags" aria-label="证券标签">
        <span v-for="tag in tags" :key="tag" class="stock-card__tag">{{ tag }}</span>
      </div>
    </footer>

    <p v-if="sourceText" class="stock-card__source">数据来源：{{ sourceText }}</p>
  </article>
</template>

<style scoped>
.stock-card {
  margin: 20px 0;
  padding: 18px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
}

.stock-card__header {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  justify-content: space-between;
}

.stock-card__name {
  margin: 0;
  font-size: 18px;
  line-height: 1.4;
}

.stock-card__symbol {
  margin: 4px 0 0;
  color: var(--vp-c-text-2);
  font-family: var(--vp-font-family-mono);
  font-size: 13px;
}

.stock-card__badges,
.stock-card__tags,
.stock-card__footer {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.stock-card__badge,
.stock-card__tag,
.stock-card__status {
  border-radius: 999px;
  padding: 4px 10px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  font-size: 12px;
  line-height: 1.4;
}

.stock-card__quote {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 18px;
  padding: 14px;
  border-radius: 12px;
  background: var(--vp-c-bg);
}

.stock-card__quote[data-tone='positive'] {
  color: #c2410c;
}

.stock-card__quote[data-tone='negative'] {
  color: #15803d;
}

.stock-card__quote-label {
  display: block;
  color: var(--vp-c-text-2);
  font-size: 12px;
}

.stock-card__quote-price {
  display: block;
  margin-top: 4px;
  font-size: 24px;
}

.stock-card__quote-change {
  display: grid;
  gap: 4px;
  justify-items: end;
  font-weight: 700;
}

.stock-card__metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 10px;
  margin: 16px 0 0;
}

.stock-card__metric {
  padding: 12px;
  border-radius: 10px;
  background: var(--vp-c-bg);
}

.stock-card__metric dt {
  color: var(--vp-c-text-2);
  font-size: 12px;
}

.stock-card__metric dd {
  margin: 6px 0 0;
  font-size: 16px;
  font-weight: 700;
}

.stock-card__footer {
  align-items: center;
  justify-content: space-between;
  margin-top: 16px;
}

.stock-card__status[data-status='normal'] {
  color: #15803d;
  background: rgba(22, 163, 74, 0.12);
}

.stock-card__status[data-status='suspended'] {
  color: #a16207;
  background: rgba(234, 179, 8, 0.16);
}

.stock-card__status[data-status='delisted'] {
  color: #b91c1c;
  background: rgba(239, 68, 68, 0.14);
}

.stock-card__source {
  margin: 12px 0 0;
  color: var(--vp-c-text-2);
  font-size: 13px;
  line-height: 1.6;
}
</style>
