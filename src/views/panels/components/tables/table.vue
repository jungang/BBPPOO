<template>
  <div class="app-container">

    <el-table
      :data="list"
      style="width: 100%"
      size="mini"
      border
      :max-height="data.height-30"
    >
      <el-table-column type="index" label="序号" width="50" />
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="title" label="标题" />
      <el-table-column prop="value" label="值" />
    </el-table>

    <el-dialog
      title="全屏"
      :visible.sync="maxVisible"
      width="100%"
      top="0"
      class="max-table-dialog"
    >
      <el-table
        :data="list"
        style="width: 100%"
        size="mini"
        border
        max-height="700px"
      >
        <el-table-column type="index" label="序号" width="50" />
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="title" label="标题" />
        <el-table-column prop="value" label="值" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="maxVisible = false">关闭</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>

import { fetchData } from '@/api/panel'

export default {
  name: 'ChartTable',
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
      listLoading: true,
      maxVisible: false,
      list: [],
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
          console.log(this.data)
          // this.chart.resize()
        }, 100)
      }
    }
  },
  created() {
    this.getList()
    console.log(this.data.title)
  },
  mounted() {},
  methods: {
    maxPanel() {
      this.maxVisible = true
      console.log('maxPanel...')
      this.$nextTick(() => {
        // this.maxChart = echarts.init(document.getElementById('maxChart'))
        // this.maxChart.setOption(this.options)
      })
    },
    getList() {
      this.listLoading = true
      // test().then(response => {
      //   // console.log(response)
      //   this.list = response.data.items
      //   this.listLoading = false
      // })

      console.log(this.data)
      const data = {
        'dir': 'Sample Reports/monthly_items_list',
        'year': +this.data.parameters.year,
        'month': +this.data.parameters.month,
        'projectId': '00000000-0000-0000-0000-000000000000',
        'vf_id': 1,
        'vf_file': 'dashboard.efwvf'
      }
      return new Promise((resolve, reject) => {
        fetchData(data).then(response => {
          this.list = response
          console.log(response)
        })
      })
    }
  }
}

</script>

<style lang="scss" scoped>
  .app-container{
    padding: 18px 0 0 0;
    height: 100%;
  }
</style>
<style lang="scss">
  .max-table-dialog{
    .el-dialog__body{
      padding: 0 20px;
    }
  }
</style>
