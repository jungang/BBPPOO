<template>
  <div class="app-container">
    <el-row type="flex" align="middle">
      <el-col :span="2" align="center">上传文件 </el-col>
      <el-col :span="15">
        <el-upload
          class="upload-demo"
          action="https://jsonplaceholder.typicode.com/posts/"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :before-remove="beforeRemove"
          multiple
          :limit="3"
          :on-exceed="handleExceed"
        >
          <el-button v-waves type="primary">点击上传</el-button>
        </el-upload>
      </el-col>
    </el-row>

    <el-row type="flex" justify="end">
      <el-button>
        添加
      </el-button>
    </el-row>

    <el-table
      :data="tableData"
      border
      style="width: 100%"
    >
      <el-table-column
        type="index"
        label="序号"
        align="center"
        width="50"
      />
      <el-table-column
        prop="date"
        label="数据项"
      />
      <el-table-column
        prop="name"
        label="类型"
      />
      <el-table-column
        align="center"
        label="操作"
        width="180"
      >

        <template>
          <el-button type="text" size="mini">
            编辑
          </el-button>
          <el-button type="text" size="mini">
            删除
          </el-button>
        </template>

      </el-table-column>
    </el-table>

  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive

export default {
  name: 'BaseConfig',
  components: { },
  directives: { waves },
  filters: {},
  data() {
    return {
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }]
    }
  },
  created() {},
  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    }
  }
}
</script>
