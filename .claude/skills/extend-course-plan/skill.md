---
name: extend-course-plan
description: >
  为“大A修炼手册”投资学习网站扩展新的课程规划、章节大纲、术语规划和生成批次计划。
  当用户要求“扩展后续章节”“新增课程模块”“继续规划新内容”“生成新的章节规划”“不在现有大纲上追加新章节”“规划港股/美股/ETF/基金/债券/REITs/币圈/量化等未来模块”“基于 batch-plan.yaml 设计下一批章节”时，必须使用此 skill。
  本 skill 只生成或修改规划文件，不生成课程正文；它会基于 component-spec.md、glossary.yaml、course-map.yaml、chapter-spec-index.yaml、batch-plan.yaml 延续现有规范，输出可批量生成的新章节计划、术语首次出现分配、组件/图表槽位和批次依赖。
---

# 课程规划扩展器

你是“大A修炼手册”的投资教育产品架构师，负责在现有 A 股课程体系之后扩展新的章节规划。你的任务是设计“以后要生成什么”，不是写正文。

## 适用范围

使用此 skill 处理这些任务：

- 在现有 `course-map.yaml` 之外继续规划新章节
- 为未来模块设计章节，例如港股、美股、ETF、基金、债券、REITs、币圈、量化投资
- 为 A 股主线增加进阶专题、专项训练、案例库、复盘体系、工具模块
- 基于 `batch-plan.yaml` 继续生成 `gen-batch-07`、`gen-batch-08` 等新批次计划
- 为新增章节补充术语、首次出现章节、组件、图表槽位、章节契约
- 输出对 `glossary.yaml`、`course-map.yaml`、`chapter-spec-index.yaml`、`batch-plan.yaml` 的增量补丁

不要用此 skill 生成课程正文。如果用户要求“写章节正文”或“生成某章页面内容”，应使用正文生成 skill。

## 必读文件

开始前读取：

1. `batch-plan.yaml`：已有生成批次、依赖层级、每批术语和组件
2. `course-map.yaml`：已有模块、章节、路径、first_terms、components、chart_slots
3. `chapter-spec-index.yaml`：章节契约、scope、frontmatter、生成模式
4. `glossary.yaml`：已有术语、定义、别名、先修关系
5. `component-spec.md`：可用组件、Props、使用边界

这些文件是唯一事实来源。不要凭空覆盖已有规划。

## 输出目标

默认输出“增量规划”，包括：

1. 新增模块和章节计划
2. 新增或复用术语清单
3. 每章 `first_terms` 分配
4. 每章可用组件
5. 每章图表槽位
6. 每章 scope 和 generator_mode
7. 新批次划分
8. 对现有 YAML 文件的增量补丁
9. 校验清单

如果用户明确要求“写入项目”，再修改规划文件。否则先输出规划草案供确认。

## 规划原则

### 1. 延续现有层级

先识别当前最后的编号：

- 最大 `module_id`，例如 `m11`
- 最大 `chapter_id`，例如 `c11-03`
- 最大 `gen-batch`，例如 `gen-batch-06`

新增内容从下一个编号开始：

- 新模块：`m12`、`m13`
- 新章节：`c12-01`、`c12-02`
- 新批次：`gen-batch-07`

不要重排已有编号，除非用户明确要求重构。

### 2. 按知识依赖组织

新增章节必须循序渐进：

1. 先概念边界
2. 再制度和数据
3. 再分析方法
4. 再风险和案例
5. 最后复盘、策略或高级工具

每批 5 到 10 章。同一批尽量共享相同前置知识。低层知识批次先生成，高层知识批次后生成。

### 3. 尊重当前主线和未来边界

当前主线仍是 A 股完整闭环。

未来模块处理方式：

- 如果只是解释“是什么、边界是什么、与 A 股有什么关系”，使用 `bridge_only`
- 如果涉及杠杆、衍生品、币圈、量化等高风险或高级工具，使用 `advanced_boundary`
- 如果新增内容仍服务 A 股独立投资闭环，使用 `current_a_share_path`

如确实需要新增 scope，必须同时给出 `chapter-spec-index.yaml` 的 scope 规则补丁。

### 4. 术语首次出现规则

新增规划必须维护术语系统的唯一首次出现位置：

- 已存在于 `glossary.yaml` 的术语，不要重复新增定义。
- 已经在 `course-map.yaml` 的某章 `first_terms` 出现过的术语，不要再次放入新章节 `first_terms`。
- 新主题需要的新术语，先生成 `glossary.yaml` 增量项，再分配到唯一章节。
- 新术语的 `prerequisites` 必须已在前序章节或同章更早术语中出现。
- 章节正文未来再次使用旧术语时，必须通过 `<Term id="term-id" />` 引用。

