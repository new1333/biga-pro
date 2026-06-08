<script setup lang="ts">
import Quiz from './Quiz.vue'

/**
 * Markdown 用法：
 *
 * <LearnQuiz
 *   id="pe-basic"
 *   type="single"
 *   question="市盈率（PE）通常用于观察什么？"
 *   :options="[
 *     { id: 'A', label: '股价相对于每股收益的估值水平' },
 *     { id: 'B', label: '股票每天一定上涨的概率' }
 *   ]"
 *   answer="A"
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

const learnQuizExampleData = {
  id: 'pe-basic',
  type: 'single',
  question: '市盈率（PE）通常用于观察什么？',
  options: [
    { id: 'A', label: '股价相对于每股收益的估值水平' },
    { id: 'B', label: '股票每天一定上涨的概率' }
  ],
  answer: 'A'
}

withDefaults(
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
</script>

<template>
  <Quiz
    class="learn-quiz"
    :id="id"
    :type="type"
    :question="question"
    :options="options"
    :answer="answer"
    :explanation="explanation"
    :shuffle="shuffle"
    :show-answer-mode="showAnswerMode"
    :attempts="attempts"
    :persist-key="persistKey"
    @submit="emit('submit', $event)"
    @reveal="emit('reveal', $event)"
  />
</template>

<style scoped>
.learn-quiz {
  border-left: 4px solid var(--vp-c-brand-1);
}
</style>
