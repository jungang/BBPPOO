<template>
  <div class="charts-container">
    <div :id="id" class="chart" style="width:100%; height:30vh;" />
  </div>
</template>

<script>
const echarts = require('echarts')
import uuidv1 from 'uuid/v1'
import { parseTime } from '@/utils'

import moment from 'moment' // 导入模块
moment.locale('zh-cn') // 设置语言 或 moment.lang('zh-cn');
// const chartBarData = require('../../../subpage/mock/chartBar');

export default {
  name: 'ChartsBar',
  components: {},
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      id: uuidv1(),
      chart: {},
      options: {
        // title: { text: this.data.view.title },
        // legend: {},
        tooltip: {
          formatter: (params) => {
            const str = params.data.type === 'Percentage' ? params.seriesName + ':' + params.data[params.seriesName] + '%' : params.seriesName + ':' + params.data[params.seriesName]
            return str
          }
        },
        grid: {
          left: '20%'
        },
        // color:['#60acfc','#32d3eb', '#5bc49f', '#feb64d', '#ff7b7b','#9287e7'],
        dataset: { // https://echarts.apache.org/zh/tutorial.html#%E4%BD%BF%E7%94%A8%20dataset%20%E7%AE%A1%E7%90%86%E6%95%B0%E6%8D%AE
          // 提供一份数据。
          // dimensions: ['score', 'count', 'score'],
          // dimensions: ['product', '收入'],
          source: [
            /* { product: '一月', '收入': 50 },
               { product: '二月', '收入': 100 }*/
          ]
        },
        // 声明一个 X 轴，类目轴（category）。默认情况下，类目轴对应到 dataset 第一列。
        xAxis: {
          type: 'category',
          axisLabel: {
            // interval: 0
            // rotate: 5
          }
        },
        // 声明一个 Y 轴，数值轴。
        yAxis: {
          axisLabel: {
            formatter: (value) => {
              // console.log('value=>',value)
              return value
            }
          }
        },
        // 声明多个 bar 系列，默认情况下，每个系列会自动对应到 dataset 的每一列。
        series: [
          {
            type: 'bar',
            itemStyle: {
              normal: {
                color: function(params) {
                  var colorList = ['#feb64d', '#6ad9d5', '#48b885', '#60acfc', '#fd4b4f', '#9287e7']
                  return colorList[params.dataIndex]
                }
              }
            }
          }
        ]
      },
      chartData: []
    }
  },
  watch: {
    data: {
      deep: true,
      handler() {
        this.formatDataSet(this.data)
        // this.options.dataset = this.data
      }
    }
  },
  created() {
    // console.log('this.data:', this.data)
    // console.log('dataset:', this.options.dataset)
    // this.options.dataset = this.data
    // this.formatDataSet(this.data)
  },
  mounted() {
    this.renderChart()
  },
  methods: {
    formatDataSet(data) {
      let _arry = []

      if (data.query.dateType === 'week') {
        data.data.forEach((item) => {
          const __obj = {}
          __obj.index = item.index
          __obj.name = item.name
          __obj.title = item.title
          __obj.dimension = []
          __obj.dimension.push({ data: [], v_group_name: '' })
          __obj.dimension[0].v_group_name = item.dimension[0].v_group_name
          __obj.dimension[0].data = this.findDateData(item.dimension[0].data, data.query.date)
          _arry.push(__obj)
        })
      } else {
        _arry = data.data
      }

      const query = this.$store.state.options.filterOptions

      // console.log('query:', query)

      const dimensions = ['time']
      const source = []
      const series = []

      _arry.forEach(subject => { // subject
        dimensions.push(subject.title)
        // console.log('subject.title:', subject.title)
        series.push({ type: 'bar' })

        if (subject.dimension.length > 0) {
          console.log('ddd', subject.dimension[0].data)
          subject.dimension[0].data.forEach((item, index, arr) => { // 组织
            const _v = source.find(date => date.time === item.time)

            if (query.dateType === 'week') {
              const current_w = parseTime(query.date, '{m}.{d}')
              const last_w = parseTime(query.date - 86400000 * 7, '{m}.{d}')
              const _arr = [current_w, last_w]
              console.log('_arr:', _arr)
              console.log('item.time:', item.time)
              _arr.forEach(date => {
                if (item.time.search(date) !== -1) {
                  // console.log('item.time:', item.time)
                  if (!_v) {
                    source.push({
                      time: item.time,
                      [subject.title]: item.actualValue,
                      type: item.type
                    })
                  } else {
                    _v[subject.title] = item.actualValue
                  }
                }
              })
            } else {
              // console.log('_v:', _v)
              if (!_v) {
                source.push({ // 创建维度并添加数据
                  time: item.time,
                  [subject.title]: item.actualValue,
                  type: item.type
                })
                // console.log('item.actualValue:', item.actualValue)
              } else { // 添加数据
                _v[subject.title] = item.actualValue
                // console.log('item.actualValue:', item.actualValue)
              }
            }

            // console.log('_v:', _v)
          })
        }
      })

      // todo 测试数据
      this.options.dataset.source = source
      this.options.dataset.dimensions = dimensions
      this.options.series = series
      // console.log(this.options.series)
      this.$nextTick(() => {
        this.chart.setOption(this.options)
      })
    },
    initChart() {
      this.chart = echarts.init(document.getElementById(this.id))
    },
    renderChart() {
      !this.chart.id && this.initChart()
      this.chart.hideLoading()
      this.chart.setOption(this.options)
    },
    findDateData(_arr, selectTime) {
      const timeArray = []
      const _data = []
      timeArray.push(moment(selectTime).subtract('days', 13).format('MM.DD') + '-' + moment(selectTime).subtract('days', 7).format('MM.DD'))
      timeArray.push(moment(selectTime).subtract('days', 6).format('MM.DD') + '-' + moment(selectTime).format('MM.DD'))

      _arr.forEach((item) => {
        if ((item.time === timeArray[0]) || (item.time === timeArray[1])) {
          _data.push(item)
        }
      })

      return _data
    }

  }
}

</script>

<style lang="scss" scoped>
  .charts-container {
    width: 100%;
    height: 30vh;
  }
</style>
