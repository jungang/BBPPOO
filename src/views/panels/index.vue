<!--page_index-->
<template>
  <div id="panel2" class="app-container">
    <panelDefault />
  </div>
</template>

<script>
// import { fetchPanel } from '@/api/panel'
// import Panel2 from './components/panel2'
import panelDefault from './components/panelDefault'
// eslint-disable-next-line no-unused-vars
// import chart from './charts/charts'
// import tabular from './tables/table'
// import uuidv1 from 'uuid/v1'
// import { deepClone } from '@/utils'

export default {
  name: 'Report',
  components: { panelDefault },
  props: { },
  data() {
    return {
      list: [
        {
          'id': '0dda4872-8f7b-11ea-b838-4df6ec1a2906',
          'type': 'def',
          'title': '当月利润分析',
          'width': 500,
          'height': 500,
          'chartId': '0dda4873-8f7b-11ea-b838-4df6ec1a2906',
          'indexId': '0dda4874-8f7b-11ea-b838-4df6ec1a2906',
          'viewName': 'profit_income_expanse',
          'component': 'chart',
          'panelTitle': '当月利润分析',
          'parameters': {
            'year': 2020,
            'month': '01'
          }
        },
        {
          'id': '0dda4875-8f7b-11ea-b838-4df6ec1a2906',
          'type': 'def',
          'title': '本年累计利润分析',
          'width': 500,
          'height': 500,
          'chartId': '0dda4876-8f7b-11ea-b838-4df6ec1a2906',
          'indexId': '0dda4877-8f7b-11ea-b838-4df6ec1a2906',
          'viewName': 'profit_income_expanse_ytd',
          'component': 'chart',
          'panelTitle': '本年累计利润分析',
          'parameters': {
            'year': 2020,
            'month': '01'
          }
        },
        {
          'id': '0dda4878-8f7b-11ea-b838-4df6ec1a2906',
          'type': 'def',
          'title': '月度预实一览表',
          'width': 1020,
          'height': 500,
          'chartId': '0dda4879-8f7b-11ea-b838-4df6ec1a2906',
          'indexId': '0dda487a-8f7b-11ea-b838-4df6ec1a2906',
          'viewName': 'monthly_items_list',
          'component': 'tabular',
          'panelTitle': '月度预实一览表',
          'parameters': {
            'year': 2020,
            'month': '01'
          }
        }
      ],
      cardData: [
        {
          title: 'P&L',
          list: [
            {
              categoryName: '收入',
              targetValue: 19.08,
              actualValue: 23.47,
              unit: '万元',
              finishingRate: 123.00
            },
            {
              categoryName: '成本',
              targetValue: 9.67,
              actualValue: 12.76,
              unit: '万元',
              finishingRate: 131.95
            },
            {
              categoryName: '毛利',
              targetValue: 4.27,
              actualValue: 10.71,
              unit: '万元',
              finishingRate: 250.81
            }
          ]
        },
        {
          title: '产能',
          list: [
            {
              categoryName: '业务量',
              targetValue: 36882,
              actualValue: 50835,
              unit: '笔',
              finishingRate: 137.83
            },
            {
              categoryName: '签入时长',
              targetValue: 600.10,
              actualValue: 601.31,
              unit: '',
              finishingRate: 101
            },
            {
              categoryName: '利用率',
              targetValue: 4.27,
              actualValue: 10.71,
              unit: '',
              finishingRate: 250.81
            },
            {
              categoryName: 'AHT',
              targetValue: 4.27,
              actualValue: 10.71,
              unit: '',
              finishingRate: 250.81
            }
          ]
        },
        {
          title: '质量',
          list: [
            {
              categoryName: '投诉数',
              targetValue: 36882,
              actualValue: 50835,
              unit: '笔',
              finishingRate: 137.83
            },
            {
              categoryName: '接起率',
              targetValue: 600.10,
              actualValue: 601.31,
              unit: '',
              finishingRate: 101
            },
            {
              categoryName: '满意度',
              targetValue: 4.27,
              actualValue: 10.71,
              unit: '',
              finishingRate: 250.81
            },
            {
              categoryName: '解决率',
              targetValue: 4.27,
              actualValue: 10.71,
              unit: '',
              finishingRate: 250.81
            }
          ]
        },
        {
          title: '人员',
          list: [
            {
              categoryName: '自然人数',
              targetValue: 19.08,
              actualValue: 23.47,
              unit: '万元',
              finishingRate: 123.00
            },
            {
              categoryName: '标准人数',
              targetValue: 9.67,
              actualValue: 12.76,
              unit: '万元',
              finishingRate: 131.95
            },
            {
              categoryName: '一线人数',
              targetValue: 4.27,
              actualValue: 10.71,
              unit: '万元',
              finishingRate: 250.81
            }
          ]
        }
      ],
      title: '',
      id: 0,
      timer: {},
      loading: false,
      tempRoute: {}
    }
  },
  computed: { },
  watch: { },
  created() {
  },
  methods: {
  }
}
</script>

<style lang="scss">
  #panel2{
    .el-card__header{
      padding: 0;
    }
  }
</style>

<style lang="scss" scoped>
  .warp{
    margin-top: 50px;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
  }
  .card{
    width: 500px;
    padding: 0 !important;
    text-align: center;
    display: inline-block;
    margin: 10px;
    .title{
      background: #dbdbdb;
      padding: 10px;
    }
    .emphasize{
      font-size: 24px;
      font-weight: bold;
    }
    .gray{
      color: #bababa;
    }

    .el-divider{
      margin: 10px 0 ;
    }
    .row{
      border-bottom: 1px #d3d3d3 solid;
      padding: 10px 0;
    }
  }
</style>

