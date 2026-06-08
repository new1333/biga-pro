<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'

/**
 * Markdown 用法：
 *
 * <Quiz
 *   id="pe-basic"
 *   type="single"
 *   question="市盈率（PE）通常用于观察什么？"
 *   :options="[
 *     { id: 'A', label: '股价相对于每股收益的估值水平' },
 *     { id: 'B', label: '股票每天一定上涨的概率' }
 *   ]"
 *   answer="A"
 *   explanation="PE 是估值指标，不是收益保证。"
 * />
 *
 * 示例题用于说明交互结构，不构成课程题库或投资建议。
 */

type QuizType = 'single' | 'multiple' | 'true-false' | 'scenario'
type ShowAnswerMode = 'immediate' | 'after-submit' | 'manual'

type QuizOption = {
  id: string
  label: string
}

type QuizResult = {
  id: string
  selected: string[]
  correct?: boolean
  attemptsUsed: number
}

const quizExampleData = {
  id: 'pe-basic',
  type: 'single',
  question: '市盈率（PE）通常用于观察什么？',
  options: [
    { id: 'A', label: '股价相对于每股收益的估值水平' },
    { id: 'B', label: '股票每天一定上涨的概率' }
  ],
  answer: 'A',
  explanation: 'PE 是估值指标，不是收益保证。'
}

const props = withDefaults(
  defineProps<{
    id?: string
    type?: QuizType
    question: string
    options?: QuizOption[]
    answer?: string | string[]
    explanation?: string
    shuffle?: boolean
    showAnswerMode?: ShowAnswerMode
    attempts?: number
    persistKey?: string
  }>(),
  {
    id: '',
    type: 'single',
    options: () => [],
    answer: undefined,
    explanation: '',
    shuffle: false,
    showAnswerMode: 'after-submit',
    attempts: 1,
    persistKey: ''
  }
)

const emit = defineEmits<{
  submit: [result: QuizResult]
  reveal: [answer: string[]]
}>()

const selectedIds = ref<string[]>([])
const visibleOptions = ref<QuizOption[]>([])
const submitted = ref(false)
const answerRevealed = ref(false)
const attemptsUsed = ref(0)
const isClient = ref(false)

const normalizedAnswer = computed(() => {
  if (Array.isArray(props.answer)) return props.answer
  return props.answer ? [props.answer] : []
})

const hasAnswer = computed(() => normalizedAnswer.value.length > 0)
const isMultiple = computed(() => props.type === 'multiple')
const radioName = computed(() => `quiz-${props.id || 'anonymous'}`)
const maxAttempts = computed(() => Math.max(1, props.attempts))
const remainingAttempts = computed(() => Math.max(0, maxAttempts.value - attemptsUsed.value))

const singleSelection = computed({
  get: () => selectedIds.value[0] ?? '',
  set: (value: string) => {
    selectedIds.value = value ? [value] : []
  }
})

const isCorrect = computed(() => {
  if (!hasAnswer.value) return undefined
  const selected = [...selectedIds.value].sort()
  const answer = [...normalizedAnswer.value].sort()
  return selected.length === answer.length && selected.every((item, index) => item === answer[index])
})

const shouldShowAnswer = computed(() => {
  if (!hasAnswer.value) return false
  if (props.showAnswerMode === 'immediate') return selectedIds.value.length > 0
  if (props.showAnswerMode === 'manual') return answerRevealed.value
  return submitted.value
})

const locked = computed(() => submitted.value)
const canSubmit = computed(
  () => selectedIds.value.length > 0 && !submitted.value && remainingAttempts.value > 0
)
const storageKey = computed(() => props.persistKey || (props.id ? `vitepress-quiz:${props.id}` : ''))

function shuffleOptions(options: QuizOption[]) {
  return [...options].sort(() => Math.random() - 0.5)
}

function refreshOptions() {
  visibleOptions.value = props.shuffle && isClient.value ? shuffleOptions(props.options) : [...props.options]
}

function resetState() {
  selectedIds.value = []
  submitted.value = false
  answerRevealed.value = false
  attemptsUsed.value = 0
  refreshOptions()
}

function submitAnswer() {
  if (!canSubmit.value) return
  submitted.value = true
  attemptsUsed.value += 1
  emit('submit', {
    id: props.id,
    selected: [...selectedIds.value],
    correct: isCorrect.value,
    attemptsUsed: attemptsUsed.value
  })
}

function retry() {
  if (remainingAttempts.value <= 0 || isCorrect.value === true) return
  selectedIds.value = []
  submitted.value = false
  answerRevealed.value = false
}

function revealAnswer() {
  answerRevealed.value = true
  emit('reveal', [...normalizedAnswer.value])
}

function optionClass(optionId: string) {
  if (!shouldShowAnswer.value) return ''
  if (normalizedAnswer.value.includes(optionId)) return 'quiz__option--correct'
  if (selectedIds.value.includes(optionId)) return 'quiz__option--wrong'
  return ''
}

function loadPersistedState() {
  if (!storageKey.value || typeof window === 'undefined') return
  const raw = window.localStorage.getItem(storageKey.value)
  if (!raw) return

  try {
    const saved = JSON.parse(raw) as {
      selectedIds?: string[]
      submitted?: boolean
      answerRevealed?: boolean
      attemptsUsed?: number
    }

    selectedIds.value = Array.isArray(saved.selectedIds) ? saved.selectedIds : []
    submitted.value = Boolean(saved.submitted)
    answerRevealed.value = Boolean(saved.answerRevealed)
    attemptsUsed.value = typeof saved.attemptsUsed === 'number' ? saved.attemptsUsed : 0
  } catch (error) {
    console.warn(`无法读取测验进度：${storageKey.value}`, error)
    window.localStorage.removeItem(storageKey.value)
  }
}

