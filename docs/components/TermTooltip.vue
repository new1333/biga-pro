<script setup lang="ts">
import { computed } from 'vue'

/**
 * Markdown 用法：
 *
 * 第一次出现术语时：
 * <TermTooltip
 *   id="pe"
 *   term="市盈率"
 *   definition="市盈率（PE）是股价相对于每股收益的倍数，用来观察估值高低。"
 * />
 *
 * 卡片模式：
 * <TermTooltip
 *   id="pe"
 *   term="市盈率"
 *   mode="card"
 *   :aliases="['PE', 'Price-to-Earnings Ratio']"
 * />
 *
 * 示例数据仅用于术语展示，不构成投资判断。
 */

type DataSource = {
  name: string
  url?: string
  asOf?: string
  updatedAt?: string
  license?: string
}

type TermMode = 'tooltip' | 'inline' | 'card' | 'link'
type TermLevel = 'beginner' | 'intermediate' | 'advanced'

const termTooltipExampleData = {
  id: 'pe',
  term: '市盈率',
  definition: '市盈率（PE）是股价相对于每股收益的倍数，用来观察估值高低。',
  aliases: ['PE', 'Price-to-Earnings Ratio'],
  mode: 'tooltip',
  level: 'beginner'
}

const props = withDefaults(
  defineProps<{
    id?: string
    term: string
    definition?: string
    aliases?: string[]
    mode?: TermMode
    level?: TermLevel
    href?: string
    source?: DataSource
    related?: string[]
  }>(),
  {
    id: '',
    definition: '',
    aliases: () => [],
    mode: 'tooltip',
    level: 'beginner',
    href: '',
    source: undefined,
    related: () => []
  }
)

const levelTextMap: Record<TermLevel, string> = {
  beginner: '入门',
  intermediate: '进阶',
  advanced: '高级'
}

const tooltipId = computed(() => {
  const raw = props.id || props.term
  const normalized = raw.toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-|-$/g, '')
  return `term-tooltip-${normalized || 'item'}`
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
</script>

<template>
  <span v-if="mode === 'tooltip'" class="term-tooltip">
    <span
      class="term-tooltip__trigger"
      tabindex="0"
      :aria-describedby="tooltipId"
    >
      <slot>{{ term }}</slot>
    </span>
    <span :id="tooltipId" class="term-tooltip__bubble" role="tooltip">
      <strong>{{ term }}</strong>
      <span v-if="definition">{{ definition }}</span>
      <span v-if="aliases.length" class="term-tooltip__aliases">
        别名：{{ aliases.join('、') }}
      </span>
    </span>
  </span>

  <span v-else-if="mode === 'inline'" class="term-inline">
    <strong>{{ term }}</strong>
    <span v-if="definition">：{{ definition }}</span>
    <a v-if="href" :href="href" class="term-inline__link">查看详情</a>
  </span>

  <a v-else-if="mode === 'link' && href" class="term-link" :href="href">
    <slot>{{ term }}</slot>
  </a>

  <span v-else-if="mode === 'link'" class="term-link term-link--disabled">
    <slot>{{ term }}</slot>
  </span>

  <article v-else class="term-card" :aria-label="`${term} 术语卡片`">
    <header class="term-card__header">
      <div>
        <h3>{{ term }}</h3>
        <p v-if="aliases.length">{{ aliases.join(' / ') }}</p>
      </div>
      <span class="term-card__level">{{ levelTextMap[level] }}</span>
    </header>

    <p v-if="definition" class="term-card__definition">{{ definition }}</p>
    <p v-else class="term-card__definition term-card__definition--empty">
      暂无术语解释，请在 Markdown 中通过 definition 传入。
    </p>

    <footer v-if="href || related.length || sourceText" class="term-card__footer">
      <a v-if="href" :href="href">术语详情</a>
      <span v-if="related.length">相关术语：{{ related.join('、') }}</span>
      <span v-if="sourceText">来源：{{ sourceText }}</span>
    </footer>
  </article>
</template>

<style scoped>
.term-tooltip {
  position: relative;
  display: inline-flex;
  align-items: center;
}

.term-tooltip__trigger,
.term-link {
  border-bottom: 1px dashed var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
  cursor: help;
  text-decoration: none;
}

.term-link {
  cursor: pointer;
}

.term-link--disabled {
  color: var(--vp-c-text-2);
  cursor: default;
}

.term-tooltip__trigger:focus {
  outline: 2px solid var(--vp-c-brand-2);
  outline-offset: 2px;
  border-radius: 3px;
}

.term-tooltip__bubble {
  position: absolute;
  z-index: 20;
  bottom: calc(100% + 10px);
  left: 50%;
  display: grid;
  width: min(320px, 80vw);
  gap: 6px;
  padding: 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  background: var(--vp-c-bg-elv);
  box-shadow: var(--vp-shadow-3);
  color: var(--vp-c-text-1);
  font-size: 13px;
  line-height: 1.6;
  opacity: 0;
  pointer-events: none;
  transform: translate(-50%, 4px);
  transition: opacity 0.16s ease, transform 0.16s ease;
}

.term-tooltip:hover .term-tooltip__bubble,
.term-tooltip:focus-within .term-tooltip__bubble {
  opacity: 1;
  transform: translate(-50%, 0);
}

.term-tooltip__aliases,
.term-card__footer,
.term-inline {
  color: var(--vp-c-text-2);
  font-size: 13px;
}

.term-inline strong {
  color: var(--vp-c-text-1);
}

.term-inline__link {
  margin-left: 8px;
}

.term-card {
  margin: 20px 0;
  padding: 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  background: var(--vp-c-bg-soft);
}

.term-card__header {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  justify-content: space-between;
}

.term-card__header h3 {
  margin: 0;
  font-size: 18px;
}

.term-card__header p {
  margin: 4px 0 0;
  color: var(--vp-c-text-2);
}

.term-card__level {
  border-radius: 999px;
  padding: 4px 10px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  font-size: 12px;
}

.term-card__definition {
  margin: 12px 0 0;
  line-height: 1.7;
}

.term-card__definition--empty {
  color: var(--vp-c-text-2);
}

.term-card__footer {
  display: grid;
  gap: 6px;
  margin-top: 12px;
}
</style>
