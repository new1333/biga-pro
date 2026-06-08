# 投资学习网站组件体系规格

> 目标：为 VitePress 投资学习网站设计可复用组件体系，服务“从零基础投资新手成长为能够独立进行 A 股投资的投资者”的学习路径，并预留港股、美股、ETF、基金、债券、REITs、加密货币、量化投资等扩展空间。
>
> 说明：本文只定义组件结构、交互、数据模型与使用边界，不生成课程内容。所有示例均使用占位数据或示意数据。

## 1. 组件设计原则

1. **内容与结构分离**：组件只承载展示结构、交互方式、风险边界和数据契约；课程内容由 Markdown 页面、数据文件或后续 CMS 注入。
2. **先 A 股，后多资产扩展**：所有证券、市场、组合、图表类组件都应通过 `market`、`assetClass`、`currency`、`exchange` 等字段表达资产范围，避免把 A 股逻辑写死。
3. **VitePress 友好**：组件应支持在 Markdown 中直接使用；依赖浏览器 API 的组件需要放入 `<ClientOnly>` 或内部延迟加载。
4. **风险提示前置**：涉及收益、估值、案例、组合、回测、加密资产、杠杆等内容时，应能显式绑定风险提示组件。
5. **数据可追溯**：行情、财报、图表、组合、案例数据都应支持 `source`、`asOf`、`updatedAt` 等元信息。
6. **可访问性优先**：图表、流程图、公式、测验必须提供标题、说明、替代文本或键盘可访问交互。

## 2. 全站通用组件判定

全站通用组件应满足以下任一条件：

- 在多数学习页面反复出现，例如术语、提示、风险提示、公式、测验、思考题。
- 跨资产类别复用，例如股票卡、财报表、组合、图表、时间轴。
- 对一致性和合规边界有要求，例如风险提示、数据来源、案例分析。
- 需要统一技术封装，例如 Mermaid、ECharts、公式渲染。

不建议全站注册的组件：

- 只服务某一个章节的一次性排版组件。
- 强绑定某个具体课程内容的组件。
- 尚未抽象出跨市场、跨资产模型的实验性组件。

## 3. 推荐组件分层

| 层级 | 命名前缀 | 职责 | 是否建议全站注册 |
| --- | --- | --- | --- |
| 基础内容层 | `Base*` | 提示框、数据来源、标签、折叠面板等通用 UI | 是 |
| 学习交互层 | `Learn*` | 测验、思考题、学习进度、案例分析任务 | 是 |
| 投资领域层 | `Invest*` | 证券、财报、估值指标、投资组合、风险提示 | 是 |
| 可视化层 | `Viz*` | 图表、时间轴、流程图、Mermaid、ECharts | 是 |
| 页面布局层 | `Page*` | 专题页、目录页、章节页专属布局 | 视复用程度决定 |

推荐目录：

```txt
.vitepress/theme/
  index.ts
  components/
    base/
      BaseCallout.vue
      BaseDataSource.vue
    learning/
      LearnQuiz.vue
      LearnReflection.vue
      LearnCaseStudy.vue
    investment/
      InvestTerm.vue
      InvestRiskNotice.vue
      InvestSecurityCard.vue
      InvestFinancialReport.vue
      InvestPortfolio.vue
      InvestMetricBadge.vue
    visualization/
      VizFormula.vue
      VizChart.vue
      VizTimeline.vue
      VizProcessFlow.vue
      VizMermaid.vue
      VizECharts.vue
    types/
      investment.ts
      learning.ts
      visualization.ts
```

## 4. 共享类型建议

```ts
type Market =
  | 'CN-A'
  | 'HK'
  | 'US'
  | 'GLOBAL'
  | 'CRYPTO'

type AssetClass =
  | 'stock'
  | 'etf'
  | 'fund'
  | 'bond'
  | 'reit'
  | 'crypto'
  | 'cash'
  | 'strategy'

type RiskLevel = 'low' | 'medium' | 'high' | 'critical'

type DataSource = {
  name: string
  url?: string
  asOf?: string
  updatedAt?: string
  license?: string
}

type ComponentSize = 'sm' | 'md' | 'lg'
```

