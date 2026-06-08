<script setup lang="ts">
import StockCard from './StockCard.vue'

/**
 * Markdown 用法：
 *
 * <InvestSecurityCard
 *   symbol="000001.SZ"
 *   name="示例 A 股证券"
 *   market="CN-A"
 *   exchange="SZSE"
 *   asset-class="stock"
 *   :metrics="[{ label: '市盈率（PE）', value: 12.5, unit: '倍' }]"
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

const investSecurityCardExampleData = {
  symbol: '000001.SZ',
  name: '示例 A 股证券',
  market: 'CN-A',
  exchange: 'SZSE',
  assetClass: 'stock',
  metrics: [{ label: '市盈率（PE）', value: 12.5, unit: '倍' }]
}

withDefaults(
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
</script>

<template>
  <StockCard
    class="invest-security-card"
    :symbol="symbol"
    :name="name"
    :market="market"
    :exchange="exchange"
    :asset-class="assetClass"
    :status="status"
    :quote="quote"
    :metrics="metrics"
    :tags="tags"
    :source="source"
  />
</template>

<style scoped>
.invest-security-card {
  border-left: 4px solid var(--vp-c-brand-1);
}
</style>
