<template>
  <div class="app-container">

    <el-row type="flex">
      <el-col :span="12">
        <h3>
          报表
        </h3>
      </el-col>
      <el-col :span="12" style="text-align: end">
        <!--<el-button type="primary" @click="sortRest">手动排序</el-button>-->
        <el-button type="primary" @click="handleCreate">生成报表</el-button>
      </el-col></el-row>

    <draggable
      v-model="list"
      class="list-group"
      tag="ul"
      v-bind="dragOptions"
      @start="drag = true"
      @end="onEnd"
    >
      <transition-group type="transition" :name="!drag ? 'flip-list' : null">
        <li
          v-for="(element, index) in list"
          :key="element.id"
          class="list-group-item"
          @click="toDetail(element)"
        >
          <span>{{ element.title }}</span>
          <el-button
            class="btn-delete"
            type="danger"
            size="mini"
            icon="el-icon-delete"
            circle
            @click.stop="handleDelete(element,index)"
          />
        </li>
      </transition-group>
    </draggable>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="30%" style="width: 100%;">

        <el-form-item label="是否生成自定义报表：" prop="isCreate">
          <el-switch
            v-model="temp.isCreate"
          />
        </el-form-item>

        <el-form-item label="年份：" prop="year">
          <el-select v-model="temp.year" class="filter-item" placeholder="请选择">
            <el-option v-for="item in $store.state.options.dateValueYear" :key="item.key" :label="item.label" :value="item.key" />
          </el-select>
        </el-form-item>

        <el-form-item label="选择生成对象：" prop="dateType">
          <el-select v-model="temp.dateType" class="filter-item" placeholder="请选择" @change="temp.dateValue = ''">
            <el-option v-for="item in $store.state.options.dateType" :key="item.key" :label="item.label" :value="item.key" />
          </el-select>
        </el-form-item>

        <el-form-item label="选择生成维度：" prop="dateValue">

          <el-select v-if="temp.dateType==='month'" v-model="temp.dateValue" class="filter-item" placeholder="请选择">
            <el-option
              v-for="item in monthOptions"
              :key="item.key"
              :label="item.label"
              :value="item.key"
              :disabled="item.disabled"
            />
          </el-select>

          <el-select v-if="temp.dateType==='day'" v-model="temp.dateValue" class="filter-item" placeholder="请选择">
            <el-option v-for="item in $store.state.options.dateValueDay" :key="item.key" :label="item.label" :value="item.key" />
          </el-select>

        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确定
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
// import { fetchList } from '@/api/article'
import { panelsFetchList, createPanel, deletePanel, saveQueue } from '@/api/panels'
import { sortUtil } from '@/utils/SortUtil'
import uuidv1 from 'uuid/v1'
import draggable from 'vuedraggable'