## 5. 组件规格

### 5.1 术语组件：`InvestTerm`

**组件用途**

用于统一展示投资术语。支持行内解释、悬浮提示、术语页跳转和术语卡片，避免同一术语在多个页面重复解释。

**Props 设计**

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `id` | `string` | - | 术语库中的唯一 ID |
| `term` | `string` | - | 术语名称；未传时优先从术语库按 `id` 回填 |
| `definition` | `string` | - | 可选短解释；优先从术语库读取 |
| `aliases` | `string[]` | `[]` | 别名、英文缩写或常见写法 |
| `mode` | `'tooltip' \| 'inline' \| 'card' \| 'link'` | `'tooltip'` | 展示方式 |
| `level` | `'beginner' \| 'intermediate' \| 'advanced'` | `'beginner'` | 术语难度 |
| `href` | `string` | - | 术语详情页链接 |
| `source` | `DataSource` | - | 解释来源 |
| `related` | `string[]` | `[]` | 关联术语 ID |

**使用场景**

- 正文中第一次出现关键术语。
- 章节开头的术语清单。
- 测验、案例、财报表中的字段解释。

**示例**

```md
<InvestTerm id="term-placeholder" term="示例术语" mode="tooltip" />

<InvestTerm
  id="term-placeholder"
  term="示例术语"
  mode="card"
  :aliases="['Example Term']"
  level="beginner"
/>
```

### 5.2 提示框组件：`BaseCallout`

**组件用途**

用于替代零散的 Markdown 提示容器，统一展示学习提示、操作提醒、注意事项、常见误区和延伸阅读入口。

**Props 设计**

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `type` | `'info' \| 'tip' \| 'warning' \| 'danger' \| 'note' \| 'check'` | `'info'` | 提示类型 |
| `title` | `string` | - | 标题 |
| `icon` | `string \| false` | - | 自定义图标；`false` 表示隐藏 |
| `compact` | `boolean` | `false` | 是否紧凑展示 |
| `dismissible` | `boolean` | `false` | 是否允许关闭 |
| `tone` | `'neutral' \| 'brand' \| 'risk'` | `'neutral'` | 视觉语气 |
| `ariaLabel` | `string` | - | 无障碍标签 |

**使用场景**

- 章节导读中的阅读提醒。
- 页面内的非风险类注意事项。
- 引导用户查看术语、案例、测验或外部资料。

**示例**

```md
<BaseCallout type="tip" title="学习提示">
  这里放置页面作者提供的简短提示，不承载完整课程内容。
</BaseCallout>
```

### 5.3 风险提示组件：`InvestRiskNotice`

**组件用途**

用于统一展示风险提示，覆盖市场风险、流动性风险、估值风险、集中度风险、杠杆风险、数据风险和产品特有风险。

**Props 设计**

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `kind` | `'general' \| 'market' \| 'liquidity' \| 'valuation' \| 'concentration' \| 'leverage' \| 'data' \| 'crypto'` | `'general'` | 风险类型 |
| `level` | `RiskLevel` | `'medium'` | 风险等级 |
| `market` | `Market` | `'CN-A'` | 适用市场 |
| `assetClass` | `AssetClass` | `'stock'` | 适用资产类别 |
| `title` | `string` | - | 自定义标题 |
| `required` | `boolean` | `false` | 是否必须展示 |
| `source` | `DataSource` | - | 风险说明来源 |
| `compact` | `boolean` | `false` | 是否紧凑展示 |

**使用场景**

- 任何涉及投资决策、案例、估值、组合、收益展示的页面。
- 涉及加密货币、杠杆、衍生品等高风险资产时。
- 图表、回测和模拟组合的上方或下方。

**示例**

```md
<InvestRiskNotice
  kind="market"
  level="high"
  market="CN-A"
  asset-class="stock"
  title="市场风险提示"
/>
```

### 5.4 公式组件：`VizFormula`

**组件用途**

用于展示投资指标、估值模型、收益计算、风险度量等公式。支持变量解释、单位、推导步骤折叠和渲染降级。

