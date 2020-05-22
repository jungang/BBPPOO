<template>
  <div class="filters-container">
    <el-date-picker
      v-model="query.date"
      type="date"
      placeholder="选择日期"
      format="yyyy 年 MM 月 dd 日"
      style="width: 200px"
      @change="handleChange"
    />
    <el-select
      v-model="query.dateType"
      placeholder="请选择"
      style="width: 60px"
    >
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>

    <span v-if="query.group" style="margin-left: 20px">选择组织：</span>

    <el-cascader
      v-if="query.group"
      v-model="q"
      :options="qlist"
      style="width: 100px"
    />

    <!--
    <el-cascader
      v-if="query.group && props.multiple"
      v-model="query.group"
      :options="groupList"
      :props="props"
      collapse-tags
      style="width: 170px"
    />-->

    <el-cascader
      v-if="query.group && query.multiple"
      v-model="query.group"
      :options="employeeList"
      :props="props"
      collapse-tags
      style="width: 250px"
    />

    <el-cascader
      v-if="query.group && !query.multiple"
      v-model="query.group"
      :options="employeeList"
      show-all-levels
      :props="{ checkStrictly: true }"
    />

    <span v-if="query.type" style="margin-left: 20px">业务线条：</span>
    <el-select
      v-if="query.type"
      v-model="query.type"
      placeholder="请选择"
      style="width: 100px"
    >
      <el-option
        v-for="item in type"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    <el-button icon="el-icon-search" style="margin-left: 20px" @click="handleCurrentChange">查询</el-button>
  </div>
</template>

<script>

import { fetchData } from '@/api/panel'
import { deepClone, parseTime } from '@/utils'
import permission from '@/directive/permission/index.js'

export default {
  name: 'Filters',
  directives: { permission },
  props: {
    query: {
      type: Object,
      required: true
    },
    type: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      props: {
        multiple: this.query.multiple,
        checkStrictly: true
        // emitPath: false
      },
      options: [
        {
          value: 'daily',
          label: '日'
        }, {
          value: 'week',
          label: '周'
        }, {
          value: 'month',
          label: '月'
        },
        {
          value: 'year',
          label: '年'
        }
      ],
      q: 'wf',
      qlist: [{
        value: 'wf',
        label: '网服'
      }],
      groupList: [],
      employeeList: [],
      day: '',
      month: '',
      year: ''
    }
  },
  computed: {
  },
  mounted: function() {
    this.$nextTick(() => {
      this.handleChange()
    })
  },
  created() {
    // console.log('----query:', this.query)
    // this.getEmployee()
  },
  methods: {
    handleChange() {
      this.employeeList = []
      this.query.group = 'null'
      // console.log('handleChange...', this.query.date)
      this.month = +parseTime(this.query.date.getTime(), '{m}')
      this.year = parseTime(this.query.date.getTime(), '{y}')
      this.getEmployee()
    },
    getEmployee() {
      const data = {
        'dir': 'Sample Reports/employee',
        'projectId': this.$store.state.user.apiTemplate.projectId,
        'vf_id': 0,
        'month': this.month,
        'year': this.year,
        'vf_file': 'dashboard.efwvf'
      }
      fetchData(data).then(response => {
        // console.log('response:', response)

        // 构建组结构
        response.forEach(item => {
          const _v = this.groupList.find(group => group.label === item.v_group_name + '组')
          // console.log('_v:', _v)
          if (!_v) {
            this.groupList.push({
              type: 'group',
              v_project_work_id: item.v_project_work_id,
              value: item.v_group_name,
              label: item.v_group_name + '组'
            })
          }
        })
        // console.log('this.employeeList:', this.employeeList)

        this.employeeList = deepClone(this.groupList)

        // 构建人员
        response.forEach(item => {
          // console.log(item)
          const group = this.employeeList.find(group => group.label === item.v_group_name + '组')
          group.children = group.children || []
          group.children.push({
            v_project_work_id: item.v_project_work_id,
            value: item.v_project_work_id,
            label: item.v_name
          }
          )
        })

        // console.log('employeeList:', this.employeeList)
      })
    },
    handleCurrentChange(val) {
      this.$emit('filtration', { })
    }
  }
}
</script>

<style scoped>
.filters-container {
  background: #fff;
  text-align: left;
  padding: 0 0 10px 0 ;
}
</style>
