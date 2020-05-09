<template>
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

    <Filters
      total=""
      @filtration="getPanel"
    />

    <el-row
      v-for="row in cardData.list"
      :key="row.categoryName"
      class="row"
    >
      <el-col :span="7">{{ row.slot1 }} <br> <span class="gray">目标{{ row.slot2 }}</span> </el-col>
      <el-col :span="8"><span class="emphasize">{{ row.slot3 }}</span> {{ row.slot4 }}</el-col>
      <el-col :span="7">{{ row.slot5 }}%</el-col>
    </el-row>

  </el-card>
</template>

<script>
// import { fetchPanel } from '@/api/panel'
// import 'vue-draggable-resizable/dist/VueDraggableResizable.css'
// eslint-disable-next-line no-unused-vars
// import chart from './charts/charts'
// import tabular from './tables/table'
// import uuidv1 from 'uuid/v1'
// import { deepClone } from '@/utils'
import Filters from '@/components/Filters' // Secondary package based on el-pagination
import { getFullData } from '@/utils/dataProce'

export default {
  name: 'Panel2',
  components: { Filters },
  props: {
    data: {
      type: Object,
      default() {
        return {}
      }
    }},
  data() {
    return {
      currentView: {},
      fullData: {},
      cardData: {
        title: 'P&L',
        list: []
      }
    }
  },
  computed: { },
  watch: { },
  created() {
    this.currentView = this.$store.state.options.views.find(item => item.name === this.data.viewName)

    this.getPanel()
  },
  methods: {
    async getPanel() {
      console.log('currentView:', this.currentView)
      this.currentView.drill_name = this.data.title
      this.currentView.drill_drillName = this.data.title
      this.currentView.drill__drillName = this.data.viewName
      this.currentView.drill_parameters = this.data.parameters
      this.fullData = await getFullData(this.currentView)
      console.log('this.fullData:::', this.fullData)
      this.fullData.tableDate.forEach(item => {
        console.log(item)
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

<style lang="scss">
  #panel2{
    .el-card__header{
      padding: 0;
    }
  }
</style>

<style lang="scss" scoped>
  .warp{
    margin-top: 50px;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
  }
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

