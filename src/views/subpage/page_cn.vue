<template>
  <div class="zone-box">
    <Filters
      v-if="contrastView.length > 0"
      :query.sync="querycn"
      :multiple="true"
      :type="filterType"
      class="filter-box"
      @filtration="handleDBFilter"
    />
    <el-row v-if="contrastView.length > 0" type="flex" justify="space-around">
      <RowBox
        v-for="item in contrastView"
        :key="item.id"
        ref="componentdb"
        :data="item"
        :query="querycn"
      />
    </el-row>
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
    <el-tabs v-model="tab1_activeName" type="border-card">
      <el-tab-pane
        v-for="item in trendChartLineView"
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
    <Filters
      v-if="comparisonChartLineView.length > 0"
      :query.sync="querycn"
      :multiple="true"
      :type="filterType"
      class="filter-box"
      @filtration="handleCNFilter"
    />
    <el-tabs v-if="comparisonChartLineView.length > 0" v-model="tab2_activeName" type="border-card" class="table-box">
      <el-tab-pane
        v-for="item in comparisonChartLineView"
        :key="item.id"
        :label="item.title"
        :name="item.name"
      >
        <Tab
          ref="componentcn"
          :data="item"
          :query="querycn"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Filters from '@/components/Filters'
import Row from '../panels/components/rows/row'
import RowBox from '../panels/components/rows/rowbox'
import Tab from '../panels/components/tabs/tab'
import { sortArray } from '../../utils/sortArray'
import _ from 'underscore'
export default {
  name: 'Capacity',
  components: { Filters, Row, Tab, RowBox },
  props: { },
  data() {
    return {
      rowView: [],
      chartBar: {
        len: 0
      },
      trendChartLineView: [],
      comparisonChartLineView: [],
      contrastView: [],
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
        group: 'null', // 选择组信息
        isStore: 'false',
        type: this.$store.state.user.alias === 'ts' ? false : 'all' // 合集 all | 集团 group | 本地 local
      },
      querycn: {
        dateType: 'month', // 天 day | 周 week | 月 month | 年 year
        date: new Date(), // 日期20200501
        multiple: true,
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
    handleCNFilter() {
      this.$refs.componentcn.forEach((item) => item.getData())
    },
    handleDBFilter() {
      this.$refs.componentdb.forEach((item) => item.getData())
    },
    getCurrentView() {
      _.map(this.$store.state.options.views, (_val, _index, _list) => {
        if (_val.config.pagesName === this.$route.meta.title) {
          this.currentView.push(_val)
          if ((_val.config.indexType === 'rowIndex') && (_val.config.component.type === 'chart_bar' && (_val.config.zoneName === 'trend'))) {
            this.rowView.push(_val)
          }

          if ((_val.config.indexType === 'tabIndex') && (_val.config.component.type === 'chart_line' && (_val.config.zoneName === 'trend'))) {
            this.trendChartLineView.push(_val)
          }

          if ((_val.config.indexType === 'tabIndex') && (_val.config.component.type === 'chart_line') && (_val.config.zoneName === 'comparison')) {
            this.comparisonChartLineView.push(_val)
          }
          if ((_val.config.indexType === 'rowIndex') && (_val.config.component.type === 'chart_bar_duibi') && (_val.config.zoneName === 'contrast')) {
            this.contrastView.push(_val)
          }
        }
        return this.currentView
      })

      // console.log('currentView=>',this.currentView)
      // console.log('rowView=>',this.rowView)
      // console.log('trendChartLineView=>',this.trendChartLineView)
      // console.log('contrastView=>', this.contrastView)

      this.chartBar.len = this.rowView.length

      this.rowView = sortArray(this.rowView)
      this.trendChartLineView = sortArray(this.trendChartLineView)
      this.comparisonChartLineView = sortArray(this.comparisonChartLineView)
    },
    defaultTab() {
      if (this.trendChartLineView.length > 0) {
        this.tab1_activeName = this.trendChartLineView[0].name
      }

      if (this.comparisonChartLineView.length > 0) {
        this.tab2_activeName = this.comparisonChartLineView[0].name
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
    .row-box2{
      margin-top: 30px;
      height: 35vh
    }
    .row-box3{
      margin-top: 30px;
      height: 75vh
    }
    .table-box{
      margin-top: 20px;
    }
  }
</style>