**Props 设计**

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `formula` | `string` | - | 公式文本，支持 LaTeX 或纯文本 |
| `display` | `'block' \| 'inline'` | `'block'` | 展示方式 |
| `engine` | `'katex' \| 'mathjax' \| 'plain'` | `'katex'` | 渲染引擎 |
| `variables` | `{ symbol: string; label: string; unit?: string }[]` | `[]` | 变量说明 |
| `steps` | `string[]` | `[]` | 可选推导步骤 |
| `precision` | `number` | - | 数值展示精度 |
| `caption` | `string` | - | 公式说明 |
| `source` | `DataSource` | - | 公式来源 |

**使用场景**

- 估值、财报、收益率、波动率、回撤等指标说明。
- 测验解析或案例分析中的计算步骤。
- 量化投资扩展模块中的模型展示。

**示例**

```md
<VizFormula
  formula="指标 = 分子 / 分母"
  caption="示例公式，仅用于展示组件结构"
  :variables="[
    { symbol: '分子', label: '示例变量 A' },
    { symbol: '分母', label: '示例变量 B' }
  ]"
/>
```

### 5.5 图表组件：`VizChart`

**组件用途**

用于轻量展示折线图、柱状图、面积图、饼图等基础图表。适合不需要完整 ECharts 配置的常见页面。

**Props 设计**

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `type` | `'line' \| 'bar' \| 'area' \| 'pie' \| 'scatter'` | `'line'` | 图表类型 |
| `data` | `Record<string, unknown>[]` | `[]` | 图表数据 |
| `xKey` | `string` | - | X 轴字段 |
| `yKeys` | `string[]` | `[]` | Y 轴字段 |
| `title` | `string` | - | 图表标题 |
| `caption` | `string` | - | 图表说明 |
| `height` | `number \| string` | `320` | 图表高度 |
| `source` | `DataSource` | - | 数据来源 |
| `emptyText` | `string` | `'暂无数据'` | 空数据提示 |

**使用场景**

- 展示市场数据、指标走势、财报趋势、组合变化。
- 页面作者只需要声明数据，不需要写 ECharts 配置。
- 移动端需要统一图表尺寸和空状态。

**示例**

```md
<VizChart
  type="line"
  title="示例趋势图"
  x-key="date"
  :y-keys="['value']"
  :data="[
    { date: 'T1', value: 10 },
    { date: 'T2', value: 12 }
  ]"
/>
```

### 5.6 股票组件：`InvestSecurityCard`

**组件用途**

用于统一展示股票或其他证券的基础信息。虽然命名可用 `Security`，但首期重点服务 A 股股票，后续可扩展到港股、美股、ETF、REITs、债券等。

**Props 设计**

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `symbol` | `string` | - | 证券代码 |
| `name` | `string` | - | 证券名称 |
| `market` | `Market` | `'CN-A'` | 市场 |
| `exchange` | `string` | - | 交易所 |
| `assetClass` | `AssetClass` | `'stock'` | 资产类别 |
| `status` | `'normal' \| 'suspended' \| 'delisted' \| 'unknown'` | `'unknown'` | 交易状态 |
| `quote` | `{ price?: number; change?: number; changePct?: number; currency?: string }` | - | 可选行情 |
| `metrics` | `{ label: string; value: string \| number; unit?: string }[]` | `[]` | 指标列表 |
| `tags` | `string[]` | `[]` | 标签 |
| `source` | `DataSource` | - | 数据来源 |

**使用场景**

- 股票案例页顶部信息卡。
- 财报组件、估值组件、组合组件中的证券引用。
- 未来跨市场证券详情页。

**示例**

```md
<InvestSecurityCard
  symbol="000000.SZ"
  name="示例证券"
  market="CN-A"
  exchange="SZSE"
  asset-class="stock"
  :metrics="[
    { label: '示例指标 A', value: '--' },
    { label: '示例指标 B', value: '--' }
  ]"
/>
```

### 5.7 财报组件：`InvestFinancialReport`

**组件用途**

用于展示资产负债表、利润表、现金流量表、关键财务指标和同比/环比变化。组件只负责结构化展示，不内置财务解读内容。

