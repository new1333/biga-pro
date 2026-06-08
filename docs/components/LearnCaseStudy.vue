<script setup lang="ts">
/**
 * Markdown 用法：
 *
 * <LearnCaseStudy
 *   id="case-demo"
 *   title="示例案例"
 *   market="CN-A"
 *   asset-class="stock"
 *   :facts="[{ label: '事实 A', value: '页面作者填写' }]"
 *   :tasks="[{ id: 'task-1', title: '识别主要风险' }]"
 * />
 *
 * 示例数据只用于案例结构展示，不预设投资结论。
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

type Fact = {
  label: string
  value: string
}

type CaseTask = {
  id: string
  title: string
  type?: string
}

const learnCaseStudyExampleData = {
  id: 'case-demo',
  title: '示例案例',
  market: 'CN-A',
  assetClass: 'stock',
  facts: [{ label: '事实 A', value: '页面作者填写' }],
  tasks: [{ id: 'task-1', title: '识别主要风险' }]
}

withDefaults(
  defineProps<{
    id?: string
    title?: string
    market?: Market
    assetClass?: AssetClass
    riskLevel?: RiskLevel
    facts?: Fact[]
    tasks?: CaseTask[]
    dataRefs?: DataSource[]
    showConclusion?: boolean
    collapsible?: boolean
  }>(),
  {
    id: '',
    title: '',
    market: 'CN-A',
    assetClass: 'stock',
    riskLevel: 'medium',
    facts: () => [],
    tasks: () => [],
    dataRefs: () => [],
    showConclusion: false,
    collapsible: true
  }
)
</script>

<template>
  <section class="learn-case" :data-risk="riskLevel">
    <component :is="collapsible ? 'details' : 'div'" class="learn-case__panel" open>
      <summary v-if="collapsible" class="learn-case__summary">
        {{ title || '案例分析' }}
      </summary>
      <header v-else class="learn-case__header">
        <h3>{{ title || '案例分析' }}</h3>
      </header>

      <div class="learn-case__meta">
        <span>{{ market }}</span>
        <span>{{ assetClass }}</span>
        <span>风险：{{ riskLevel }}</span>
      </div>

      <dl v-if="facts.length" class="learn-case__facts">
        <div v-for="fact in facts" :key="fact.label">
          <dt>{{ fact.label }}</dt>
          <dd>{{ fact.value }}</dd>
        </div>
      </dl>

      <ol v-if="tasks.length" class="learn-case__tasks">
        <li v-for="task in tasks" :key="task.id">
          <strong>{{ task.title }}</strong>
          <span v-if="task.type">{{ task.type }}</span>
        </li>
      </ol>

      <div v-if="showConclusion" class="learn-case__conclusion">
        <slot name="conclusion">请在 conclusion 插槽中填写案例结论。</slot>
      </div>

      <footer v-if="dataRefs.length" class="learn-case__sources">
        <span v-for="source in dataRefs" :key="source.name">
          {{ source.name }}<template v-if="source.asOf">（截至 {{ source.asOf }}）</template>
        </span>
      </footer>
    </component>
  </section>
</template>

<style scoped>
.learn-case {
  margin: 24px 0;
}

.learn-case__panel {
  padding: 18px;
  border: 1px solid var(--vp-c-divider);
  border-left: 4px solid var(--vp-c-brand-1);
  border-radius: 14px;
  background: var(--vp-c-bg-soft);
}

.learn-case[data-risk='high'] .learn-case__panel,
.learn-case[data-risk='critical'] .learn-case__panel {
  border-left-color: #f97316;
}

.learn-case__summary {
  cursor: pointer;
  font-size: 18px;
  font-weight: 700;
}

.learn-case__header h3 {
  margin: 0;
}

.learn-case__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.learn-case__meta span,
.learn-case__tasks span {
  border-radius: 999px;
  padding: 3px 8px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  font-size: 12px;
}

.learn-case__facts {
  display: grid;
  gap: 8px;
  margin: 14px 0 0;
}

.learn-case__facts div {
  display: grid;
  grid-template-columns: minmax(90px, 160px) 1fr;
  gap: 12px;
  padding: 10px;
  border-radius: 10px;
  background: var(--vp-c-bg);
}

.learn-case__facts dt {
  font-weight: 700;
}

.learn-case__facts dd {
  margin: 0;
  color: var(--vp-c-text-2);
}

.learn-case__tasks {
  display: grid;
  gap: 8px;
  margin: 14px 0 0;
  padding-left: 22px;
}

.learn-case__tasks li {
  line-height: 1.7;
}

.learn-case__conclusion {
  margin-top: 14px;
  padding: 12px;
  border-radius: 10px;
  background: var(--vp-c-bg);
}

.learn-case__sources {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 12px;
  margin-top: 14px;
  color: var(--vp-c-text-2);
  font-size: 13px;
}
</style>
