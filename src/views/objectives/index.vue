<template>
  <div class="app-container">
    <el-row type="flex" align="middle">

      <el-col :span="12">
        <!--        批次:
        <el-select v-model="temp.year" class="filter-item" placeholder="请选择" @change="getList">
          <el-option v-for="item in $store.state.options.dateValueYear" :key="item.key" :label="item.label" :value="item.key" />
        </el-select>
        <el-select v-model="temp.month" class="filter-item" placeholder="请选择" @change="getList">
          <el-option v-for="item in $store.state.options.dateValueMonth" :key="item.key" :label="item.label" :value="item.key" />
        </el-select>-->

        <el-upload
          class="upload-demo"
          :action="$store.state.options.API+'/upload/target'"
          :show-file-list="false"
          multiple
          :limit="10"
          :data="{projectId}"
          :on-exceed="handleExceed"
          :on-error="handleError"
          :on-success="handleSuccess"
          style="width: 60px;display: inline-block;"
        >

          <el-button v-waves v-permission="['admin', 'project_manager', 'group_captain']" size="mini" type="primary">上传文件</el-button>
        </el-upload>

      </el-col>

      <el-col :span="10" />
    </el-row>
    <el-table
      :data="list.items"
      border
      style="width: 100%"
    >
      <el-table-column
        prop="id"
        label="ID"
      />
      <el-table-column
        prop="date"
        label="日期"
      />
      <el-table-column
        align="center"
        label="操作"
      >
        <template slot-scope="{row}">
          <el-button size="mini" @click="handleDetail(row)">
            查看
          </el-button>
        </template>

      </el-table-column>
    </el-table>
    <pagination
      :total="list.total"
      hide-on-single-page
      :page.sync="list.listQuery.page"
      :limit.sync="list.listQuery.limit"
      @pagination="getList"
    />

    <el-dialog
      title="详情"
      :visible.sync="detailDialogVisible"
      width="80%"
    >

      <el-table
        :data="detailList.items"
        border
        size="mini"
        max-height="500"
        style="width: 100%"
      >
        <el-table-column
          type="index"
          label="序号"
          width="50"
        />
        <el-table-column prop="title" label="科目" />
        <el-table-column prop="targetValue" label="目标">
          <!--          <template slot-scope="{row}">-->
          <!--            {{ row.targetValue }}-->
          <!--          </template>-->
        </el-table-column>
        <!--        <el-table-column prop="actualValue" label="实际" />-->
        <el-table-column prop="calculate" label="占比">
          <template slot-scope="{row}">
            {{ row.calculate }}
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="detailDialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import { fetchData } from '@/api/panel'
import Pagination from '@/components/Pagination'
// import { getData, standardize } from '@/utils/chart-data' // Secondary package based on el-pagination
import permission from '@/directive/permission/index.js'
import { getFullData } from '@/utils/dataProce_v1'
import { handleCalculate } from '@/utils/standardize'
export default {
  name: 'Objectives',
  components: { Pagination },
  directives: { waves, permission },
  filters: {},
  data() {
    return {
      fullData: {},
      currentView: {},
      temp: {
        year: 2020,
        month: '01'
      },
      projectId: this.$store.state.user.apiTemplate.projectId,
      listLoading: true,
      generateDialogVisible: false,
      detailDialogVisible: false,
      list: {
        items: [],
        total: 0,
        listQuery: {
          page: 1,
          limit: 20
        }
      },
      detailList: {
        items: [],
        total: 0,
        listQuery: {
          id: 0,
          page: 1,
          limit: 20
        }
      },

      fileList: []
    }
  },
  created() {
    this.getList()
    this.currentView = this.$store.state.options.views.find(item => item.name === 'view_calculate')
    console.log('currentView:', this.currentView)
    console.log(this.$store.state.options.API)
  },
  methods: {
    handleDetail(row) {
      this.detailList.listQuery.page = 1
      this.detailDialogVisible = true
      this.getDetail(row)
    },

    async getDetail(row) {
      // console.log(row)
      this.listLoading = true

      console.log('row:', row)
      const _g = this.$store.state.options.currentDashboard.defaultFilterOptionGroupValue
      this.currentView.query = {
        type: undefined,
        dateType: 'month',
        date: new Date(row.year, row.month - 1, 1),
        group: _g ? [_g] : []
      }

      // console.log('this.currentView:', this.currentView)
      this.fullData = await getFullData(this.currentView)
      // console.log('this.fullData.fillDate:', this.fullData.fillDate)

      this.detailList.items = []

      // actualValue 实际值 占比值，二者共用字段，需要靠科目名参数区分
      // targetValue 目标值
      this.fullData.fillDate.forEach(item => {
        let _date = {}
        // console.log('item:', item)
        const _pop = item.dimension[0].date.pop()
        if (_pop) _date = _pop
        _date.title = item.title
        _date.name = item.name
        this.detailList.items.push(_date)
      })

      this.detailList.items = handleCalculate(this.detailList.items)

      // console.log('this.detailList.items:', this.detailList.items)
    },

    getList() {
      this.listLoading = true
      const data = {
        'dir': 'Sample Reports/target',
        'projectId': this.$store.state.user.apiTemplate.projectId,
        'vf_id': 0,
        'vf_file': 'dashboard.efwvf'
      }
      return new Promise((resolve, reject) => {
        fetchData(data).then(response => {
          this.list.items = response
          console.log('this.list:', this.list)
        })
      })
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 10 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    handleSuccess(response) {
      this.getList()
      this.$message({
        message: '文件上传成功。',
        type: 'success'
      })
    },
    handleError(response) {
      this.$message({
        message: '文件上传失败',
        type: 'error'
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
