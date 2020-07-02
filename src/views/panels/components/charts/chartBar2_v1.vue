<template>
  <el-col :span="8" :class="[data.isShow?'showBar':'hideBar']">
    <div class="title">{{ data.title }}</div>
    <div id="chartBox" class="charts-container">
      <div :id="id" style="width:100%; height:30vh;" />
    </div>
  </el-col>
</template>

<script>
const echarts = require('echarts')
import uuidv1 from 'uuid/v1'
import { deepClone } from '@/utils'
// import { sortUtil } from '@/utils/SortUtil'
import _ from 'underscore'
import moment from 'moment' // 导入模块

moment.locale('zh-cn') // 设置语言 或 moment.lang('zh-cn');

export default {
  name: 'ChartsBarContrast',
  components: {},
  props: {
    data: {
      type: Object,
      required: true
    },
    currentView: {
      type: Object,
      required: true
    },
    qurey: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      id: uuidv1(),
      chart: {},
      initWidth: '',
      options: {
        color: ['#333436', '#eab018', '#e22339'],
        tooltip: {
          formatter: (params) => {
            const str = params.data.type === 'Percentage' ? params.seriesName + ':' + params.data[params.seriesName] + '%' : params.seriesName + ':' + params.data[params.seriesName]
            return str
          }
        },
        grid: {
          left: '20%'
        },
        dataset: {
          // 提供一份数据。
          // dimensions: ['v_company', '201912', '202001', '增长'],
          source: [
            /* { v_company: '通软', '201912': 50,'202001': 60 ,'增长':10},
                  { v_company: '电发', '201912': 80 ,'202001': 70,'增长':-10},
                  { v_company: '众齐', '201912': 60 ,'202001': 90,'增长':30},
                  { v_company: '惟帆', '201912': 100 ,'202001': 130,'增长':30}*/
          ]
        },
        xAxis: {
          type: 'category',
          axisLabel: {
            // interval: 0
            // rotate: 5
          }
        },
        yAxis: {
          axisLabel: {
            formatter: (value) => {
              return value
            }
          }
        },
        series: []
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

  },
  mounted() {
    this.renderChart()
  },
  methods: {
    formatDataSet(data) {
      // 限制条目数
      if (this.currentView.config.component.limit) data = this.limitHandle(deepClone(data), this.currentView.config.component.limit)

      let subject = []

      subject = data

      //console.log('subject=>',subject)

      const dimensions = ['v_company']
      const source = []
      const series = []

      if (subject.dimension.length > 0) {
        subject.dimension.forEach((item, index) => {
          item.date.forEach((_item) => {
            const _f = dimensions.find(ff => ff === _item.time)
            if (!_f) {
              dimensions.push(_item.time)
            }

            const _v = source.find(date => date.v_company === item.v_company)
            if (!_v) {
              source.push({ // 创建维度并添加数据
                v_company: item.v_company,
                [_item.time]: _item.actualValue
              })
              // console.log('item.actualValue:', item.actualValue)
            } else { // 添加数据
              _v[_item.time] = _item.actualValue
            }
          })

          source[index]['增长'] = item.date[1].actualValue === ""? -item.date[0].actualValue:item.date[1].actualValue - item.date[0].actualValue
        })

        dimensions.push('增长')

        for (let i = 0; i < dimensions.length - 1; i++) {
          series.push({ type: 'bar',barMaxWidth: 40 })
        }
      }

      // todo 测试数据
      this.options.dataset.source = this.sortCurrent(source)
      this.options.dataset.dimensions = dimensions
      this.options.series = series
       //console.log(this.options)
      this.$nextTick(() => {
        this.chart.clear();
        this.chart.setOption(this.options)
      })
    },
    initChart() {
      this.chart = echarts.init(document.getElementById(this.id))
      this.initWidth = document.getElementById('chartBox').offsetWidth
    },
    renderChart() {
      !this.chart.id && this.initChart()
      this.chart.hideLoading()
      const resize = {
        width: this.initWidth
      }
      this.chart.setOption(this.options)
      this.chart.resize(resize)
    },

    limitHandle(data, limit) {
      data.dimension.forEach(date => {
        date.date = date.date.slice(date.date.length - limit)
      })
      return data
    },
    sortCurrent(arr) {
      var _arr = []
      var _keyword = ''

      switch (this.qurey.dateType) {
        case 'year':
          _keyword = moment(this.qurey.date).format('YYYYMMDD')
          break
        case 'month':
          _keyword = moment(this.qurey.date).format('YYYYMM')
          break
        case 'week':
          _keyword = moment(this.qurey.date).subtract('days', 6).format('YYYYMMDD')
          break
        case 'daily':
          _keyword = moment(this.qurey.date).format('YYYYMMDD')
          break
      }

      // console.log('_keyword=>',_keyword)

      _arr = _.sortBy(arr, (item) => {
        return item[_keyword]
      })

      // console.log('_arr=>',_arr)

      return _arr.reverse()
    }
  }
}

</script>

<style lang="scss" scoped>
  .charts-container {
    width: 100%;
    height: 30vh;
  }
  .title{
    text-align: center;
    width: 100%;
    margin: 0;
    font-size: 13px;
    font-weight: 400;
  }
  .showBar{
    display: block;
  }

  .hideBar{
    display: none;
  }
</style>
