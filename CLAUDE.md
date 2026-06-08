# 项目固定规则

## 项目概述

- 站点主题：A股投资知识（VitePress 站点）
- 受众：零基础投资新手
- 写作语言：中文
- 当前范围：A股从零基础到独立分析、独立决策、独立复盘的完整闭环
- 未来扩展：港股、美股、币圈、ETF、基金、债券、REITs、量化投资（不在当前范围展开正文）

## 核心文档

生成任何章节前，必须先读取以下文件：

| 文件                      | 用途                                           |
| ------------------------- | ---------------------------------------------- |
| `glossary.yaml`           | 全部术语定义、难度、前置依赖                   |
| `course-map.yaml`         | 章节顺序、术语首次出现位置、组件分配、图表槽位 |
| `chapter-spec-index.yaml` | 章节契约、frontmatter 字段、scope 规则         |
| `component-spec.md`       | 每个组件的 Props、用途、使用示例               |

## 写作风格

- 解释风格：先通俗（生活化类比），再专业
- 叙事结构：原理 → 例子 → 误区 → 总结
- 内容充实度：不要两句话就讲完，注重原理让读者印象深刻
- 不要跳过前置知识

## 术语规则

1. **首次出现**：只解释当前章节 `first_terms` 中的术语，用自然语言完整解释
2. **再次出现**：已在前序章节解释过的术语，必须写成 `<InvestTerm id="term-id" />`，不得重复定义
3. **术语别名**：别名只在首次解释时使用，后续用 `<InvestTerm id="term-id" />` 引用
4. **禁止引入**：如果引入 `glossary.yaml` 之外的新术语，需要按首次出现规则来，然后更新术语表
5. 术语首次出现位置以 `course-map.yaml` 中各章节的 `first_terms` 为准

## 组件使用规则

### 术语组件

```
<InvestTerm id="term-id" term="术语名称" mode="tooltip" />
```

### 风险提示（涉及以下内容时必须添加）

- 收益、估值、案例、组合、回测、加密资产、杠杆
- 组件：`<InvestRiskNotice kind="market" level="high" />`

### 图表组件

- 优先用于第一次出现的重要抽象概念
- 每章默认最多 1 个图表（`chart_slots` 声明除外）
- 必须包含 `caption`（图表说明）
- 涉及市场数据或财务数据时必须附带 `BaseDataSource`

| 组件             | 适用场景                                           |
| ---------------- | -------------------------------------------------- |
| `VizChart`       | 折线图、柱状图、面积图等基础图表                   |
| `VizECharts`     | K 线图、雷达图等复杂图表（需 `<ClientOnly>` 包裹） |
| `VizFormula`     | 公式展示（PE、ROE 等计算公式）                     |
| `VizTimeline`    | 时间轴（交易日、披露节奏、牛熊周期）               |
| `VizProcessFlow` | 流程图（委托撮合、产业链、分析流程）               |
| `VizMermaid`     | Mermaid 图（需 `<ClientOnly>` 包裹）               |

### 交互组件（按难度分配）

| 章节难度     | 允许的交互组件                                               |
| ------------ | ------------------------------------------------------------ |
| beginner     | 最多一个 `LearnQuiz` 或 `LearnReflection`                    |
| intermediate | 可包含一个 `LearnQuiz` + 一个 `LearnReflection`              |
| advanced     | 优先使用 `LearnCaseStudy` 或 `LearnReflection`，不做投资建议 |

### 其他组件

- `BaseCallout`：学习提示、操作提醒、常见误区
- `BaseCompareMatrix`：多维度对比（市场、指数、资产类别）
- `InvestSecurityCard`：证券信息卡
- `InvestFinancialReport`：财报表（资产负债表、利润表、现金流量表）
- `InvestMetricBadge`：单个指标展示
- `InvestPortfolio`：模拟组合、资产配置
- `InvestScenarioTabs`：场景切换（A 股/港股/美股等）
- `BaseDataSource`：数据来源标注
- `LearnProgress`：学习进度

## 章节范围规则

| scope 值               | 含义                                                     |
| ---------------------- | -------------------------------------------------------- |
| `current_a_share_path` | 正文围绕 A 股完整闭环展开                                |
| `bridge_only`          | 只解释边界和术语，不展开未来模块正文                     |
| `advanced_boundary`    | 只说明工具边界、风险和适用前提，不鼓励新手使用高风险工具 |

## 禁止内容

- 不得给出具体买卖建议
- 不得使用未经验证的市场数据
- 不得在当前 A 股路径中深入展开港股、美股、币圈等未来模块
- 不得重复定义已在前序章节解释过的术语
- 不得使用 `chart_slots` 之外的图表组件
- 图表不要过度设计，适度使用

## 文件组织

- 一个章节一个 Markdown 文件
- 路由基础：`/course/`
- 章节文件路径遵循 `course-map.yaml` 中 `path` 字段定义
- 所有 Vue 组件放在 `components/` 目录，已全局自动注册，可直接在 Markdown 中使用

## 章节生成检查清单

生成每个章节时，逐项确认：

1. 已读取 `glossary.yaml`、`course-map.yaml`、`chapter-spec-index.yaml`、`component-spec.md`
2. 只解释当前章节 `first_terms` 中的术语
3. 前序术语全部使用 `<InvestTerm id="..." />` 引用
4. 只使用 `course-map.yaml` 当前章节 `components` 中声明的组件
5. 图表只使用 `chart_slots` 中声明的槽位
6. 涉及风险内容时已添加 `InvestRiskNotice`
7. scope 正确（`current_a_share_path` / `bridge_only` / `advanced_boundary`）
8. 无具体买卖建议、无未验证数据
