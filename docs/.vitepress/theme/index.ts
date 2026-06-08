import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import { registerComponents } from './register-components'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    registerComponents(app)
  }
} satisfies Theme
