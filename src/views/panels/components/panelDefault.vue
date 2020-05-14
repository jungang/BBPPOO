<!--panel_default-->
<template>
  <div class="panel-container">

    <!--    query 参数-->
    <Filters
      :query.sync="query"
      :multiple="true"
      :type="filterType"
      @filtration="handleFilter"
    />

    <div class="zone_cards">
      <Card
        v-for="cardData in list"
        :key="cardData.id"
        ref="card"
        :data="cardData"
        :query="query"
      />

    </div>
  </div>
</template>

<script>
// import { fetchPanel } from '@/api/panel'
// import 'vue-draggable-resizable/dist/VueDraggableResizable.css'
// eslint-disable-next-line no-unused-vars
import Card from './cards/card'
// import tabular from './tables/table'
// import uuidv1 from 'uuid/v1'
import Filters from '@/components/Filters'
// import { getFullData } from '@/utils/dataProce'

export default {
  name: 'PanelDefault',
  components: { Filters, Card },
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
      filterType: [
        {
          value: 'all',
          label: '合计'
        }, {
          value: 'group',
          label: '集团'
        }, {
          value: 'local',
          label: '本地'
        }, {
          value: 'other',
          label: '其他'
        }
      ],
      query: {
        dateType: 'day', // 天 day | 周 week | 月 month | 年 year
        date: new Date(), // 日期20200501
        multiple: false,
        group: 'null', // 选择组信息
        type: 'all' // 合集 all | 集团 group | 本地 local
      },
      currentView: {},
      fullData: {}
    }
  },
  computed: { },
  watch: { },
  created() {
    this.currentView = this.$store.state.options.views.find(item => item.name === this.list[0].viewName)
  },
  methods: {
    showAdvice() {
      console.log('showAdvice...')
    },
    handleFilter() {
      this.$refs.card.forEach((item) => item.getData())
    }
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
</style>

