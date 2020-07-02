<template>
  <div class="app-container">

    <el-table
      :data="list"
      style="width: 100%"
      size="mini"
      row-key="name"
      default-expand-all
      border
      fit
      :tree-props="{children: 'childrenRow',hasChildren: 'hasChildren'}"
      :max-height="data.height-30"
    >
      <!--      <el-table-column type="index" label="序号" width="80" />-->
      <el-table-column
        prop="res_s_title"
        label="名称"
      >
        <template slot-scope="{row}">
          <span v-if="row._drillName" class="table-row-is-drill-class" @click="handelDrill(row)"> {{ row.res_s_title }} </span>
          <span v-else> {{ row.res_s_title }} </span>
        </template>
      </el-table-column>

      <el-table-column v-if="list[0].res_y_value" prop="res_y_value" :sortable="sort" label="预计" />
      <el-table-column v-if="list[0].res_y_zb_value" prop="res_y_zb_value" :sortable="sort" label="预计占比%" />
      <el-table-column v-if="list[0].res_s_value" prop="res_s_value" :sortable="sort" label="实际" />
      <el-table-column v-if="list[0].res_s_zb_value" prop="res_s_zb_value" :sortable="sort" label="实际占比%" />
      <el-table-column v-if="list[0].finish_value" prop="finish_value" :sortable="sort" label="完成率%" />

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
        fit
        stripe
        default-expand-all
        row-key="name"
        :tree-props="{children: 'childrenRow',hasChildren: 'hasChildren'}"
        max-height="700px"
      >
        <!--        <el-table-column type="index" label="序号" width="50" />-->
        <el-table-column
          prop="res_s_title"
          label="名称"
        >
          <template slot-scope="{row}">
            <span v-if="row._drillName" class="table-row-is-drill-class" @click="handelDrill(row)"> {{ row.res_s_title }} </span>
            <span v-else> {{ row.res_s_title }} </span>
          </template>
        </el-table-column>

        <el-table-column v-if="list[0].res_y_value" prop="res_y_value" :sortable="sort" label="预计" />
        <el-table-column v-if="list[0].res_y_zb_value" prop="res_y_zb_value" :sortable="sort" label="预计占比%" />
        <el-table-column v-if="list[0].res_s_value" prop="res_s_value" :sortable="sort" label="实际" />
        <el-table-column v-if="list[0].res_s_zb_value" prop="res_s_zb_value" :sortable="sort" label="实际占比%" />
        <el-table-column v-if="list[0].finish_value" prop="finish_value" :sortable="sort" label="完成率%" />

      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="maxVisible = false">关闭</el-button>
      </span>
    </el-dialog>
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
  </div>
</template>

<script>

import drill from '../charts/drill-down'
import { standardize, getData } from '@/utils/chart-data'
import { planeToHierarchy } from '@/utils/chartType'
import uuidv1 from 'uuid/v1'

// import { fetchData } from '@/api/panel'

export default {
  name: 'Tabular',
  components: { drill
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
      fold: true,
      sort: true,
      listLoading: true,
      maxVisible: false,
      dialogVisible: false,
      list: [{}],
      timer: {},
      currentView: {},
      title: '222',
      drillData: {}
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
    this.fold = this.currentView.fold
    this.sort = this.currentView.sort
    this.getData()
  },
  mounted() {},
  methods: {
    handleClosed() {
      // console.log('handleClosed')
      this.$refs.drill.breadcrumb = []
    },
    handelDrill(row) {
      console.log('handelDrill...')
      this.drillData = row
      this.drillData.parameters = this.data.parameters
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.drill.init()
      })
    },
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
      mixed.res_s.forEach(item => {
        // console.log(item.type)
        if (item.type === 'Percentage') { // Currency 金额、 Integer 整数、 Percentage 百分比
          item.value = item.value + '%'
        }
      })
      console.log('mixed:', mixed)
      console.log('this.currentView:', this.currentView)

      this.list = []
      mixed.res_s.forEach((item, index) => {

        this.list.push({
          chartId: uuidv1(),
          name: item.name,
          children: item.children,
          drillName: item.name,
          _drillName: this.currentView.items[item.name] || this.currentView.items['*'],
          breadName: item.title,
          res_s_title: item.title,
          res_s_value: item.value,
          res_y_title: mixed.res_y[index].title,
          res_y_value: mixed.res_y[index].value,
          res_s_zb_title: mixed.res_s_zb[index].title,
          res_s_zb_value: mixed.res_s_zb[index].value && mixed.res_s_zb[index].value + '%',
          res_y_zb_title: mixed.res_y_zb[index].title,
          res_y_zb_value: mixed.res_y_zb[index].value && mixed.res_y_zb[index].value + '%',
          finish_value: mixed.res_y[index].value > 0 && (item.value / mixed.res_y[index].value * 100).toFixed(0) + '%'
        })
      })

      // console.log('this.list:', this.list)

      this.list = this.fold ? planeToHierarchy([...this.list]) : this.list
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
      min-height: 700px;
    }
  }
  .table-row-is-drill-class{
    color: blue;
    cursor: pointer;
  }
  .table-row-is-drill-class:hover{
    text-decoration:underline;
  }
</style>
