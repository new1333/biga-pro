---
chapter_id: c03-04
title: "常见技术指标边界"
module_id: m03
batch: batch-03
difficulty: intermediate
first_terms: [macd, rsi, kdj, bollinger-bands, golden-cross, death-cross, divergence, overbought, oversold]
prerequisite_chapters: [c03-03]
components_used: [InvestTerm, BaseCompareMatrix, InvestRiskNotice]
chart_slots: [indicator-comparison]
---

## 本章目标

认识 MACD、RSI、KDJ 和布林带四种常见技术指标的核心原理和应用边界，理解金叉、死叉、背离、超买和超卖的含义，建立"指标是工具不是保证"的正确认知。

## 重要前提：指标是温度计，不是预言家

在进入具体指标之前，有一个必须牢记的前提：

**技术指标是基于历史价格和成交量计算出来的衍生数据。** 它们就像人体的体温计——能告诉你"现在体温是多少"，但不能告诉你"明天会不会发烧"。指标的价值在于帮你更高效地观察和整理市场信息，而不是替你预测未来。

<InvestRiskNotice kind="market" level="medium" market="CN-A" asset-class="stock" title="技术指标使用提示" />

## MACD：趋势跟踪指标

<InvestTerm id="macd" term="MACD" mode="tooltip" />

**MACD**（指数平滑异同移动平均线）是基于不同周期 <InvestTerm id="moving-average" term="均线" /> 的差值计算出来的趋势类指标。它由三部分组成：

- **DIF 线**（快线）：短期均线与长期均线的差值
- **DEA 线**（慢线）：DIF 线的移动平均
- **柱线**（MACD 柱）：DIF 和 DEA 之间的差值，在零轴上方/下方以柱状图显示

MACD 的核心用途是判断**趋势的强度和转折**：

- 当 DIF 向上穿过 DEA 时 → <InvestTerm id="golden-cross" term="金叉" mode="tooltip" />（通常被视为偏多信号）
- 当 DIF 向下穿过 DEA 时 → <InvestTerm id="death-cross" term="死叉" mode="tooltip" />（通常被视为偏空信号）
- 当价格创了新高但 MACD 没有同步创出新高时 → <InvestTerm id="divergence" term="背离" mode="tooltip" />（顶背离，趋势可能减弱）
- 当价格创了新低但 MACD 没有同步创出新低时 → 底背离（下跌动力可能减弱）

<BaseCallout type="warning" title="MACD 的边界">
MACD 是趋势跟随指标，在趋势明确的行情中参考价值较高。但在震荡市中，MACD 会频繁产生金叉死叉信号——这些"假信号"是 MACD 的固有局限。不要看到金叉就买、看到死叉就卖。
</BaseCallout>

## RSI：相对强弱指标

<InvestTerm id="rsi" term="RSI" mode="tooltip" />

**RSI**（相对强弱指标）用于衡量一段时间内价格上涨和下跌力量的相对强度，取值范围在 0 到 100 之间。

RSI 的核心用途：

- RSI 高于 70 → <InvestTerm id="overbought" term="超买" mode="tooltip" />：短期内上涨力量过强，可能出现技术性回调（但不等于"马上要跌"）
- RSI 低于 30 → <InvestTerm id="oversold" term="超卖" mode="tooltip" />：短期内下跌力量过强，可能出现技术性反弹（但不等于"马上要涨"）
- 在强势上涨趋势中，RSI 可能长时间维持在 70 以上的"超买区"，价格照样上涨——这说明"超买"不等于趋势要转折

## KDJ：随机指标

<InvestTerm id="kdj" term="KDJ" mode="tooltip" />

**KDJ**（随机指标）是基于某个周期内价格所处区间位置构建的指标，由 K 线、D 线和 J 线三条曲线组成。KDJ 常用于观察短期的超买超卖状态。

KDJ 的特点是对价格变化反应非常灵敏——但灵敏也意味着信号多、噪音大。在短线波动中，KDJ 可能一天之内产生多个不同方向的信号。对于中长线投资者来说，KDJ 的参考价值有限。

## 布林带：波动区间指标

<InvestTerm id="bollinger-bands" term="布林带" mode="tooltip" />

**布林带**（BOLL）由中轨（通常为 MA20 均线）和上下两条标准差通道构成。布林带反映的不是价格的方向，而是价格的**波动范围**。

