<template>
  <!--  <div class="card-container">-->
  <el-card
    class="card"
    shadow="hover"
  >
    <div
      slot="header"
      class="clearfix title"
      style="cursor: pointer"
      @click="linkTo"
    >
      {{ data.title }}
    </div>
    <List :data="cardData.list" />
    <chartLine :data="cardData.dataSet" />
  </el-card>
<!--  </div>-->
</template>

<script>
import { deepClone } from '@/utils'
import { getFullData } from '@/utils/dataProce_v1'
import List from './list'
import chartLine from '../charts/chartLine_v1'

export default {
  name: 'Card',
  components: { List, chartLine },
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
      console.log('linkTo...')
      console.log(this.data.name)
      this.$router.push({ path: this.data.name })
    },
    async getData() {
      // console.log('currentView:', this.currentView)
      // console.log('query:', this.query)
      this.currentView = deepClone(this.data)
      this.currentView.query = this.query
      this.fullData = await getFullData(this.currentView)
      console.log('this.fullData:::', this.fullData)

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
      this.cardData.list = []
      console.log('this.fullData.res:', this.fullData.res)
      this.fullData.res.forEach(subject => {
        const _len = subject.dimension[0].data.length - 1
        const _item = {}
        const _type = subject.dimension[0].data[_len].type
        const _suffix = _type === 'Percentage' ? '%' : ''
        _item.slot1 = subject.title
        _item.slot2 = subject.dimension[0].data[_len].targetValue
        _item.slot3 = subject.dimension[0].data[_len].actualValue + _suffix
        _item.slot4 = subject.dimension[0].data[_len].unit
        _item.slot5 = subject.dimension[0].data[_len].finish_rate
        this.cardData.list.push(_item)
      })

      // 图表数据
      this.cardData.dataSet = this.fullData.chartDate
    }
  }
}
</script>

<style lang="scss" scoped>

  .card{
    width: 45%;
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
