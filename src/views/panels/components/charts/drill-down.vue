<template>
  <div class="drill-container">
    <el-row type="flex" justify="end">
      <el-col :span="17">
        <el-breadcrumb v-if="breadcrumb.length>1" separator="/" style="margin-left: 10px">
          <!--        <el-breadcrumb separator="/" style="margin-left: 10px">-->
          <el-breadcrumb-item v-for="(item, index) in breadcrumb" :key="item.id">
            <el-button
              type="text"
              style="padding:0"
              @click="handleBread(item, index)"
            >
              {{ item.title || item.breadName }}
            </el-button>
          </el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
      <el-col :span="7" style="text-align: right; padding-right: 10px">
        <!--        <el-button type="primary" size="mini" @click="handleAdd">复制</el-button>-->
        <el-button type="primary" size="mini" @click="handleAdd">复制</el-button>
        <el-button
          v-if="data.type !== 'def'"
          size="mini"
          @click="handleDelete"
        >删除</el-button>
      </el-col>
    </el-row>

    <el-tabs
      v-model="activeName"
      type="border"
      :class="!currentView.switch?'only-table':''"
      @tab-click="handleClick"
    >
      <el-tab-pane v-if="currentView.switch" name="chart">
        <span slot="label"><i class="el-icon-s-data" /> 图表</span>
        <div :id="data.chartId" class="chart" :style="`width:100%; height:`+(data.height-140)+`px`">{{ data.name }}</div>
      </el-tab-pane>
      <el-tab-pane name="tabular">
        <span v-if="currentView.switch" slot="label"><i class="el-icon-s-grid" /> 表格</span>
        <el-table
          :data="list"
          style="width: 100%"
          size="mini"
          border
          fit
          stripe
          row-key="id"
          :tree-props="{children: 'childrenRow',hasChildren: 'hasChildren'}"
          :max-height="data.height-138"
          :header-cell-style="{background:'#eef1f6'}"
        >
          <!--          <el-table-column type="index" label="序号" width="50" />-->
          <el-table-column
            prop="res_s_title"
            label="名称"
            :sortable="sort"
          >
            <template slot-scope="{row}">
              <el-tooltip :disabled="!fold || !row.formula" class="item" effect="dark" :content="row.formula" placement="top-start">
                <span v-if="row._drillName" class="table-row-is-drill-class" @click="handelDrill(row)"> {{ row.res_s_title }} </span>
                <span v-else>
                  {{ row.res_s_title }}
                </span>
              </el-tooltip>

            </template>
          </el-table-column>

          <el-table-column v-if="list[0].res_y_value" :sortable="sort" prop="res_y_value" label="预计">
            <template slot-scope="{row}">
              <span> {{ row.res_y_value }}</span>
            </template>
          </el-table-column>
          <el-table-column v-if="list[0].res_y_zb_value" :sortable="sort" prop="res_y_zb_value" label="预计占比%" />
          <el-table-column :sortable="sort" prop="res_s_value" label="实际">
            <template slot-scope="{row}">
              <span :class="row.highlightStyle" @click="cellHandelDrill(row)"> {{ row.res_s_value }}</span>
            </template>
          </el-table-column>
          <el-table-column v-if="list[0].res_s_zb_value" :sortable="sort" prop="res_s_zb_value" label="实际占比%" />
          <el-table-column v-if="list[0].res_y_value" :sortable="sort" prop="res_finish_rate_value" label="完成率%">
            <template slot-scope="{row}">
              {{ row.res_finish_rate_value && row.res_finish_rate_value+'%' }}

            </template>
          </el-table-column>

        </el-table>
      </el-tab-pane>
    </el-tabs>

  </div>
