<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'

/**
 * Markdown 用法：
 *
 * <LearnProgress
 *   path-id="beginner"
 *   variant="checklist"
 *   :items="[
 *     { id: 'risk', title: '理解风险', href: '#' },
 *     { id: 'pe', title: '学习市盈率', href: '#' }
 *   ]"
 * />
 *
 * 示例数据只用于说明本地学习进度结构。
 */

type ProgressItem = {
  id: string
  title: string
  href?: string
  status?: string
}

const learnProgressExampleData = {
  pathId: 'beginner',
  items: [
    { id: 'risk', title: '理解风险', href: '#' },
    { id: 'pe', title: '学习市盈率', href: '#' }
  ]
}

const props = withDefaults(
  defineProps<{
    pathId?: string
    items?: ProgressItem[]
    persistKey?: string
    showPercent?: boolean
    allowReset?: boolean
    variant?: 'bar' | 'checklist' | 'roadmap'
  }>(),
  {
    pathId: '',
    items: () => [],
    persistKey: '',
    showPercent: true,
    allowReset: false,
    variant: 'bar'
  }
)

const completedIds = ref<string[]>([])
const key = computed(() => props.persistKey || (props.pathId ? `learn-progress:${props.pathId}` : ''))
const completedCount = computed(() => props.items.filter((item) => completedIds.value.includes(item.id) || item.status === 'done').length)
const percent = computed(() => (props.items.length ? Math.round((completedCount.value / props.items.length) * 100) : 0))

function toggleItem(id: string) {
  completedIds.value = completedIds.value.includes(id)
    ? completedIds.value.filter((item) => item !== id)
    : [...completedIds.value, id]
}

function resetProgress() {
  completedIds.value = []
}

watch(
  completedIds,
  () => {
    if (!key.value || typeof window === 'undefined') return
    window.localStorage.setItem(key.value, JSON.stringify(completedIds.value))
  },
  { deep: true }
)

onMounted(() => {
  if (!key.value || typeof window === 'undefined') return
  const raw = window.localStorage.getItem(key.value)
  completedIds.value = raw ? JSON.parse(raw) : []
})
</script>

<template>
  <section class="learn-progress" :data-variant="variant">
    <header class="learn-progress__header">
      <strong>学习进度</strong>
      <span v-if="showPercent">{{ percent }}%</span>
    </header>

    <div class="learn-progress__bar" aria-hidden="true">
      <span :style="{ width: `${percent}%` }" />
    </div>

    <ol v-if="variant !== 'bar'" class="learn-progress__items">
      <li
        v-for="item in items"
        :key="item.id"
        :class="{ 'learn-progress__item--done': completedIds.includes(item.id) || item.status === 'done' }"
      >
        <label>
          <input
            type="checkbox"
            :checked="completedIds.includes(item.id) || item.status === 'done'"
            @change="toggleItem(item.id)"
          />
          <a v-if="item.href" :href="item.href">{{ item.title }}</a>
          <span v-else>{{ item.title }}</span>
        </label>
      </li>
    </ol>

    <p v-if="!items.length" class="learn-progress__empty">暂无学习节点</p>

    <button
      v-if="allowReset"
      class="learn-progress__reset"
      type="button"
      @click="resetProgress"
    >
      重置进度
    </button>
  </section>
</template>

<style scoped>
.learn-progress {
  margin: 24px 0;
  padding: 18px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  background: var(--vp-c-bg-soft);
}

.learn-progress__header {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.learn-progress__bar {
  height: 10px;
  margin-top: 12px;
  overflow: hidden;
  border-radius: 999px;
  background: var(--vp-c-bg);
}

.learn-progress__bar span {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: var(--vp-c-brand-1);
  transition: width 0.2s ease;
}

.learn-progress__items {
  display: grid;
  gap: 10px;
  margin: 14px 0 0;
  padding: 0;
  list-style: none;
}

.learn-progress[data-variant='roadmap'] .learn-progress__items {
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
}

.learn-progress__items li {
  padding: 10px;
  border-radius: 10px;
  background: var(--vp-c-bg);
}

.learn-progress__items label {
  display: flex;
  gap: 8px;
  align-items: center;
}

.learn-progress__item--done {
  opacity: 0.72;
}

.learn-progress__empty {
  margin: 12px 0 0;
  color: var(--vp-c-text-2);
}

.learn-progress__reset {
  margin-top: 14px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 999px;
  padding: 7px 14px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  cursor: pointer;
}
</style>
