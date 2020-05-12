const views = [
  {
    title: '收入',
    name: 'view_收入',
    config: {
      show: true, // 是否默认缺省显示
      dashboardName: 'wf', // "队列名"
      pagesName: 'detail',
      panelName: 'default',
      zoneName: 'trend',
      tabIndex: 1,
      tabTitle: '收入',
      switch: true, // 是否可切换（图表、表格）
      compare: true, // 是否显示比较预计目标
      completion: true, // 是否显示计算完成率
      param: ['all', 'local', 'group'], // 业务线条： 全部 all |   本地 local | 集团 group
      component: { // 视图细节配置
        type: 'card', // 组件类型 card 卡片 | chart 图表 | table 表格
        fold: false, // 是否折叠表格行
        sort: false, // 是否表格可排序
        ratio: true, // 是否显示占比
        style: 'style_1'
      }
    },
    parameters: { // 默认参数
      year: 2020,
      month: 1,
      week: 1,
      day: 1
    },
    items: {
      expanse: 'expanse_composition',
      income: 'income_composition',
      '*': 'income_*'
    },
    description: 'P&L'
  }
]

console.log(views)

