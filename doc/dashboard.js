const dashboard = {
  id: 1,
  name: '网服', // "队列名"
  component: 'dashboard',
  pages: [
    {
      id: 101,
      name: '首页',
      path: '/index',
      component: 'page_index',
      panel: [{
        id: 10101, // panel ID
        name: '',
        component: 'panel_index',
        filter: { // 分片器配置
          options: ['day', 'week', 'month', 'year', 'group', 'param']
          // ['天', '周', '月', '年', '选择组织', '业务线条']
        },
        views: [ // 共包含4个view ，组件类型为card
          {
            id: '0dda4872-8f7b-11ea-b838-4df6ec1a2906', // 自动生成
            type: 'def', // 默认视图
            title: 'P&L', // 标题
            chartId: '0dda4873-8f7b-11ea-b838-4df6ec1a2906', // 渲染图表用ID 自动生成
            indexId: '0dda4874-8f7b-11ea-b838-4df6ec1a2906', // 复制、排序用ID 自动生成
            viewName: 'view_P&L',
            component: {
              type: 'card', // 组件类型 card 卡片 | chart 图表 | table 表格
              style: 'style_1',
              config: { // 位置信息
                patterns: {
                  slot1: 'categoryName',
                  slot2: 'targetValue',
                  slot3: 'actualValue',
                  slot4: 'finishingRate'
                }
              }
            },
            link: '/detail', // 链接页面地址  ,既 pages[].path
            parameters: { // 默认参数
              year: 2020,
              month: 1,
              week: 1,
              day: 1
            }
          },
          {
            id: '',
            type: 'def', // 默认视图
            title: '产能', // 标题
            chartId: '', // 渲染图表用ID
            indexId: '', // 复制、排序用ID
            viewName: 'view_capacity',
            component: {
              type: 'card', // 组件类型 card 卡片 | chart 图表 | table 表格
              style: 'style_1',
              config: { // 位置信息
                patterns: {
                  slot1: 'categoryName',
                  slot2: 'targetValue',
                  slot3: 'actualValue',
                  slot4: 'finishingRate'
                }
              }
            },
            link: '/detail', // 链接页面地址
            parameters: {
              year: 2020,
              month: 1,
              week: 1,
              day: 1
            }
          },
          {
            id: '',
            type: 'def', // 默认视图
            title: '质量', // 标题
            chartId: '', // 渲染图表用ID
            indexId: '', // 复制、排序用ID
            viewName: 'view_quality',
            component: 'card',
            link: '/detail', // 链接页面地址
            parameters: {
              year: 2020,
              month: 1,
              week: 1,
              day: 1
            }
          },
          {
            id: '',
            type: 'def', // 默认视图
            title: '人员', // 标题
            chartId: '', // 渲染图表用ID
            indexId: '', // 复制、排序用ID
            viewName: 'view_staff',
            component: 'card',
            link: '/detail', // 链接页面地址
            parameters: {
              year: 2020,
              month: 1,
              week: 1,
              day: 1
            }
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
          views: [ // 共包含7个view ，组件类型为 chart 和 table
            {
              id: '0dda4872-8f7b-11ea-b838-4df6ec1a2906', // 自动生成
              type: 'def', // 默认视图
              title: '收入', // 标题
              chartId: '0dda4873-8f7b-11ea-b838-4df6ec1a2906', // 渲染图表用ID 自动生成
              indexId: '0dda4874-8f7b-11ea-b838-4df6ec1a2906', // 复制、排序用ID 自动生成
              tabsName: 'tab1', // tab标签组
              viewName: 'view_income',
              component: {
                type: 'chart' // 组件类型 card 卡片 | chart 图表 | table 表格
              },
              link: '/detail', // 链接页面地址  ,既 pages[].path
              parameters: { // 默认参数
                year: 2020,
                month: 1,
                week: 1,
                day: 1
              }
            },
            {
              id: '',
              type: 'def', // 默认视图
              title: '成本', // 标题
              chartId: '', // 渲染图表用ID
              indexId: '', // 复制、排序用ID
              tabsName: 'tab1', // tab标签组
              viewName: 'view_cost',
              component: {
                type: 'chart' // 组件类型 card 卡片 | chart 图表 | table 表格
              },
              link: '/detail', // 链接页面地址
              parameters: {
                year: 2020,
                month: 1,
                week: 1,
                day: 1
              }
            },
            {
              id: '',
              type: 'def', // 默认视图
              title: '利润', // 标题
              chartId: '', // 渲染图表用ID
              indexId: '', // 复制、排序用ID
              tabsName: 'tab1', // tab标签组
              viewName: 'view_profit',
              component: {
                type: 'chart' // 组件类型 card 卡片 | chart 图表 | table 表格
              },
              link: '/detail', // 链接页面地址
              parameters: {
                year: 2020,
                month: 1,
                week: 1,
                day: 1
              }
            },
            {
              id: '0dda4872-8f7b-11ea-b838-4df6ec1a2906', // 自动生成
              type: 'def', // 默认视图
              title: '收入', // 标题
              chartId: '0dda4873-8f7b-11ea-b838-4df6ec1a2906', // 渲染图表用ID 自动生成
              indexId: '0dda4874-8f7b-11ea-b838-4df6ec1a2906', // 复制、排序用ID 自动生成
              tabsName: 'tab2', // tab标签组
              viewName: 'view_income',
              component: {
                type: 'table' // 组件类型 card 卡片 | chart 图表 | table 表格
              },
              link: '/detail', // 链接页面地址  ,既 pages[].path
              parameters: { // 默认参数
                year: 2020,
                month: 1,
                week: 1,
                day: 1
              }
            },
            {
              id: '',
              type: 'def', // 默认视图
              title: '成本', // 标题
              chartId: '', // 渲染图表用ID
              indexId: '', // 复制、排序用ID
              tabsName: 'tab2', // tab标签组
              viewName: 'view_cost',
              component: {
                type: 'table' // 组件类型 card 卡片 | chart 图表 | table 表格
              },
              link: '/detail', // 链接页面地址
              parameters: {
                year: 2020,
                month: 1,
                week: 1,
                day: 1
              }
            },
            {
              id: '',
              type: 'def', // 默认视图
              title: '利润', // 标题
              chartId: '', // 渲染图表用ID
              indexId: '', // 复制、排序用ID
              tabsName: 'tab2', // tab标签组
              viewName: 'view_profit',
              component: {
                type: 'table' // 组件类型 card 卡片 | chart 图表 | table 表格
              },
              link: '/detail', // 链接页面地址
              parameters: {
                year: 2020,
                month: 1,
                week: 1,
                day: 1
              }
            },
            {
              id: '',
              type: 'def', // 默认视图
              title: '单人利润', // 标题
              chartId: '', // 渲染图表用ID
              indexId: '', // 复制、排序用ID
              tabsName: 'tab2', // tab标签组
              viewName: 'view_profit',
              component: {
                type: 'table' // 组件类型 card 卡片 | chart 图表 | table 表格
              },
              link: '/detail', // 链接页面地址
              parameters: {
                year: 2020,
                month: 1,
                week: 1,
                day: 1
              }
            }
          ]
        }
      ]
    },
    {
      id: 103,
      name: '明细页 产能',
      path: '/detail',
      component: 'page_detail',
      panel: [
        {
          id: 10103, // panel ID
          name: '',
          component: 'panel_detail',
          filter: { // 分片器配置
            options: ['day', 'week', 'month', 'year', 'group', 'param']
          // ['天', '周', '月', '年', '选择组织', '业务线条']
          },
          views: [ // 共包含1个view ，组件类型为 chart
            {
              id: '0dda4872-8f7b-11ea-b838-4df6ec1a2906', // 自动生成
              type: 'def', // 默认视图
              title: '关键指标', // 标题
              chartId: '0dda4873-8f7b-11ea-b838-4df6ec1a2906', // 渲染图表用ID 自动生成
              indexId: '0dda4874-8f7b-11ea-b838-4df6ec1a2906', // 复制、排序用ID 自动生成
              tabsName: 'tab1', // tab标签组
              viewName: 'view_key',
              component: {
                type: 'chart' // 组件类型 card 卡片 | chart 图表 | table 表格
              },
              link: '/detail', // 链接页面地址  ,既 pages[].path
              parameters: { // 默认参数
                year: 2020,
                month: 1,
                week: 1,
                day: 1
              }
            }
          ]
        },
        {
          id: 10104,
          name: '',
          component: 'panel_detail_comparison',
          filter: { // 分片器配置
            options: ['day', 'week', 'month', 'year', 'group', 'param']
            // ['天', '周', '月', '年', '选择组织', '业务线条']
          },
          views: [ // 共包含1个view ，组件类型为 chart
            {
              id: '0dda4872-8f7b-11ea-b838-4df6ec1a2906', // 自动生成
              type: 'def', // 默认视图
              title: '', // 标题
              chartId: '0dda4873-8f7b-11ea-b838-4df6ec1a2906', // 渲染图表用ID 自动生成
              indexId: '0dda4874-8f7b-11ea-b838-4df6ec1a2906', // 复制、排序用ID 自动生成
              viewName: 'view_',
              component: {
                type: 'chart' // 组件类型 card 卡片 | chart 图表 | table 表格
              },
              link: '/detail', // 链接页面地址  ,既 pages[].path
              parameters: { // 默认参数
                year: 2020,
                month: 1,
                week: 1,
                day: 1
              }
            }

          ]
        }
      ]
    },
    {
      id: 104,
      name: '明细页 质量',
      path: '/detail',
      component: 'page_detail',
      panel: [
        {
          id: 10105, // panel ID
          name: '',
          component: 'panel_detail',
          filter: { // 分片器配置
            options: ['day', 'week', 'month', 'year', 'group', 'param']
          // ['天', '周', '月', '年', '选择组织', '业务线条']
          },
          views: [ // 共包含2个view ，组件类型为 chart
            {
              id: '0dda4872-8f7b-11ea-b838-4df6ec1a2906', // 自动生成
              type: 'def', // 默认视图
              title: '服务', // 标题
              chartId: '0dda4873-8f7b-11ea-b838-4df6ec1a2906', // 渲染图表用ID 自动生成
              indexId: '0dda4874-8f7b-11ea-b838-4df6ec1a2906', // 复制、排序用ID 自动生成
              tabsName: 'tab1', // tab标签组
              viewName: 'view_service',
              component: {
                type: 'chart' // 组件类型 card 卡片 | chart 图表 | table 表格
              },
              link: '/detail', // 链接页面地址  ,既 pages[].path
              parameters: { // 默认参数
                year: 2020,
                month: 1,
                week: 1,
                day: 1
              }
            },
            {
              id: '0dda4872-8f7b-11ea-b838-4df6ec1a2906', // 自动生成
              type: 'def', // 默认视图
              title: '质量', // 标题
              chartId: '0dda4873-8f7b-11ea-b838-4df6ec1a2906', // 渲染图表用ID 自动生成
              indexId: '0dda4874-8f7b-11ea-b838-4df6ec1a2906', // 复制、排序用ID 自动生成
              tabsName: 'tab1', // tab标签组
              viewName: 'view_service',
              component: {
                type: 'chart' // 组件类型 card 卡片 | chart 图表 | table 表格
              },
              link: '/detail', // 链接页面地址  ,既 pages[].path
              parameters: { // 默认参数
                year: 2020,
                month: 1,
                week: 1,
                day: 1
              }
            }
          ]
        }
      ]
    },
    {
      id: 105,
      name: '明细页 质量',
      path: '/detail',
      component: 'page_detail',
      panel: [
        {
          id: 10106, // panel ID
          name: '',
          component: 'panel_detail',
          filter: { // 分片器配置
            options: ['day', 'week', 'month', 'year', 'group', 'param']
          // ['天', '周', '月', '年', '选择组织', '业务线条']
          },
          views: [ // 共包含2个view ，组件类型为 chart
            {
              id: '0dda4872-8f7b-11ea-b838-4df6ec1a2906', // 自动生成
              type: 'def', // 默认视图
              title: '服务', // 标题
              chartId: '0dda4873-8f7b-11ea-b838-4df6ec1a2906', // 渲染图表用ID 自动生成
              indexId: '0dda4874-8f7b-11ea-b838-4df6ec1a2906', // 复制、排序用ID 自动生成
              tabsName: 'tab1', // tab标签组
              viewName: 'view_service',
              component: {
                type: 'chart' // 组件类型 card 卡片 | chart 图表 | table 表格
              },
              link: '/detail', // 链接页面地址  ,既 pages[].path
              parameters: { // 默认参数
                year: 2020,
                month: 1,
                week: 1,
                day: 1
              }
            },
            {
              id: '0dda4872-8f7b-11ea-b838-4df6ec1a2906', // 自动生成
              type: 'def', // 默认视图
              title: '质量', // 标题
              chartId: '0dda4873-8f7b-11ea-b838-4df6ec1a2906', // 渲染图表用ID 自动生成
              indexId: '0dda4874-8f7b-11ea-b838-4df6ec1a2906', // 复制、排序用ID 自动生成
              tabsName: 'tab1', // tab标签组
              viewName: 'view_service',
              component: {
                type: 'chart' // 组件类型 card 卡片 | chart 图表 | table 表格
              },
              link: '/detail', // 链接页面地址  ,既 pages[].path
              parameters: { // 默认参数
                year: 2020,
                month: 1,
                week: 1,
                day: 1
              }
            }
          ]
        }
      ]
    }
  ]

}

console.log(dashboard)
