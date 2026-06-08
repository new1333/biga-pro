---
chapter_id: c09-02
title: "分散投资、资产配置、再平衡与风险控制"
module_id: m09
batch: batch-09
difficulty: intermediate
first_terms: [risk-return, stop-loss, take-profit, asset-allocation, rebalancing, concentration-risk, liquidity-risk, black-swan, tail-risk]
prerequisite_chapters: [c09-01]
components_used: [InvestTerm, InvestPortfolio, InvestRiskNotice]
chart_slots: [allocation-portfolio]
---

## 本章目标

理解风险收益比、止损止盈、资产配置和再平衡的实践逻辑，认识集中度风险、流动性风险、黑天鹅事件和尾部风险，建立系统化的风险控制思维。

## 风险收益比：每一次交易的算账

<InvestTerm id="risk-return" term="风险收益比" mode="tooltip" />

**风险收益比**（也叫盈亏比）是潜在收益与潜在风险之间的比较关系。在进入任何一笔交易之前，先问自己：如果对了，大概能赚多少？如果错了，大概会亏多少？前者除以后者，就是风险收益比。

比如：你认为一只股票有 60% 概率涨到 12 元（赚 2 元），有 40% 概率跌到 8 元（亏 2 元）。风险收益比 = 2:2 = 1:1。这个比例太低——你需要更高的盈亏比来弥补不确定性。

## 止损与止盈

<InvestTerm id="stop-loss" term="止损" mode="tooltip" />

**止损**是当亏损或风险达到预设条件时卖出或降低风险敞口的行为。止损的核心是在你判断错误的时候**保护本金**——让一次错误的代价可控。

止损的具体方式可以多种：固定比例止损（跌 10% 就卖）、技术位止损（跌破关键支撑就卖）、时间止损（一个月不涨就卖）。没有一种方式是最优的，但"没有止损"对大多数投资者来说是最危险的。

<InvestTerm id="take-profit" term="止盈" mode="tooltip" />

**止盈**是当收益达到预设条件时卖出或降低风险敞口的行为。止盈比止损更难——亏钱时的痛苦驱动止损相对容易执行，但赚钱时的贪婪会让投资者总觉得"还能再涨"。

<BaseCallout type="tip" title="止盈止损不是万能药">
机械的止盈止损在趋势行情中可能让你过早离场（踏空了一大段涨幅），在震荡行情中可能频繁触发导致成本累积。它们是需要根据具体策略和市场环境灵活调整的工具，不是放之四海而皆准的铁律。
</BaseCallout>

## 资产配置与再平衡

<InvestTerm id="asset-allocation" term="资产配置" mode="tooltip" />

**资产配置**是在股票、债券、现金等资产类别之间分配资金的过程。资产配置是组合管理中影响最大的决策——研究表明，资产配置解释了组合收益波动的 90% 以上。

<InvestTerm id="rebalancing" term="再平衡" mode="tooltip" />

**再平衡**是将组合权重调整回目标配置比例的过程。比如你的目标是 60% <InvestTerm id="stock" term="股票" /> + 40% 债券。股票大涨后比例变成 75% + 25%——你需要卖出部分股票、买入部分债券来恢复到 60/40。

再平衡的智慧在于：它强迫你在"资产贵的时候卖出、在资产便宜的时候买入"——这是纪律性的反向操作，与人的自然冲动（追涨杀跌）恰好相反。

<InvestPortfolio
  id="allocation-example"
  currency="CNY"
  scenario="rebalance"
  :holdings="[
    { symbol: 'STOCK-A', name: 'A股大盘', assetClass: 'stock', weight: 40, market: 'CN-A' },
    { symbol: 'STOCK-B', name: 'A股中小盘', assetClass: 'stock', weight: 20, market: 'CN-A' },
    { symbol: 'BOND', name: '债券类资产', assetClass: 'bond', weight: 25, market: 'CN-A' },
    { symbol: 'CASH', name: '现金/货币基金', assetClass: 'cash', weight: 15, market: 'CN-A' }
  ]"
  :metrics="[
    { label: '总权益类', value: '60%' },
    { label: '总固收+现金', value: '40%' }
  ]"
/>

## 几种需要认识的风险类型

<InvestTerm id="concentration-risk" term="集中度风险" mode="tooltip" />

**集中度风险**是资金过度集中于少数标的、行业或风格导致的风险。如果你的全部身家都在一只股票上，这只股票出了任何一个问题，你的财富都会遭受剧烈冲击。适度的分散是应对集中度风险最朴素的方式。

<InvestTerm id="liquidity-risk" term="流动性风险" mode="tooltip" />

**流动性风险**是无法以合理价格及时买入或卖出资产的风险。A 股中的 ST 股票、部分小盘股在市场恐慌时可能出现"想卖卖不掉"的情况。与流动性充足的大盘股相比，这些品种的流动性风险在你最需要变现的时候会急剧放大。

<InvestTerm id="black-swan" term="黑天鹅" mode="tooltip" />

**黑天鹅**是难以预测但影响重大的极端事件。新冠疫情、2008 年全球金融危机——这些事件的共同特征是"事前几乎没有人预见到，事后产生的影响极其深远"。黑天鹅无法被预测，但可以被"应对"——保持适度的现金仓位、不把所有资金都放在高风险资产中。

<InvestTerm id="tail-risk" term="尾部风险" mode="tooltip" />

**尾部风险**是发生概率较低但损失可能极大的极端风险。正态分布假设认为"极端事件"发生概率很小，但金融市场的实际分布存在"肥尾"——极端事件发生的频率远比统计模型预测的更高。尾部风险的存在是给高杠杆策略敲响的警钟。

<InvestRiskNotice kind="market" level="high" market="CN-A" asset-class="stock" title="综合风险提示" />

## 常见误区

1. **"止损了就能控制风险"**：止损在正常市场中有效，但在市场恐慌、流动性枯竭时，你可能无法在止损价位成交——最终的实际亏损远大于预设止损线。这就是流动性风险让止损机制失灵的情况。

2. **"资产配置做好了就一劳永逸"**：资产配置是一个持续过程，需要定期审视和再平衡。随着市场变化和你的生活阶段变化，目标配置比例也应该调整——年轻人可以承受更高比例的股票配置，临近退休则应更偏保守。

3. **"黑天鹅事件关心也没用，因为它不可预测"**：不可预测≠不可准备。保持足够的现金缓冲、控制单一资产的最大占比、不在高杠杆下裸奔——这些措施不减损黑天鹅的概率，但能大幅降低击中你时的伤害程度。

## 本章总结

- **风险收益比**在每笔交易前问自己——对了赚多少、错了亏多少
- **止损止盈**是纪律工具，不是万能公式，需要根据策略和市场环境灵活使用
- **资产配置**是组合管理影响最大的决策，**再平衡**是纪律性的逆向操作
- **集中度风险**和**流动性风险**时刻存在——分散和对流动性的关注是最好的保护
- **黑天鹅**和**尾部风险**不可预测但可以被准备——保持安全缓冲
