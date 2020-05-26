<template>
  <el-col :span="24/chartBarlen.len -1" style="position: relative">
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
    linkTo() {
      // console.log('linkTo...')
      // console.log(this.data.name)
      this.$router.push({ path: this.data.name })
    },
    async getData() {
      // console.log('currentView:', this.currentView)
      // console.log('query:', this.query)
      this.currentView = deepClone(this.data)
      this.currentView.query = this.query
      this.fullData = await getFullData(this.currentView)
      // console.log('this.fullData:::', this.fullData)

      // data.forEach(subject => {
      //   subject.dimension.forEach(group => {
      //     // console.log(data)
      //     group.data.forEach(item => {
      //       // console.log('item:', item)
      //       let _rate = (item.actualValue / item.targetValue * 100).toFixed(2)
      //       _rate = washValue(_rate)
      //       item.finish_rate = _rate
      //     })
      //   })
      // })

      // 摘要数据
      /*      this.cardData.list = []
      // console.log('this.fullData.res:', this.fullData.res)
      this.fullData.res.forEach(subject => {
        const _len = subject.dimension[0].data.length - 1
        const _item = {}
        _item.slot1 = subject.title
        _item.slot2 = subject.dimension[0].data[_len].targetValue
        _item.slot3 = subject.dimension[0].data[_len].actualValue
        _item.slot4 = subject.dimension[0].data[_len].unit
        _item.slot5 = subject.dimension[0].data[_len].finish_rate
        this.cardData.list.push(_item)
      })*/

      // 图表数据
      this.cardData.dataSet = this.fullData.chartDate
      console.log(this.cardData.dataSet)
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
    top: 30px;
  }

</style>
