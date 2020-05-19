<template>
  <div class="table-container">
    <el-table
      :data="tableData"
      style="width: 100%;margin-bottom: 20px;"
      row-key="id"
      border
      default-expand-all
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column
        prop="date"
        label="名称"
        :min-width="50"
      />
      <el-table-column
        prop="name"
        label="目标（万元）"
        :min-width="25"
      />
      <el-table-column
        prop="address"
        label="实际（万元）"
        :min-width="25"
      />
    </el-table>
  </div>
</template>

<script>
import uuidv1 from 'uuid/v1'

export default {
  name: 'Table',
  components: { },
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      id: uuidv1(),
      tableData: [{
        id: 1,
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        id: 2,
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        id: 3,
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄',
        children: [{
          id: 31,
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        }, {
          id: 32,
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        }]
      }, {
        id: 4,
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }]
    }
  },
  watch: {
    data: {
      deep: true,
      handler() {
        this.formatDataSet(this.data)
        // this.options.dataset = this.data
      }
    }
  },
  created() {
    // console.log('this.data:', this.data)
  },
  mounted() {
    // this.renderChart()
  },
  methods: {
    formatDataSet(data) {
      // console.log('formatDataSet...')
      // console.log(data.data)
    }

  }
}

</script>

<style lang="scss">
  .charts-container{
    width: 100%;
    height: 30vh;
  }
</style>