</template>
1
<script>
// import { fetchData } from '@/api/panel'
// eslint-disable-next-line no-unused-vars
import { dataType } from '@/filters'
var echarts = require('echarts')
import uuidv1 from 'uuid/v1'
import { format, getData, standardize } from '@/utils/chart-data'
import { deepClone } from '@/utils/index'
import { planeToHierarchy } from '@/utils/chartType'
import { getFullData } from '@/utils/dataProce'
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
      indexId: '',
      fullData: {},
      fold: true,
      sort: true,
      timer: {},
      list: [{}],
      activeName: 'chart',
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
        legend: {

        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          // backgroundColor: '#eee',
          padding: 20,
          extraCssText: 'box-shadow: 0 0 3px rgba(10px,10px, 10px, 1,black);',
          borderColor: '#aaa',
          borderWidth: 1,
          borderRadius: 4,
          position: ['80%', '10%'],
          alwaysShowContentL: true,
          transitionDuration: 0,
          showDelay: 0,
          formatter: (params, ticket, callback) => {
            // console.log(params)
            let str = ''
            str += `${params[0].name}<br>`
            str += `完成率: ${params[0].data.完成率}%`
            return str
          }
          /*          position: function(pos, params, dom, rect, size) {
            // 鼠标在左侧时 tooltip 显示到右侧，鼠标在右侧时 tooltip 显示到左侧。
            var obj = { top: 60 }
            obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 5
            return obj
          }*/
        },
        toolbox: {
          show: true,
          // orient: 'vertical',
          left: 'right',
          top: 'top',
          feature: {
            dataView: {
              show: false
              // readOnly: true,
              /*              optionToContent: function(opt) {
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
              }*/
            },
            magicType: { show: true, type: ['line', 'bar', 'stack', 'tiled'] },
            restore: { show: true }
          }
        },
        dataset: {},
        grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
        xAxis: {
          axisLabel: {
            show: true,
            interval: 0, // 'auto'
            fontSize: 9,
            fontWeight: 100
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
  watch: {
    data: {
      deep: true,
      handler() {
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          // console.log('resize...')
          // console.log('data:', this.data)
          this.chart.id && this.chart.resize()
        }, 100)
      }
    }
  },
  created() {
    this.indexId = this.data.indexId
    this.init()
    window.onresize = () => {
      // console.log('window.onresize...')
      // console.log(this.chart)
      // this.chart.id && this.chart.resize()
    }
  },
  mounted() {
  },
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

    cellHandelDrill(row) {
      console.log('cellHandelDrill...')
      console.log(row)
      console.log(this.$store.state.options.views)
      const _currentView = this.$store.state.options.views.find(item => {
        console.log(item.name === row.name)
        return item.name === row.name
      })
      console.log(_currentView)

      // this.init(row)
    },

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
      // console.log('init.....')

      // console.log('this.data:', this.data)
      // console.log('params:', params)
      params = params || deepClone(this.data)

      // console.log('params:', params)
      // console.log('this.breadcrumb:', this.breadcrumb)

      isBread || this.breadcrumb.push({
        id: params.id,
        type: params.type,
        title: params.title,
        breadName: params.breadName || params.drillName || params.title,
        width: params.width,
        height: params.height,
        chartId: params.chartId,
        viewName: params.viewName,
        component: params.component,
        drillName: params.drillName,
        _drillName: params.viewName || params._drillName,
        parameters: this.data.parameters
      })

      // console.log('this.breadcrumb:', this.breadcrumb)

      params._drillName = params._drillName || params.viewName

      // console.log('params:', params)

      this.$store.state.options.views.forEach(item => {
        // console.log(item.name)
      })

      // console.log('params._drillName:', params._drillName)
      this.currentView = this.$store.state.options.views.find(item => item.name === params._drillName)
      this.fold = this.currentView.fold
      this.sort = this.currentView.sort

      params.parameters = this.data.parameters
      // console.log(this.$store.state.options.views)
      // console.log('this.currentView:', this.currentView)
      // console.log('this.fold:', this.fold)
      // console.log('currentView.style:', this.currentView.style)
      this.activeName = this.currentView.style

      this.temp = params
      this.$emit('update:title', this.currentView.title)

      // 发起请求
      this.chart.id && this.chart.showLoading(this.loading)

      // todo 重构数据API S

      // this.currentView.drill_name = params.name
      this.currentView.drill_drillName = params.drillName
      this.currentView.drill__drillName = params._drillName
      this.currentView.drill_parameters = this.data.parameters

      // fix boolen
      // this.currentView.compare = params.compare
      // this.currentView.completion = params.completion
      // this.currentView.ratio = params.ratio

      this.fullData = await getFullData(this.currentView)

      console.log('fullData:', this.fullData)

      // todo 重构数据API E

      this.options = (format(deepClone(this.options), this.currentView, await getData(this.currentView, params)))

      const mixed = standardize(await getData(this.currentView, params), this.currentView)
      mixed.res_y.forEach(item => {
        // console.log(item.type)
        if (item.type === 'Percentage') { // Currency 金额、 Integer 整数、 Percentage 百分比
          item.value = item.value + '%'
        }
      })
      mixed.res_s.forEach(item => {
        // console.log(item.type)
        if (item.type === 'Percentage') { // Currency 金额、 Integer 整数、 Percentage 百分比
          item.value = item.value + '%'
        }
      })
      // console.log('mixed:', mixed)

      const _list = []

      mixed.res_s.forEach((item, index) => {
        // console.log('item:', item)
        // console.log(this.currentView.items[item.name] || this.currentView.items['*'])
        _list.push({
          id: uuidv1(),
          chartId: uuidv1(),
          name: item.name,
          type: item.type,
          formula: item.formula === 'Null' ? undefined : item.formula,
          highlight: item.highlight,
          children: item.children,
          drillName: item.name,
          _drillName: this.currentView.items[item.name] || this.currentView.items['*'],
          breadName: item.title,
          res_s_title: item.title,
          res_s_value: item.value,
          res_y_title: mixed.res_y[index] && mixed.res_y[index].title,
          res_y_value: mixed.res_y[index] && mixed.res_y[index].value,
          // res_s_zb_title: mixed.res_s_zb[index] && mixed.res_s_zb[index].title,
          // res_s_zb_value: mixed.res_s_zb[index].value && mixed.res_s_zb[index].value + '%',
          // res_y_zb_title: mixed.res_y_zb[index].title,
          // res_y_zb_value: mixed.res_y_zb[index].value && mixed.res_y_zb[index].value + '%',
          // res_finish_rate_value: (mixed.res_y[index] || mixed.res_y[index].value) > 0 && (item.value / mixed.res_y[index].value * 100).toFixed(0) + '%'
          res_finish_rate_value: parseFloat(item.完成率)
        })

        // console.log('item.title:', item.title)
        // console.log(item.value, typeof item.value)
        // console.log(mixed.res_y[index].value, typeof mixed.res_y[index].value)
      })

      // console.log('init this.list-------------')
      this.list = []
      // console.log('this.options.dataset.source:', this.options.dataset.source)
      this.options.dataset.source.forEach((item, index) => {
        // console.log(item)
        this.list.push({
          id: uuidv1(),
          chartId: uuidv1(),
          name: item.类目,
          type: item.type,
          formula: item.formula,
          highlight: item.highlight,
          children: item.children,
          drillName: item.drillName,
          drillNameNode: item.drillNameNode,
          isDrill: item.isDrill,
          _drillName: item.drillNameNode,
          breadName: item.类目,
          res_s_title: item.类目,
          res_s_value: dataType(item.实际, item.type, item),
          res_y_title: item.类目,
          res_y_value: dataType(item.预计, item.type, item),
          res_s_zb_title: item.类目,
          res_s_zb_value: item.实际占比 && item.实际占比 + '%',
          res_y_zb_title: item.类目,
          res_y_zb_value: item.预计占比 && item.预计占比 + '%',
          res_finish_rate_value: parseFloat(item.完成率) && +item.完成率
        })
      })

      // console.log('_list:', _list)

      // 完成率
      _list.forEach(item => {
        // item.res_finish_rate_value = (item.res_s_value / item.res_y_value * 100)

        // console.log('item.res_finish_rate_value:', item.res_finish_rate_value)
        // console.log('typeof item.res_finish_rate_value:', typeof item.res_finish_rate_value)
        // if (isNaN(item.res_finish_rate_value)) {
        //   item.res_finish_rate_value = ''
        // } else {
        //   item.res_finish_rate_value = item.res_finish_rate_value.toFixed(2)
        // }

        item.res_finish_rate_value = parseFloat(item.res_finish_rate_value) || ''
        item.res_finish_rate_value = item.res_finish_rate_value === Infinity ? '' : item.res_finish_rate_value

        // console.log('item.res_s_title:', item.res_s_title)
        // console.log(item.res_s_value, typeof item.res_s_value)
        // console.log(item.res_finish_rate_value, typeof item.res_finish_rate_value)
      })

      // todo 未解决的数据源 图表 、表格

      this.list.forEach(item => {
        item.highlightStyle = ''
        if (item.highlight === 'true') {
          item.highlightStyle = item.res_finish_rate_value < 100 ? 'danger' : ''
        } else if (item.highlight === 'false') {
          item.highlightStyle = item.res_finish_rate_value > 100 ? 'danger' : ''
        }
        // console.log('item:', item)
        // console.log('item.res_finish_rate_value:', item.res_finish_rate_value)

        item.res_finish_rate_value = isNaN(item.res_finish_rate_value) ? '' : item.res_finish_rate_value
        // 修复 完成率

        // console.log('item.res_finish_rate_value:', item.res_finish_rate_value)
      })

      // todo 重复业务
      _list.forEach(item => {
        item.highlightStyle = ''
        if (item.highlight === 'true') {
          item.highlightStyle = item.res_finish_rate_value < 100 ? 'danger' : ''
        } else if (item.highlight === 'false') {
          item.highlightStyle = item.res_finish_rate_value > 100 ? 'danger' : ''
        }
        // console.log('item:', item)
        // console.log('item.res_finish_rate_value:', item.res_finish_rate_value)
      })

      // this.list = this.fold ? planeToHierarchy([...this.list]) : this.list
      // this.list = this.fold ? planeToHierarchy([..._list]) : _list
      this.list = this.fold ? planeToHierarchy([..._list]) : this.list

      // console.log('this.fold:', this.fold)
      // console.log('this.list:', this.list)

      if (this.list.length <= 0) {
        this.list.push({})
      }

      this.currentView.switch && this.renderChart(this.options)
    },
    handleBread(item, index) {
      this.breadcrumb.splice(index + 1)
      this.init(item, true)
    },

    initChart() {
      // console.log('initChart.......')
      // console.log(this.data)
      // console.log(this.data.name)
      // console.log(document.getElementById(this.data.chartId))

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
      if (this.chart.id) {
        this.chart.dispose()
      }
      this.initChart()
      this.chart.hideLoading()
      this.chart.setOption(options)
      /* 切换图例选中状态后*/
      this.chart.on('legendselectchanged', (params) => {
        let isVis = true
        if (!params.selected[params.name]) {
          for (const key of Object.keys(params.selected)) {
            /* if(Object.prototype.hasOwnProperty.call(params.selected, key)) {
              if(params.selected[key]){
                isVis = false;
              }
            }*/
            if (params.selected[key]) {
              isVis = false
            }
          }
        }

        if (isVis) {
          this.chart.dispatchAction({
            type: 'legendSelect',
            name: params.name
          })
        }
      })
    },
    handleCopy() {
      console.log('this.temp:', this.temp)
      const newPanel = { ...this.data }
      newPanel.id = uuidv1()
      newPanel.chartId = uuidv1()
      newPanel.type = 'cus'
      // console.log(this.breadcrumb)
      newPanel.breadcrumb = deepClone(this.breadcrumb)
      console.log('newPanel:', newPanel)
      this.panel.list.unshift(newPanel)
      console.log(this.panel.list)
    },
    handleAdd() {
      console.log('this.temp:', this.temp)
      const newPanel = {
        id: uuidv1(),
        chartId: uuidv1(),
        indexId: uuidv1(),
        type: 'cus',
        title: this.temp.breadName || this.temp.panelTitle,
        viewName: this.temp._drillName, // -this.view
        drillName: this.temp.drillName || this.temp.name,
        // component: 'chart',
        parameters: this.data.parameters,
        width: this.data.width,
        height: this.data.height
      }

      const _index = this.panel.list.findIndex(item => item.indexId === this.indexId)
      // console.log(_index)
      // console.log(newPanel)
      this.panel.list.splice(_index + 1, 0, newPanel)

      /*      this.panel.list.forEach((item, index) => {
        if (item.indexId === this.temp.indexId) {
          console.log(index, item)
          console.log('newPanel:', newPanel)
          console.log('this.panel.list', this.panel.list)
          this.panel.list.splice(index, 0, newPanel)
        }
      })*/

      // this.panel.list.unshift(newPanel)
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
  .drill-container{
    margin-top: 45px;
    height: 100%;
  }
  .el-tabs{
    height: 100%;
  }
  .el-breadcrumb__inner{
    cursor: pointer;
  }
  .el-tab-pane{
    height: 100%;
  }
  .table-row-is-drill-class{
    color: blue;
    cursor: pointer;
  }
  .table-row-is-drill-class:hover{
    text-decoration:underline;
  }
</style>

<style lang="scss">
  .drill-container {
    .el-tabs__content {
      height: 100% !important;
    }
  }
  .only-table{
    .is-top{
      /*display: none !important;*/
    }
  }
</style>
