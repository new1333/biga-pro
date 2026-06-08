---
chapter_id: c04-03
title: "基金、指数基金与ETF"
module_id: m04
batch: batch-04
difficulty: beginner
first_terms: [fund, mutual-fund, index-fund, etf, lof, qdii]
prerequisite_chapters: [c04-02]
components_used: [InvestTerm, BaseCompareMatrix, InvestRiskNotice]
chart_slots: [fund-product-matrix]
---

## 本章目标

理解基金的基本概念、公募基金、指数基金、ETF、LOF 和 QDII 的区别，建立"通过基金参与市场"的基础认知。

## 基金：把钱交给专业的人管

<InvestTerm id="fund" term="基金" mode="tooltip" />

**基金**是由基金管理人集合投资者资金，并按基金合同进行投资管理的金融产品。简单说，就是"大家凑钱，请一个专业的团队来管"。

基金的核心逻辑：

1. 很多投资者各自出一点钱，汇集成一个大的资金池
2. 基金管理人（基金公司）按约定的策略进行投资——买什么、买多少、什么时候调整
3. 投资者按出资比例分享收益、承担亏损

对于新手来说，基金的一个关键优势是**分散**——买一只基金等于间接持有几十只甚至几百只 <InvestTerm id="stock" term="股票" /> 或债券，不需要你自己逐只选股。

<InvestTerm id="mutual-fund" term="公募基金" mode="tooltip" />

**公募基金**是面向公众募集资金并由专业机构管理的基金产品。你在银行、证券公司 App、第三方理财平台能买到的基金，绝大多数是公募基金。公募基金受严格监管，信息披露和运作规则相对透明。

## 指数基金：跟着指数走

<InvestTerm id="index-fund" term="指数基金" mode="tooltip" />

**指数基金**是以跟踪特定 <InvestTerm id="index" term="指数" /> 为主要目标的基金。它的逻辑很简单：指数里有哪些股票、各占多少比例，这个基金就按相同的比例买入这些股票。

指数基金不靠基金经理的"眼光"选股，而是机械地复制指数的构成，所以也被叫做"被动基金"。它的优势是：

- **费用低**：不需要养研究团队选股，管理费通常比主动基金低很多
- **风格稳定**：不会因为换了基金经理就改变风格
- **透明**：你知道它买的是什么（因为指数的成分股是公开的）

## ETF：可以在交易所买卖的基金

<InvestTerm id="etf" term="ETF" mode="tooltip" />

**ETF**（交易型开放式指数基金）是可以在交易所像 <InvestTerm id="stock" term="股票" /> 一样实时买卖的开放式基金。ETF 结合了基金和股票两种产品的特点：

- 像基金一样：一篮子持有多只证券，天然分散
- 像股票一样：在交易时段可以随时按市价买卖（不需要等收盘后的净值结算）
- 费用低于普通公募基金

ETF 的一级市场和二级市场机制是一个理解门槛较高的概念（将在下一章展开），目前你只需要知道：ETF 在交易 App 上的操作方式和买卖股票几乎完全相同——输入代码、价格、数量，点击买卖。

<InvestTerm id="lof" term="LOF" mode="tooltip" />

**LOF**（上市型开放式基金）是既可以在 <InvestTerm id="secondary-market" term="二级市场" />（交易所）按市价交易，也可以按规则申购赎回的基金品种。LOF 和 ETF 的差别在于：LOF 不一定是跟踪指数的——它也可以是主动管理的基金；ETF 则绝大多数是指数跟踪型。

<InvestTerm id="qdii" term="QDII" mode="tooltip" />

**QDII**（合格境内机构投资者）是一种允许境内的基金等机构投资境外市场的制度安排。QDII 基金让你可以在不直接开立境外账户的情况下，通过人民币参与港股、美股、全球市场。

<BaseCallout type="note" title="QDII 的局限性">
QDII 有额度限制——当额度用完后，基金可能暂停申购。此外，QDII 基金的赎回周期通常比普通基金更长（涉及跨境资金结算），流动性需要特别注意。
</BaseCallout>

## 基金产品对比

<BaseCompareMatrix
  caption="公募基金、指数基金、ETF、LOF 和 QDII 的关键特征对比"
  :columns="[
    { key: 'mutual', label: '公募基金' },
    { key: 'index', label: '指数基金' },
    { key: 'etf', label: 'ETF' },
    { key: 'lof', label: 'LOF' },
    { key: 'qdii', label: 'QDII基金' }
  ]"
  :rows="[
    { key: 'nature', label: '本质', values: { mutual: '投资者集合资金，专业机构管理', index: '被动跟踪指数的基金', etf: '可在交易所实时交易的指数基金', lof: '可在交易所交易的开放式基金', qdii: '投资境外市场的基金'} },
    { key: 'trade', label: '交易方式', values: { mutual: '场外申购赎回，按日终净值结算', index: '同公募基金，场外申赎', etf: '交易所实时交易 + 场外申赎双机制', lof: '交易所交易 + 场外申赎', qdii: '场外申赎为主'} },
    { key: 'fee', label: '费率水平', values: { mutual: '中等（管理费+托管费）', index: '较低', etf: '最低', lof: '中等偏高', qdii: '中等偏高'} },
    { key: 'scope', label: '当前课程覆盖', values: { mutual: '仅概念入门（未来扩展）', index: '仅概念入门（未来扩展）', etf: '概念入门（未来扩展）', lof: '仅概念入门', qdii: '仅概念边界'} }
  ]"
/>

<InvestRiskNotice kind="market" level="medium" market="CN-A" asset-class="fund" title="基金投资风险提示" />

<BaseCallout type="note" title="本课程的基金覆盖范围">
当前课程聚焦于 A 股的股票投资闭环。基金（包括 ETF）的深入内容——如何分析基金持仓、如何比较费率、如何构建基金组合——将在未来的 ETF/基金扩展模块中详细展开。本章的目标是建立概念认知，让你知道这些产品分别是什么。
</BaseCallout>

## 常见误区

1. **"基金不会亏钱"**：基金只是分散了单只股票的风险，没有消除 <InvestTerm id="market-risk" term="市场风险" />。遇上熊市，指数基金同样会下跌——而且跌幅可能和指数一样大。

2. **"ETF 和股票完全一样"**：ETF 在交易操作上和股票看起来一样，但底层结构不同。ETF 的净值由成分股的价格决定，而交易价格由市场买卖决定——两者可能存在偏离（这也是下一章要讲的溢价折价问题）。

3. **"QDII 基金就能轻松买遍全球"**：QDII 受限于额度和跨境结算机制，不是"想来就来、想走就走"的通道。对于新手来说，当前的精力更适合集中在 A 股市场。

## 本章总结

- **基金**是集合投资工具，核心优势是**分散**、**专业管理**和**低门槛**
- **指数基金**被动跟踪指数，费率低、风格稳定
- **ETF**可以像股票一样实时交易，费率最低
- **LOF** 是交易所可交易的开放式基金，不限于指数跟踪
- **QDII**是投资境外市场的制度通道，有额度限制

理解了基金和 ETF 的基本概念，下一章我们将深入 ETF 的一个关键技术问题——**净值、溢价折价和跟踪误差**。
