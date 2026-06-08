import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "大A修炼手册",
  description: "A股投资知识 - 从零基础到独立分析、独立决策、独立复盘",
  lang: 'zh-CN',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: '课程', link: '/course/00-start/how-to-use' },
    ],

    sidebar: {
      '/course/': [
        {
          text: '第一部分：基础认知',
          collapsed: true,
          items: [
            { text: '如何使用本网站和术语体系', link: '/course/00-start/how-to-use' },
            { text: '证券、股票与公司权益', link: '/course/01-foundation/securities-stock-equity' },
            { text: 'A股市场与交易场所', link: '/course/01-foundation/a-share-market-structure' },
            { text: '跨市场名称与未来扩展边界', link: '/course/01-foundation/cross-market-vocabulary' },
            { text: '投资前的风险边界与学习目标', link: '/course/01-foundation/risk-boundary' },
          ]
        },
        {
          text: '第二部分：交易机制',
          collapsed: true,
          items: [
            { text: '证券账户、资金账户与适当性', link: '/course/02-trading/accounts-suitability' },
            { text: '交易日、交易时段与交易单位', link: '/course/02-trading/calendar-session-lot' },
            { text: '委托、报价与撮合', link: '/course/02-trading/orders-and-matching' },
            { text: '涨跌幅、涨停跌停与停复牌', link: '/course/02-trading/price-limits-trading-status' },
            { text: '交易成本与滑点', link: '/course/02-trading/transaction-costs' },
            { text: '发行、上市制度与特殊状态', link: '/course/02-trading/issuance-listing-status' },
            { text: '分红、送配与回购', link: '/course/02-trading/corporate-actions' },
            { text: '仓位、成本与盈亏', link: '/course/02-trading/position-cost-profit-loss' },
          ]
        },
        {
          text: '第三部分：行情识读',
          collapsed: true,
          items: [
            { text: '价格、成交与波动', link: '/course/03-market-data/price-volume-volatility' },
            { text: 'K线与趋势状态', link: '/course/03-market-data/kline-trend' },
            { text: '均线、支撑压力与量价关系', link: '/course/03-market-data/ma-support-resistance-volume-price' },
            { text: '常见技术指标边界', link: '/course/03-market-data/technical-indicators' },
          ]
        },
        {
          text: '第四部分：指数与ETF',
          collapsed: true,
          items: [
            { text: '指数、成分股与基准', link: '/course/04-index-etf/index-constituents-benchmark' },
            { text: 'A股核心指数', link: '/course/04-index-etf/a-share-core-indexes' },
            { text: '基金、指数基金与ETF', link: '/course/04-index-etf/fund-index-fund-etf' },
            { text: 'ETF净值、溢价折价与跟踪误差', link: '/course/04-index-etf/etf-nav-premium-tracking' },
            { text: '债券、REITs与加密资产的边界', link: '/course/04-index-etf/adjacent-asset-boundaries' },
          ]
        },
        {
          text: '第五部分：财报阅读',
          collapsed: true,
          items: [
            { text: '财报、年报、季报与披露节点', link: '/course/05-financial-reports/report-types-disclosure-calendar' },
            { text: '资产负债表与资产质量', link: '/course/05-financial-reports/balance-sheet' },
            { text: '利润表与盈利质量', link: '/course/05-financial-reports/income-statement-profit-quality' },
            { text: '现金流量表与自由现金流', link: '/course/05-financial-reports/cash-flow-statement' },
            { text: '每股收益、ROE与偿债周转指标', link: '/course/05-financial-reports/key-financial-metrics' },
          ]
        },
        {
          text: '第六部分：公司与行业基本面',
          collapsed: true,
          items: [
            { text: '行业、板块、产业链与供需', link: '/course/06-fundamentals/industry-sector-chain' },
            { text: '竞争优势、护城河与蓝筹特征', link: '/course/06-fundamentals/competitive-advantage-blue-chip' },
            { text: '概念股与主题投资', link: '/course/06-fundamentals/concepts-and-themes' },
            { text: '公司治理与违规风险', link: '/course/06-fundamentals/corporate-governance-risk' },
          ]
        },
        {
          text: '第七部分：估值体系',
          collapsed: true,
          items: [
            { text: '估值、成长价值风格与安全边际', link: '/course/07-valuation/valuation-intrinsic-value-margin' },
            { text: 'PE、PB、PS、PCF与PEG', link: '/course/07-valuation/multiple-valuation' },
            { text: '企业价值、DCF与绝对估值', link: '/course/07-valuation/enterprise-value-dcf' },
          ]
        },
        {
          text: '第八部分：宏观与周期',
          collapsed: true,
          items: [
            { text: '宏观经济、增长、通胀与汇率', link: '/course/08-macro/macro-growth-inflation-fx' },
            { text: '货币政策、财政政策、流动性与经济周期', link: '/course/08-macro/policy-liquidity-cycle' },
            { text: '牛市、熊市、牛熊周期与市场情绪', link: '/course/08-macro/bull-bear-sentiment' },
            { text: '周期股、防御股、均值回归与轮动', link: '/course/08-macro/style-cycle-rotation' },
          ]
        },
        {
          text: '第九部分：组合与风控',
          collapsed: false,
          items: [
            { text: '回撤、波动、Alpha、Beta与夏普比率', link: '/course/09-portfolio/risk-return-metrics' },
            { text: '分散投资、资产配置、再平衡与风险控制', link: '/course/09-portfolio/allocation-risk-control' },
            { text: '行为金融与常见心理偏差', link: '/course/09-portfolio/behavioral-biases' },
          ]
        },
        {
          text: '第十部分：投资方法与独立决策',
          collapsed: false,
          items: [
            { text: '基本面分析、技术分析、策略与定投', link: '/course/10-decision/analysis-methods-strategy' },
            { text: '信号、调仓、组合优化与事件驱动', link: '/course/10-decision/signals-rebalance-optimization' },
            { text: 'A股独立研究与决策工作流', link: '/course/10-decision/independent-a-share-workflow' },
          ]
        },
        {
          text: '第十一部分：高级边界',
          collapsed: false,
          items: [
            { text: '融资融券、杠杆与强制平仓', link: '/course/11-advanced/leverage-margin-short-selling' },
            { text: '衍生品、期货、期权与对冲', link: '/course/11-advanced/derivatives-futures-options-hedging' },
            { text: '量化、回测、因子与策略偏差', link: '/course/11-advanced/quant-backtest-factor-bias' },
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/new1333/biga-pro' }
    ]
  }
})
