<template>
  <div class="drill-container">
    <el-row style="margin-bottom: 10px">
      <el-col :span="20">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item v-for="(item, index) in breadcrumb" :key="item.id">
            <el-button type="text" @click="handleBread(item, index)"> {{ item.breadName || item.name }}</el-button>
          </el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
      <el-col :span="4" style="text-align: right">
        <el-button type="primary" @click="handleAdd">加入仪表盘</el-button>
      </el-col>
    </el-row>

    <div :id="data.name" class="chart" style="width:100%; height:50vh;">{{ data.name }}</div>

  </div>
</template>
1
<script>
// import { fetchData } from '@/api/panel'
var echarts = require('echarts')
import uuidv1 from 'uuid/v1'
import { format, getData } from '@/utils/chart-data'
import { deepClone } from '@/utils/index'
// import { format } from '@/utils/chart-data'

export default {
  name: 'Drill',
  components: { },
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
    panel: {
      type: Object,
      default: function() {
        return {}
      }
    },
    title: {
      type: String,
      default: function() {
        return ''
      }
    }
  },
  data() {
    return {
      currentView: {},
      breadcrumb: [],
      temp: {},
      query: {
        id: 1
      },
      chart: {},
      loading: {
        text: 'loading',
        color: '#4cbbff',
        textColor: '#4cbbff',
        maskColor: 'rgba(255, 255, 255, 0.7)'
      },
      options: {
        legend: {},
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        toolbox: {
          show: true,
          // orient: 'vertical',
          left: 'right',
          top: 'top',
          feature: {
            dataView: {
              readOnly: true,
              optionToContent: function(opt) {
                var axisData = opt.dataset[0].source

                var table = '<table style="width:100%;text-align:center; user-select: text;"><tbody><tr>' +
                  '<td>' + opt.dataset[0].dimensions[0] + '</td>' +
                  '<td>' + opt.dataset[0].dimensions[1] + '</td>' +
                  '<td>' + opt.dataset[0].dimensions[2] + '</td>' +
                  '<td>' + opt.dataset[0].dimensions[3] + '</td>' +
                  '</tr>'

                for (var i = 0; i < axisData.length; i++) {
                  table += '<tr>' +
                    '<td>' + axisData[i].类目 + '</td>' +
                    '<td>' + axisData[i].实际 + '</td>' +
                    '<td>' + axisData[i].预计 + '</td>' +
                    '<td>' + axisData[i].完成率 + '</td>' +
                    '</tr>'
                }
                table += '</tbody></table>'
                return table
              }
            },
            magicType: { show: true, type: ['line', 'bar', 'stack', 'tiled'] },
            restore: { show: true }
          }
        },
        dataset: {},
        grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
        xAxis: {
          axisLabel: {
            show: false
            // formatter: (value, index) => {
            //   const drillName = this.options.dataset.source[index].drillName
            //   const drill = !this.currentView.items[drillName]
            //   return drill ? value : value + '(含下钻图表)'
            // }
          },
          type: 'category'
        },
        yAxis: {},
        series: []
      }
    }
  },
  created() { },
  mounted() {
  },
  methods: {
    async init(params, isBread) {
      console.log('init.....')
      params = params || { ...this.data }

      isBread || this.breadcrumb.push({ ...params })

      // console.log(params)
      this.currentView = this.$store.state.options.views.find(item => item.name === params._drillName)

      this.temp = params
      this.$emit('update:title', this.currentView.title)

      // 发起请求
      this.chart.id && this.chart.showLoading(this.loading)

      this.options = (format(deepClone(this.options), this.currentView, await getData(this.currentView, params)))

      this.renderChart(this.options)
    },
    handleBread(item, index) {
      this.breadcrumb.splice(index + 1)
      this.init(item, true)
    },

    initChart() {
      // console.log('initChart....')
      this.chart = echarts.init(document.getElementById(this.data.name))
      this.chart.on('click', (params) => {
        params.drillName = params.value.drillName // 下钻所用名称

        params.parameters = this.data.parameters

        if (this.currentView.items[params.drillName] || this.currentView.items['*']) {
          params._drillName = this.currentView.items[params.drillName] || this.currentView.items['*'] // 下钻名称
          params.breadName = params.name // 面包屑名字
          this.drillData = params
          this.dialogVisible = true
          this.$nextTick(() => {
            this.init(params)
          })
        }
      })
    },

    renderChart(options) {
      console.log('this.chart.id:', this.chart.id)
      if (this.chart.id) {
        this.chart.dispose()
      }
      this.initChart()
      this.chart.hideLoading()
      this.chart.setOption(options)
    },

    handleAdd() {
      console.log(this.temp)
      const newPanel = {
        id: uuidv1(),
        type: 'cus',
        title: this.temp.breadName,
        viewName: this.temp._drillName, // -this.view
        drillName: this.temp.name,
        component: 'chart',
        parameters: this.data.parameters,
        width: 600,
        height: 400
      }
      console.log(newPanel)
      this.panel.list.unshift(newPanel)
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
  .drill-container{
    margin: 0;
  }
  .el-breadcrumb__inner{
    cursor: pointer;
  }

</style>
