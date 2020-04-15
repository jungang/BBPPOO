<template>
  <div class="drill-container">
    <el-row style="margin-bottom: 10px">
      <el-col :span="18">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item v-for="(item, index) in breadcrumb" :key="item.id">
            <el-button type="text" @click="handleBread(item, index)"> {{ item.breadName || item.name }}</el-button>
          </el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
      <el-col :span="6" style="text-align: right">
        <el-button type="primary" @click="handleAdd">加入仪表盘</el-button>
      </el-col>
    </el-row>

    <el-tabs
      v-model="activeName"
      type="border-card"
      @tab-click="handleClick"
    >

      <el-tab-pane name="first">
        <span slot="label"><i class="el-icon-s-data" /> 图表</span>
        <div :id="data.chartId" class="chart" style="width:100%; height:50vh;">{{ data.name }}</div>
      </el-tab-pane>
      <el-tab-pane label="表格" name="second">
        <span slot="label"><i class="el-icon-s-grid" /> 表格</span>
        <el-table
          :data="list"
          style="width: 100%"
          size="mini"
          border
          fit
          stripe
        >
          <el-table-column type="index" label="序号" width="50" />
          <el-table-column
            prop="res_s_title"
            label="名称"
          >
            <template slot-scope="{row}">
              <span v-if="row._drillName" class="table-row-is-drill-class" @click="handelDrill(row)"> {{ row.res_s_title }} </span>
              <span v-else> {{ row.res_s_title }} </span>
            </template>
          </el-table-column>

          <el-table-column v-if="list[0].res_y_value" prop="res_y_value" label="预计" />
          <el-table-column v-if="list[0].res_y_zb_value" prop="res_y_zb_value" label="预计占比" />
          <el-table-column v-if="list[0].res_s_value" prop="res_s_value" label="实际" />
          <el-table-column v-if="list[0].res_s_zb_value" prop="res_s_zb_value" label="实际占比" />
          <el-table-column v-if="list[0].res_finish_rate_value" prop="res_finish_rate_value" label="完成率" />

        </el-table>
      </el-tab-pane>
    </el-tabs>

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
      list: [{}],
      activeName: 'first',
      renderType: 'chart',
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
    handelDrill(row) {
      console.log('handelDrill...')
      console.log(row)

      this.init(row)
    },
    handleClick() {
      console.log(this.chart)
      this.$nextTick(() => {
        this.chart.resize()
      })
    },
    async init(params, isBread) {
      console.log('init.....')
      params = params || { ...this.data }
      isBread || this.breadcrumb.push({ ...params })

      console.log(params)
      console.log(params._drillName)
      this.currentView = this.$store.state.options.views.find(item => item.name === params._drillName)

      params.parameters = this.data.parameters
      console.log(this.$store.state.options.views)
      console.log(this.currentView)

      this.temp = params
      this.$emit('update:title', this.currentView.title)

      // 发起请求
      this.chart.id && this.chart.showLoading(this.loading)

      this.options = (format(deepClone(this.options), this.currentView, await getData(this.currentView, params)))

      console.log('init this.list-------------')
      this.list = []
      this.options.dataset.source.forEach((item, index) => {
        console.log(item)

        this.list.push({
          chartId: uuidv1(),
          name: item.类目,
          drillName: item.drillName,
          drillNameNode: item.drillNameNode,
          isDrill: item.isDrill,
          _drillName: item.drillNameNode,
          breadName: item.类目,
          res_s_title: item.类目,
          res_s_value: item.实际,
          res_y_title: item.类目,
          res_y_value: item.预计,
          res_s_zb_title: item.类目,
          res_s_zb_value: item.实际占比 && item.实际占比 + '%',
          res_y_zb_title: item.类目,
          res_y_zb_value: item.预计占比 && item.预计占比 + '%',
          res_finish_rate_value: item.完成率 && item.完成率 + '%'
        })
      })

      console.log('this.list:', this.list)

      this.renderChart(this.options)
    },
    handleBread(item, index) {
      this.breadcrumb.splice(index + 1)
      this.init(item, true)
    },

    initChart() {
      console.log('initChart....')
      console.log(this.data)
      console.log(this.data.name)
      console.log(document.getElementById(this.data.chartId))

      this.chart = echarts.init(document.getElementById(this.data.chartId))
      this.chart.on('click', (params) => {
        params.drillName = params.value.drillName // 下钻所用名称


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