**Props 设计**

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `symbol` | `string` | - | 证券代码 |
| `companyName` | `string` | - | 公司名称 |
| `period` | `string` | - | 报告期 |
| `reportType` | `'balance-sheet' \| 'income' \| 'cash-flow' \| 'metrics'` | `'metrics'` | 报表类型 |
| `unit` | `string` | - | 金额单位 |
| `columns` | `{ key: string; label: string }[]` | `[]` | 表格列 |
| `rows` | `Record<string, unknown>[]` | `[]` | 表格行 |
| `highlightRules` | `{ field: string; operator: string; value: number; tone: string }[]` | `[]` | 高亮规则 |
| `source` | `DataSource` | - | 数据来源 |
| `audited` | `boolean` | `false` | 是否审计 |

**使用场景**

- 财报入门、公司分析、案例分析页面。
- 用同一表格结构比较不同报告期。
- 未来扩展到 REITs、基金持仓、ETF 成分等结构化披露数据。

**示例**

```md
<InvestFinancialReport
  symbol="000000.SZ"
  company-name="示例公司"
  period="YYYY-QX"
  report-type="metrics"
  unit="示例单位"
  :columns="[
    { key: 'item', label: '项目' },
    { key: 'value', label: '数值' }
  ]"
  :rows="[
    { item: '示例科目 A', value: '--' },
    { item: '示例科目 B', value: '--' }
  ]"
/>
```

### 5.8 时间轴组件：`VizTimeline`

**组件用途**

用于展示市场事件、公司事件、学习路径、交易流程节点、政策变化或案例发展阶段。

**Props 设计**

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `events` | `{ date?: string; title: string; description?: string; type?: string; link?: string }[]` | `[]` | 时间轴事件 |
| `orientation` | `'vertical' \| 'horizontal'` | `'vertical'` | 布局方向 |
| `density` | `'compact' \| 'comfortable'` | `'comfortable'` | 展示密度 |
| `groupBy` | `'year' \| 'month' \| 'none'` | `'none'` | 分组方式 |
| `showDate` | `boolean` | `true` | 是否显示日期 |
| `currentIndex` | `number` | - | 当前节点 |
| `source` | `DataSource` | - | 数据来源 |

**使用场景**

- 投资新手学习路线。
- 上市公司案例发展过程。
- 市场周期、政策事件、回测区间说明。

**示例**

```md
<VizTimeline
  :events="[
    { date: 'T1', title: '阶段一', description: '占位说明' },
    { date: 'T2', title: '阶段二', description: '占位说明' }
  ]"
/>
```

### 5.9 流程图组件：`VizProcessFlow`

**组件用途**

用于展示投资分析流程、开户流程、交易前检查流程、财报阅读流程、组合构建流程等步骤型内容。

**Props 设计**

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `steps` | `{ id: string; title: string; description?: string; status?: string; next?: string[] }[]` | `[]` | 流程节点 |
| `direction` | `'vertical' \| 'horizontal'` | `'vertical'` | 流程方向 |
| `numbered` | `boolean` | `true` | 是否显示序号 |
| `current` | `string` | - | 当前步骤 ID |
| `clickable` | `boolean` | `false` | 节点是否可点击 |
| `allowBranching` | `boolean` | `false` | 是否支持分支 |
| `ariaLabel` | `string` | - | 无障碍标签 |

**使用场景**

- 把复杂投资动作拆成标准步骤。
- 引导用户按顺序完成学习任务。
- 未来量化模块中的策略构建流程。

**示例**

```md
<VizProcessFlow
  :steps="[
    { id: 'step-1', title: '步骤一', description: '占位说明' },
    { id: 'step-2', title: '步骤二', description: '占位说明' }
  ]"
/>
```

### 5.10 Mermaid 组件：`VizMermaid`

**组件用途**

用于在 Markdown 中安全、统一地渲染 Mermaid 图，包括流程图、状态图、时序图、关系图等。

**Props 设计**

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `code` | `string` | - | Mermaid 源码 |
| `title` | `string` | - | 图标题 |
| `caption` | `string` | - | 图说明 |
| `theme` | `'default' \| 'neutral' \| 'dark'` | `'neutral'` | Mermaid 主题 |
| `zoomable` | `boolean` | `true` | 是否可缩放 |
| `fallbackText` | `string` | - | 渲染失败时的替代文本 |
| `source` | `DataSource` | - | 来源 |

