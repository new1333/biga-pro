<script setup lang="ts">
import { computed } from 'vue'

/**
 * Markdown 用法：
 *
 * <BaseDataSource
 *   :source="{ name: '示例数据源', asOf: '2024-06-30', updatedAt: '2024-07-01' }"
 * />
 *
 * 示例数据只用于说明来源字段，不代表真实授权或数据口径。
 */

type DataSource = {
  name: string
  url?: string
  asOf?: string
  updatedAt?: string
  license?: string
}

const baseDataSourceExampleData: DataSource = {
  name: '示例数据源',
  asOf: '2024-06-30',
  updatedAt: '2024-07-01',
  license: '示例授权'
}

const props = withDefaults(
  defineProps<{
    source?: DataSource | DataSource[]
    compact?: boolean
    showLicense?: boolean
    showUpdatedAt?: boolean
    placement?: 'inline' | 'footer' | 'caption'
  }>(),
  {
    source: undefined,
    compact: true,
    showLicense: false,
    showUpdatedAt: true,
    placement: 'caption'
  }
)

const sources = computed(() => {
  if (!props.source) return []
  return Array.isArray(props.source) ? props.source : [props.source]
})

function sourceParts(item: DataSource) {
  return [
    item.asOf ? `截至 ${item.asOf}` : '',
    props.showUpdatedAt && item.updatedAt ? `更新于 ${item.updatedAt}` : '',
    props.showLicense && item.license ? `授权：${item.license}` : ''
  ].filter(Boolean)
}
</script>

<template>
  <div
    v-if="sources.length"
    class="base-data-source"
    :class="{ 'base-data-source--compact': compact }"
    :data-placement="placement"
  >
    <span class="base-data-source__label">数据来源：</span>
    <ul class="base-data-source__list">
      <li v-for="item in sources" :key="`${item.name}-${item.asOf || ''}`">
        <a v-if="item.url" :href="item.url" target="_blank" rel="noopener noreferrer">
          {{ item.name }}
        </a>
        <span v-else>{{ item.name }}</span>
        <span v-if="sourceParts(item).length">（{{ sourceParts(item).join('，') }}）</span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.base-data-source {
  display: flex;
  gap: 6px;
  align-items: flex-start;
  margin: 12px 0;
  color: var(--vp-c-text-2);
  font-size: 13px;
  line-height: 1.6;
}

.base-data-source--compact {
  margin: 8px 0;
  font-size: 12px;
}

.base-data-source[data-placement='footer'] {
  padding-top: 12px;
  border-top: 1px solid var(--vp-c-divider);
}

.base-data-source__label {
  flex: 0 0 auto;
}

.base-data-source__list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 12px;
  margin: 0;
  padding: 0;
  list-style: none;
}
</style>
