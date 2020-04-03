<template>
  <div class="app-container">
    <div :id="data.id" style="width:100%; height:100%;" />
  </div>
</template>

<script>
const echarts = require('echarts')

export default {
  name: 'Charts',
  components: {

  },
  props: {
    data: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
      myChart: {},
      timer: {}
    }
  },
  computed: {
  },
  watch: {
    data: {
      deep: true,
      handler() {
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          console.log('resize...')
          this.myChart.resize()
        }, 100)
      }
    }
  },
  created() {

  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.myChart = echarts.init(document.getElementById(this.data.id))
      console.log(this.myChart)
      var option = {
        xAxis: {
          data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
        },
        yAxis: {},
        series: [{
          name: '销量',
          type: 'bar',
          data: [5, 20, 36, 10, 10, 20]
        }]
      }
      this.myChart.setOption(option)

      this.$nextTick(() => {
        this.myChart.resize()
      })
    }

  }
}

</script>

<style lang="scss" scoped>
  .app-container{
    height: 100%;
  }

</style>

