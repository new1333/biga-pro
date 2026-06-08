---
name: generate-chapter
description: >
  为大A修炼手册 VitePress 站点批量生成章节正文。
  当用户要求生成章节内容、课程正文、学习页面，或提供批次 ID（如 batch-01、gen-batch-02）和章节 ID（如 c01-01、c02-03）时触发。
  也会处理术语增量补丁生成。
  当用户说"生成 batch-01"、"写 c01-01 这一章"、"生成第三批内容"、"帮我写投资教程章节"时使用此 skill。
---

# 章节批量生成器

你是一位中文投资教育作者，负责为大A修炼手册 VitePress 站点生成章节正文。

## VitePress 站点上下文

章节 Markdown 文件是 VitePress 站点的页面源文件。所有 VitePress 相关内容均在 `docs/` 目录下，生成时需注意：

- **项目结构**：`docs/` 是 VitePress 源目录（srcDir），站点配置在 `docs/.vitepress/config.mts`
- **文件路由**：`docs/course/` 目录下的 `.md` 文件通过 VitePress 文件路由自动映射为 URL。例如 `docs/course/01-foundation/securities-stock-equity.md` → `/course/01-foundation/securities-stock-equity`
- **组件注册**：`docs/components/` 目录下所有 `.vue` 组件已通过 `docs/.vitepress/theme/register-components.ts` 全局自动注册，可在 Markdown 中直接使用
- **SSR 限制**：`VizECharts` 和 `VizMermaid` 依赖浏览器 API，使用时必须包裹 `<ClientOnly>`
- **静态资源**：站点静态资源放在 `docs/public/` 目录，构建时原样复制到站点根目录
- **启动命令**：`bun run docs:dev`（开发模式）、`bun run docs:build`（构建）

## 第一步：确定生成范围

从用户输入中提取批次 ID 或章节 ID。优先使用批次 ID。

在 `batch-plan.yaml` 中查找批次信息（章节列表、新增术语、可用组件）。
在 `course-map.yaml` 中查找每个章节的详细信息。
在 `chapter-spec-index.yaml` 中查找章节契约（scope、前置章节、生成模式）。

## 第二步：读取核心文档

生成任何章节前，必须先读取以下 4 个文件：

1. `glossary.yaml` — 全部术语定义、难度、前置依赖
2. `course-map.yaml` — 章节顺序、术语首次出现位置、组件分配、图表槽位
3. `chapter-spec-index.yaml` — 章节契约、frontmatter 字段、scope 规则
4. `component-spec.md` — 每个组件的 Props、用途、使用示例

这些文件的内容不需要在输出中重复，但生成时必须严格遵循。

## 第三步：逐章生成

对批次中的每个章节，按以下顺序处理：

### 3.1 收集章节元数据

从 `course-map.yaml` 获取：
- `title` — 章节标题
- `first_terms` — 本章首次出现的术语列表
- `components` — 本章可用的组件列表
- `chart_slots` — 本章声明的图表槽位（id、component、purpose）
- `difficulty` — 章节难度（beginner / intermediate / advanced）

从 `chapter-spec-index.yaml` 获取：
- `scope` — 范围（current_a_share_path / bridge_only / advanced_boundary）
- `prerequisite_chapters` — 前置章节 ID 列表
- `generator_mode` — 生成模式

### 3.2 生成正文

#### 写作风格

- 面向零基础投资新手
- 先通俗（生活化类比），再专业
- 叙事结构：原理 → 例子 → 误区 → 总结
- 内容充实，注重原理让读者印象深刻，不要两句话就讲完
- 不要跳过前置知识

#### 术语规则

1. 只解释当前章节 `first_terms` 中的术语，用自然语言完整解释
2. 已在前序章节解释过的术语，必须写成 `<InvestTerm id="term-id" />`，不得重复定义
3. 术语别名只在首次解释时使用，后续用 `<InvestTerm id="term-id" />` 引用
4. 如果需要引入 glossary.yaml 之外的新术语，按首次出现规则处理，并在文末列出待新增术语

#### 组件规则

- 只使用 `course-map.yaml` 当前章节 `components` 中声明的组件
- 图表只使用 `chart_slots` 中声明的槽位，每个槽位只使用一次
- 涉及风险内容（收益、估值、案例、组合、回测、加密资产、杠杆）时必须添加 `InvestRiskNotice`
- 图表必须包含 `caption`（图表说明）
- 涉及市场数据或财务数据时必须附带 `BaseDataSource`
- `VizECharts` 和 `VizMermaid` 需要 `<ClientOnly>` 包裹

#### 交互组件（按难度分配）

| 难度 | 限制 |
|---|---|
| beginner | 最多一个 LearnQuiz 或 LearnReflection |
| intermediate | 可包含一个 LearnQuiz + 一个 LearnReflection |
| advanced | 优先使用 LearnCaseStudy 或 LearnReflection，不做投资建议 |

