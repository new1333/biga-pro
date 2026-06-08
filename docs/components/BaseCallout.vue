<script setup lang="ts">
import { computed, ref } from 'vue'

/**
 * Markdown 用法：
 *
 * <BaseCallout type="tip" title="学习提示">
 *   这里放置页面作者提供的简短提示。
 * </BaseCallout>
 *
 * 示例数据只用于展示组件结构，不承载课程正文。
 */

type CalloutType = 'info' | 'tip' | 'warning' | 'danger' | 'note' | 'check'
type CalloutTone = 'neutral' | 'brand' | 'risk'

const baseCalloutExampleData = {
  type: 'tip',
  title: '学习提示',
  compact: false,
  tone: 'neutral'
}

const props = withDefaults(
  defineProps<{
    type?: CalloutType
    title?: string
    icon?: string | false
    compact?: boolean
    dismissible?: boolean
    tone?: CalloutTone
    ariaLabel?: string
  }>(),
  {
    type: 'info',
    title: '',
    icon: undefined,
    compact: false,
    dismissible: false,
    tone: 'neutral',
    ariaLabel: ''
  }
)

const dismissed = ref(false)

const defaultIconMap: Record<CalloutType, string> = {
  info: 'i',
  tip: '✓',
  warning: '!',
  danger: '!',
  note: '•',
  check: '✓'
}

const visibleIcon = computed(() => {
  if (props.icon === false) return ''
  return props.icon || defaultIconMap[props.type]
})

const label = computed(() => props.ariaLabel || props.title || '提示信息')
</script>

<template>
  <aside
    v-if="!dismissed"
    class="base-callout"
    :class="{ 'base-callout--compact': compact }"
    :data-type="type"
    :data-tone="tone"
    :aria-label="label"
  >
    <div v-if="visibleIcon" class="base-callout__icon" aria-hidden="true">{{ visibleIcon }}</div>
    <div class="base-callout__body">
      <header v-if="title || dismissible" class="base-callout__header">
        <strong v-if="title">{{ title }}</strong>
        <button
          v-if="dismissible"
          class="base-callout__close"
          type="button"
          aria-label="关闭提示"
          @click="dismissed = true"
        >
          ×
        </button>
      </header>
      <div class="base-callout__content">
        <slot />
      </div>
    </div>
  </aside>
</template>

<style scoped>
.base-callout {
  display: flex;
  gap: 12px;
  margin: 20px 0;
  padding: 16px;
  border: 1px solid var(--vp-c-divider);
  border-left-width: 4px;
  border-radius: 14px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
}

.base-callout--compact {
  padding: 12px;
}

.base-callout[data-tone='brand'],
.base-callout[data-type='tip'],
.base-callout[data-type='check'] {
  border-left-color: var(--vp-c-brand-1);
}

.base-callout[data-type='warning'],
.base-callout[data-tone='risk'] {
  border-left-color: #f59e0b;
  background: rgba(245, 158, 11, 0.1);
}

.base-callout[data-type='danger'] {
  border-left-color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
}

.base-callout__icon {
  display: grid;
  flex: 0 0 28px;
  width: 28px;
  height: 28px;
  place-items: center;
  border-radius: 50%;
  background: var(--vp-c-bg);
  color: var(--vp-c-brand-1);
  font-weight: 800;
}

.base-callout__body {
  flex: 1;
  min-width: 0;
}

.base-callout__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 6px;
}

.base-callout__close {
  border: 0;
  background: transparent;
  color: var(--vp-c-text-2);
  cursor: pointer;
  font-size: 18px;
  line-height: 1;
}

.base-callout__content {
  color: var(--vp-c-text-1);
  line-height: 1.7;
}
</style>
