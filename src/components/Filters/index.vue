<template>
  <div class="filters-container">
    <el-date-picker
      v-model="query.date"
      type="date"
      placeholder="选择日期"
      format="yyyy 年 MM 月 dd 日"
      value-format="yyyyMMdd"
      style="width: 200px"
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

    <span style="margin-left: 20px">选择组织：</span>

    <el-cascader
      v-model="query.group"
      :options="employeeList"
      show-all-levels
      :props="{ checkStrictly: true }"
      clearable
    />

    <span style="margin-left: 20px">业务线条：</span>
    <el-select v-model="query.type" placeholder="请选择">
      <el-option
        v-for="item in options3"
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

export default {
  name: 'Filters',
  props: {
    query: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      options: [
        {
          value: 'day',
          label: '日'
        }, {
          value: 'week',
          label: '周'
        }, {
          value: 'month',
          label: '月'
        }, {
          value: 'year',
          label: '年'
        }
      ],
      employeeList: [],
      options3: [
        {
          value: 'all',
          label: '合计'
        }, {
          value: 'group',
          label: '集团'
        }, {
          value: 'local',
          label: '本地'
        }],
      value3: ''
    }
  },
  computed: {
  },
  created() {
    console.log('----query:', this.query)
    this.getEmployee()
  },
  methods: {
    getEmployee() {
      const data = {
        'dir': 'Sample Reports/employee',
        'projectId': '00000000-0000-0000-0000-000000000000',
        'vf_id': 1,
        'vf_file': 'dashboard.efwvf'
      }
      fetchData(data).then(response => {
        const _list = {
          value: 'wf',
          label: '网服',
          children: []
        }

        // 构建组结构
        response.forEach(item => {
          const _v = _list.children.find(group => group.label === item.v_group_name)
          if (!_v) {
            _list.children.push({
              type: 'group',
              v_project_work_id: item.v_project_work_id,
              value: item.v_group_name,
              label: item.v_group_name,
              children: []
            })
          }
        })

        // 构建人员
        response.forEach(item => {
          console.log(item)
          const group = _list.children.find(group => group.label === item.v_group_name)
          group.children.push({
            v_project_work_id: item.v_project_work_id,
            value: item.v_name,
            label: item.v_name
          }
          )
        })

        this.employeeList.push(_list)
        console.log('employeeList:', this.employeeList)
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