**使用场景**

- 需要作者直接维护 Mermaid 语法的图示。
- 复杂关系图、决策树、状态转换图。
- 不适合用固定流程组件表达的图形。

**示例**

```md
<ClientOnly>
  <VizMermaid
    title="示例流程图"
    fallback-text="示例流程图无法渲染时显示的文本"
    code="flowchart TD; A[开始] --> B[结束];"
  />
</ClientOnly>
```

### 5.11 ECharts 组件：`VizECharts`

**组件用途**

用于承载复杂图表和高度定制图表。适合多轴图、K 线图、热力图、雷达图、组合收益曲线、回撤图等。

**Props 设计**

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `option` | `EChartsOption` | - | ECharts 配置 |
| `theme` | `'light' \| 'dark' \| string` | `'light'` | 图表主题 |
| `height` | `number \| string` | `360` | 高度 |
| `renderer` | `'canvas' \| 'svg'` | `'canvas'` | 渲染方式 |
| `autoresize` | `boolean` | `true` | 容器变化时自适应 |
| `loading` | `boolean` | `false` | 加载态 |
| `ariaLabel` | `string` | - | 图表替代说明 |
| `source` | `DataSource` | - | 数据来源 |

**使用场景**

- K 线图、收益曲线、回撤曲线、相关性矩阵。
- 多市场、多资产、多维指标可视化。
- 未来量化投资模块中的策略分析图。

**示例**

```md
<ClientOnly>
  <VizECharts
    height="320"
    aria-label="示例图表"
    :option="{
      xAxis: { type: 'category', data: ['T1', 'T2'] },
      yAxis: { type: 'value' },
      series: [{ type: 'line', data: [1, 2] }]
    }"
  />
</ClientOnly>
```

### 5.12 测验组件：`LearnQuiz`

**组件用途**

用于章节测验、自测题、判断题、场景选择题和阶段性复盘。组件只定义题型、选项、反馈与记录方式，不内置题库内容。

**Props 设计**

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `id` | `string` | - | 测验唯一 ID |
| `type` | `'single' \| 'multiple' \| 'true-false' \| 'scenario'` | `'single'` | 题型 |
| `question` | `string` | - | 题干 |
| `options` | `{ id: string; label: string }[]` | `[]` | 选项 |
| `answer` | `string \| string[]` | - | 正确答案；可在构建期隐藏或延迟加载 |
| `explanation` | `string` | - | 解析 |
| `shuffle` | `boolean` | `false` | 是否打乱选项 |
| `showAnswerMode` | `'immediate' \| 'after-submit' \| 'manual'` | `'after-submit'` | 答案展示方式 |
| `attempts` | `number` | `1` | 可尝试次数 |
| `persistKey` | `string` | - | 本地记录键 |

**使用场景**

- 每节课后的快速自测。
- 财报、估值、交易规则等模块的概念检查。
- 阶段学习路径中的闯关式反馈。

**示例**

```md
<LearnQuiz
  id="quiz-placeholder"
  type="single"
  question="这里放置页面作者提供的题干"
  :options="[
    { id: 'A', label: '选项 A' },
    { id: 'B', label: '选项 B' }
  ]"
  answer="A"
/>
```

### 5.13 思考题组件：`LearnReflection`

**组件用途**

用于开放式思考、投资前自检、案例复盘、交易日志提示。支持本地草稿、提示语、评分维度和导出。

**Props 设计**

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `id` | `string` | - | 思考题唯一 ID |
| `prompt` | `string` | - | 提问文本 |
| `context` | `string` | - | 背景说明 |
| `hints` | `string[]` | `[]` | 思考提示 |
| `rubric` | `{ label: string; description?: string }[]` | `[]` | 评价维度 |
| `minWords` | `number` | - | 最少字数 |
| `allowPrivateNote` | `boolean` | `true` | 是否允许本地记录 |
| `storageKey` | `string` | - | 本地草稿键 |
| `exportable` | `boolean` | `false` | 是否支持导出 |

**使用场景**

