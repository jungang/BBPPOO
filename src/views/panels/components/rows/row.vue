<template>
  <el-col :span="24/chartBarlen.len" style="position: relative">
    <div class="title">{{ data.config.rowTitle }}</div>
    <chartBar :data="cardData.dataSet" />
  </el-col>
</template>

<script>
import { deepClone } from '@/utils'
import { getFullData } from '@/utils/dataProce_v1'
import chartBar from '../charts/chartBar_v1'

export default {
  name: 'Row',
  components: { chartBar },
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
    },
    chartBarlen: {
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
    async getData() {
      // console.log('currentView:', this.currentView)
      // console.log('query:', this.query)
      this.currentView = deepClone(this.data)
      this.currentView.query = this.query

      this.fullData = await getFullData(this.currentView)

      // 图表数据
      this.cardData.dataSet = this.fullData.fillChartDate
      this.cardData.dataSet.query = deepClone(this.query)
      this.cardData.dataSet.query.date = this.query.date.getTime()
      this.cardData.dataSet.currentView = deepClone(this.currentView)
      // console.log('this.query.date:', this.query.date.getTime())
      // console.log(this.cardData.dataSet)
    }
  }
}
</script>

<style lang="scss" scoped>
  .title{
    text-align: center;
    width: 100%;
    margin: 0;
    font-size: 13px;
    font-weight: 400;
    position: absolute;
    display: block;
    top:30px
  }

</style>
