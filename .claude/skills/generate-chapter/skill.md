---
name: generate-chapter
description: >
  为“大A修炼手册”VitePress 投资学习站生成后续课程章节和批次正文。
  当用户要求“生成章节”“生成正文”“继续生成下一批”“生成 gen-batch-02”“写 c05-01”“按 batch-plan.yaml 生成”“扩展后续章节内容”“补齐某个批次”时，必须使用此 skill。
  本 skill 严格读取并执行 component-spec.md、glossary.yaml、course-map.yaml、chapter-spec-index.yaml、batch-plan.yaml 的规划约束，按批次或章节生成 Markdown 页面，控制术语首次解释、后续 Term 引用、组件使用、图表槽位、风险提示和 VitePress 路由。
---

# 大A修炼手册章节/批次生成器

你是“大A修炼手册”的课程正文生成代理，负责把已经规划好的 A 股投资学习体系分批落地为 VitePress Markdown 页面。这个 skill 的核心价值不是自由写作，而是把正文生成约束在项目规划文件内，确保后续批次可以稳定、连续、可校验地扩展。

## 适用任务

使用此 skill 处理以下请求：

- 生成某个批次：`gen-batch-01`、`gen-batch-02`、`下一批`、`继续生成后续批次`
- 生成某个章节：`c01-01`、`c05-03`、`写 PE 这一章`
- 补齐缺失章节正文
- 按 `batch-plan.yaml` 扩展后续章节内容
- 根据规划文件生成课程 Markdown 页面
- 检查某批次是否符合术语、组件、图表和 scope 规则

如果用户只是要求“规划”“总结批次”“修改 course-map”，不要生成课程正文；只输出或修改规划文件。

## 当前项目约定

- 站点类型：VitePress
- 源目录：项目根目录
- 路由来源：`course-map.yaml` 中的 `path`
- 页面文件路径：把 `path` 转为根目录下的 Markdown 文件
  - `/course/01-foundation/securities-stock-equity`
  - 写入 `course/01-foundation/securities-stock-equity.md`
- 术语引用组件：`<Term id="pe" />`
- 章节正文语言：中文
- 受众：零基础投资新手
- 当前主线：A 股从零基础到独立分析、独立决策、独立复盘
- 未来方向：港股、美股、币圈、ETF、基金、债券、REITs、量化投资；当前正文只允许边界说明，不展开未来模块正文

## 必读文件

生成任何章节前，先读取并遵守以下文件：

1. `batch-plan.yaml`：生成批次、批次依赖、本批新术语、可用组件、适合图表类型
2. `course-map.yaml`：章节顺序、路径、难度、first_terms、components、chart_slots
3. `chapter-spec-index.yaml`：章节契约、scope、frontmatter、生成模式、禁止内容
4. `glossary.yaml`：术语定义、别名、难度、先修术语
5. `component-spec.md`：组件用途、Props、示例和使用边界

不要凭记忆生成。规划文件是唯一事实来源。

## 工作流程

### 1. 确定生成范围

从用户输入中提取目标：

- 如果输入包含 `gen-batch-XX`，优先按 `batch-plan.yaml` 生成整个批次。
- 如果输入包含 `batch-XX`，在 `course-map.yaml` 中匹配原始规划批次。
- 如果输入包含 `cXX-XX`，只生成对应章节。
- 如果用户说“下一批”，查找已存在的 `course/**/*.md`，选择尚未生成的最早 `gen-batch`。
- 如果目标不明确，先询问用户要生成哪个批次或章节。

### 2. 读取章节元数据

对每个待生成章节，收集：

- `chapter_id`
- `title`
- `path`
- `batch`
- `difficulty`
- `first_terms`
- `components`
- `chart_slots`
- `scope`
- `generator_mode`
- `prerequisite_chapters`

这些字段分别来自 `course-map.yaml` 和 `chapter-spec-index.yaml`。不要自行改名、改路径或改章节顺序。

### 3. 校验前置依赖

生成批次前先检查：

- `batch-plan.yaml` 中的 `prerequisites` 是否已生成或用户明确允许跳过。
- 当前章节的 `prerequisite_chapters` 是否已有对应 Markdown 文件。
- 若前置章节缺失，告知用户缺失项；除非用户明确要求强行生成，否则先生成前置批次。

### 4. 写正文

写作目标：

- 先通俗，再专业。
- 结构遵循：原理 → 例子 → 误区 → 总结。
- 对零基础读者友好，不跳过前置知识。
- 内容要充分解释原理，不要两三句话敷衍。
- 不提供具体买卖建议。
- 不使用未经验证的市场数据。

章节范围：

| scope | 写作边界 |
| --- | --- |
| `current_a_share_path` | 正文围绕 A 股完整闭环展开 |
| `bridge_only` | 只解释边界和术语，不展开港股、美股、币圈等未来模块正文 |
| `advanced_boundary` | 只说明工具边界、风险和适用前提，不鼓励新手使用高风险工具 |

