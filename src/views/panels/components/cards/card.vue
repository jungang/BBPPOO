<template>
  <!--  <div class="card-container">-->
  <el-card
    class="card"
    shadow="always"
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
import { deepClone, parseTime } from '@/utils'
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

      let viewSubject = this.currentView.items[`${this.query.type}`]
      // console.log('subject:', subject)
      if (!viewSubject) { // todo 降级参数
        viewSubject = this.currentView.items['*'] || ['']
      }
      viewSubject = viewSubject.map(item => {
        return {
          name: item,
          title: this.$store.state.options.subject.find(s => s.name === item).title
        }
      })

      // console.log('viewSubject:', viewSubject)

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
      // console.log('this.fullData:', this.fullData)

      // fix 空数据科目
      /*      this.fullData.tableDate.forEach(subject => {
        // console.log(subject)
        const _v = this.fullData.tableDate.find(v => v.name === subject.name)
        if (!_v) {
          this.fullData.tableDate.push(subject)
        }
      })*/
      // console.log('this.fullData:', this.fullData)

      let _current = ''

      switch (this.query.dateType) {
        case 'daily':
          _current = parseTime(this.query.date.getTime(), '{y}{m}{d}')
          break
        case 'week':
          _current = 7
          break
        case 'month':
          _current = +parseTime(this.query.date.getTime(), '{y}{m}')
          break
        case 'year':
          _current = +parseTime(this.query.date.getTime(), '{y}')
          break
      }

      // console.log('_current:', _current)

      this.fullData.tableDate.forEach(subject => {
        const _item = {}
        _item.slot1 = subject.title

        if (subject.dimension.length > 0) {
          // console.log('subject.dimension:', subject.dimension)
          const _v = subject.dimension[0].data.find(item => item.time === _current)
          // console.log('_v:', _v)
          if (_v) {
            const _type = _v.type
            // console.log('_type:', _type)
            const _suffix = _type === 'Percentage' ? '%' : ''

            if (_v.type === 'Double') {
              // console.log('_v', _v)
              _v.targetValue = _v.targetValue && _v.targetValue.toFixed(2)
              _v.actualValue = _v.actualValue && _v.actualValue.toFixed(2)
            }

            if (_v.type === 'Time') {
              _v.actualValue = _v.timeValue
            }

            _item.slot2 = _v.targetValue
            _item.slot3 = _v.actualValue + _suffix
            _item.slot4 = _v.unit
            _item.slot5 = _v.finish_rate
            _item.highlightStyle = _v.highlightStyle
          }
        }

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
    width: 48%;
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
