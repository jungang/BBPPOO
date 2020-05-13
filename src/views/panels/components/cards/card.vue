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

    <el-row
      v-for="row in data.list"
      :key="row.categoryName"
      class="row"
    >
      <el-col :span="7">{{ row.slot1 }} <br> <span class="gray">目标{{ row.slot2 }}</span> </el-col>
      <el-col :span="8"><span class="emphasize">{{ row.slot3 }}</span> {{ row.slot4 }}</el-col>
      <el-col :span="7">{{ row.slot5 }}%</el-col>
    </el-row>

  </el-card>
<!--  </div>-->
</template>

<script>

import { getFullData } from '@/utils/dataProce'

export default {
  name: 'Card',
  components: { },
  directives: { },
  props: {
    data: {
      type: Object,
      default: function() {
        return {
          name: 'default'
        }
      }
    }
  },
  data() {
    return { }
  },
  watch: { },
  created() {
  },
  mounted() {
  },
  methods: {
    async getData(query) {
      // console.log('currentView:', this.currentView)

      console.log('query:', this.query)

      this.currentView.drill_name = this.data[0].title
      this.currentView.drill_drillName = this.data[0].title
      this.currentView.drill__drillName = this.data[0].viewName
      this.currentView.drill_parameters = this.data[0].parameters
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
