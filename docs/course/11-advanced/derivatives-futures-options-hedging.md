---
chapter_id: c11-02
title: "衍生品、期货、期权与对冲"
module_id: m11
batch: batch-11
difficulty: advanced
first_terms: [derivative, futures, stock-index-futures, options, call-option, put-option, hedging]
prerequisite_chapters: [c11-01]
components_used: [InvestTerm, InvestRiskNotice, BaseCompareMatrix]
chart_slots: [derivatives-boundary-matrix]
---

## 本章目标

本章属于"advanced_boundary"——只建立衍生品、期货、期权和对冲的基本认知边界和风险意识，不鼓励新手参与高复杂度的金融工具。

<InvestRiskNotice kind="leverage" level="critical" market="CN-A" asset-class="stock" title="衍生品极高风险提示" />

## 衍生品：价值来自别人

<InvestTerm id="derivative" term="衍生品" mode="tooltip" />

**衍生品**是价值来源于股票、指数、利率、商品等基础资产的金融工具。衍生品的价格不由自身创造，而是"衍生"自它所挂钩的底层资产。衍生品家族包括期货、期权、掉期等多种产品——它们共享一个特征：**复杂度远高于股票本身**。

## 期货：未来的价格

<InvestTerm id="futures" term="期货" mode="tooltip" />

**期货**是买卖双方约定在未来按特定价格交割标的资产或现金结算的标准化合约。一份期货合约锁定了"未来的买卖价格"——比如你买入一份下个月到期的螺纹钢期货，意思是下个月到期时你将以约定的价格买入这批钢材。

<InvestTerm id="stock-index-futures" term="股指期货" mode="tooltip" />

**股指期货**是以 <InvestTerm id="stock-index" term="股票指数" /> 为标的的期货合约。A 股的股指期货主要有沪深 300 股指期货、中证 500 股指期货等。股指期货是机构进行**对冲**（见下方）的重要工具，但也吸引投机资金参与方向博弈。

期货的一个关键特征是**保证金交易**——你只需要缴纳约 10%-15% 的保证金就能建立对应面值的仓位。这意味着大约 7-10 倍的杠杆。方向判断错误时，亏损会以同样的倍数放大。

## 期权：权利而非义务

<InvestTerm id="options" term="期权" mode="tooltip" />

**期权**是赋予买方在未来按约定价格买入或卖出标的资产**权利**（而非义务）的合约。期权的买方支付一笔"权利金"，获得在未来以约定价格买卖的权利；卖方收取权利金，承担在买方行权时必须履行的义务。

<InvestTerm id="call-option" term="认购期权" mode="tooltip" />

**认购期权**（看涨期权）赋予持有人按约定价格**买入**标的资产的权利。如果你认为某只股票未来会大涨，买一份认购期权，如果判断错了——最多亏掉权利金，而不需要承担股票下跌的全部损失。

<InvestTerm id="put-option" term="认沽期权" mode="tooltip" />

**认沽期权**（看跌期权）赋予持有人按约定价格**卖出**标的资产的权利。如果你持有股票、但担心短期内价格大跌——买入一份认沽期权作为"保险"。如果真的大跌了，认沽期权的收益可以部分对冲股票的亏损。

## 对冲：降低风险的行为

<InvestTerm id="hedging" term="对冲" mode="tooltip" />

**对冲**是通过持有相关资产或衍生品来降低特定风险敞口的行为。对冲不是"对冲基金"——它是一种风险管理行为。比如：你持有大量 <InvestTerm id="csi300" term="沪深 300" /> 成分股，担心近期行情可能下跌——通过做空等量的股指期货来"对冲"下跌风险。如果市场真跌了，期货的空头收益可以弥补股票的亏损。

<BaseCompareMatrix
  caption="期货、期权和对冲的核心特征和风险边界对比"
  :columns="[
    { key: 'futures', label: '期货' },
    { key: 'options', label: '期权' },
    { key: 'hedge', label: '对冲' }
  ]"
  :rows="[
    { key: 'nature', label: '本质', values: { futures: '锁定未来买卖价格的标准化合约', options: '买卖「在未来以约定价交易」的权利', hedge: '通过相关资产降低特定风险的行为' } },
    { key: 'leverage', label: '杠杆水平', values: { futures: '高（保证金交易，约7-10倍）', options: '取决于策略，可高可低', hedge: '取决于对冲工具和比例' } },
    { key: 'risk', label: '主要风险', values: { futures: '方向判断错误 + 杠杆放大亏损', options: '买方最多亏权利金、卖方亏损无上限', hedge: '对冲不完全、基差风险' } },
    { key: 'suitability', label: '新手适合度', values: { futures: '不适合', options: '不适合', hedge: '复杂策略不适合，但理解对冲思想有价值' } }
  ]"
/>

<InvestRiskNotice kind="leverage" level="critical" market="CN-A" asset-class="stock" title="衍生品不适合新手" />

## 常见误区

1. **"期权买方最多亏权利金，所以期权不危险"**：虽然买方损失有限，但多数期权在到期时是"一文不值"的。频繁买入期权的累计亏损很快就会把本金消耗殆尽。

2. **"对冲就能消除所有风险"**：对冲不是免费的——需要承担对冲工具的成本（权利金、期货的交易费用等），而且对冲可能不完全（基差风险、比例不匹配）。对冲是管理风险，不是消除风险。

3. **"期货就是用来赌博的"**：期货在设计之初是用于套期保值（锁价）的实用功能——农民用期货锁定粮食售价、航空公司用期货锁定油价。但在投机资金大量参与后确实容易被误用。

## 本章总结

- **衍生品**的价值来自底层资产，期货、期权是最常见的两类
- **期货**放大杠杆、**期权**提供非对称的损益结构
- **对冲**用相关资产降低特定风险——这个思想在组合管理中有应用价值
- **以上工具对新手极度不推荐**——当前阶段只需知道它们存在即可
