<template>
  <div class="app-container">
    <el-table
      :data="list"
      style="width: 100%"
      :max-height="data.height-55"
    >
      <el-table-column
        prop="id"
        label="ID"
      />
      <el-table-column
        prop="title"
        label="标题"
      />
      <el-table-column
        prop="arg1"
        label="地址"
      />
      <el-table-column
        prop="arg1"
        label="地址"
      />
    </el-table>
  </div>
</template>

<script>

import { test } from '@/api/panel'

export default {
  name: 'ChartTable',
  components: {
  },
  props: {
    data: {
      type: Object,
      default: function() {
        return {}
      }
    },
    panel: {
      type: Object,
      default: function() {
        return {}
      }
    },
    view: {
      type: String,
      default: function() {
        return ''
      }
    }
  },
  data() {
    return {
      listLoading: true,
      list: [],
      timer: {}
    }
  },
  computed: {
  },
  watch: {
    data: {
      deep: true,
      handler() {
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          console.log('resize...')
          console.log(this.data)
          // this.chart.resize()
        }, 100)
      }
    }
  },
  created() {
    this.getList()
  },
  mounted() {},
  methods: {
    getList() {
      this.listLoading = true
      test().then(response => {
        console.log(response)
        this.list = response.data.items
        this.listLoading = false
      })
    }
  }
}

</script>

<style lang="scss" scoped>
  .app-container{
    padding: 40px 5px 5px 5px;
    height: 100%;
  }

</style>
