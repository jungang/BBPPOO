<template>
  <div class="app-container">
    <el-row style="margin-bottom: 10px">

      <el-col :span="4">
        &nbsp;
      <!--        <span class="demonstration" style="padding-left: 10px">月</span>-->
      <!--        <el-select v-model="value1" class="filter-item" placeholder="请选择">-->
      <!--          <el-option v-for="item in $store.state.options.dateValueMonth" :key="item.key" :label="item.label" :value="item.key" />-->
      <!--        </el-select>-->
      <!--        到-->
      <!--        <el-select v-model="value2" class="filter-item" placeholder="请选择">-->
      <!--          <el-option v-for="item in $store.state.options.dateValueMonth" :key="item.key" :label="item.label" :value="item.key" />-->
      <!--        </el-select>-->
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

    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="800"
      @closed="handleClosed"
    >

      <drill ref="drill" :data="{...drillData}" :panel.sync="panel" :title.sync="title" @close="dialogVisible = false" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="全屏"
      :visible.sync="maxVisible"
      width="100%"
      top="0"
      style="height: 100vh"
    >
      <div id="maxChart" class="chart" style="width:100%; height:79vh;" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="maxVisible = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import drill from './drill-down'
import uuidv1 from 'uuid/v1'
import { format, getData } from '@/utils/chart-data'
const echarts = require('echarts')

export default {
  name: 'Charts',
  components: {
    drill
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
        legend: {},
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
            shadowColor: 'red'
          },
          transitionDuration: 1,
          enterable: true,
          shadowStyle: {
            shadowColor: 'rgba(0, 0, 0, 0.5)',
            shadowBlur: 10
          }
        },
        // formatter: (params, ticket, callback) => {
        //   if (params[0].data !== undefined) {
        //     console.log(this.currentView.items[params[0].data.drillName])
        //   }
        //   return '{a}'
        // },
        toolbox: {},
        dataset: {},
        grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
        xAxis: {
          triggerEvent: true,
          axisLabel: {
            show: true
            // formatter: (value, index) => {
            //   return !this.options.dataset.source[index].drillNameNode ? value : '{a|' + value + '}'
            // },
            // rich: { a: { color: 'blue' }}
          },
          type: 'category'
        },
        yAxis: [{
          type: 'value'
        }],
        series: []
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
    // console.log('this.view:', this.view)
    this.currentView = this.$store.state.options.views.find(item => item.name === this.view)
    // console.log('this.currentView:', this.currentView)
    this.getData()
    // console.log(this.currentView)
    // console.log(this.$store.state.options.views)
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

      // console.log('this.data:', this.data)
      // const [res_s, res_y, res_s_zb, res_y_zb] = await getData(this.currentView, this.data)
      this.options = (format(this.options, this.currentView, await getData(this.currentView, this.data)))
      this.renderChart(this.options)
    },
    initChart() {
      this.chart = echarts.init(document.getElementById(this.data.id))
      this.chart.on('click', (params) => {
        console.log(params)
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
    handleMaxOpend() {
      // console.log('handleMaxOpend...')
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
