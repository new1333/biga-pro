<script setup lang="ts">
import { computed } from 'vue'

/**
 * Markdown 用法：
 *
 * <RiskWarning kind="market" level="high" market="CN-A" asset-class="stock">
 *   股价可能因市场情绪、公司经营和政策变化出现较大波动。
 * </RiskWarning>
 *
 * 示例数据只用于说明风险提示的结构。组件不替代投资者适当性评估。
 */

type Market = 'CN-A' | 'HK' | 'US' | 'GLOBAL' | 'CRYPTO'
type AssetClass = 'stock' | 'etf' | 'fund' | 'bond' | 'reit' | 'crypto' | 'cash' | 'strategy'
type RiskLevel = 'low' | 'medium' | 'high' | 'critical'

type DataSource = {
  name: string
  url?: string
  asOf?: string
  updatedAt?: string
  license?: string
}

type RiskKind =
  | 'general'
  | 'market'
  | 'liquidity'
  | 'valuation'
  | 'concentration'
  | 'leverage'
  | 'data'
  | 'crypto'

const riskWarningExampleData = {
  kind: 'market',
  level: 'high',
  market: 'CN-A',
  assetClass: 'stock',
  title: '市场风险提示',
  source: { name: '示例口径：页面作者整理', asOf: '2024-06-30' }
}

const props = withDefaults(
  defineProps<{
    kind?: RiskKind
    level?: RiskLevel
    market?: Market
    assetClass?: AssetClass
    title?: string
    required?: boolean
    source?: DataSource
    compact?: boolean
  }>(),
  {
    kind: 'general',
    level: 'medium',
    market: 'CN-A',
    assetClass: 'stock',
    title: '',
    required: false,
    source: undefined,
    compact: false
  }
)

const levelTextMap: Record<RiskLevel, string> = {
  low: '低风险',
  medium: '中等风险',
  high: '高风险',
  critical: '极高风险'
}

const kindTextMap: Record<RiskKind, string> = {
  general: '一般风险',
  market: '市场风险',
  liquidity: '流动性风险',
  valuation: '估值风险',
  concentration: '集中度风险',
  leverage: '杠杆风险',
  data: '数据风险',
  crypto: '加密资产风险'
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

const defaultMessages: Record<RiskKind, string> = {
  general: '投资有风险，学习案例和图表只能帮助理解概念，不能保证收益。',
  market: '市场价格会上下波动。专业地说，证券价格会受宏观环境、行业景气度、公司经营和投资者情绪共同影响。',
  liquidity: '有些资产不一定能随时按理想价格买入或卖出。专业地说，成交量、买卖价差和交易规则会影响流动性。',
  valuation: '估值便宜不等于马上会上涨，估值昂贵也不等于马上会下跌。估值指标需要结合盈利质量和周期位置理解。',
  concentration: '把资金集中在少数资产上会放大单一事件影响。专业地说，组合分散度不足会提高非系统性风险。',
  leverage: '借钱或使用杠杆会同时放大收益和亏损，极端情况下可能触发追加保证金或强制平仓。',
  data: '数据可能存在延迟、缺失或口径差异。引用数据前应确认来源、日期和统计方法。',
  crypto: '加密资产价格波动大，并可能面临交易所、钱包、监管和技术风险。新手不应把它等同于普通股票。'
}

const computedTitle = computed(() => props.title || kindTextMap[props.kind])
const defaultMessage = computed(() => defaultMessages[props.kind])

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
</script>

<template>
  <section
    class="risk-warning"
    :class="{ 'risk-warning--compact': compact }"
    :data-level="level"
    :aria-label="computedTitle"
    :role="required || level === 'critical' ? 'alert' : 'note'"
  >
    <div class="risk-warning__icon" aria-hidden="true">!</div>
    <div class="risk-warning__body">
      <header class="risk-warning__header">
        <h3>{{ computedTitle }}</h3>
        <div class="risk-warning__meta">
          <span>{{ levelTextMap[level] }}</span>
          <span>{{ market }}</span>
          <span>{{ assetClassTextMap[assetClass] }}</span>
          <span v-if="required">必须展示</span>
        </div>
      </header>

      <p class="risk-warning__content">
        <slot>{{ defaultMessage }}</slot>
      </p>

      <p v-if="sourceText" class="risk-warning__source">来源：{{ sourceText }}</p>
    </div>
  </section>
</template>

<style scoped>
.risk-warning {
  display: flex;
  gap: 14px;
  margin: 20px 0;
  padding: 16px;
  border: 1px solid rgba(245, 158, 11, 0.35);
  border-left-width: 4px;
  border-radius: 14px;
  background: rgba(245, 158, 11, 0.1);
  color: var(--vp-c-text-1);
}

.risk-warning[data-level='low'] {
  border-color: rgba(22, 163, 74, 0.35);
  background: rgba(22, 163, 74, 0.1);
}

.risk-warning[data-level='high'] {
  border-color: rgba(249, 115, 22, 0.45);
  background: rgba(249, 115, 22, 0.12);
}

.risk-warning[data-level='critical'] {
  border-color: rgba(239, 68, 68, 0.5);
  background: rgba(239, 68, 68, 0.12);
}

.risk-warning--compact {
  padding: 12px;
}

.risk-warning__icon {
  display: grid;
  flex: 0 0 28px;
  width: 28px;
  height: 28px;
  place-items: center;
  border-radius: 50%;
  background: var(--vp-c-bg);
  color: #b45309;
  font-weight: 800;
}

.risk-warning__body {
  flex: 1;
  min-width: 0;
}

.risk-warning__header {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  justify-content: space-between;
}

.risk-warning__header h3 {
  margin: 0;
  font-size: 16px;
  line-height: 1.4;
}

.risk-warning__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  justify-content: flex-end;
}

.risk-warning__meta span {
  border-radius: 999px;
  padding: 3px 8px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  font-size: 12px;
}

.risk-warning__content {
  margin: 10px 0 0;
  color: var(--vp-c-text-1);
  line-height: 1.7;
}

.risk-warning__source {
  margin: 8px 0 0;
  color: var(--vp-c-text-2);
  font-size: 13px;
}
</style>
