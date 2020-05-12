const dashboard = {
  id: 1,
  name: 'wf', // "队列名"
  component: 'dashboard',
  pages: [
    {
      id: 101,
      name: 'index',
      path: '/index',
      component: 'page_index',
      panel: [{
        id: 10101, // panel ID
        name: 'default',
        component: 'panel_index',
        filter: { // 分片器配置
          options: ['day', 'week', 'month', 'year', 'group', 'param']
          // ['天', '周', '月', '年', '选择组织', '业务线条']
        },
        zone: [
          {
            id: 1010101,
            name: 'cards',
            views: [] // view数量及类型数据取自 view.config,  多个view组合为tabs组
          }, {
            id: 1010102,
            views: []
          }, {
            id: 1010103,
            views: []
          }
        ]
      }]
    },
    {
      id: 102,
      name: '明细页 P&L',
      path: '/detail',
      component: 'page_detail',
      panel: [
        {
          id: 10102, // panel ID
          name: '',
          component: 'panel_detail',
          filter: { // 分片器配置
            options: ['day', 'week', 'month', 'year', 'group', 'param']
          // ['天', '周', '月', '年', '选择组织', '业务线条']
          },
          zone: [
            {
              id: 1010101,
              name: 'trend',
              tabs: [
                {
                  index: 1,
                  views: []// view数量及类型数据取自 view.config,  多个view组合为tabs组
                },
                {
                  index: 2,
                  views: []
                }
              ]
            }, {
              id: 1010102,
              name: 'comparison',
              tabs: [
                {
                  index: 1,
                  views: []// view数量及类型数据取自 view.config,  多个view组合为tabs组
                },
                {
                  index: 2,
                  views: []
                }
              ]
            }, {
              id: 1010103,
              tabs: [
                {
                  index: 1,
                  views: []// view数量及类型数据取自 view.config,  多个view组合为tabs组
                },
                {
                  index: 2,
                  views: []
                }
              ]
            }
          ]
        }
      ]
    }
  ]

}

console.log(dashboard)
