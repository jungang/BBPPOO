<!--panel_default-->
<template>
  <div class="panel-container">

    <!--    query 参数-->
    <Filters
      :query.sync="query"
      :multiple="true"
      :type="filterType"
      @filtration="handleFilter"
    />

    <div class="zone_cards">
      <Card
        v-for="cardData in list"
        :key="cardData.id"
        ref="card"
        :data="cardData"
        :query="query"
      />

    </div>
  </div>
</template>

<script>
// import { fetchPanel } from '@/api/panel'
// import 'vue-draggable-resizable/dist/VueDraggableResizable.css'
// eslint-disable-next-line no-unused-vars
import Card from './cards/card'
// import tabular from './tables/table'
// import uuidv1 from 'uuid/v1'
import Filters from '@/components/Filters'
// import { getFullData } from '@/utils/dataProce'

export default {
  name: 'PanelDefault',
  components: { Filters, Card },
  props: { },
  data() {
    return {
      list: [],
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
      },
      fullData: {}
    }
  },
  computed: { },
  watch: { },
  created() {
    // console.log('this.$store.state.options.views:', this.$store.state.options.views)
    this.$store.state.options.views.forEach(item => {
      if (item.location === 'wf_index_default_cards') {
        if (item.name === 'view_pl') {
          this.list.push(item)
        }
      }
    })
    console.log(this.list)
  },
  methods: {
    handleFilter() {
      this.$refs.card.forEach((item) => item.getData())
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
</style>

