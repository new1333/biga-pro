<script setup lang="ts">
import { computed } from 'vue'

/**
 * Markdown 用法：
 *
 * <InvestRiskNotice kind="market" level="high" market="CN-A" asset-class="stock" />
 *
 * 示例数据只用于说明风险提示结构，不替代投资者适当性评估。
 */

type Market = 'CN-A' | 'HK' | 'US' | 'GLOBAL' | 'CRYPTO'
type AssetClass = 'stock' | 'etf' | 'fund' | 'bond' | 'reit' | 'crypto' | 'cash' | 'strategy'
type RiskLevel = 'low' | 'medium' | 'high' | 'critical'
type RiskKind =
  | 'general'
  | 'market'
  | 'liquidity'
  | 'valuation'
  | 'concentration'
  | 'leverage'
  | 'data'
  | 'crypto'

type DataSource = {
  name: string
  url?: string
  asOf?: string
  updatedAt?: string
  license?: string
}

const investRiskNoticeExampleData = {
  kind: 'market',
  level: 'high',
  market: 'CN-A',
  assetClass: 'stock',
  title: '市场风险提示'
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

const levelTextMap: Record<RiskLevel, string> = {
  low: '低风险',
  medium: '中等风险',
  high: '高风险',
  critical: '极高风险'
}

const defaultMessageMap: Record<RiskKind, string> = {
  general: '投资有风险，学习案例和图表只能帮助理解概念，不能保证收益。',
  market: '市场价格会上下波动。专业地说，证券价格会受宏观环境、行业景气度、公司经营和投资者情绪共同影响。',
  liquidity: '有些资产不一定能随时按理想价格买入或卖出。专业地说，成交量、买卖价差和交易规则会影响流动性。',
  valuation: '估值便宜不等于马上会上涨，估值昂贵也不等于马上会下跌，需要结合盈利质量和周期位置理解。',
  concentration: '资金集中在少数资产上会放大单一事件影响。专业地说，组合分散度不足会提高非系统性风险。',
  leverage: '借钱或使用杠杆会同时放大收益和亏损，极端情况下可能触发追加保证金或强制平仓。',
  data: '数据可能存在延迟、缺失或口径差异。引用数据前应确认来源、日期和统计方法。',
  crypto: '加密资产价格波动大，并可能面临交易所、钱包、监管和技术风险。新手不应把它等同于普通股票。'
}

const computedTitle = computed(() => props.title || kindTextMap[props.kind])
const sourceText = computed(() => {
  if (!props.source) return ''
  return [props.source.name, props.source.asOf ? `截至 ${props.source.asOf}` : '']
    .filter(Boolean)
    .join(' · ')
})
</script>

<template>
  <section
    class="invest-risk"
    :class="{ 'invest-risk--compact': compact }"
    :data-level="level"
    :role="required || level === 'critical' ? 'alert' : 'note'"
    :aria-label="computedTitle"
  >
    <strong class="invest-risk__icon" aria-hidden="true">!</strong>
    <div class="invest-risk__body">
      <header class="invest-risk__header">
        <h3>{{ computedTitle }}</h3>
        <div>
          <span>{{ levelTextMap[level] }}</span>
          <span>{{ market }}</span>
          <span>{{ assetClass }}</span>
          <span v-if="required">必须展示</span>
        </div>
      </header>
      <p><slot>{{ defaultMessageMap[kind] }}</slot></p>
      <p v-if="sourceText" class="invest-risk__source">来源：{{ sourceText }}</p>
    </div>
  </section>
</template>

<style scoped>
.invest-risk {
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

.invest-risk[data-level='low'] {
  border-color: rgba(22, 163, 74, 0.35);
  background: rgba(22, 163, 74, 0.1);
}

.invest-risk[data-level='high'] {
  border-color: rgba(249, 115, 22, 0.45);
  background: rgba(249, 115, 22, 0.12);
}

.invest-risk[data-level='critical'] {
  border-color: rgba(239, 68, 68, 0.5);
  background: rgba(239, 68, 68, 0.12);
}

.invest-risk--compact {
  padding: 12px;
}

.invest-risk__icon {
  display: grid;
  flex: 0 0 28px;
  width: 28px;
  height: 28px;
  place-items: center;
  border-radius: 50%;
  background: var(--vp-c-bg);
  color: #b45309;
}

.invest-risk__body {
  flex: 1;
}

.invest-risk__header {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.invest-risk h3,
.invest-risk p {
  margin: 0;
}

.invest-risk__header div {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  justify-content: flex-end;
}

.invest-risk__header span {
  border-radius: 999px;
  padding: 3px 8px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  font-size: 12px;
}

.invest-risk p {
  margin-top: 10px;
  line-height: 1.7;
}

.invest-risk__source {
  color: var(--vp-c-text-2);
  font-size: 13px;
}
</style>
