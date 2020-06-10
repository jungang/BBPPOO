<template>
  <div id="chartBox" class="charts-container">
    <div :id="id" class="chart" style="width:100%; height:20vh" />
  </div>
</template>

<script>
const echarts = require('echarts')
import uuidv1 from 'uuid/v1'

export default {
  name: 'Charts',
  components: { },
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
        legend: {
        },
        grid: {
          left: 70,
          top: 50,
          bottom: 20
        },
        tooltip: {
          formatter: (params) => this.handleFormatter(params)
        },
        dataset: {
          dimensions: ['time'],
          source: []
        },
        xAxis: { type: 'category' },
        yAxis: {},
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
    // console.log('this.data:', this.data)
    // console.log('dataset:', this.options.dataset)
    // this.options.dataset = this.data
    // this.formatDataSet(this.data)
  },
  mounted() {
    this.calculateEcharts()
    this.renderChart()
  },
  methods: {
    handleFormatter(params) {
      let res = ''
      res += `${params.seriesName} : ${params.value[params.seriesName]}`
      const _v = this.data.data.find(item => item.title === params.seriesName)

      switch (_v.type) {
        case 'Percentage':
          res += `%`
          break
        case 'Integer':
          // res +=
          break
        case 'Duration':
          // res +=
          break
      }

      return res
    },
    formatDataSet(data) {
      // console.log('formatDataSet...')
      // console.log('data=>',data)

      const dimensions = ['time']
      const source = []
      const series = []

      data.data.forEach(subject => { // subject
        dimensions.push(subject.title)
        // console.log('subject.title:', subject.title)
        series.push({ type: 'line' })
        // console.log(subject.dimension[0].data)
        if (subject.dimension.length > 0) {
          subject.dimension[0].data.forEach(item => { // 组织
            // console.log(item.time)
            // console.log(item.actualValue)
            const _v = source.find(date => date.time === item.time)
            // console.log('_v:', _v)
            if (!_v) {
              source.push({ // 创建维度并添加数据
                time: item.time,
                [subject.title]: item.actualValue
              })

              // console.log('item.actualValue:', item.actualValue)
            } else { // 添加数据
              _v[subject.title] = item.actualValue
              // console.log('item.actualValue:', item.actualValue)
            }
            // console.log('_v:', _v)
          })
          // console.log('source:', source)
        }
      })

      // console.log('source:', source)
      this.options.dataset.source = source
      this.options.dataset.dimensions = dimensions
      this.options.series = series

      // console.log('legendSelectMode=>',data.legendSelectMode)

      if (data.legendSelectMode !== '' && data.legendSelectMode === 'single') {
        this.options.legend.selectedMode = 'single'
      }
      // console.log(this.options.dataset)
      this.$nextTick(() => {
        this.chart.setOption(this.options)
      })
    },
    initChart() {
      this.chart = echarts.init(document.getElementById(this.id))

      // legendselectchanged
      // legendselected 无触发？
      const _this = this
      this.chart.on('legendselectchanged', function(params) {
        const select_value = Object.values(params.selected)
        select_value.n = 0
        select_value.forEach(res => !res && select_value.n++)
        if (select_value.n === select_value.length) {
          _this.chart.dispatchAction({
            type: 'legendSelect',
            batch: [{ name: params.name }]
          })
        }
      })
    },
    renderChart() {
      !this.chart.id && this.initChart()
      this.chart.hideLoading()
      this.chart.setOption(this.options)

      const resize = {
        width: this.initWidth
      }

      this.chart.resize(resize)
    },
    calculateEcharts() {
      // 获取这个组件的窗口宽度
      this.initWidth = document.getElementById('chartBox').offsetWidth
    }

  }
}

</script>

<style lang="scss">
  .charts-container{
    width: 100%;
    height: 20vh;
  }
</style>
