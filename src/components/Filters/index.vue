<template>
  <div class="filters-container">
    <el-date-picker
      v-if="params.dateType==='day'"
      v-model="params.date"
      type="date"
      size="mini"
      placeholder="选择日期"
      style="width: 150px"
      @change="handleCurrentChange"
    />
    <el-date-picker
      v-if="params.dateType==='week'"
      v-model="params.week"
      type="week"
      size="mini"
      format="yyyy 第 WW 周"
      placeholder="选择周"
      style="width: 150px"
      @change="handleCurrentChange"
    />
    <el-date-picker
      v-if="params.dateType==='month'"
      v-model="params.month"
      type="month"
      size="mini"
      placeholder="选择月"
      style="width: 150px"
      @change="handleCurrentChange"
    />
    <el-date-picker
      v-if="params.dateType==='year'"
      v-model="params.year"
      type="year"
      size="mini"
      placeholder="选择年"
      style="width: 150px"
      @change="handleCurrentChange"
    />
    <el-select
      v-model="params.dateType"
      placeholder="请选择"
      size="mini"
      style="width: 60px"
    >
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>

    选择组织：

    <el-cascader
      :options="options2"
      :props="{ checkStrictly: true }"
      clearable
    />

  </div>
</template>

<script>

export default {
  name: 'Filters',
  props: {
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
      options2: [
        {
          value: 'zhinan',
          label: '网服',
          children: [{
            value: 'shejiyuanze',
            label: '刘组',
            children: [{
              value: 'yizhi',
              label: '刘1'
            }, {
              value: 'fankui',
              label: '刘3'
            }, {
              value: 'xiaolv',
              label: '刘4'
            }, {
              value: 'kekong',
              label: '刘5'
            }]
          }, {
            value: 'daohang',
            label: '李组',
            children: [{
              value: 'cexiangdaohang',
              label: '李1'
            }, {
              value: 'dingbudaohang',
              label: '李2'
            }]
          }]
        }
      ],
      params: {
        dateType: 'day',
        date: '',
        week: '',
        month: '',
        year: ''
      }
    }
  },
  computed: {
  },
  methods: {
    handleSizeChange(val) {
      this.$emit('filtration', { })
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
