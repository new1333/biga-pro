/// <reference types="vite/client" />
import type { App, Component } from 'vue'

/**
 * 将文件路径转换为 PascalCase 组件名
 *   components/VizECharts.vue → VizECharts
 *   components/learn-quiz.vue → LearnQuiz
 */
function toPascalName(filePath: string): string {
  return filePath
    .split('/').pop()!
    .replace(/\.\w+$/, '')
    .replace(/(?:^|[-_.])(\w)/g, (_, c) => c.toUpperCase())
}

/**
 * eager 模式：所有组件立即加载（适合 SSR 一致性）
 */
export function registerComponents(app: App) {
  const modules = import.meta.glob<{ default: Component }>(
    '../../components/*.vue',
    { eager: true }
  )

  for (const [path, mod] of Object.entries(modules)) {
    app.component(toPascalName(path), mod.default)
  }
}
