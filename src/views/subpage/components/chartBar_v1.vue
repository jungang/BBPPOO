<template>
  <div class="charts-container">
    <div :id="id" class="chart" style="width:100%; height:30vh;" />
  </div>
</template>

<script>
const echarts = require('echarts')
import uuidv1 from 'uuid/v1'

export default {
  name: 'ChartsBar',
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
        // title: { text: this.data.view.title },
        // legend: {},
        tooltip: {},
        dataset: { // https://echarts.apache.org/zh/tutorial.html#%E4%BD%BF%E7%94%A8%20dataset%20%E7%AE%A1%E7%90%86%E6%95%B0%E6%8D%AE
          // 提供一份数据。
          // dimensions: ['score', 'count', 'score'],
          dimensions: ['product', '收入'],
          source: [
           /* { product: '一月', '收入': 50 },
            { product: '二月', '收入': 100 }*/
          ]
        },
        // 声明一个 X 轴，类目轴（category）。默认情况下，类目轴对应到 dataset 第一列。
        xAxis: { type: 'category' },
        // 声明一个 Y 轴，数值轴。
        yAxis: {},
        // 声明多个 bar 系列，默认情况下，每个系列会自动对应到 dataset 的每一列。
        series: [
          { type: 'bar' }
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
    console.log('this.data:', this.data)
    // console.log('dataset:', this.options.dataset)
    // this.options.dataset = this.data
    // this.formatDataSet(this.data)
  },
  mounted() {
    this.renderChart()
  },
  methods: {
    formatDataSet(data) {
      // console.log('formatDataSet...')
      // console.log(data.data)

      const dimensions = ['time']
      const source = []
      const series = []

      data.data.forEach(subject => { // subject
        dimensions.push(subject.title)
        // console.log('subject.title:', subject.title)
        series.push({ type: 'bar' })
        // console.log(subject.dimension[0].data)
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

            //console.log('item.actualValue:', item.actualValue)
          } else { // 添加数据
            _v[subject.title] = item.actualValue
            // console.log('item.actualValue:', item.actualValue)
          }
          // console.log('_v:', _v)
        })
      })

      // todo 测试数据
       this.options.dataset.source = source
       this.options.dataset.dimensions = dimensions
       this.options.series = series
       console.log(this.options.dataset)
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
    }

  }
}

</script>

<style lang="scss">
  .charts-container{
    width: 100%;
    height: 30vh;
  }
</style>
