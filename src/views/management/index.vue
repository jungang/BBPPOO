<template>
  <div class="app-container">
    <el-row type="flex" align="middle">

      <el-col :span="18">
        <el-select v-model="temp.year" class="filter-item" placeholder="请选择">
          <el-option v-for="item in $store.state.options.dateValueYear" :key="item.key" :label="item.label" :value="item.key" />
        </el-select>
        <el-select v-model="temp.month" class="filter-item" placeholder="请选择" @change="getList">
          <el-option v-for="item in $store.state.options.dateValueMonth" :key="item.key" :label="item.label" :value="item.key" />
        </el-select>
      </el-col>

      <el-col :span="6" style="text-align: right">
        <el-button type="primary" :disabled="calstatusPending" @click="handleCalculate">
          {{ calstatusPending?"计算进行中...":"开始计算" }}
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
        prop="name"
        label="数据表名称"
      />
      <el-table-column
        prop="status"
        label="导入状态"
      >
        <template slot-scope="{row}">
          {{ row.status | statusFilter }}
        </template>

      </el-table-column>
      <el-table-column
        prop="occurTime"
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
              fileName:row.name,
              projectId,
              refresh:true,
              batch:temp.year + temp.month}"
            :show-file-list="false"
            :action="this.$store.state.options.API+'/upload/all'"
            :on-success="handleSuccess"
            :on-error="handleError"
            :auto-upload="true"
            style="width: 60px;display: inline-block;"
          >
            <el-button size="mini" type="primary" @click="curRowIndex=row.$index">上传</el-button>
            <!--            /*主要特别注意这里新增的@click方法将当前的index值赋值一个变量，否则无法获取到对应的行信息*/-->
          </el-upload>

          <a v-if="!row.id" href="javascript:void(0)">
            <el-button v-if="!row.id" size="mini" disabled>
              下载
            </el-button>
          </a>

          <a v-if="row.id" :href="this.$store.state.options.API+'/excel/download?id='+row.id">
            <el-button size="mini">
              下载
            </el-button>
          </a>

          <a href="javascript:void(0)">
            <el-button size="mini" disabled>
              导入模版
            </el-button>
          </a>
          <el-button size="mini" :disabled="row.status === 0" @click="handleDelete(row)">
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
        0: '待上传',
        1: '上传但是不能导入',
        2: '上传并且导入成功但尚未开始计算',
        3: '上传并且计算成功',
        4: '上传但是计算失败'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      timer: {},
      calstatusPending: false, // false 未在计算中 ，true 正在计算中
      pageClick: false, // 手动开始计算
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
          projectId: '00000000-0000-0000-0000-000000000000',
          batch: ''
        }
      }
    }
  },
  created() {
    this.getList()
    this.getStatus()
  },

  methods: {
    start() {
      this.timer = setInterval(() => {
        this.getStatus()
      }, 3000)
    },

    handleFilter() {
      console.log('handleFilter...')
    },
    getStatus() {
      fetchStatus().then((res) => {
        this.calstatusPending = res.data
        // console.log('this.calstatusPending:', this.calstatusPending)
        if (!this.calstatusPending) {
          clearInterval(this.timer)
        } else {
          clearInterval(this.timer)
          this.start()
        }

        if (res.data) {
          // console.log('正在计算中。。')
        } else {
          clearInterval(this.timer)
          if (this.pageClick) {
            this.$message({
              message: '计算完成。',
              type: 'success'
            })
            this.getList()
            this.$confirm('计算完成。', '提示', {
              confirmButtonText: '查看详情',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              console.log('跳转。。。')
              this.$router.push('/panels/list') // 跳转到指定页面
            }).catch(() => {})
          }
        }
      })
    },

    handleCalculate() {
      this.calstatusPending = true
      this.pageClick = true
      calculate({ projectId: this.projectId, batch: this.temp.year + this.temp.month, refresh: true }).then((res) => {
        this.getStatus()
        this.$message({
          message: '已经开始计算。。。',
          type: 'info'
        })
      }).catch(() => {
        this.$message({
          message: '未能开始计算',
          type: 'error'
        })
      })
    },

    handleDelete(row) {
      this.$confirm('删除 ' + row.name, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          actionDelete({ id: row.id }).then((res) => {
            this.getList()
          })
          this.$message({
            type: 'success',
            message: '完成删除。'
          })
        })
        .catch(err => { console.error(err) })
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
      this.list.listQuery.batch = this.temp.year + this.temp.month
      fetchList(this.list.listQuery).then(response => {
        this.list.items = response.data
        // this.list.total = response.data.total
        this.listLoading = false
      })
    }

  }
}
</script>