### 5. 执行术语规则

术语是最容易破坏课程连续性的部分，必须严格控制：

1. 只解释当前章节 `first_terms` 中列出的术语。
2. 解释首次术语时，使用 `glossary.yaml` 的 `name`、`description`、`aliases`、`difficulty` 和 `prerequisites`。
3. 任何已在前序章节首次出现过的术语，只能写成 `<Term id="term-id" />`，不得重复定义。
4. 术语别名只在首次解释时出现；后续章节只引用标准术语组件。
5. 不主动引入 `glossary.yaml` 之外的新正式术语。若确实不可避免，在生成报告中列为“待新增术语”，不要偷偷写入正文规则之外。

正确示例：

```md
当我们讨论 <Term id="pe" /> 时，本质上是在比较价格与盈利之间的关系。
```

错误示例：

```md
PE 是市盈率，也就是股价除以每股收益。
```

如果 `pe` 不是当前章节的 `first_terms`，上述解释就是重复定义，禁止使用。

### 6. 执行组件和图表规则

只使用当前章节 `components` 中声明的组件。

图表只使用当前章节 `chart_slots` 中声明的槽位：

- 每个槽位最多使用一次。
- 没有 `chart_slots` 的章节不要强行加图。
- 图表必须有 `caption`。
- 涉及市场数据、行情数据、财务数据时，必须附带 `BaseDataSource`。
- `VizECharts` 和 `VizMermaid` 必须包裹在 `<ClientOnly>` 中。

#### 组件标签闭合规则（强制）

Vue 组件在 Markdown 中分两类，标签闭合方式不同：

**容器组件（必须有开标签和闭标签）**：

| 组件 | 正确写法 |
|------|----------|
| `BaseCallout` | `<BaseCallout type="tip" title="标题">内容</BaseCallout>` |
| `ClientOnly` | `<ClientOnly>...</ClientOnly>` |
| `InvestRiskNotice` | 属性都在开标签中，但仍需闭合 `<InvestRiskNotice ... />` 或 `<InvestRiskNotice ... ></InvestRiskNotice>` |
| `InvestScenarioTabs` | `<InvestScenarioTabs ... />` |

**自闭合组件（用 `/>` 结束，无内容体）**：

| 组件 | 正确写法 |
|------|----------|
| `InvestTerm` | `<InvestTerm id="pe" term="市盈率" mode="tooltip" />` |
| `VizChart` | `<VizChart type="line" ... />` |
| `VizFormula` | `<VizFormula ... />` |
| `VizTimeline` | `<VizTimeline ... />` |
| `VizProcessFlow` | `<VizProcessFlow ... />` |
| `VizECharts` | `<VizECharts ... />`（包裹在 ClientOnly 中） |
| `VizMermaid` | `<VizMermaid ... />`（包裹在 ClientOnly 中） |
| `BaseCompareMatrix` | `<BaseCompareMatrix ... />` |
| `BaseDataSource` | `<BaseDataSource ... />` |
| `LearnQuiz` | `<LearnQuiz ... />` |
| `LearnReflection` | `<LearnReflection ... />` |
| `LearnCaseStudy` | `<LearnCaseStudy ... />` |
| `LearnProgress` | `<LearnProgress ... />` |
| `InvestMetricBadge` | `<InvestMetricBadge ... />` |
| `InvestSecurityCard` | `<InvestSecurityCard ... />` |
| `InvestFinancialReport` | `<InvestFinancialReport ... />` |
| `InvestPortfolio` | `<InvestPortfolio ... />` |
| `InvestRiskNotice` | `<InvestRiskNotice kind="market" level="high" ... />` |

**标签闭合检查清单**（写入每个文件后必须执行）：

1. 统计文件中每个组件名的开标签数量，必须等于闭标签数量
2. `BaseCallout` 和 `ClientOnly` 必须成对出现（`<BaseCallout ...>` 对应 `</BaseCallout>`）
3. 自闭合组件必须用 `/>` 结尾，不能写成 `<InvestTerm ...>` 不带斜杠
4. 禁止出现连续两个相同的闭标签（如 `</BaseCallout>\n</BaseCallout>`）

风险提示规则：

涉及以下内容时必须使用 `InvestRiskNotice`：

- 收益
- 估值
- 案例
- 组合
- 回测
- 加密资产
- 杠杆
- 衍生品

交互组件限制：

| 难度 | 限制 |
| --- | --- |
| `beginner` | 最多一个 `LearnQuiz` 或 `LearnReflection` |
| `intermediate` | 可包含一个 `LearnQuiz` 和一个 `LearnReflection` |
| `advanced` | 优先使用 `LearnCaseStudy` 或 `LearnReflection`，不做投资建议 |

### 7. 生成 Frontmatter

每个章节文件必须以 YAML frontmatter 开头：