- 学完某个概念后的自我解释。
- 案例分析后的复盘。
- 投资组合或交易计划前的自检。

**示例**

```md
<LearnReflection
  id="reflection-placeholder"
  prompt="这里放置页面作者提供的开放式问题"
  :hints="['提示 A', '提示 B']"
  :rubric="[
    { label: '维度 A' },
    { label: '维度 B' }
  ]"
/>
```

### 5.14 案例分析组件：`LearnCaseStudy`

**组件用途**

用于组织案例背景、事实材料、数据引用、分析任务、风险提示和结论区。组件不预设案例观点，避免把课程内容写入组件。

**Props 设计**

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `id` | `string` | - | 案例唯一 ID |
| `title` | `string` | - | 案例标题 |
| `market` | `Market` | `'CN-A'` | 市场 |
| `assetClass` | `AssetClass` | `'stock'` | 资产类别 |
| `riskLevel` | `RiskLevel` | `'medium'` | 案例风险等级 |
| `facts` | `{ label: string; value: string }[]` | `[]` | 事实材料 |
| `tasks` | `{ id: string; title: string; type?: string }[]` | `[]` | 分析任务 |
| `dataRefs` | `DataSource[]` | `[]` | 数据来源 |
| `showConclusion` | `boolean` | `false` | 是否显示结论区 |
| `collapsible` | `boolean` | `true` | 是否可折叠 |

**使用场景**

- A 股公司分析案例。
- 财报阅读案例。
- 行业比较、组合构建、风险事件复盘。
- 后续港股、美股、ETF、基金、REITs、加密资产案例。

**示例**

```md
<LearnCaseStudy
  id="case-placeholder"
  title="示例案例"
  market="CN-A"
  asset-class="stock"
  risk-level="medium"
  :facts="[
    { label: '事实 A', value: '占位信息' },
    { label: '事实 B', value: '占位信息' }
  ]"
  :tasks="[
    { id: 'task-1', title: '分析任务占位' }
  ]"
/>
```

### 5.15 投资组合组件：`InvestPortfolio`

**组件用途**

用于展示模拟组合、资产配置、持仓权重、现金比例、收益/风险指标和再平衡结果。默认用于学习与模拟，不应暗示真实投资建议。

**Props 设计**

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `id` | `string` | - | 组合唯一 ID |
| `holdings` | `{ symbol: string; name?: string; assetClass: AssetClass; weight: number; market?: Market }[]` | `[]` | 持仓 |
| `cash` | `number` | `0` | 现金比例或金额 |
| `currency` | `string` | `'CNY'` | 币种 |
| `benchmark` | `string` | - | 对比基准 |
| `metrics` | `{ label: string; value: string \| number; unit?: string }[]` | `[]` | 组合指标 |
| `scenario` | `'static' \| 'rebalance' \| 'backtest'` | `'static'` | 展示场景 |
| `readonly` | `boolean` | `true` | 是否只读 |
| `riskNotice` | `boolean` | `true` | 是否显示风险提示 |
| `source` | `DataSource` | - | 数据来源 |

**使用场景**

- 资产配置章节中的示例组合结构。
- 投资组合复盘、再平衡演示。
- ETF、基金、债券、REITs、加密货币扩展模块中的多资产配置。

**示例**

```md
<InvestPortfolio
  id="portfolio-placeholder"
  currency="CNY"
  scenario="static"
  :holdings="[
    { symbol: 'ASSET-A', name: '示例资产 A', assetClass: 'stock', weight: 60, market: 'CN-A' },
    { symbol: 'ASSET-B', name: '示例资产 B', assetClass: 'cash', weight: 40, market: 'CN-A' }
  ]"
  :metrics="[
    { label: '示例指标', value: '--' }
  ]"
/>
```

### 5.16 数据来源组件：`BaseDataSource`

**组件用途**

用于展示页面、图表、财报、案例、组合的数据来源、更新时间、授权信息和数据口径说明。

**Props 设计**

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `source` | `DataSource \| DataSource[]` | - | 数据来源 |
| `compact` | `boolean` | `true` | 是否紧凑展示 |
| `showLicense` | `boolean` | `false` | 是否展示授权 |
| `showUpdatedAt` | `boolean` | `true` | 是否展示更新时间 |
| `placement` | `'inline' \| 'footer' \| 'caption'` | `'caption'` | 展示位置 |

