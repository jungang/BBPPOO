<template>
  <div class="app-container">

    <el-row type="flex">
      <el-col :span="12">
        <h3>
          报表
        </h3>
      </el-col>
      <el-col :span="12" style="text-align: end">
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
        id: '00000000-0000-0000-0000-000000000000'
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
        projectId: '00000000-0000-0000-0000-000000000000',
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
            component: 'chartTable',
            parameters: {},
            width: 500,
            height: 500,
            viewName: 'profit_income_expanse'
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

          if (item.component === 'chartTable') {
            item.title = this.temp.title
          }
        })

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
      // console.log(item.id)
      this.$router.push('/panels/view/' + item.id)
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
        'projectId': '00000000-0000-0000-0000-000000000000',
        list: this.list.map(item => { return item.id })
      }
      saveQueue(data).then((res) => {
        this.$message({
          message: '报表顺序已更新。',
          type: 'success'
        })
      })
    },
    getList() {
      this.listLoading = true
      panelsFetchList(this.listQuery).then(response => {
        // this.list = response.data.items
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
