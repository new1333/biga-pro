---
chapter_id: c10-01
title: "基本面分析、技术分析、策略与定投"
module_id: m10
batch: batch-10
difficulty: intermediate
first_terms: [fundamental-analysis, technical-analysis, strategy, dollar-cost-averaging]
prerequisite_chapters: [c09-03]
components_used: [InvestTerm, BaseCompareMatrix, InvestRiskNotice]
chart_slots: [method-comparison]
---

## 本章目标

系统梳理基本面分析和技术分析两种方法体系，理解策略的概念，以及定投作为一种入门策略的逻辑和局限。

## 基本面分析：研究"值不值"

<InvestTerm id="fundamental-analysis" term="基本面分析" mode="tooltip" />

**基本面分析**是通过公司财务、行业、竞争力、管理层和估值等因素分析投资价值的方法。你在本课程中学到的绝大多数内容——读 <InvestTerm id="financial-report" term="财报" />、分析 <InvestTerm id="industry" term="行业" />、识别 <InvestTerm id="competitive-advantage" term="竞争优势" />、计算 <InvestTerm id="valuation" term="估值" />——都属于基本面分析的范畴。

基本面分析的核心优势是逻辑链条完整、能够建立对公司的深度理解。它的局限是需要大量时间投入、无法在信息不完全的情况下做出快速判断。

## 技术分析：研究"什么时候"

<InvestTerm id="technical-analysis" term="技术分析" mode="tooltip" />

**技术分析**是通过价格、成交量和技术指标研究市场行为的方法。本课程的行情数据、K 线、均线和指标模块都属于技术分析的范畴。

技术分析的核心优势是反应快速、可以覆盖大量标的、对入场和出场时机的把握相对直观。它的局限是不关心公司的内在价值、在基本面的重大变化面前经常失灵。

<BaseCallout type="tip" title="基本面和技术分析的关系">
这两家不是"谁对谁错"的问题，而是用来回答不同问题的：基本面分析告诉你"值不值得买"，技术分析帮你把握"什么时候买"。多数有经验的投资者会两者结合——基本面选股、技术面择时。
</BaseCallout>

## 策略：把分析变成可执行的规则

<InvestTerm id="strategy" term="策略" mode="tooltip" />

**策略**是按照明确规则进行选股、买卖、仓位和风控管理的方法体系。分析是告诉你"怎么看"，策略是告诉你在具体的情境下"怎么办"。

一个好的策略通常包含：
- 选股规则（买什么、不买什么）
- 买入条件（什么情况下入场）
- 仓位规则（每次投入多少钱、单只股票最多占多少）
- 卖出条件（什么时候止盈、什么时候止损）
- 复盘规则（定期回顾和优化）

举一个简单的策略示例（仅供教学说明，不做投资建议）：

> **选股**：在沪深 300 成分股中，筛选 ROE > 15% 且连续三年正增长、资产负债率 < 60%、PE 低于近五年 50% 分位的公司  
> **买入**：当公司发布年报后，如果扣非净利润增速 > 10% 且经营现金流/净利润 > 0.8，于次日开盘买入  
> **仓位**：单只股票不超过总资金的 15%，总仓位不超过 60%  
> **卖出**：亏损超过 15% 无条件止损；PE 超过近五年 80% 分位时减持一半；公司被立案调查时立即清仓  
> **复盘**：每季度末统计每笔交易的盈亏、胜率和最大回撤，记录每笔交易的决策理由

这个示例的核心不是具体的数字（15%、60%、80% 这些阈值因人而异），而是**每一个决策环节都有明确的规则，不需要临场发挥**。拥有策略的好处是：当市场恐慌或狂热时，规则替你做了决策——你只需要执行。

## 定投：最简单但有效果的策略

<InvestTerm id="dollar-cost-averaging" term="定投" mode="tooltip" />

**定投**（定期定额投资、Dollar Cost Averaging）是按固定时间或规则分批投入资金的投资方式。比如每月工资日固定买入 1000 元某只指数基金——无论市场是高是低。

定投的核心优势：
1. **不需要择时**：你不用判断"现在是高点还是低点"
2. **平滑成本**：贵时买得少、便宜时买得多（同等金额购买更多份额）
3. **纪律性强**：克服了"跌了不敢买、涨了追高买"的心理弱点

定投的局限：
- 在持续上涨的牛市中，定投的总成本比一次投入更高
- 不适合个股——如果定投的是一家基本面持续恶化的公司，越买越亏
- 更适合以指数基金或优质 <InvestTerm id="etf" term="ETF" /> 为标的

<BaseCompareMatrix
  caption="基本面分析、技术分析和定投策略的关键特征对比"
  :columns="[
    { key: 'fundamental', label: '基本面分析' },
    { key: 'technical', label: '技术分析' },
    { key: 'dca', label: '定投策略' }
  ]"
  :rows="[
    { key: 'question', label: '回答的问题', values: { fundamental: '这只股票值不值得买？', technical: '什么时候买/卖？', dca: '怎么让时间帮你分散风险？' } },
    { key: 'strength', label: '核心优势', values: { fundamental: '深度理解公司和行业', technical: '快速反应、覆盖广', dca: '不需要择时、纪律性强' } },
    { key: 'limitation', label: '主要局限', values: { fundamental: '耗时、信息滞后', technical: '脱离基本面、熊市信号有效性低', dca: '不适合个股、不适合单边上行' } },
    { key: 'best-for', label: '适合场景', values: { fundamental: '中长期投资选股', technical: '辅助入场和出场时机判断', dca: '新手入门、长期财富积累' } }
  ]"
/>

<InvestRiskNotice kind="market" level="medium" market="CN-A" asset-class="stock" title="方法和策略选择风险" />

## 常见误区

1. **"基本面分析 = 价值投资"**：基本面积分析是工具，价值投资是哲学。你可以用基本面分析来寻找成长股，也可以用技术分析来辅助判断入场点。

2. **"定投就是躺赚"**：定投让你不择时，但不是让你不选标的。如果定投的是一只长期下跌的劣质资产，定投只是在"有纪律地亏钱"。标的的选择仍然至关重要。

3. **"策略必须非常复杂"**：策略越复杂、需要的假设和参数越多、越容易过拟合历史。有时候一个简单的策略（如"每月定投沪深 300 ETF"）长期表现优于各种花式策略。

## 本章总结

- **基本面分析**研究"值不值得"，**技术分析**把握"什么时候"——两者互补
- **策略**是把分析方法转化为可执行规则的系统，四个要素缺一不可
- **定投**适合新手、适合指数化投资——核心优势是不择时和纪律性强
