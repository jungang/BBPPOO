<template>
  <div class="app-container">
    <el-row style="margin-bottom: 10px">
      <el-col :span="3">
        <el-checkbox v-model="checked">预实</el-checkbox>
      </el-col>
      <el-col :span="3">
        <el-checkbox v-model="checked2">完成率</el-checkbox>
      </el-col>
      <el-col :span="5">
        <el-select
          v-model="value3"
          size="mini"
          placeholder="请选择"
          style="width: 100px"
        >
          <el-option label="表头信息" value="">表头信息</el-option>
          <el-option label="表头1" value="1">表头1</el-option>
          <el-option label="表头2" value="2">表头2</el-option>
          <el-option label="表头3" value="3">表头3</el-option>
          <el-option label="表头4" value="4">表头4</el-option>
        </el-select>
      </el-col>

      <el-col :span="5">
        <span class="demonstration">月</span>
        <el-date-picker
          v-model="value1"
          type="month"
          size="mini"
          placeholder="选择月"
          style="width: 100px"
        />
      </el-col>

      <el-col :span="5">
        <div class="block">
          <span class="demonstration">天</span>
          <el-date-picker
            v-model="value2"
            type="date"
            size="mini"
            placeholder="选择日期"
            style="width: 100px"
          />
        </div>
      </el-col>
      <el-col :span="3">
        <div class="block">
          <el-button
            type="primary"
            size="mini"
          >复制</el-button>
        </div></el-col>
    </el-row>

    <div :id="data.id" class="chart" style="width:100%; height:90%;" />

    <el-dialog
      title="详情"
      :visible.sync="dialogVisible"
      width="800"
      @closed="handleClosed"
    >

      <drill ref="drill" :data="{...drillData}" :panel.sync="panel" />

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>

</template>

<script>
const echarts = require('echarts')
import drill from './drill-down'

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
    }
  },
  data() {
    return {
      myChart: {},
      timer: {},
      dialogVisible: false,
      dialog: {
        name: '111',
        value: 1
      },
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

      const option = {
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
            magicType: { show: true, type: ['line', 'bar', 'stack', 'tiled'] },
            restore: { show: true }
          }
        },
        dataset: {
          source: [
            ['product', '预算', '实际'],
            ['收入', 43.3, 85.8],
            ['成本', 83.1, 73.4],
            ['利润率', 86.4, 65.2],
            ['人数', 72.4, 53.9]
          ]
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category'
        },
        yAxis: {

        },
        // Declare several bar series, each will be mapped
        // to a column of dataset.source by default.
        series: [
          { type: 'bar' },
          { type: 'bar' }
        ]
      }

      this.myChart.setOption(option)

      this.myChart.on('click', (params) => {
        this.dialogVisible = true
        this.drillData = params
      })

      this.$nextTick(() => {
        this.myChart.resize()
      })
    },
    handleClosed() {
      console.log('handleClosed')
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

