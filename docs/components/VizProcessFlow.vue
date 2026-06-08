<script setup lang="ts">
/**
 * Markdown 用法：
 *
 * <VizProcessFlow
 *   :steps="[
 *     { id: 'open', title: '开户', description: '了解账户类型和基础规则' },
 *     { id: 'learn', title: '学习', description: '先理解风险，再学习估值' }
 *   ]"
 * />
 *
 * 示例数据用于说明流程结构，不代表唯一投资流程。
 */

type FlowStep = {
  id: string
  title: string
  description?: string
  status?: string
  next?: string[]
}

const vizProcessFlowExampleData: FlowStep[] = [
  { id: 'open', title: '开户', description: '了解账户类型和基础规则' },
  { id: 'learn', title: '学习', description: '先理解风险，再学习估值' }
]

withDefaults(
  defineProps<{
    steps?: FlowStep[]
    direction?: 'vertical' | 'horizontal'
    numbered?: boolean
    current?: string
    clickable?: boolean
    allowBranching?: boolean
    ariaLabel?: string
  }>(),
  {
    steps: () => [],
    direction: 'vertical',
    numbered: true,
    current: '',
    clickable: false,
    allowBranching: false,
    ariaLabel: '流程图'
  }
)

const emit = defineEmits<{
  select: [step: FlowStep]
}>()
</script>

<template>
  <nav class="viz-flow" :data-direction="direction" :aria-label="ariaLabel">
    <p v-if="!steps.length" class="viz-flow__empty">暂无流程节点</p>
    <ol v-else class="viz-flow__list">
      <li
        v-for="(step, index) in steps"
        :key="step.id"
        class="viz-flow__item"
        :class="{ 'viz-flow__item--current': step.id === current, 'viz-flow__item--clickable': clickable }"
      >
        <button
          class="viz-flow__button"
          type="button"
          :disabled="!clickable"
          @click="emit('select', step)"
        >
          <span v-if="numbered" class="viz-flow__number">{{ index + 1 }}</span>
          <span class="viz-flow__content">
            <strong>{{ step.title }}</strong>
            <span v-if="step.description">{{ step.description }}</span>
            <small v-if="allowBranching && step.next?.length">下一步：{{ step.next.join('、') }}</small>
          </span>
        </button>
      </li>
    </ol>
  </nav>
</template>

<style scoped>
.viz-flow {
  margin: 24px 0;
}

.viz-flow__empty {
  padding: 14px;
  border: 1px dashed var(--vp-c-divider);
  border-radius: 10px;
  color: var(--vp-c-text-2);
  text-align: center;
}

.viz-flow__list {
  display: grid;
  gap: 14px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.viz-flow[data-direction='horizontal'] .viz-flow__list {
  grid-auto-flow: column;
  grid-auto-columns: minmax(220px, 1fr);
  overflow-x: auto;
}

.viz-flow__item {
  position: relative;
}

.viz-flow__button {
  display: flex;
  width: 100%;
  gap: 12px;
  align-items: flex-start;
  padding: 14px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  text-align: left;
}

.viz-flow__button:disabled {
  cursor: default;
}

.viz-flow__item--clickable .viz-flow__button {
  cursor: pointer;
}

.viz-flow__item--current .viz-flow__button {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 0 0 2px var(--vp-c-brand-soft);
}

.viz-flow__number {
  display: grid;
  flex: 0 0 30px;
  width: 30px;
  height: 30px;
  place-items: center;
  border-radius: 50%;
  background: var(--vp-c-brand-1);
  color: var(--vp-c-white);
  font-weight: 800;
}

.viz-flow__content {
  display: grid;
  gap: 5px;
}

.viz-flow__content span,
.viz-flow__content small {
  color: var(--vp-c-text-2);
  line-height: 1.6;
}
</style>