```yaml
---
chapter_id: c01-01
title: "证券、股票与公司权益"
module_id: m01
batch: batch-01
difficulty: beginner
first_terms: [securities, stock]
prerequisite_chapters: [c00-01]
components_used: [Term, BaseCallout]
chart_slots: []
---
```

字段要求：

- `chapter_id`、`title`、`module_id`、`batch`、`difficulty` 来自 `course-map.yaml`
- `first_terms` 来自 `course-map.yaml`
- `prerequisite_chapters` 来自 `chapter-spec-index.yaml`
- `components_used` 必须是本章实际使用组件，且是 `course-map.yaml` 当前章节 `components` 的子集
- `chart_slots` 必须是本章实际使用图表槽位，且是 `course-map.yaml` 当前章节 `chart_slots` 的子集

### 8. 写入文件

按 `course-map.yaml` 的 `path` 写入根目录下的 Markdown 文件。

示例：

| path | 文件 |
| --- | --- |
| `/course/00-start/how-to-use` | `course/00-start/how-to-use.md` |
| `/course/07-valuation/multiple-valuation` | `course/07-valuation/multiple-valuation.md` |

写入前：

- 若目标文件已存在，先读取并确认是否覆盖；除非用户明确要求重写，不要覆盖已有正文。
- 创建缺失目录。
- 不修改无关文件。

### 9. 更新导航

如果本次成功生成了章节正文，检查 `.vitepress/config.mts`：

- 将已生成章节加入 `/course/` sidebar。
- 只添加已经存在的 Markdown 文件。
- 按 `course-map.yaml` 的 module 分组。
- 当前生成批次涉及的分组可设为展开，旧分组可折叠。

如果用户只要求生成 Markdown 正文且不希望改导航，跳过此步骤并在结果中说明。

### 10. 生成后校验

生成完成后必须逐项校验，**标签闭合检查为最高优先级**：

1. **标签闭合检查**（必须执行，构建失败最常见原因）：
   - 统计每个文件中所有组件标签的开闭数量，开标签数必须等于闭标签数
   - 重点检查 `BaseCallout`、`ClientOnly` 的 `</BaseCallout>`、`</ClientOnly>` 是否全部匹配
   - 自闭合组件（`InvestTerm`、`VizChart`、`VizFormula`、`VizTimeline`、`VizProcessFlow`、`BaseCompareMatrix`、`BaseDataSource`、`LearnQuiz`、`LearnReflection`、`LearnCaseStudy`、`LearnProgress`、`InvestMetricBadge`、`InvestSecurityCard`、`InvestFinancialReport`、`InvestPortfolio`、`InvestRiskNotice`、`InvestScenarioTabs`）必须以 `/>` 结尾
   - `VizECharts` 和 `VizMermaid` 必须包裹在 `<ClientOnly>...</ClientOnly>` 中

2. 内容校验：
   - YAML frontmatter 可解析。
   - 章节中未出现未声明组件。
   - 章节中未使用未声明图表槽位。
   - `first_terms` 均有首次解释。
   - 非 `first_terms` 的已知术语使用 `<InvestTerm id="..." />` 引用。
   - 没有具体买卖建议。
   - 没有未经验证的市场数据。

3. 构建验证：
   - VitePress 构建命令可运行时，执行 `npm run docs:build`（项目使用 docs 目录，命令为 `npx vitepress build docs`）。
   - 构建失败时，根据错误信息定位并修复，修复后重新构建直到通过。

## 批次输出报告

每次生成批次后，在最终回复中给出简洁报告：

```md
已生成 gen-batch-02。

| 章节 ID | 标题 | 文件 |
| --- | --- | --- |
| c02-01 | 证券账户、资金账户与适当性 | course/02-trading/accounts-suitability.md |

术语：本批 first_terms 已按规则首次解释；前序术语已使用 `<Term id="..." />` 引用。
组件：仅使用本批声明组件。
图表：仅使用声明的 chart_slots。
```

不要在最终回复中粘贴完整章节正文，除非用户明确要求预览。

## 常见触发示例

用户输入：

```txt
生成 gen-batch-03
```

行为：

1. 读取 `batch-plan.yaml` 中 `gen-batch-03`
2. 生成 c03-01 到 c04-05
3. 只解释该批各章 `first_terms`
4. 写入 `course/**/*.md`
5. 校验并汇报

用户输入：

```txt
写 c07-02 这一章
```

行为：

1. 读取 `course-map.yaml#c07-02`
2. 检查前置章节 c07-01
3. 只解释 `pe`、`pb`、`relative-valuation`、`ps`、`pcf`、`peg`、`forward-pe`
4. 已出现术语使用 `<Term id="..." />`
5. 写入 `/course/07-valuation/multiple-valuation.md`

用户输入：

```txt
继续下一批
```

行为：

1. 检查 `course/**/*.md`
2. 找到最早未完成的 `gen-batch`
3. 生成该批次
4. 更新导航并汇报
