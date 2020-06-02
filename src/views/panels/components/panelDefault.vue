<!--panel_default-->
<template>
  <div class="panel-container">
    <!--    query 参数-->
    <Filters
      :query.sync="query"
      :type="filterType"
      @filtration="handleFilter"
    />

    <div class="zone_cards">
      <Card
        v-for="cardData in cardList"
        :key="cardData.id"
        ref="component"
        :data="cardData"
        :query="query"
      />
    </div>

    <div class="zone_trend">

      <el-row v-if="false">
        <Row
          v-for="data in zoneTrend.rowList"
          :key="data.id"
          ref="component"
          :data="data"
          :query="query"
        />
      </el-row>

      <el-tabs v-model="tabList_1_activeName">
        <el-tab-pane
          v-for="data in zoneTrend.tabList_1"
          :key="data.id"
          ref="component"
          :label="data.config.tabTitle"
          :name="data.name"
        >
          <Tab
            :data="data"
            :query="query"
          />
        </el-tab-pane>

        <el-tabs v-model="tabList_2_activeName">
          <el-tab-pane
            v-for="data in zoneTrend.tabList_2"
            :key="data.id"
            ref="component"
            :label="data.config.tabTitle"
            :name="data.name"
          >
            <Tab
              :data="data"
              :query="query"
            />
          </el-tab-pane>
        </el-tabs>

      </el-tabs></div>

  </div>
</template>

<script>
import Card from './cards/card'
import Row from './rows/row'
import Tab from './tabs/tab'
import Filters from '@/components/Filters'
import { ViewAuth } from '@/utils/auth'
import { cardSort } from '@/utils'

export default {
  name: 'PanelDefault',
  components: { Filters, Card, Row, Tab },
  props: { },
  data() {
    return {
      tabList_1_activeName: '',
      tabList_2_activeName: '',
      cardList: [],
      rowList: [],
      zoneTrend: {
        rowList: [],
        tabList_1: [],
        tabList_2: []
      },
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
        multiple: true,
        group: 'null', // 选择组信息
        type: 'all', // 合集 all | 集团 group | 本地 local
        isStore: true
      },
      fullData: {}
    }
  },
  computed: { },
  watch: { },
  created() {
    // console.log('this.$store.state.options.views:', this.$store.state.options.views)

    this.$store.state.options.views.forEach(item => {
      // console.log('item.location:', item.location)

      // console.log(item.config)

      // console.log('item.config.pagesName:', item.config.pagesName)
      // console.log('this.$route.name:', this.$route.name)
      // 处理当前页

      if (item.config.pagesName === this.$route.meta.view && ViewAuth(item)) {
        // wf_P&L_default_trend_tabIndex
        // wf_P&L_default_trend_rowIndex

        // console.log('item.location:', item.location)
        switch (item.location) {
          case 'wf_index_default_cards':
            this.cardList.push(item)
            break
          case 'wf_P&L_default_trend_rowIndex':
            this.zoneTrend.rowList.push(item)
            break
          case 'wf_P&L_default_trend_tabIndex':
            // item.config.tabIndex = Math.ceil(Math.random() * 1000000000 % 2) // test 1|2
            console.log('item.config.tabIndex:', item.config.tabIndex)
            this.zoneTrend['tabList_' + item.config.tabIndex].push(item)
            this['tabList_' + item.config.tabIndex + '_activeName'] = this.zoneTrend['tabList_' + item.config.tabIndex][0].name
            break
        }
      }
    })

    // console.log('this.cardList:', this.cardList)

    if (this.cardList.length > 0) {
      this.cardList = cardSort(this.cardList)
    }
  },
  methods: {
    handleFilter() {
      this.$refs.component.forEach((item) => item.getData())
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
  .zone_cards{
    display: flex;
    flex-wrap: wrap;
  }
</style>

