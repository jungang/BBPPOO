<template>
  <div class="zone-box">
    <Filters
      :query.sync="query"
      :multiple="true"
      :type="filterType"
      @filtration="handleFilter"
    />
    <el-row class="row-box" type="flex" justify="space-around">
      <Row
        v-for="item in rowView"
        :key="item.id"
        ref="component"
        :chart-barlen="chartBar"
        :data="item"
        :query="query"
      />
    </el-row>
    <el-tabs v-if="tabView.length > 0" v-model="tab1_activeName" type="border-card">
      <el-tab-pane
        v-for="item in tabView"
        :key="item.id"
        :label="item.config.tabTitle"
        :name="item.name"
      >
        <Tab
          ref="component"
          :data="item"
          :query="query"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Filters from '@/components/Filters'
import Row from '../panels/components/rows/row'
import Tab from '../panels/components/tabs/tab'
import { sortArray } from '../../utils/sortArray'
import _ from 'underscore'
export default {
  name: 'Quality',
  components: { Filters, Row, Tab },
  props: { },
  data() {
    return {
      rowView: [],
      tabView: [],
      chartBar: {
        len: 0
      },
      currentView: [],
      tab1_activeName: '',
      tab2_activeName: '',
      filterType: [
        {
          value: 'all',
          label: '合计'
        }, {
          value: 'group',
          label: '集团'
        }, {
          value: 'local',
          label: '本地'
        }
      ],
      query: {
        dateType: 'month', // 天 day | 周 week | 月 month | 年 year
        date: new Date(), // 日期20200501
        multiple: false,
        isStore: 'false',
        group: 'null', // 选择组信息
        type: this.$store.state.user.alias === 'ts' ? false : 'all' // 合集 all | 集团 group | 本地 local
      }
    }
  },
  computed: { },
  watch: { },
  created() {
    this.getCurrentView()
    this.defaultTab()
  },
  methods: {
    handleFilter() {
      this.$refs.component.forEach((item) => item.getData())
    },
    getCurrentView() {
      _.map(this.$store.state.options.views, (_val, _index, _list) => {
        if (_val.config.pagesName === this.$route.meta.title) {
          this.currentView.push(_val)
          if ((_val.config.indexType === 'rowIndex') && (_val.config.component.type === 'chart_bar')) {
            this.rowView.push(_val)
          }

          if ((_val.config.indexType === 'tabIndex') && (_val.config.component.type === 'chart_line')) {
            this.tabView.push(_val)
          }
        }
        return this.currentView
      })

      this.chartBar.len = this.rowView.length

      this.rowView = sortArray(this.rowView)
      this.tableView = sortArray(this.tableView)
    },
    defaultTab() {
      if (this.tabView.length > 0) {
        this.tab1_activeName = this.tabView[0].name
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .zone-box{
    padding: 15px;
    .filter-box{
      margin-top: 40px;
    }
    .row-box{
      margin-top: 30px;
      height: 300px
    }
    .table-box{
      margin-top: 20px;
    }
  }
</style>