**使用场景**

- 所有行情、财报、图表、案例数据附近。
- 页面底部的数据说明区。
- 第三方数据或人工整理数据的溯源。

**示例**

```md
<BaseDataSource
  :source="{
    name: '示例数据源',
    asOf: 'YYYY-MM-DD',
    updatedAt: 'YYYY-MM-DD'
  }"
/>
```

### 5.17 指标徽章组件：`InvestMetricBadge`

**组件用途**

用于展示单个投资指标、财务指标、估值指标或风险指标，并通过颜色、趋势和状态统一表达数值语义。

**Props 设计**

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `label` | `string` | - | 指标名称 |
| `value` | `string \| number` | - | 指标值 |
| `unit` | `string` | - | 单位 |
| `tone` | `'neutral' \| 'positive' \| 'negative' \| 'warning'` | `'neutral'` | 视觉语义 |
| `trend` | `'up' \| 'down' \| 'flat' \| 'unknown'` | `'unknown'` | 趋势 |
| `precision` | `number` | - | 精度 |
| `tooltip` | `string` | - | 指标说明 |
| `source` | `DataSource` | - | 数据来源 |

**使用场景**

- 股票卡、财报摘要、组合摘要。
- 图表旁的关键指标展示。
- 案例页的事实信息区。

**示例**

```md
<InvestMetricBadge
  label="示例指标"
  value="--"
  tone="neutral"
  trend="unknown"
/>
```

### 5.18 对比矩阵组件：`BaseCompareMatrix`

**组件用途**

用于对比多个市场、资产类别、投资工具、策略特征或产品要素。组件只提供结构，不写入具体对比结论。

**Props 设计**

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `columns` | `{ key: string; label: string }[]` | `[]` | 对比对象 |
| `rows` | `{ key: string; label: string; values: Record<string, unknown> }[]` | `[]` | 对比维度 |
| `highlightColumn` | `string` | - | 高亮列 |
| `compact` | `boolean` | `false` | 紧凑模式 |
| `stickyFirstColumn` | `boolean` | `true` | 首列固定 |
| `source` | `DataSource` | - | 数据来源 |

**使用场景**

- A 股与其他市场的规则对比。
- 股票、ETF、基金、债券、REITs 等资产特征对比。
- 不同投资策略或指标口径对比。

**示例**

```md
<BaseCompareMatrix
  :columns="[
    { key: 'a', label: '对象 A' },
    { key: 'b', label: '对象 B' }
  ]"
  :rows="[
    { key: 'feature', label: '维度占位', values: { a: '--', b: '--' } }
  ]"
/>
```

### 5.19 学习进度组件：`LearnProgress`

**组件用途**

用于展示学习路径、阶段进度、已完成测验、待完成思考题和下一步入口。适合 VitePress 静态站点中的本地进度记录。

**Props 设计**

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `pathId` | `string` | - | 学习路径 ID |
| `items` | `{ id: string; title: string; href?: string; status?: string }[]` | `[]` | 学习节点 |
| `persistKey` | `string` | - | 本地存储键 |
| `showPercent` | `boolean` | `true` | 是否显示百分比 |
| `allowReset` | `boolean` | `false` | 是否允许重置 |
| `variant` | `'bar' \| 'checklist' \| 'roadmap'` | `'bar'` | 展示形态 |

**使用场景**

- 新手到独立投资者的主学习路线。
- 阶段章节页顶部或底部。
- 测验、思考题完成情况汇总。

**示例**

```md
<LearnProgress
  path-id="beginner-placeholder"
  variant="checklist"
  :items="[
    { id: 'node-1', title: '学习节点 A', href: '#' },
    { id: 'node-2', title: '学习节点 B', href: '#' }
  ]"
/>
```

### 5.20 情景切换组件：`InvestScenarioTabs`

**组件用途**

用于在同一知识结构下切换不同市场、资产类别、账户类型或策略场景，便于未来从 A 股扩展到港股、美股、ETF、基金、债券、REITs、加密货币和量化投资。

