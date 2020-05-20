<template>
<div class="zone-box">
  <Filters
    :query.sync="query"
    :multiple="true"
    :type="filterType"
    @filtration="handleFilter"
  />
  <el-row class="row-box">
    <Row
      v-for="item in rowView"
      :key="item.id"
      ref="component"
      :data="item"
      :query="query"
    />
  </el-row>
  <el-tabs v-model="tab1_activeName" type="border-card">
    <el-tab-pane
      v-for="item in tabView"
      :key="item.id"
      :label="item.config.tabTitle"
      :name="item.name"
    >
      <Tab
        :data="item"
        ref="component"
        :query="query"
      />
    </el-tab-pane>
  </el-tabs>
</div>
</template>

<script>
  import Filters from '@/components/Filters';
  import Row from '../panels/components/rows/row';
  import Tab from '../panels/components/tabs/tab';
  import _ from "underscore";
  export default {
    name: 'page_zl',
    components: { Filters, Row, Tab},
    props: { },
    data() {
      return {
        rowView:[],
        tabView:[],
        currentView:[],
        tab1_activeName:'',
        tab2_activeName:'',
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
          }, {
            value: 'other',
            label: '其他'
          }
        ],
        query: {
          dateType: 'month', // 天 day | 周 week | 月 month | 年 year
          date: new Date(), // 日期20200501
          multiple: false,
          group: 'null', // 选择组信息
          type: 'all' // 合集 all | 集团 group | 本地 local
        }
      }
    },
    computed: { },
    watch: { },
    created() {
      this.getCurrentView();
      this.defaultTab();
    },
    methods: {
      handleFilter() {
        this.$refs.component.forEach((item) => item.getData())
      },
      getCurrentView(){
        _.map(this.$store.state.options.views,(_val, _index,_list) => {
          if(_val.config.pagesName == this.$route.name){
            this.currentView.push(_val);
            if((_val.config.indexType == 'rowIndex') && (_val.config.component.type == 'chart_bar')){
              this.rowView.push(_val)
            }

            if((_val.config.indexType == 'tabIndex') && (_val.config.component.type == 'chart_line')){
              this.tabView.push(_val)
            }
          }
          return this.currentView;
        });

        //console.log('currentView=>',JSON.stringify(this.currentView))
        //console.log('rowView=>',this.rowView)
        //console.log('tabView=>',this.tabView)
      },
      defaultTab(){
        this.tab1_activeName = this.tabView[0].name;
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
    }
    .table-box{
      margin-top: 20px;
    }
  }
</style>
