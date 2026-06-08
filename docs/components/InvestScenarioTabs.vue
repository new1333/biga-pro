<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'

/**
 * Markdown 用法：
 *
 * <InvestScenarioTabs
 *   default-scenario="cn-a"
 *   :scenarios="[
 *     { id: 'cn-a', label: 'A 股', market: 'CN-A', assetClass: 'stock' },
 *     { id: 'etf', label: 'ETF', market: 'CN-A', assetClass: 'etf' }
 *   ]"
 * />
 *
 * 示例场景只用于说明跨市场/跨资产切换结构。
 */

type Market = 'CN-A' | 'HK' | 'US' | 'GLOBAL' | 'CRYPTO'
type AssetClass = 'stock' | 'etf' | 'fund' | 'bond' | 'reit' | 'crypto' | 'cash' | 'strategy'

type Scenario = {
  id: string
  label: string
  market?: Market
  assetClass?: AssetClass
}

const investScenarioTabsExampleData = {
  defaultScenario: 'cn-a',
  scenarios: [
    { id: 'cn-a', label: 'A 股', market: 'CN-A', assetClass: 'stock' },
    { id: 'etf', label: 'ETF', market: 'CN-A', assetClass: 'etf' }
  ]
}

const props = withDefaults(
  defineProps<{
    scenarios?: Scenario[]
    defaultScenario?: string
    syncToHash?: boolean
    persistKey?: string
    disabledScenarios?: string[]
  }>(),
  {
    scenarios: () => [],
    defaultScenario: '',
    syncToHash: false,
    persistKey: '',
    disabledScenarios: () => []
  }
)

const emit = defineEmits<{
  change: [scenario: Scenario]
}>()

const activeId = ref('')
const enabledScenarios = computed(() =>
  props.scenarios.filter((item) => !props.disabledScenarios.includes(item.id))
)
const fallbackId = computed(() => props.defaultScenario || enabledScenarios.value[0]?.id || '')
const activeScenario = computed(() =>
  props.scenarios.find((item) => item.id === activeId.value) || enabledScenarios.value[0]
)

function selectScenario(item: Scenario) {
  if (props.disabledScenarios.includes(item.id)) return
  activeId.value = item.id
  emit('change', item)
}

watch(
  activeId,
  (value) => {
    if (!value || typeof window === 'undefined') return
    if (props.persistKey) window.localStorage.setItem(props.persistKey, value)
    if (props.syncToHash) window.history.replaceState(null, '', `#${value}`)
  }
)

onMounted(() => {
  if (typeof window === 'undefined') return
  const hashValue = props.syncToHash ? window.location.hash.replace('#', '') : ''
  const storedValue = props.persistKey ? window.localStorage.getItem(props.persistKey) || '' : ''
  activeId.value = hashValue || storedValue || fallbackId.value
})
</script>

<template>
  <section class="scenario-tabs">
    <div class="scenario-tabs__list" role="tablist">
      <button
        v-for="scenario in scenarios"
        :key="scenario.id"
        type="button"
        role="tab"
        :aria-selected="scenario.id === activeId"
        :disabled="disabledScenarios.includes(scenario.id)"
        @click="selectScenario(scenario)"
      >
        <strong>{{ scenario.label }}</strong>
        <span v-if="scenario.market || scenario.assetClass">
          {{ [scenario.market, scenario.assetClass].filter(Boolean).join(' · ') }}
        </span>
      </button>
    </div>

    <div class="scenario-tabs__panel" role="tabpanel">
      <slot :name="activeId" :scenario="activeScenario">
        <slot :scenario="activeScenario">
          <p v-if="activeScenario">
            当前场景：{{ activeScenario.label }}
          </p>
          <p v-else>暂无可用场景</p>
        </slot>
      </slot>
    </div>
  </section>
</template>

<style scoped>
.scenario-tabs {
  margin: 24px 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  background: var(--vp-c-bg-soft);
}

.scenario-tabs__list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 12px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.scenario-tabs__list button {
  display: grid;
  gap: 3px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 8px 12px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  cursor: pointer;
  text-align: left;
}

.scenario-tabs__list button[aria-selected='true'] {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 0 0 2px var(--vp-c-brand-soft);
}

.scenario-tabs__list button:disabled {
  cursor: not-allowed;
  opacity: 0.45;
}

.scenario-tabs__list span {
  color: var(--vp-c-text-2);
  font-size: 12px;
}

.scenario-tabs__panel {
  padding: 16px;
  color: var(--vp-c-text-1);
  line-height: 1.7;
}

.scenario-tabs__panel p {
  margin: 0;
}
</style>