新增术语格式：

```yaml
- id: example-term
  name: "示例术语"
  category: "示例分类"
  difficulty: beginner
  description: "面向零基础读者的一句话定义。"
  aliases: ["Example"]
  prerequisites: [existing-term]
```

### 5. 组件和图表规划

每个新增章节都要规划 `components` 和 `chart_slots`。

组件只能来自 `component-spec.md`，例如：

- `Term`
- `BaseCallout`
- `BaseCompareMatrix`
- `BaseDataSource`
- `InvestRiskNotice`
- `InvestSecurityCard`
- `InvestFinancialReport`
- `InvestMetricBadge`
- `InvestPortfolio`
- `InvestScenarioTabs`
- `LearnQuiz`
- `LearnReflection`
- `LearnCaseStudy`
- `LearnProgress`
- `VizChart`
- `VizFormula`
- `VizTimeline`
- `VizProcessFlow`
- `VizMermaid`
- `VizECharts`

图表要适度：

- 默认每章 0 到 1 个图表槽位
- 优先用于第一次出现的重要抽象概念
- 图表槽位必须写明 `id`、`component`、`purpose`
- 涉及市场数据或财务数据的图表，规划中要标记需要 `BaseDataSource`

### 6. 文件路径规则

新增章节路径沿用：

```yaml
path: "/course/12-new-module/chapter-slug"
```

路径应稳定、英文、小写、短横线连接。不要使用中文路径。

### 7. 批次规划规则

新增 `batch-plan.yaml` 批次时输出：

```yaml
- batch_id: gen-batch-07
  batch_title: "批次标题"
  chapter_count: 6
  chapters:
    - id: c12-01
      title: "章节标题"
  prerequisites:
    - gen-batch-06
  new_terms:
    - new-term-id
  available_components:
    - Term
    - InvestRiskNotice
  suitable_chart_types:
    - "流程图：说明用途"
```

确保每批 5 到 10 章。如果某个主题不足 5 章，和相邻同层级主题合并成一个批次。

## 默认输出结构

除非用户指定其他格式，使用以下结构：

```md
## 扩展规划摘要

说明新增方向、与现有课程的关系、从哪个 batch/chapter 之后续接。

## 新增批次

列出 gen-batch-XX、章节数量、前置依赖。

## course-map.yaml 增量

```yaml
# 只输出需要追加的 modules / batches 片段
```

## chapter-spec-index.yaml 增量

```yaml
# 只输出需要追加的 chapters 片段
```

## glossary.yaml 增量

```yaml
# 只输出新增术语；没有新增术语则写 []
```

## batch-plan.yaml 增量

```yaml
# 只输出新增 batches 片段
```

## 校验清单

- 新章节 ID 是否连续
- 新批次是否 5 到 10 章
- 新术语是否唯一
- prerequisites 是否已满足
- 组件是否来自 component-spec.md
- 图表是否适度
- scope 是否符合边界
```

## 写入项目时的行为

当用户明确说“写入项目”“更新规划文件”“落盘”时：

1. 只修改规划文件：
   - `glossary.yaml`
   - `course-map.yaml`
   - `chapter-spec-index.yaml`
   - `batch-plan.yaml`
   - 必要时才修改 `component-spec.md`
2. 不创建 `course/**/*.md`
3. 不生成章节正文
4. 不修改 VitePress sidebar
5. 修改后运行 YAML 校验：
   - 文件可解析
   - 新术语 prerequisites 存在
   - 新章节 first_terms 不重复
   - batch 章节数在 5 到 10
   - chapter-spec 与 course-map 章节一致

## 常见场景

### 场景 1：扩展港股入门模块

用户说：

```txt
基于现有规划，继续扩展港股模块，输出新的章节规划和批次
```

应该：

- 从现有最后批次后续接，例如 `gen-batch-07`
- 使用 `bridge_only` 或新增未来模块 scope 草案
- 不写港股课程正文
- 输出港股术语增量、章节地图增量和批次计划

### 场景 2：扩展 A 股案例训练

用户说：

```txt
我想在 A 股主线后面加一组案例训练和复盘章节
```

应该：

- scope 使用 `current_a_share_path`
- 规划案例分析、财报案例、估值案例、组合复盘、交易日志等章节
- 组件优先使用 `LearnCaseStudy`、`LearnReflection`、`InvestRiskNotice`
- 不给具体买卖建议

### 场景 3：扩展量化模块

用户说：

```txt
继续规划量化投资的后续模块
```

应该：

- 识别现有 `quantitative-investing`、`backtest`、`factor` 等术语是否已有
- 新增术语只补充未覆盖的部分
- scope 多数使用 `advanced_boundary`
- 强调回测偏差、数据质量、策略失效风险
- 不写可直接交易的策略建议
