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
      <el-table-column prop="res_s_title" label="名称" />
      <el-table-column prop="res_y_value" label="预计" />
      <el-table-column prop="res_y_zb_value" label="预计占比" />
      <el-table-column prop="res_s_value" label="实际" />
      <el-table-column prop="res_s_zb_value" label="实际占比" />
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
        <el-table-column prop="res_s_title" label="名称" />
        <el-table-column prop="res_y_value" label="预计" />
        <el-table-column prop="res_y_zb_value" label="预计占比" />
        <el-table-column prop="res_s_value" label="实际" />
        <el-table-column prop="res_s_zb_value" label="实际占比" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="maxVisible = false">关闭</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>

import { standardize, getData } from '@/utils/chart-data'
// import { fetchData } from '@/api/panel'

export default {
  name: 'Tabular',
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
      timer: {},
      currentView: {}
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
    this.currentView = this.$store.state.options.views.find(item => item.name === this.data.viewName)
    this.getData()
  },
  mounted() {},
  methods: {
    maxPanel() {
      this.maxVisible = true
      console.log('maxPanel...')
      this.$nextTick(() => {
      })
    },
    async getData() {
      this.data._drillName = this.view
      const mixed = standardize(await getData(this.currentView, this.data))

      mixed.res_y.forEach(item => {
        // console.log(item.type)
        if (item.type === 'Percentage') { // Currency 金额、 Integer 整数、 Percentage 百分比
          item.value = item.value + '%'
        }
      })
      console.log('mixed:', mixed)

      this.list = []
      mixed.res_s.forEach((item, index) => {
        this.list.push({
          res_s_title: item.title,
          res_s_value: item.value,
          res_y_title: mixed.res_y[index].title,
          res_y_value: mixed.res_y[index].value,
          res_s_zb_title: mixed.res_s_zb[index].title,
          res_s_zb_value: mixed.res_s_zb[index].value && mixed.res_s_zb[index].value + '%',
          res_y_zb_title: mixed.res_y_zb[index].title,
          res_y_zb_value: mixed.res_y_zb[index].value && mixed.res_y_zb[index].value + '%'
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
