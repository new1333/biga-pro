<script setup lang="ts">
import { computed } from 'vue'

/**
 * Markdown 用法：
 *
 * <VizTimeline
 *   :events="[
 *     { date: '2024-Q1', title: '阶段一', description: '理解账户与交易规则' },
 *     { date: '2024-Q2', title: '阶段二', description: '学习财报和估值' }
 *   ]"
 * />
 *
 * 示例数据用于说明时间轴结构，不代表真实事件。
 */

type DataSource = {
  name: string
  url?: string
  asOf?: string
  updatedAt?: string
  license?: string
}

type TimelineEvent = {
  date?: string
  title: string
  description?: string
  type?: string
  link?: string
}

const vizTimelineExampleData: TimelineEvent[] = [
  { date: '2024-Q1', title: '阶段一', description: '理解账户与交易规则' },
  { date: '2024-Q2', title: '阶段二', description: '学习财报和估值' }
]

const props = withDefaults(
  defineProps<{
    events?: TimelineEvent[]
    orientation?: 'vertical' | 'horizontal'
    density?: 'compact' | 'comfortable'
    groupBy?: 'year' | 'month' | 'none'
    showDate?: boolean
    currentIndex?: number
    source?: DataSource
  }>(),
  {
    events: () => [],
    orientation: 'vertical',
    density: 'comfortable',
    groupBy: 'none',
    showDate: true,
    currentIndex: undefined,
    source: undefined
  }
)

const groupedEvents = computed(() => {
  if (props.groupBy === 'none') return [{ group: '', items: props.events }]
  const groups = new Map<string, TimelineEvent[]>()
  for (const event of props.events) {
    const date = event.date || '未分组'
    const key = props.groupBy === 'year' ? date.slice(0, 4) : date.slice(0, 7)
    groups.set(key, [...(groups.get(key) || []), event])
  }
  return Array.from(groups, ([group, items]) => ({ group, items }))
})
</script>

<template>
  <section class="viz-timeline" :data-orientation="orientation" :data-density="density">
    <p v-if="!events.length" class="viz-timeline__empty">暂无时间轴事件</p>

    <div v-for="group in groupedEvents" v-else :key="group.group || 'all'" class="viz-timeline__group">
      <h3 v-if="group.group" class="viz-timeline__group-title">{{ group.group }}</h3>
      <ol class="viz-timeline__list">
        <li
          v-for="event in group.items"
          :key="`${event.date || ''}-${event.title}`"
          class="viz-timeline__item"
          :class="{ 'viz-timeline__item--current': events.indexOf(event) === currentIndex }"
        >
          <time v-if="showDate && event.date" class="viz-timeline__date">{{ event.date }}</time>
          <a v-if="event.link" :href="event.link" class="viz-timeline__title">{{ event.title }}</a>
          <strong v-else class="viz-timeline__title">{{ event.title }}</strong>
          <p v-if="event.description">{{ event.description }}</p>
          <span v-if="event.type" class="viz-timeline__type">{{ event.type }}</span>
        </li>
      </ol>
    </div>

    <p v-if="source" class="viz-timeline__source">
      来源：{{ source.name }}<span v-if="source.asOf">（截至 {{ source.asOf }}）</span>
    </p>
  </section>
</template>

<style scoped>
.viz-timeline {
  margin: 24px 0;
}

.viz-timeline__empty {
  padding: 14px;
  border: 1px dashed var(--vp-c-divider);
  border-radius: 10px;
  color: var(--vp-c-text-2);
  text-align: center;
}

.viz-timeline__group-title {
  margin: 18px 0 10px;
  font-size: 16px;
}

.viz-timeline__list {
  display: grid;
  gap: 14px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.viz-timeline[data-orientation='horizontal'] .viz-timeline__list {
  grid-auto-flow: column;
  grid-auto-columns: minmax(220px, 1fr);
  overflow-x: auto;
}

.viz-timeline__item {
  position: relative;
  padding: 14px 14px 14px 20px;
  border: 1px solid var(--vp-c-divider);
  border-left: 4px solid var(--vp-c-brand-1);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
}

.viz-timeline[data-density='compact'] .viz-timeline__item {
  padding: 10px 12px 10px 16px;
}

.viz-timeline__item--current {
  box-shadow: 0 0 0 2px var(--vp-c-brand-2);
}

.viz-timeline__date {
  display: block;
  color: var(--vp-c-text-2);
  font-size: 12px;
}

.viz-timeline__title {
  display: block;
  margin-top: 4px;
  color: var(--vp-c-text-1);
  font-weight: 700;
  text-decoration: none;
}

.viz-timeline__item p,
.viz-timeline__source {
  margin: 8px 0 0;
  color: var(--vp-c-text-2);
  font-size: 13px;
  line-height: 1.6;
}

.viz-timeline__type {
  display: inline-block;
  margin-top: 8px;
  border-radius: 999px;
  padding: 3px 8px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  font-size: 12px;
}
</style>