function persistState() {
  if (!storageKey.value || typeof window === 'undefined') return
  window.localStorage.setItem(
    storageKey.value,
    JSON.stringify({
      selectedIds: selectedIds.value,
      submitted: submitted.value,
      answerRevealed: answerRevealed.value,
      attemptsUsed: attemptsUsed.value
    })
  )
}

watch(
  () => [props.options, props.shuffle],
  refreshOptions,
  { deep: true, immediate: true }
)

watch(
  () => [props.id, props.question],
  resetState
)

watch(
  () => [selectedIds.value, submitted.value, answerRevealed.value, attemptsUsed.value],
  persistState,
  { deep: true }
)

onMounted(() => {
  isClient.value = true
  refreshOptions()
  loadPersistedState()
})
</script>

<template>
  <section class="quiz" :aria-label="question">
    <header class="quiz__header">
      <p class="quiz__type">{{ type === 'multiple' ? '多选题' : type === 'true-false' ? '判断题' : type === 'scenario' ? '情景题' : '单选题' }}</p>
      <p class="quiz__attempts">剩余 {{ remainingAttempts }} 次</p>
    </header>

    <h3 class="quiz__question">{{ question }}</h3>

    <div v-if="!visibleOptions.length" class="quiz__empty">
      暂无选项，请通过 options 传入题目选项。
    </div>

    <fieldset v-else class="quiz__options" :disabled="locked">
      <legend class="quiz__legend">请选择答案</legend>
      <label
        v-for="option in visibleOptions"
        :key="option.id"
        class="quiz__option"
        :class="optionClass(option.id)"
      >
        <input
          v-if="isMultiple"
          v-model="selectedIds"
          type="checkbox"
          :value="option.id"
        />
        <input
          v-else
          v-model="singleSelection"
          type="radio"
          :name="radioName"
          :value="option.id"
        />
        <span class="quiz__option-id">{{ option.id }}</span>
        <span>{{ option.label }}</span>
      </label>
    </fieldset>

    <div class="quiz__actions">
      <button class="quiz__button" type="button" :disabled="!canSubmit" @click="submitAnswer">
        提交答案
      </button>
      <button
        v-if="submitted && isCorrect === false && remainingAttempts > 0"
        class="quiz__button quiz__button--secondary"
        type="button"
        @click="retry"
      >
        再试一次
      </button>
      <button
        v-if="showAnswerMode === 'manual' && hasAnswer && !answerRevealed"
        class="quiz__button quiz__button--secondary"
        type="button"
        @click="revealAnswer"
      >
        查看答案
      </button>
    </div>

    <div v-if="shouldShowAnswer" class="quiz__feedback" :data-correct="isCorrect">
      <strong v-if="isCorrect === true">回答正确</strong>
      <strong v-else-if="isCorrect === false">回答不完全正确</strong>
      <strong v-else>已提交</strong>
      <p v-if="hasAnswer">参考答案：{{ normalizedAnswer.join('、') }}</p>
      <p v-if="explanation">{{ explanation }}</p>
    </div>
  </section>
</template>

<style scoped>
.quiz {
  margin: 24px 0;
  padding: 18px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  background: var(--vp-c-bg-soft);
}

.quiz__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.quiz__type,
.quiz__attempts {
  margin: 0;
  color: var(--vp-c-text-2);
  font-size: 13px;
}

.quiz__question {
  margin: 10px 0 14px;
  color: var(--vp-c-text-1);
  font-size: 18px;
  line-height: 1.5;
}

.quiz__empty {
  padding: 14px;
  border: 1px dashed var(--vp-c-divider);
  border-radius: 10px;
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg);
}

.quiz__options {
  display: grid;
  gap: 10px;
  margin: 0;
  padding: 0;
  border: 0;
}

.quiz__legend {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
}

.quiz__option {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  padding: 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  background: var(--vp-c-bg);
  cursor: pointer;
  line-height: 1.6;
}

.quiz__option input {
  margin-top: 4px;
}

.quiz__option-id {
  display: inline-grid;
  flex: 0 0 24px;
  width: 24px;
  height: 24px;
  place-items: center;
  border-radius: 50%;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  font-size: 12px;
  font-weight: 700;
}

.quiz__option--correct {
  border-color: rgba(22, 163, 74, 0.55);
  background: rgba(22, 163, 74, 0.1);
}

.quiz__option--wrong {
  border-color: rgba(239, 68, 68, 0.5);
  background: rgba(239, 68, 68, 0.1);
}

.quiz__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 14px;
}

.quiz__button {
  border: 1px solid var(--vp-c-brand-1);
  border-radius: 999px;
  padding: 8px 16px;
  background: var(--vp-c-brand-1);
  color: var(--vp-c-white);
  cursor: pointer;
  font-weight: 700;
}

.quiz__button:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.quiz__button--secondary {
  background: transparent;
  color: var(--vp-c-brand-1);
}

.quiz__feedback {
  margin-top: 14px;
  padding: 12px;
  border-radius: 10px;
  background: var(--vp-c-bg);
}

.quiz__feedback[data-correct='true'] {
  border-left: 4px solid #16a34a;
}

.quiz__feedback[data-correct='false'] {
  border-left: 4px solid #ef4444;
}

.quiz__feedback p {
  margin: 6px 0 0;
  color: var(--vp-c-text-2);
  line-height: 1.7;
}
</style>
