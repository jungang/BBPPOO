<template>
  <div class="app-container">
    <el-row type="flex" align="middle">
      <el-col :span="24" style="text-align: right">
        <el-button type="primary" @click="handleCalculate">开始计算</el-button>
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
      />
      <el-table-column
        prop="dateTime"
        label="导入时间"
      />
      <el-table-column
        align="center"
        label="操作"
        width="400"
      >
        <template>
          <el-button size="mini">
            上传
          </el-button>
          <el-button size="mini">
            下载
          </el-button>
          <el-button size="mini">
            导入模版
          </el-button>
          <el-button size="mini">
            删除
          </el-button>
        </template>

      </el-table-column>
    </el-table>

  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import { fetchList } from '@/api/management'

export default {
  name: 'Management',
  components: { },
  directives: { waves },
  filters: {},
  data() {
    return {
      temp: {},
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
  },

  methods: {
    handleCalculate() {
      console.log('handleCalculate...')
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
