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
      style="width: 60px; margin-left: 20px;"
    >
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>

    <span v-if="query.group" style="margin-left: 20px">{{ $store.state.user.apiTemplate.description }}队列 选择组织：</span>

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
      ref="cascader"
      v-model="query.group"
      :options="companyList"
      :props="props"
      collapse-tags
      clearable
      style="width: 250px;margin-left: 20px;"
    />

    <el-cascader
      v-if="query.group && !query.multiple"
      ref="cascader"
      v-model="query.group"
      :options="companyList"
      style="margin-left: 20px;"
      show-all-levels
      clearable
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
import { parseTime, unique } from '@/utils'
// import { deepClone, parseTime } from '@/utils'
import permission from '@/directive/permission/index.js'
// import store from '../../store'

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
      currentDashboard: {},
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
      companyList: [],
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
    this.currentDashboard = this.$store.state.options.currentDashboard
    console.log('currentDashboard:', this.currentDashboard)

    this.query.type = this.currentDashboard.defaultFilterOptionType
    // this.$store.state.options.filterOptions = this.currentDashboard.defaultFilterOptionType
    // console.log('this.query.type:', this.query.type)
    // console.log('this.query.group:', this.query.group)
    // console.log('typeof:', typeof this.query.group)
    // this.query.group = [currentDashboard.defaultFilterOptionGroupValue]
    // this.getEmployee()

    if (this.query.isStore === 'false') {
      this.query.date = this.$store.state.options.filterOptions.date
      // this.query.type = this.$store.state.options.filterOptions.type
      this.query.dateType = this.$store.state.options.filterOptions.dateType
      this.query.group = this.$store.state.options.filterOptions.group
    }

    // console.log('created....:')

    // todo setTimeout是待优化问题，需要修改以达到更准确的页面异步更新，
    setTimeout(() => {
      // console.log('setTimeout....:')
      this.handleCurrentChange()
    }, 3000)
  },
  methods: {
    handleChange() {
      // console.log('this.query:', this.query)
      // console.log('filterOptions:', this.$store.state.options.filterOptions)
      this.employeeList = []
      this.query.group = 'null'
      // console.log('handleChange...', this.query.date)
      if (this.query.isStore === 'true') {
        this.$store.dispatch('options/setFilterOptions', this.query)
      }
      this.month = +parseTime(this.query.date.getTime(), '{m}')
      this.year = parseTime(this.query.date.getTime(), '{y}')

      this.query.group = []

      this.getEmployee()
    },
    getEmployee() {
      const data = {
        'dir': 'Sample Reports/employee',
        'projectId': this.$store.state.user.apiTemplate.projectId,
        'vf_id': 2,
        'month': this.month,
        'year': this.year,
        'vf_file': 'dashboard.efwvf'
      }
      // console.log('data:', data)
      if (this.$store.state.user.apiTemplate.projectId === '00000000-0000-0000-0000-000000000000') {
        data.vf_id = 0
      }
      fetchData(data).then(response => {
        this.$store.dispatch('group/person', response)
        // console.log('response:', response)

        this.companyList = []
        // 构建公司结构（外包商）
        response.forEach(item => {
          // console.log('item.v_company:', item.v_company)
          const _v = this.companyList.find(company => company.label === item.v_company)
          // console.log('_v:', _v)
          if (!_v) {
            this.companyList.push({
              value: item.v_company,
              label: item.v_company,
              children: []
            })
          }
        })

        if (response.find(item => item.v_company === this.currentDashboard.defaultFilterOptionGroupValue)) {
          this.query.group.push(this.currentDashboard.defaultFilterOptionGroupValue)
        }

        // console.log('this.companyList:', this.companyList)

        // 构建组结构
        response.forEach(item => {
          if (item.v_group_name === 'Null') {
            // item.v_group_name = '未分'  // todo
          }

          // console.log('item.v_group_name:', item.v_group_name)
          const _company = this.companyList.find(company => company.label === item.v_company)
          const _v = _company.children.find(group => group.label === item.v_group_name + '组')
          if (!_v) {
            _company.children.push({
              type: 'group',
              v_project_work_id: item.v_project_work_id,
              value: item.v_group_name,
              label: item.v_group_name + '组',
              children: []
            })
          }
          // console.log('_v:', _v)
        })

        // console.log('response:', response)
        // 构建人员结构
        response.forEach(item => {
          const _company = this.companyList.find(company => company.label === item.v_company)
          // console.log(item)
          const _group = _company.children.find(group => group.label === item.v_group_name + '组')
          // console.log('_group:', _group)
          _group.children.push({
            v_project_work_id: item.v_project_work_id,
            value: item.v_project_work_id,
            label: item.v_name
          }
          )
        })

        this.$store.dispatch('group/employeelist', { list: this.companyList, res: response })
        // console.log(' this.companyList:', this.companyList)

        if (this.companyList.length > 0) {
          console.log('this.companyList.length:', this.companyList.length)
          // this.companyList.unshift({ label: '全台', value: 'all' })
        }

        // console.log('person:', this.$store.state.group.persons)
      })
    },
    handleCurrentChange(val) {
      this.query.group_all = this.getAll()
      console.log('this.query:', this.query)
      this.$emit('filtration', { })
    },

    handleGroup(data) {
      const res = []
      const all = { c: [], g: [], v: [] }
      // 分类 v_company v_group_name v_id

      data.forEach(item => {
        // console.log('item:', item)
        all.c.push({
          name: item.v_company,
          type: 'v_company'
        })
        all.g.push({
          name: item.v_group_name,
          type: 'v_group_name'
        })
        all.v.push({
          name: item.v_project_work_id,
          type: 'v_id'
        })
      })

      // 排重
      Object.keys(all).forEach((key) => {
        all[key] = unique(all[key])
        all[key].forEach(item => {
          // console.log('item:', item)
          res.push(
            { [item.type]: item.name }
          )
        })
      })

      // fix res undefined
      if (res.length <= 0)res.push({})

      return res
    },
    getAll() {
      // 不选 = 全台 = 所有人员
      let res = []
      let _data = []
      const group = this.$store.state.group.employeeList_res
      if (this.query.group.length <= 0) {
        // 未选即全部、全体成员
        res = this.handleGroup(group)
      } else if (!this.query.multiple) {
        switch (this.query.group.length) {
          case 1:
            _data = group.filter(item => item.v_company === this.query.group[0])
            res = this.handleGroup(_data)
            break
          case 2:
            _data = group.filter(item => item.v_group_name === this.query.group[1])
            res = this.handleGroup(_data)
            break
          case 3:
            res = [{ v_id: this.query.group[2] }]
            break
        }
      }
      return res
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
