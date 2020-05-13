<template>
  <!--  <div class="card-container">-->
  <el-card
    class="card"
    shadow="hover"
  >
    <div
      slot="header"
      class="clearfix title"
    >
      {{ data.title }}
    </div>
    <List :data="cardData.list" />
    <chartLine :data="cardData.dataSet" />
  </el-card>
<!--  </div>-->
</template>

<script>

import { getFullData } from '@/utils/dataProce_v1'
import List from './list'
import chartLine from '../charts/chartLine_v1'

export default {
  name: 'Card',
  components: { List, chartLine },
  directives: { },
  props: {
    data: {
      type: Object,
      default: function() {
        return {
          name: 'default'
        }
      }
    },
    query: {
      type: Object,
      default: function() {
        return { }
      }
    }
  },
  data() {
    return {
      currentView: {},
      cardData: {
        list: [],
        dataSet: {}
      }
    }
  },
  watch: { },
  created() {
    this.currentView = this.$store.state.options.views.find(item => item.name === this.data.viewName)
    this.getData()
  },
  mounted() {
  },
  methods: {
    async getData() {
      console.log('currentView:', this.currentView)
      console.log('query:', this.query)
      this.currentView.drill_name = this.data.title
      this.currentView.drill_drillName = this.data.title
      this.currentView.drill__drillName = this.data.viewName
      this.currentView.drill_parameters = this.data.parameters
      this.currentView.query = this.query
      this.fullData = await getFullData(this.currentView)
      console.log('this.fullData:::', this.fullData)
      this.fullData.tableDate.forEach(item => {
        // console.log(item)
        this.cardData.list.push({
          slot1: item.res_s_title, // 类目
          slot2: item.res_y_value, // 目标
          slot3: item.res_s_value, // 实际
          slot4: '万元',
          slot5: item.res_finish_rate_value,
          slot6: '',
          slot7: ''
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>

  .card{
    width: 500px;
    padding: 0 !important;
    text-align: center;
    display: inline-block;
    margin: 10px;
    .title{
      background: #dbdbdb;
      padding: 10px;
    }
    .emphasize{
      font-size: 24px;
      font-weight: bold;
    }
    .gray{
      color: #bababa;
    }

    .el-divider{
      margin: 10px 0 ;
    }
    .row{
      border-bottom: 1px #d3d3d3 solid;
      padding: 10px 0;
    }
  }
</style>