export default {
  name: 'PanelList',
  components: {
    draggable
  },
  data() {
    return {
      monthOptions: [],
      drag: false,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        id: this.$store.state.user.apiTemplate.projectId
      },
      statusOptions: ['day', 'month', 'year'],
      temp: {
        id: undefined,
        title: '一月',
        isCreate: false,
        year: 2020,
        dateType: 'day',
        dateValue: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '生成报表'
      },
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        dateValue: [{ required: true, message: '请选择', trigger: 'blur' }]
      }
    }
  },
  computed: {
    dragOptions() {
      return {
        animation: 200,
        group: 'description',
        disabled: false,
        ghostClass: 'ghost'
      }
    }
  },
  created() {
    this.getList()
    // console.log(this.$store.state)
  },
  methods: {
    month() {
      console.log('month...')
      console.log(this.list)
      this.monthOptions = [...this.$store.state.options.dateValueMonth]
      this.monthOptions.forEach(item => {
        // console.log(this.list)
        item.disabled = !!this.list.find(item2 => parseInt(item2.dateValue) === item.num)
      })
    },
    resetTemp() {
      this.temp = {
        id: uuidv1(),
        title: '一月',
        isCreate: false,
        year: 2020,
        dateType: 'month',
        dateValue: '',
        projectId: this.$store.state.user.apiTemplate.projectId,
        'list': [
          {
            id: uuidv1(),
            title: '利润分析',
            type: 'def',
            component: 'charts',
            parameters: {},
            width: 500,
            height: 500,
            viewName: 'profit_income_expanse'
          },
          {
            id: uuidv1(),
            title: '表格',
            type: 'def',
            component: 'tabular',
            parameters: {},
            width: 500,
            height: 500,
            viewName: 'monthly_items_list'
          }
        ]
      }
    },
    handleCreate() {
      this.resetTemp()
      this.month()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        this.temp.title = this.$store.state.options.dateValueMonth.find(item => { return item.key === this.temp.dateValue }).label
        this.temp.list.forEach(item => {
          item.parameters.month = this.temp.dateValue
          item.parameters.year = this.temp.year
          if (item.component === 'tabular') {
            item.title = this.temp.title
          }
        })

        // nsdh
        console.log(this.temp)
        console.log(this.$store.state.options.views)
        this.temp.list = []
        this.$store.state.options.views.forEach(item => {
          if (item.show) { // todo 判读缺省 item.default_show
            // console.log(item)
            /*        this.temp.list.push({
              id: uuidv1(),
              chartId: uuidv1(),
              title: item.title,
              panelTitle: item.title,
              type: 'def',
              component: item.style, // 'tabular' | chart,
              parameters: {
                month: this.temp.dateValue,
                year: this.temp.year
              },
              width: 1000,
              height: 500,
              viewName: item.name
            })*/
            this.temp.list = [{
              id: uuidv1(),
              type: 'def',
              title: '当月利润分析',
              width: 500,
              height: 500,
              chartId: uuidv1(),
              indexId: uuidv1(),
              viewName: 'profit_income_expanse',
              component: 'chart',
              panelTitle: '当月利润分析',
              parameters: {
                year: 2020,
                month: '01'
              }
            }, {
              id: uuidv1(),
              type: 'def',
              title: '本年累计利润分析',
              width: 500,
              height: 500,
              chartId: uuidv1(),
              indexId: uuidv1(),
              viewName: 'profit_income_expanse_ytd',
              component: 'chart',
              panelTitle: '本年累计利润分析',
              parameters: {
                year: 2020,
                month: '01'
              }
            }, {
              id: uuidv1(),
              type: 'def',
              title: '月度预实一览表',
              width: 1020,
              height: 500,
              chartId: uuidv1(),
              indexId: uuidv1(),
              viewName: 'monthly_items_list',
              component: 'tabular',
              panelTitle: '月度预实一览表',
              parameters: {
                year: 2020,
                month: '01'
              }
            }]
          }
        })

        console.log(this.temp)
        // 生成
        if (valid) {
          createPanel(this.temp).then(() => {
            // this.getList()
            this.list.unshift(this.temp) // 插入数组

            this.onEnd()
            this.dialogFormVisible = false
            this.$notify({
              title: '完成',
              message: '创建完成',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    toDetail(item) {
      // console.log('xxx')
      console.log(item)
      this.$router.push({ path: '/panels/view/' + item.id, query: { month: item.dateValue }})
    },
    handleDelete(item, index) {
      this.$confirm('删除' + item.title, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          deletePanel(item.id).then((res) => {
            console.log(res)
          })
          this.list.splice(index, 1)
          this.$message({
            type: 'success',
            message: '完成删除。'
          })
        })
        .catch(err => { console.error(err) })
    },
    onEnd() {
      this.drag = false
      const data = {
        'projectId': this.$store.state.user.apiTemplate.projectId,
        list: this.list.map(item => { return item.id })
      }

      saveQueue(data).then((res) => {
        this.$message({
          message: '报表顺序已更新。',
          type: 'success'
        })
      })
    },
    // 正叙倒叙排列
    sortRest() {
      // DESC
      this.drag = true
      const datarest = {
        'projectId': this.$store.state.user.apiTemplate.projectId,
        list: sortUtil(this.list, 'dateValue', 'ASC').map(item => { return item.id })
      }
      saveQueue(datarest).then((res) => {
        this.$message({
          message: '报表顺序已更新。',
          type: 'success'
        })
      })
    },
    getList() {
      this.listLoading = true
      panelsFetchList(this.listQuery).then(response => {
        this.list = response.data
        this.total = response.data.total
        this.listLoading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .button {
    margin-top: 35px;
  }
  .flip-list-move {
    transition: transform 0.5s;
  }
  .no-move {
    transition: transform 0s;
  }
  .ghost {
    opacity: 0.5;
    background: #c8ebfb;
  }
  .list-group {
    min-height: 20px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    span{
      width: 100%;
    }
  }
  .list-group-item{
    cursor: pointer;
    display: inline-block;
    text-align: center;
    width: 150px;
    height: 200px;
    background: white;
    position: relative;
    border-radius: 20px;
    border: 1px solid #cecece;
    margin: 12px 12px 0 0;
    transition: background 1s;
    padding-top: 90px;

  }
  .btn-delete{
    opacity: 0;
    border: none;
    background: gray;
    position: absolute;
    bottom: 5px;
    right: 5px;
    transition: opacity 1s;
  }
  .btn-delete:hover{
    background: red;
  }
  .list-group-item:hover .btn-delete{
    opacity: 1;
    transition: opacity 0.1s;
  }
</style>
