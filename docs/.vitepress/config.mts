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
          collapsed: false,
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
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/new1333/biga-pro' }
    ]
  }
})
