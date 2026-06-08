<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'

/**
 * Markdown 用法：
 *
 * <LearnReflection
 *   id="reflection-risk"
 *   prompt="如果一只股票短期大涨，你会先检查哪些风险？"
 *   :hints="['先看是否理解公司业务', '再看估值和资金占比']"
 * />
 *
 * 示例问题用于说明组件结构，不构成投资建议。
 */

type RubricItem = {
  label: string
  description?: string
}

const learnReflectionExampleData = {
  id: 'reflection-risk',
  prompt: '如果一只股票短期大涨，你会先检查哪些风险？',
  hints: ['先看是否理解公司业务', '再看估值和资金占比'],
  rubric: [{ label: '能否说明风险来源' }, { label: '是否避免收益承诺' }]
}

const props = withDefaults(
  defineProps<{
    id?: string
    prompt?: string
    context?: string
    hints?: string[]
    rubric?: RubricItem[]
    minWords?: number
    allowPrivateNote?: boolean
    storageKey?: string
    exportable?: boolean
  }>(),
  {
    id: '',
    prompt: '',
    context: '',
    hints: () => [],
    rubric: () => [],
    minWords: undefined,
    allowPrivateNote: true,
    storageKey: '',
    exportable: false
  }
)

const note = ref('')
const savedAt = ref('')
const key = computed(() => props.storageKey || (props.id ? `learn-reflection:${props.id}` : ''))
const wordCount = computed(() => note.value.trim().split(/\s+/).filter(Boolean).length)
const meetsMinWords = computed(() => !props.minWords || wordCount.value >= props.minWords)

function persistNote() {
  if (!props.allowPrivateNote || !key.value || typeof window === 'undefined') return
  window.localStorage.setItem(key.value, note.value)
  savedAt.value = new Date().toLocaleString()
}

function exportNote() {
  if (typeof window === 'undefined') return
  const blob = new Blob([`${props.prompt}\n\n${note.value}`], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${props.id || 'reflection'}.txt`
  link.click()
  URL.revokeObjectURL(url)
}

watch(note, persistNote)

onMounted(() => {
  if (!key.value || typeof window === 'undefined') return
  note.value = window.localStorage.getItem(key.value) || ''
})
</script>

<template>
  <section class="learn-reflection">
    <header class="learn-reflection__header">
      <p class="learn-reflection__label">思考题</p>
      <p v-if="minWords" class="learn-reflection__count">
        {{ wordCount }}/{{ minWords }} 词
      </p>
    </header>

    <h3>{{ prompt || '请通过 prompt 传入思考题' }}</h3>
    <p v-if="context" class="learn-reflection__context">{{ context }}</p>

    <ul v-if="hints.length" class="learn-reflection__hints">
      <li v-for="hint in hints" :key="hint">{{ hint }}</li>
    </ul>

    <textarea
      v-if="allowPrivateNote"
      v-model="note"
      class="learn-reflection__textarea"
      rows="6"
      placeholder="在这里记录你的思考，内容只保存在本地浏览器。"
    />

    <p v-if="allowPrivateNote && savedAt" class="learn-reflection__saved">已本地保存：{{ savedAt }}</p>
    <p v-if="minWords && !meetsMinWords" class="learn-reflection__warning">建议继续补充，让思考更完整。</p>

    <dl v-if="rubric.length" class="learn-reflection__rubric">
      <div v-for="item in rubric" :key="item.label">
        <dt>{{ item.label }}</dt>
        <dd v-if="item.description">{{ item.description }}</dd>
      </div>
    </dl>

    <button
      v-if="exportable && allowPrivateNote"
      class="learn-reflection__button"
      type="button"
      @click="exportNote"
    >
      导出记录
    </button>
  </section>
</template>

<style scoped>
.learn-reflection {
  margin: 24px 0;
  padding: 18px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  background: var(--vp-c-bg-soft);
}

.learn-reflection__header {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  color: var(--vp-c-text-2);
  font-size: 13px;
}

.learn-reflection h3 {
  margin: 8px 0;
  font-size: 18px;
}

.learn-reflection__context,
.learn-reflection__saved,
.learn-reflection__warning {
  margin: 8px 0 0;
  color: var(--vp-c-text-2);
  font-size: 13px;
  line-height: 1.6;
}

.learn-reflection__hints {
  margin: 12px 0;
  padding-left: 20px;
  color: var(--vp-c-text-1);
}

.learn-reflection__textarea {
  width: 100%;
  box-sizing: border-box;
  margin-top: 12px;
  padding: 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  line-height: 1.6;
}

.learn-reflection__rubric {
  display: grid;
  gap: 8px;
  margin: 14px 0 0;
}

.learn-reflection__rubric div {
  padding: 10px;
  border-radius: 10px;
  background: var(--vp-c-bg);
}

.learn-reflection__rubric dt {
  font-weight: 700;
}

.learn-reflection__rubric dd {
  margin: 4px 0 0;
  color: var(--vp-c-text-2);
}

.learn-reflection__button {
  margin-top: 14px;
  border: 1px solid var(--vp-c-brand-1);
  border-radius: 999px;
  padding: 8px 16px;
  background: var(--vp-c-brand-1);
  color: var(--vp-c-white);
  cursor: pointer;
  font-weight: 700;
}
</style>