**Props 设计**

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `scenarios` | `{ id: string; label: string; market?: Market; assetClass?: AssetClass }[]` | `[]` | 场景列表 |
| `defaultScenario` | `string` | - | 默认场景 ID |
| `syncToHash` | `boolean` | `false` | 是否同步到 URL hash |
| `persistKey` | `string` | - | 本地偏好键 |
| `disabledScenarios` | `string[]` | `[]` | 禁用场景 |

**使用场景**

- 同一个概念在 A 股、港股、美股中的规则差异。
- 股票、ETF、基金、债券等资产类别切换。
- 量化策略与主观投资流程对比。

**示例**

```md
<InvestScenarioTabs
  default-scenario="cn-a"
  :scenarios="[
    { id: 'cn-a', label: 'A 股', market: 'CN-A', assetClass: 'stock' },
    { id: 'etf', label: 'ETF', market: 'CN-A', assetClass: 'etf' }
  ]"
/>
```

## 6. 全站注册优先级

| 优先级 | 组件 | 原因 |
| --- | --- | --- |
| P0 | `InvestTerm`、`BaseCallout`、`InvestRiskNotice`、`BaseDataSource` | 所有内容页都可能使用，且需要统一规范 |
| P0 | `VizFormula`、`VizChart`、`VizTimeline`、`VizProcessFlow` | 投资教育高频表达工具 |
| P1 | `LearnQuiz`、`LearnReflection`、`LearnCaseStudy`、`LearnProgress` | 形成学习闭环 |
| P1 | `InvestSecurityCard`、`InvestFinancialReport`、`InvestMetricBadge`、`InvestPortfolio` | 支撑 A 股独立分析能力 |
| P1 | `VizMermaid`、`VizECharts` | 技术封装复杂，应统一 SSR 与样式 |
| P2 | `BaseCompareMatrix`、`InvestScenarioTabs` | 用于跨市场、跨资产扩展 |

## 7. VitePress 集成建议

1. 在 `.vitepress/theme/index.ts` 中全局注册 P0 和 P1 组件，P2 可按需注册。
2. `VizMermaid`、`VizECharts`、`InvestPortfolio` 等依赖浏览器环境的组件应使用动态导入或内部 `onMounted` 初始化。
3. 所有组件都应支持 Markdown 直接调用，并避免要求页面作者写复杂 JavaScript。
4. 复杂数据可放入 `.data.ts`、JSON 或 YAML 文件，再通过 props 传入组件。
5. 组件样式应优先使用 VitePress CSS 变量，以适配亮色/暗色主题。

## 8. 扩展边界

| 未来方向 | 复用组件 | 需要新增或扩展的能力 |
| --- | --- | --- |
| 港股 | `InvestSecurityCard`、`InvestRiskNotice`、`InvestScenarioTabs` | 交易规则、币种、交易时段、税费字段 |
| 美股 | `InvestSecurityCard`、`VizECharts`、`InvestPortfolio` | 盘前盘后、美元、财报口径、ADR 字段 |
| ETF/基金 | `InvestPortfolio`、`BaseCompareMatrix`、`InvestMetricBadge` | 持仓穿透、费率、跟踪误差、净值字段 |
| 债券 | `VizFormula`、`VizChart`、`InvestMetricBadge` | 久期、到期收益率、票息、评级字段 |
| REITs | `InvestFinancialReport`、`InvestMetricBadge` | 分派率、底层资产、出租率字段 |
| 加密货币 | `InvestRiskNotice`、`VizECharts`、`InvestPortfolio` | 链上数据、交易所风险、钱包风险 |
| 量化投资 | `VizFormula`、`VizECharts`、`VizProcessFlow` | 回测、参数、因子、策略版本管理 |

## 9. 设计结论

应成为全站通用组件的核心不是“某一节课的内容块”，而是投资教育中反复出现的表达模式：术语、提示、风险、公式、图表、证券、财报、流程、案例、测验、思考和组合。以上组件体系可以先支撑 A 股新手学习路径，同时通过市场、资产类别、数据来源和风险等级字段，为未来多资产扩展保留稳定接口。
