<template>
  <div class="tab-container">
    <Table v-if="data.config.component.type === 'table'" :data="cardData.dataSet" />
    <chartLine v-if="data.config.component.type === 'chart_line'" :data="cardData.dataSet" />
  </div>
</template>

<script>

import { deepClone } from '@/utils'
import { getFullData } from '@/utils/dataProce_v1'
import chartLine from '../charts/chartLine_v1'
import Table from '../tables/table_v1'

export default {
  name: 'Tab',
  components: { chartLine, Table },
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
          data: []
        }
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
       //console.log('currentView:', this.currentView)
      // console.log('query:', this.query)
      this.currentView = deepClone(this.data)
      this.currentView.query = this.query
      // console.log('currentView=>',this.currentView)
      this.fullData = await getFullData(this.currentView)
       //console.log('this.fullData:::', this.fullData)

      // 摘要数据
      this.cardData.list = []
      // console.log('this.fullData:', this.fullData)
      this.fullData.res.forEach(subject => {
        const _len = subject.dimension[0].data.length - 1
        const _item = {}
        _item.slot1 = subject.title
        _item.slot2 = subject.dimension[0].data[_len].targetValue
        _item.slot3 = subject.dimension[0].data[_len].actualValue
        _item.slot4 = subject.dimension[0].data[_len].unit
        _item.slot5 = subject.dimension[0].data[_len].finish_rate
        this.cardData.list.push(_item)
      })

      // 数据

      if(this.currentView.config.component.type == 'table'){
        this.cardData.dataSet.data = this.fullData.tableDate;
      }else{
        this.cardData.dataSet = this.fullData.chartDate;
      }

      //this.cardData.dataSet = this.currentView.config.component.type == 'table' ? this.fullData.tableDate : this.fullData.chartDate;
      //console.log(typeof this.cardData.dataSet)
      console.log(this.cardData.dataSet)
    }
  }
}
</script>

<style lang="scss" scoped>
.tab-container{
  /*display: inline-block;*/
}

</style>
