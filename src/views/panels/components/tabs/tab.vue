<template>
  <div class="tab-container">
    <Table
      v-if="data.config.component.type === 'table' || data.config.component.type === 'table_lirun'"
      :data="cardData"
      :current-view="currentView"
    />
    <chartLine
      v-if="data.config.component.type === 'chart_line' && data.config.zoneName !== 'comparison'"
      :data="cardData.dataSet"
    />
    <chartLineComparison v-if="data.config.component.type === 'chart_line' && data.config.zoneName === 'comparison'" :data="comparison" :query="currentView.query" />
  </div>
</template>

<script>

import { deepClone } from '@/utils'
import { getFullData } from '@/utils/dataProce_v1'
import chartLine from '../charts/chartLine_v1'
import chartLineComparison from '../charts/chartLine2_v1'
import Table from '../tables/table_v1'
// import { parseTime } from '@/utils'
// import _ from 'underscore'

export default {
  name: 'Tab',
  components: { chartLine, Table, chartLineComparison },
  directives: { },
  props: {
    data: {
      type: Object,
      default: function() {
        return {
          name: 'default'
        }
      }
    },
    query: {
      type: Object,
      default: function() {
        return { }
      }
    }
  },
  data() {
    return {
      currentView: {},
      cardData: {
        list: [],
        dataSet: {
          legendSelectMode: '',
          data: []
        }
      },
      comparison: {
        data: []
      }
    }
  },
  watch: { },
  created() {
    this.getData()
  },
  mounted() {
  },
  methods: {
    linkTo() {
      // console.log('linkTo...')
      // console.log(this.data.name)
      this.$router.push({ path: this.data.name })
    },
    async getData() {
      // console.log('currentView:', this.currentView)
      // console.log('query:', this.query)
      // console.log('this.data=>',this.data)
      // 判断图例是否为单选
      if (this.data.config.component.legendSelectMode) {
        this.cardData.dataSet.legendSelectMode = this.data.config.component.legendSelectMode
      }
      this.currentView = deepClone(this.data)
      this.currentView.query = this.query
      // console.log('currentView=>',this.currentView)
      this.fullData = await getFullData(this.currentView)
      // console.log('this.fullData:::', this.fullData.res)

      // 摘要数据
      this.cardData.list = []
      // console.log('this.fullData:', this.fullData)
      /*     this.fullData.res.forEach(subject => {
        const _len = subject.dimension[0].data.length - 1
        const _item = {}
        _item.slot1 = subject.title
        _item.slot2 = subject.dimension[0].data[_len].targetValue
        _item.slot3 = subject.dimension[0].data[_len].actualValue
        _item.slot4 = subject.dimension[0].data[_len].unit
        _item.slot5 = subject.dimension[0].data[_len].finish_rate
        this.cardData.list.push(_item)
      })*/

      // 数据

      if (this.currentView.config.component.type === 'table' || this.currentView.config.component.type === 'table_lirun') {
        this.cardData.list = []
        // this.cardData.list = this.fullData.tableDate
        this.cardData.list = this.fullData.fillFoldTableDate

        // console.log('list=>',this.cardData.list)
      } else {
        if (this.currentView.config.zoneName === 'comparison') {
          this.comparison.data = this.fullData.res
        } else {
          this.cardData.dataSet.data = this.fullData.fillChartDate.data
        }
      }
      this.cardData.dataSet.query = deepClone(this.query)
      this.cardData.currentView = this.currentView

      // console.log(this.comparison)
      // console.log(this.fullData.chartDate)
    }

  }
}
</script>

<style lang="scss" scoped>
.tab-container{
  /*display: inline-block;*/
}

</style>
