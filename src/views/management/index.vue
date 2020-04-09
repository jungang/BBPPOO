<template>
  <div class="app-container">
    <el-row type="flex" align="middle">

      <el-col :span="18">
        <el-select v-model="temp.year" class="filter-item" placeholder="请选择">
          <el-option v-for="item in $store.state.options.dateValueYear" :key="item.key" :label="item.label" :value="item.key" />
        </el-select>
        <el-select v-model="temp.month" class="filter-item" placeholder="请选择">
          <el-option v-for="item in $store.state.options.dateValueMonth" :key="item.key" :label="item.label" :value="item.key" />
        </el-select>
      </el-col>

      <el-col :span="6" style="text-align: right">
        <el-button type="primary" :disabled="calstatus" @click="handleCalculate">
          {{ calstatus?"计算进行中...":"开始计算" }}
        </el-button>
      </el-col>
    </el-row>

    <el-table
      :data="list.items"
      border
    >
      <el-table-column
        type="index"
        label="序号"
        width="50"
      />
      <el-table-column
        prop="title"
        label="数据表名称"
      />
      <el-table-column
        prop="status"
        label="导入状态"
      >
        <template slot-scope="{row}">
          {{ row.status | statusFilter }}

          <p v-if="row.errorInfo">
            {{ row.errorInfo }}

          </p>
        </template>

      </el-table-column>
      <el-table-column
        prop="dateTime"
        label="导入时间"
      />
      <el-table-column
        align="center"
        label="操作"
        width="400"
      >
        <template slot-scope="{row}">

          <el-upload
            ref="upload"
            :data="{
              id:row.id,
              fileName:row.title,
              projectId,
              batch:temp.year + temp.month}"
            :show-file-list="false"
            action="http://39.98.167.246:8096/upload/all"
            :on-success="handleSuccess"
            :on-error="handleError"
            :auto-upload="true"
            style="width: 60px;display: inline-block;"
          >
            <el-button size="mini" @click="curRowIndex=row.$index">上传</el-button>
            <!--            /*主要特别注意这里新增的@click方法将当前的index值赋值一个变量，否则无法获取到对应的行信息*/-->
          </el-upload>

          <a href="./data_prep.xlsx">
            <el-button size="mini">
              下载
            </el-button>
          </a>

          <a href="./data_prep.xlsx">
            <el-button size="mini">
              导入模版
            </el-button>
          </a>
          <el-button size="mini" @click="handleDelete(row)">
            删除
          </el-button>
        </template>

      </el-table-column>
    </el-table>

  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import { fetchList, actionDelete, fetchStatus } from '@/api/management'
import { calculate } from '@/api/objectives'

export default {
  name: 'Management',
  components: { },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        success: '导入成功',
        error: '导入失败',
        noFile: '待上传'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      calstatus: false,
      uploadUrl: '',
      projectId: '00000000-0000-0000-0000-000000000000',
      curRowIndex: null,
      temp: {
        year: 2020,
        month: '01'
      },
      listLoading: true,
      list: {
        items: [],
        total: 0,
        listQuery: {
          page: 1,
          limit: 20,
          projectId: '00000000-0000-0000-0000-000000000000'
        }
      }
    }
  },
  created() {
    this.getList()
    this.getStatus()
  },

  methods: {
    getStatus() {
      fetchStatus().then((res) => {
        this.calstatus = res.content
      })
    },
    handleDelete(row) {
      this.$confirm('删除' + row.title, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          actionDelete(row.title).then((res) => {
            this.getList()
          })
          this.$message({
            type: 'success',
            message: '完成删除。'
          })
        })
        .catch(err => { console.error(err) })
    },

    handleCalculate() {
      this.calstatus = true
      calculate({ projectId: this.projectId, batch: this.temp.year + this.temp.month, refresh: true }).then((res) => {
        this.getStatus()
      }).catch(() => {
        this.$message({
          message: '未能开始计算',
          type: 'error'
        })
      })
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
    },
    getList() {
      this.listLoading = true
      fetchList(this.list.listQuery).then(response => {
        this.list.items = response.data.items
        this.list.total = response.data.total
        this.listLoading = false
      })
    }

  }
}
</script>
