<template>
  <div class="charts-container">
    <div :id="id" class="chart" style="width:100%; height:90%;" />
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
        legend: {},
        tooltip: {},
        dataset: { // https://echarts.apache.org/zh/tutorial.html#%E4%BD%BF%E7%94%A8%20dataset%20%E7%AE%A1%E7%90%86%E6%95%B0%E6%8D%AE
          // 提供一份数据。
          // dimensions: ['score', 'count', 'score'],
          dimensions: ['product', '2015', '2016', '2017'],
          source: [
            { product: 'Matcha Latte', '2015': 43.3, '2016': 85.8, '2017': 93.7 },
            { product: 'Milk Tea', '2015': 83.1, '2016': 73.4, '2017': 55.1 },
            { product: 'Cheese Cocoa', '2015': 86.4, '2016': 65.2, '2017': 82.5 },
            { product: 'Walnut Brownie', '2015': 72.4, '2016': 53.9, '2017': 39.1 }
          ]
          // source: {
          //   'product': ['Matcha Latte', 'Milk Tea', 'Cheese Cocoa', 'Walnut Brownie'],
          //   'count': [823, 235, 1042, 988],
          //   'score': [95.8, 81.4, 91.2, 76.9]
          // }
        },
        // 声明一个 X 轴，类目轴（category）。默认情况下，类目轴对应到 dataset 第一列。
        xAxis: { type: 'category' },
        // 声明一个 Y 轴，数值轴。
        yAxis: {},
        // 声明多个 bar 系列，默认情况下，每个系列会自动对应到 dataset 的每一列。
        series: [
          { type: 'line' },
          // { type: 'line' },
          { type: 'line' }
        ]
      },
      chartData: []
    }
  },
  watch: {
    data: {
      deep: true,
      handler() {
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          // console.log('resize...')
          this.chart.resize()
        }, 100)
      }
    }
  },
  created() {
  },
  mounted() {
    this.renderChart()
  },
  methods: {
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
    height: 30vh;
  }
</style>