- 价格触及上轨 → 价格运行到统计意义上的"高位区域"
- 价格触及下轨 → 价格运行到统计意义上的"低位区域"
- 布林带收窄 → 波动率在缩小，可能酝酿变盘
- 布林带扩张 → 波动率在扩大，趋势可能在加速

布林带的核心价值在于：它给出了一个"当前统计框架下的正常波动范围"，帮助你判断价格是否偏离了正常区间——而不是给出买卖指令。

## 四大指标对比

<BaseCompareMatrix
  caption="MACD、RSI、KDJ、布林带的定位、核心用途与主要局限对比"
  :columns="[
    { key: 'macd', label: 'MACD' },
    { key: 'rsi', label: 'RSI' },
    { key: 'kdj', label: 'KDJ' },
    { key: 'boll', label: '布林带' }
  ]"
  :rows="[
    { key: 'type', label: '指标类型', values: { macd: '趋势类', rsi: '强弱类', kdj: '摆动类', boll: '波动类' } },
    { key: 'main-use', label: '核心用途', values: { macd: '判断趋势方向和强度变化', rsi: '衡量价格超买超卖程度', kdj: '观察短期价格摆动', boll: '界定价格正常波动区间' } },
    { key: 'sensitivity', label: '灵敏度', values: { macd: '中等', rsi: '中等偏高', kdj: '高（噪音也多）', boll: '中等' } },
    { key: 'best-scene', label: '较适用场景', values: { macd: '趋势行情', rsi: '趋势+震荡过渡期', kdj: '短线波动', boll: '震荡+突破识别' } },
    { key: 'weakness', label: '主要局限', values: { macd: '震荡市频繁假信号', rsi: '强趋势中长时间停留在极端值', kdj: '信号过多，噪音大', boll: '只描述波动范围，不判断方向' } }
  ]"
/>

## 关于金叉、死叉和背离

<InvestTerm id="golden-cross" term="金叉" mode="tooltip" />

**金叉**是短期指标向上穿越长期指标的技术形态（如 MA5 上穿 MA20、MACD 的 DIF 上穿 DEA）。传统解读是买入信号——但金叉是**滞后信号**，金叉发生时上涨可能已经完成了一部分。

<InvestTerm id="death-cross" term="死叉" mode="tooltip" />

**死叉**是短期指标向下穿越长期指标的技术形态。同理，死叉也是滞后信号——它确认了已经发生的下跌，但不一定适合作为卖出时点。

<InvestTerm id="divergence" term="背离" mode="tooltip" />

**背离**是价格走势与技术指标走势方向不一致的现象。顶背离（价格新高、指标不新高）和底背离（价格新低、指标不新低）是技术分析中被较广泛关注的信号——但背离可能在趋势中持续存在很长时间才发生转折。

<InvestRiskNotice kind="market" level="medium" market="CN-A" asset-class="stock" title="技术指标的综合使用" />

## 常见误区

1. **"多学几个指标就能预测市场"**：指标只是整理和可视化历史数据的方式，不会告诉你"未来"。真正有效的是**综合判断**——指标 + 趋势 + 量价 + 基本面 + 你自己的风险计划。

2. **"RSI 超买了就该卖了"**：在强趋势中，RSI 可以超买更超买。超买不是卖出信号的充分条件——它更恰当的作用是提醒你"这里风险回报比在变化，需要注意"。

3. **"背离出现就会转折"**：背离可能持续很长时间。价格可能在高位连续背离数次才真正见顶。背离是一个概率偏好转折信号，不是定时触发器。

4. **"哪个指标最好"**：没有"最好"的指标，只有"在某个市场环境中更适合"的指标。不同的指标测量价格的不同侧面——趋势、动能、波动、成交量——合在一起看才有意义。

## 本章总结

- **MACD** 跟踪趋势强度和转折，震荡市会频繁产生假信号
- **RSI** 衡量超买超卖，但强趋势中极端值可能持续存在
- **KDJ** 灵敏度高，适合短线观察但不适合中长期判断
- **布林带**界定波动范围，收窄预示可能变盘
- **金叉/死叉**是滞后信号，**背离**是概率信号——都不是绝对规则
- 指标的价值在于协助观察和判断，而不是替代思考

至此，你已经掌握了识读行情数据、K 线、趋势、均线和常用指标的基础能力。从下一章开始，我们将从"看一只股票的行情"升级到"看整个市场的表现"——引入指数、成分股和基准的概念。
