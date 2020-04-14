<template>
  <div class="app-container">
    <el-row style="margin-bottom: 10px">
      <el-col :span="4">
        &nbsp;
      </el-col>
      <el-col :span="20" style="text-align: right;padding-right: 10px">
        <div class="block">
          <el-button
            type="primary"
            size="mini"
            @click="handleCopy"
          >复制</el-button>
          <el-button
            v-if="data.type !== 'def'"
            size="mini"
            @click="handleDelete"
          >删除</el-button>
        </div></el-col>
    </el-row>

    <div :id="data.id" class="chart" style="width:100%; height:90%;" />

  </div>
</template>

<script>

// import { format, getData } from '@/utils/chart-data'
import uuidv1 from 'uuid/v1'
const echarts = require('echarts')

export default {
  name: 'Chart2',
  components: {

  },
  props: {
    data: {
      type: Object,
      default: function() {
        return {}
      }
    },
    panel: {
      type: Object,
      default: function() {
        return {}
      }
    },
    view: {
      type: String,
      default: function() {
        return ''
      }
    }
  },
  data() {
    return {
      dataset: {},
      currentView: {},
      chart: {},
      maxChart: {},
      timer: {},

      options: {
        xAxis: {
          type: 'category'
        },
        yAxis: [
          {
            type: 'value',
            name: '数量'
          }
        ],
        dataset: [{
          // 按行的 key-value 形式（对象数组），这是个比较常见的格式。
          source: [
            { product: '综合系统接起率', count: 444 },
            { product: '本地接起率', count: 555 },
            { product: '集团解决率', count: 666 },
            { product: '本地解决率', count: 235 },
            { product: '合计解决率', count: 999 },
            { product: '合计解决率', count: 888 },
            { product: '本地满意度', count: 777 },
            { product: '合计满意度', count: 988 }
          ]
        }],
        series: [
          { type: 'bar' }
        ]
      },

      chartData: [],
      dialogVisible: false,
      maxVisible: false,
      title: '111',
      drillData: {},
      checked: true,
      checked2: true,
      value1: '',
      value2: '',
      value3: ''
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
          // console.log('resize...')
          this.chart.resize()
        }, 100)
      }
    }
  },
  created() {
    this.currentView = this.$store.state.options.views.find(item => item.name === this.view)
    this.getData()
  },
  mounted() {},
  methods: {
    handleDelete() {
      console.log(this.data)
      this.$confirm('删除' + this.data.title, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          const _index = this.panel.list.findIndex(item => item.id === this.data.id)
          this.panel.list.splice(_index, 1)
          this.$message({
            type: 'success',
            message: '完成删除。'
          })
        })
        .catch(err => { console.error(err) })
        // this.panel.list.unshift(newPanel)
    },
    handleCopy() {
      const newPanel = { ...this.data }
      newPanel.id = uuidv1()
      newPanel.type = 'cus'
      console.log(newPanel)
      this.panel.list.unshift(newPanel)
      console.log(this.panel.list)
    },
    async getData() {
      this.data._drillName = this.view

      console.log(this.options)
      // this.options = (format(this.options, this.currentView, await getData(this.currentView, this.data)))
      // /////////////////////////////////////////////////////////////////////////////////////////////////////
      console.log(this.options.dataset)

      // ///////////////////////////////////////////////////////////////////////////////////////////////////////
      this.$nextTick(() => {
        this.renderChart(this.options)
      })
    },
    initChart() {
      this.chart = echarts.init(document.getElementById(this.data.id))
      this.chart.on('click', (params) => {
        params.drillName = params.value.drillName // 下钻所用名称
        params.parameters = this.data.parameters
        if (this.currentView.items[params.drillName] || this.currentView.items['*']) {
          params._drillName = this.currentView.items[params.drillName] || this.currentView.items['*'] // 下钻名称
          params.breadName = params.name // 面包屑名字
          this.drillData = params
          this.dialogVisible = true
          this.$nextTick(() => {
            this.$refs.drill.init()
          })
        }
      })
    },
    maxPanel() {
      this.maxVisible = true
      console.log('maxPanel...')
      this.$nextTick(() => {
        this.maxChart = echarts.init(document.getElementById('maxChart'))
        this.maxChart.setOption(this.options)
      })
      // this.maxChart = echarts.init(document.getElementById('maxChart'))
      // this.maxChart.setOption(this.options)
    },
    renderChart(options) {
      !this.chart.id && this.initChart()
      this.chart.hideLoading()
      this.chart.setOption(options)
    },
    handleClosed() {
      // console.log('handleClosed')
      this.$refs.drill.breadcrumb = []
    }

  }
}

</script>

<style lang="scss" scoped>
  .app-container{
    padding: 40px 5px 5px 5px;
    height: 100%;
  }

</style>
<style lang="scss">
  .chart-table{
    width: 100%;
    font-size: 14px;
    user-select: text;
    border-collapse:collapse;
    th{
      font-weight: bold;
    }
    th, td{
      text-align: center;
      border: 1px solid rgb(214, 206, 227);
    }
  }
</style>
