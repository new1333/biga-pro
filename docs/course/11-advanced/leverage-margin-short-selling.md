---
chapter_id: c11-01
title: "融资融券、杠杆与强制平仓"
module_id: m11
batch: batch-11
difficulty: advanced
first_terms: [leverage, margin-trading, short-selling, securities-lending, margin, liquidation]
prerequisite_chapters: [c10-03]
components_used: [InvestTerm, InvestRiskNotice, BaseCompareMatrix]
chart_slots: [leverage-risk-flow]
---

## 本章目标

本章属于"advanced_boundary"——只建立对融资融券、杠杆交易和强制平仓的认知边界和风险理解，**不鼓励新手使用高风险工具**。

<InvestRiskNotice kind="leverage" level="critical" market="CN-A" asset-class="stock" title="杠杆交易极高风险提示" />

## 杠杆：放大收益与亏损的双刃剑

<InvestTerm id="leverage" term="杠杆" mode="tooltip" />

**杠杆**是通过借入资金或使用衍生品放大资产收益和亏损波动的机制。杠杆使你能够用少量的本金控制更大规模的资产——但放大是双向的：收益放大，亏损同样放大。

一个简单示例：你有 10 万元本金。不加杠杆：买入 10 万元股票，涨 10% 赚 1 万。加 1 倍杠杆（借入 10 万）：买入 20 万元股票，涨 10% 赚 2 万——收益翻倍。但如果跌 10%，亏损也是 2 万（本金的 20%）。如果跌 50%，不加杠杆亏 5 万，加杠杆亏 10 万——**本金全亏光**。

## 融资融券：A 股的杠杆工具

<InvestTerm id="margin-trading" term="融资交易" mode="tooltip" />

**融资交易**（融资买入）是投资者向证券公司借入资金买入证券的交易方式。你看好一只股票会上涨，但本金不够——向券商借钱多买一些。股票上涨后卖出，归还借来的钱和利息，差额是自己的利润。但如果股票下跌，你不但要承受股价下跌的损失，还要支付借款利息。

<InvestTerm id="short-selling" term="融券卖出" mode="tooltip" />

**融券卖出**（融券做空）是投资者借入证券后卖出，并在未来买回归还的交易方式。你看跌一只股票——先向券商借入股票卖出，等股价下跌后再买回归还，赚取中间的差价。做空的风险特征与做多不同：做多最多亏 100%（跌到零），**做空的亏损理论上没有上限**——股价可以翻倍甚至翻十倍，你的亏损也同步放大。

<InvestTerm id="securities-lending" term="转融通" mode="tooltip" />

**转融通**是证券金融公司向证券公司提供资金或证券，再由证券公司用于融资融券业务的机制。它是一层"批发"关系——普通投资者通过券商做融资融券，券商缺券或缺钱时向证金公司借。对投资者来说，直接影响不大，但转融通的松紧会影响融资融券的费率和可操作性。

## 保证金与强制平仓

<InvestTerm id="margin" term="保证金" mode="tooltip" />

**保证金**是进行杠杆或衍生品交易时按规则缴纳的履约资金。你把一笔钱作为担保放在券商那里，券商才借你更多的钱或证券。保证金分为初始保证金（开仓时必须达到的比例）和维持保证金（持仓期间必须维持的最低比例）。

<InvestTerm id="liquidation" term="强制平仓" mode="tooltip" />

**强制平仓**（强平）是当保证金或风险指标不满足要求时，交易方被强制了结持仓的行为。当股价下跌导致你的保证金不足时，券商会要求你追加保证金——如果不及时补充，券商会强行卖出你的持仓来收回借款。这时候**你没有选择权**——卖在什么价格、什么时候卖，都不由你控制。

<BaseCompareMatrix
  caption="融资融券与普通交易的关键风险对比"
  :columns="[
    { key: 'normal', label: '普通交易' },
    { key: 'margin', label: '融资融券' }
  ]"
  :rows="[
    { key: 'max-loss', label: '最大亏损', values: { normal: '买入：本金（100%），卖出：理论上无限', margin: '融资：放大亏损；融券：亏损理论上无上限' } },
    { key: 'cost', label: '额外成本', values: { normal: '佣金、印花税', margin: '佣金、印花税 + 融资利息/融券费用' } },
    { key: 'control', label: '持仓控制权', values: { normal: '自主决定何时卖出', margin: '保证金不足时券商可强制平仓' } },
    { key: 'suitability', label: '新手适合度', values: { normal: '正常参与', margin: '不适合新手' } }
  ]"
/>

<InvestRiskNotice kind="leverage" level="critical" market="CN-A" asset-class="stock" title="强制平仓的风险不可逆" />

## 常见误区

1. **"融资就是借钱多赚点，没什么大风险"**：杠杆把你在错误的时点上"被迫离场"的概率放大了很多倍。不加杠杆时你可以"熬过去"，加了杠杆后的强制平仓会把你彻底踢出局——市场后续反弹和你就没有关系了。

2. **"融券做空是高手玩的，学会了就能熊市也赚钱"**：做空不仅风险极高，在 A 股的实际操作性也有限——融券的券源经常不足、费率高、有期限和额度限制。作为新手投资者，当前阶段完全不需要考虑做空。

3. **"只要控制好杠杆比例就没事"**：再低比例的杠杆也会在极端行情中成为风险放大器。2008 年和 2015 年的市场教训一再证明：很多人不是倒在判断错误上，而是倒在了杠杆上。

## 本章总结

- **杠杆**在放大收益的同时等比例放大亏损——本质是"借钱下注"
- **融资**是借钱买股票（做多），**融券**是借股票卖出（做空）
- **保证金不足**就会触发**强制平仓**——你失去了持仓的控制权
- 融资融券对新手**极度不推荐**——在建立完整的基础投资能力之前，不需要考虑杠杆
