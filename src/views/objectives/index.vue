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

          <el-button v-waves type="primary">上传文件</el-button>
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
        <el-table-column prop="res_y_title" label="科目" />
        <el-table-column prop="res_y_value" label="金额">
          <template slot-scope="{row}">
            {{ row.res_y_value }}
          </template>
        </el-table-column>
        <el-table-column prop="res_y_zb_value" label="占比">
          <template slot-scope="{row}">
            {{ row.res_y_zb_value }}
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
import { getData, standardize } from '@/utils/chart-data' // Secondary package based on el-pagination

export default {
  name: 'BaseConfig',
  components: { Pagination },
  directives: { waves },
  filters: {},
  data() {
    return {
      currentView: {},
      temp: {
        year: 2020,
        month: '01'
      },
      projectId: '00000000-0000-0000-0000-000000000000',
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
    this.currentView = this.$store.state.options.views.find(item => item.name === 'monthly_items_list')
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

      const data = {
        _drillName: 'monthly_items_list',
        drillName: '',
        parameters: {
          year: row.year,
          month: row.month
        }
      }
      const mixed = standardize(await getData(this.currentView, data))
      console.log(mixed)
      this.detailList.items = []

      mixed.res_y.forEach((item, index) => {
        this.detailList.items.push({
          res_y_title: mixed.res_y[index].title,
          res_y_value: mixed.res_y[index].value,
          // res_y_zb_title: mixed.res_y_zb[index].title,
          res_y_zb_value: mixed.res_y_zb[index].value && mixed.res_y_zb[index].value + '%'
        })
      })
      // fetchDetail(this.detailList.listQuery).then(response => {
      //   this.detailList.items = response.data.items
      //   this.detailList.total = response.data.total
      //   this.listLoading = false
      // })
    },

    getList() {
      this.listLoading = true
      const data = {
        'dir': 'Sample Reports/target',
        'projectId': '00000000-0000-0000-0000-000000000000',
        'vf_id': 0,
        'vf_file': 'dashboard.efwvf'
      }
      return new Promise((resolve, reject) => {
        fetchData(data).then(response => {
          this.list.items = response
          console.log(this.list)
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
