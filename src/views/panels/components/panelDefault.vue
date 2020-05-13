<!--panel_default-->
<template>
  <div class="panel-container">

    <!--    query 参数-->
    <Filters
      :query.sync="query"
      :multiple="false"
      @filtration="handleFilter"
    />

    <div class="zone_cards">
      <Card
        v-for="cardData in list"
        :key="cardData.id"
        ref="card"
        :data="cardData"
        @give-advice="showAdvice"
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
import { parseTime } from '@/utils'
import Filters from '@/components/Filters'
import { getFullData } from '@/utils/dataProce'

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
      query: {
        dateType: 'day', // 天day | 周week | 月 month | 年 year
        date: parseTime(new Date(), '{y}{m}{d}'), // 日期20200501
        group: 'null', // 选择组信息
        employee: 'null', // 选择人员信息
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
      this.$refs.card.forEach((item, index) => {
        item.getData(this.query)
      })
    },
    async getPanel() {
      // console.log('currentView:', this.currentView)

      console.log('query:', this.query)

      this.currentView.drill_name = this.data[0].title
      this.currentView.drill_drillName = this.data[0].title
      this.currentView.drill__drillName = this.data[0].viewName
      this.currentView.drill_parameters = this.data[0].parameters
      this.fullData = await getFullData(this.currentView)
      console.log('this.fullData:::', this.fullData)
      this.fullData.tableDate.forEach(item => {
        // console.log(item)
        this.cardData.list.push({
          slot1: item.res_s_title, // 类目
          slot2: item.res_y_value, // 目标
          slot3: item.res_s_value, // 实际
          slot4: '万元',
          slot5: item.res_finish_rate_value,
          slot6: '',
          slot7: ''
        })
      })
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

