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

    <List :data="cardData.list" :view="data" />

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
    // console.log('this.data:', this.data)
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
      // console.log('viewSubject:', viewSubject)
      viewSubject = viewSubject.map(item => {
        // console.log('item:', item)
        return {
          name: item,
          title: this.$store.state.options.subject.find(s => s.name === item) && this.$store.state.options.subject.find(s => s.name === item).title
        }
      })

      // console.log('viewSubject:', viewSubject)
      // console.log('this.$store.state.options.filterOptions:', this.$store.state.options.filterOptions)

      this.currentView.query = this.$store.state.options.filterOptions
      this.currentView.query.multiple = this.query.multiple

      // console.log('this.currentView.query:', this.currentView.query)

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

      switch (this.$store.state.options.filterOptions.dateType) {
        case 'daily':
          _current = parseTime(this.$store.state.options.filterOptions.date.getTime(), '{y}{m}{d}')
          break
        case 'week':
          // console.log('this.$store.state.options.filterOptions.date.getTime():', this.$store.state.options.filterOptions.date.getTime())
          _current = parseTime(this.$store.state.options.filterOptions.date.getTime() - 517400000, '{y}{m}{d}')

          // console.log('_current:', _current)

          break
        case 'month':
          _current = +parseTime(this.$store.state.options.filterOptions.date.getTime(), '{y}{m}')
          break
        case 'year':
          _current = +parseTime(this.$store.state.options.filterOptions.date.getTime(), '{y}')
          break
      }

      // console.log('_current:', _current)
      // console.log('card_fullData:', this.fullData)

      this.fullData.fillDate.forEach(subject => {
        const _item = {}
        _item.slot1 = subject.title
        _item.name = subject.name

        // console.log('subject.title:', subject.title)
        // console.log('subject:', subject)
        // console.log('_item.slot1:', _item.slot1)
        // console.log('subject.dimension:', subject.dimension)
        if (subject.dimension.length > 0) {
          // console.log('subject.dimension:', subject.dimension)
          // console.log('_current:', _current)
          // console.log('subject.dimension[0].date:', subject.dimension[0].date)
          const _v = subject.dimension[0].date.find(item => {
            item.time = item.time.toString()
            _current = _current.toString()
            // console.log('item.time:', item.time)
            // console.log('_current:', _current)
            return item.time.search(_current) !== -1
          })
          // console.log('_v:', _v)
          if (_v) {
            const _type = _v.type
            // console.log('_v.actualValue:', _v.actualValue)
            // console.log('_type:', _type)
            const _suffix = _type === 'Percentage' ? '%' : ''

            if (_v.type === 'Double') {
              // console.log('_v', _v)
              _v.targetValue = _v.targetValue && _v.targetValue.toFixed(2)
              _v.actualValue = _v.actualValue && _v.actualValue.toFixed(2)
            }

            // if (_v.type === 'Time') {
            //   _v.actualValue = _v.timeValue
            // }

            _item.slot2 = (_v.targetValue !== undefined) && _v.targetValue + _suffix
            // _item.slot3 = (_v.actualValue !== undefined) && _v.actualValue + _suffix
            _item.slot3 = ((_v.actualValue !== undefined) && (_v.actualValue !== '')) ? _v.actualValue + _suffix : '-'
            _item.slot4 = _v.unit
            _item.slot5 = _v.finish_rate
            _item.highlightStyle = _v.highlightStyle

            // console.log('subject.title:', subject.title)
            // console.log('_item:', _item)
          }
        }

        // console.log('_item:', _item)
        this.cardData.list.push(_item)
      })

      // 图表数据
      // console.log('this.fullData.chartDate:', this.fullData.chartDate)
      this.fullData.fillChartDate.query = this.query
      this.cardData.dataSet = this.fullData.fillChartDate
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