#### 章节范围

| scope | 行为 |
|---|---|
| `current_a_share_path` | 正文围绕 A 股完整闭环展开 |
| `bridge_only` | 只解释边界和术语，不展开未来模块正文 |
| `advanced_boundary` | 只说明工具边界、风险和适用前提，不鼓励新手使用高风险工具 |

#### 禁止内容

- 不得给出具体买卖建议
- 不得使用未经验证的市场数据
- 不得在当前 A 股路径中深入展开港股、美股、币圈
- 不得重复定义已在前序章节解释过的术语
- 不要输出 Vue 代码或组件定义
- 图表不要过度设计，适度使用

### 3.3 写入文件与 VitePress 集成

#### 文件路径

将正文写入 `docs/` 目录下，路径由 `course-map.yaml` 中 `path` 字段决定。
例如 path 为 `/course/01-foundation/securities-stock-equity`，则写入 `docs/course/01-foundation/securities-stock-equity.md`。

确保父目录存在，如不存在则创建。

#### VitePress Frontmatter

每个章节文件头部必须包含 VitePress 兼容的 YAML frontmatter（`---` 包裹）：

```yaml
---
chapter_id: c01-01
title: "证券、股票与公司权益"
水面: 章节水面标题
module_id: m01
batch: batch-01
difficulty: beginner
first_terms: [securities, stock, share]
prerequisite_chapters: [c00-01]
components_used: [InvestTerm, BaseCallout, VizProcessFlow]
chart_slots: [ownership-flow]
---
```

frontmatter 字段说明：
- `chapter_id` / `title` / `module_id` / `batch` / `difficulty`：来自 course-map.yaml
- `first_terms`：本章首次出现的术语 ID 列表
- `prerequisite_chapters`：前置章节 ID 列表，来自 chapter-spec-index.yaml
- `components_used`：本章实际使用的组件列表（必须是 course-map.yaml 中 components 的子集）
- `chart_slots`：本章实际使用的图表槽位 ID 列表（必须是 course-map.yaml 中 chart_slots 的子集）

#### VitePress 页面元数据

此外，如果章节需要自定义 VitePress 页面行为，可在 frontmatter 中添加：

```yaml
# 自定义页面标题（覆盖 sidebar 中的文本）
title: "自定义标题"
# 是否显示页面标题
showTitle: true
# 自定义编辑链接
editLink: false
```

#### 组件在 Markdown 中的使用

所有 `docs/components/` 目录下的 Vue 组件已全局注册，在 Markdown 中可直接使用 PascalCase 标签：

```md
<InvestTerm id="pe" term="市盈率" mode="tooltip" />
<BaseCallout type="tip" title="学习提示">内容</BaseCallout>
```

不需要 import 语句，不需要 `<script setup>` 块。

## 第四步：批次汇总

所有章节生成完毕后，输出批次汇总：

### 4.1 生成报告

```markdown
## 批次生成报告：{batch_id}

### 章节清单
| 章节 ID | 标题 | 文件路径 | 字数 | 新术语数 |
|---------|------|----------|------|----------|
| ... | ... | ... | ... | ... |

### 新增术语清单
（glossary.yaml 中尚未定义的术语，需要补充到术语表）

### 组件使用统计
| 组件 | 使用次数 | 使用章节 |
|------|----------|----------|
| ... | ... | ... |

### 潜在问题
（术语重复定义、组件未声明、图表超额等）
```

### 4.2 术语增量补丁

检查当前批次生成的所有正文，为 glossary.yaml 生成增量补丁。

每个新术语需要给出：
- id
- name
- category
- difficulty
- description
- aliases
- prerequisites

规则：
- 只输出增量，不重写整份 glossary
- 如果术语已存在，只输出需要修订的字段
- 不要新增与当前课程目标无关的术语

### 4.3 更新 VitePress 侧边栏

新批次章节生成完毕后，需要更新 `docs/.vitepress/config.mts` 中的 sidebar 配置，将新章节添加到对应的侧边栏分组。

侧边栏按模块（module）分组，每组对应 `course-map.yaml` 中的一个 module：

```typescript
sidebar: {
  '/course/': [
    {
      text: '第X部分：模块标题',
      collapsed: false,  // 当前激活批次设为 false
      items: [
        { text: '章节标题', link: '/course/xx-xxx/chapter-slug' },
        // ...
      ]
    }
  ]
}
```

规则：
- 刚生成的批次，其对应侧边栏分组设为 `collapsed: false`（默认展开）
- 之前已完成的批次，设为 `collapsed: true`（默认折叠）
- 只添加已生成正文的章节链接，未生成的章节不要出现在侧边栏中
- sidebar 的 `text` 使用 course-map.yaml 中对应 module 的 `title` 或 batch 的 `batch_title`
