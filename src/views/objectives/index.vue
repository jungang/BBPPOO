<template>
  <div class="app-container">
    <el-row type="flex" align="middle">
      <el-col :span="15">
        <el-upload
          class="upload-demo"
          action="/dev-api/objectives/upload"
          :show-file-list="false"
          multiple
          :limit="10"
          :on-exceed="handleExceed"
          :on-success="handleSuccess"
        >
          <el-button v-waves type="primary">上传文件</el-button>
        </el-upload>

      </el-col>
    </el-row>

    <el-table
      v-if="fileList.length > 0"
      :data="fileList"
      border
      size="mini"
      style="width: 100%"
    >
      <el-table-column
        prop="id"
        label="ID"
        width="200"
      />
      <el-table-column
        prop="fileName"
        label="文件名"
        width="200"
      />
      <el-table-column
        align="center"
        label="操作"
        width="180"
      >
        <template slot-scope="{row}">
          <el-button size="mini" @click="openGenerate(row)">
            生成目标
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-table
      :data="list.items"
      border
      style="width: 100%"
    >
      <el-table-column
        prop="id"
        label="ID"
        width="200"
      />
      <el-table-column
        prop="date"
        label="日期"
        width="200"
      />
      <el-table-column
        align="center"
        label="操作"
        width="180"
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
      title="目标"
      :visible.sync="generateDialogVisible"
      width="30%"
    >
      <el-form ref="dataForm" :model="temp" label-position="right" label-width="30%" style="width: 100%;">
        <el-form-item label="选择年：">
          <el-select v-model="temp.year" class="filter-item" placeholder="请选择">
            <el-option v-for="item in $store.state.options.dateValueYear" :key="item.key" :label="item.label" :value="item.key" />
          </el-select>
        </el-form-item>

        <el-form-item label="选择月：">
          <el-select v-model="temp.month" class="filter-item" placeholder="请选择">
            <el-option v-for="item in $store.state.options.dateValueMonth" :key="item.key" :label="item.label" :value="item.key" />
          </el-select>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="generateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleGenerate">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="详情"
      :visible.sync="detailDialogVisible"
      width="80%"
    >

      <el-table
        :data="detailList.items"
        border
        size="mini"
        max-height="400"
        style="width: 100%"
      >
        <el-table-column
          prop="id"
          label="ID"
          width="200"
        />
        <el-table-column
          prop="date"
          label="日期"
        />
        <el-table-column prop="arg1" label="数据" />
        <el-table-column prop="arg2" label="数据" />
        <el-table-column prop="arg3" label="数据" />
        <el-table-column prop="arg4" label="数据" />
        <el-table-column prop="arg5" label="数据" />
      </el-table>
      <pagination
        :total="detailList.total"
        hide-on-single-page
        :page.sync="detailList.listQuery.page"
        :limit.sync="detailList.listQuery.limit"
        @pagination="getDetail"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="detailDialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import { fetchFileList, generate, fetchList, fetchDetail } from '@/api/objectives'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'BaseConfig',
  components: { Pagination },
  directives: { waves },
  filters: {},
  data() {
    return {
      temp: {},
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
    this.getFileList()
    this.getList()
  },

  methods: {
    handleDetail(row) {
      console.log(row)
      this.detailList.listQuery.id = row.id
      this.detailList.listQuery.page = 1
      this.getDetail()
      this.detailDialogVisible = true
    },

    getDetail() {
      this.listLoading = true
      fetchDetail(this.detailList.listQuery).then(response => {
        this.detailList.items = response.data.items
        this.detailList.total = response.data.total
        this.listLoading = false
      })
    },

    getList() {
      this.listLoading = true
      fetchList(this.list.listQuery).then(response => {
        this.list.items = response.data.items
        this.list.total = response.data.total
        this.listLoading = false
      })
    },
    restTemp() {
      return {
        year: 2020,
        month: 1
      }
    },
    openGenerate(row) {
      this.temp = { ...this.restTemp(), ...row }
      this.generateDialogVisible = true
    },
    handleGenerate() {
      generate(this.temp).then((res) => {
        this.$notify({
          title: '完成',
          message: '生成目标完成',
          type: 'success'
        })
        this.getFileList()
        this.generateDialogVisible = false
      })
    },
    getFileList() {
      fetchFileList().then((res) => {
        this.fileList = [...res.data]
      })
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 10 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    handleSuccess(response) {
      this.getFileList()
      this.$message({
        message: '文件上传成功。',
        type: 'success'
      })
    }
  }
}
</script>
