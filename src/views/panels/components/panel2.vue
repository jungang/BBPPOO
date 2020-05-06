<template>
  <div id="panel2" class="app-container">
    <el-row class="warp">
      <el-card
        v-for="item in cardData"
        :key="item.title"
        class="card"
        shadow="hover"
      >
        <div
          slot="header"
          class="clearfix title"
        >
          {{ item.title }}
        </div>

        <el-row
          v-for="row in item.list"
          :key="row.categoryName"
          class="row"
        >
          <el-col :span="7">{{ row.categoryName }} <br> <span class="gray">目标{{ row.targetValue }}</span> </el-col>
          <el-col :span="8"><span class="emphasize">{{ row.actualValue }}</span> {{ row.unit }}</el-col>
          <el-col :span="7">{{ row.finishingRate }}%</el-col>
        </el-row>

      </el-card>
    </el-row>
  </div>
</template>

<script>
import { fetchPanel } from '@/api/panel'
import 'vue-draggable-resizable/dist/VueDraggableResizable.css'
// eslint-disable-next-line no-unused-vars
// import chart from './charts/charts'
// import tabular from './tables/table'
// import uuidv1 from 'uuid/v1'
// import { deepClone } from '@/utils'

export default {
  name: 'Panel2',
  components: { },
  props: { },
  data() {
    return {
      cardData: [
        {
          title: 'P&L',
          list: [
            {
              categoryName: '收入',
              targetValue: 19.08,
              actualValue: 23.47,
              unit: '万元',
              finishingRate: 123.00
            },
            {
              categoryName: '成本',
              targetValue: 9.67,
              actualValue: 12.76,
              unit: '万元',
              finishingRate: 131.95
            },
            {
              categoryName: '毛利',
              targetValue: 4.27,
              actualValue: 10.71,
              unit: '万元',
              finishingRate: 250.81
            }
          ]
        },
        {
          title: '产能',
          list: [
            {
              categoryName: '业务量',
              targetValue: 36882,
              actualValue: 50835,
              unit: '笔',
              finishingRate: 137.83
            },
            {
              categoryName: '签入时长',
              targetValue: 600.10,
              actualValue: 601.31,
              unit: '',
              finishingRate: 101
            },
            {
              categoryName: '利用率',
              targetValue: 4.27,
              actualValue: 10.71,
              unit: '',
              finishingRate: 250.81
            },
            {
              categoryName: 'AHT',
              targetValue: 4.27,
              actualValue: 10.71,
              unit: '',
              finishingRate: 250.81
            }
          ]
        },
        {
          title: '质量',
          list: [
            {
              categoryName: '投诉数',
              targetValue: 36882,
              actualValue: 50835,
              unit: '笔',
              finishingRate: 137.83
            },
            {
              categoryName: '接起率',
              targetValue: 600.10,
              actualValue: 601.31,
              unit: '',
              finishingRate: 101
            },
            {
              categoryName: '满意度',
              targetValue: 4.27,
              actualValue: 10.71,
              unit: '',
              finishingRate: 250.81
            },
            {
              categoryName: '解决率',
              targetValue: 4.27,
              actualValue: 10.71,
              unit: '',
              finishingRate: 250.81
            }
          ]
        },
        {
          title: '人员',
          list: [
            {
              categoryName: '自然人数',
              targetValue: 19.08,
              actualValue: 23.47,
              unit: '万元',
              finishingRate: 123.00
            },
            {
              categoryName: '标准人数',
              targetValue: 9.67,
              actualValue: 12.76,
              unit: '万元',
              finishingRate: 131.95
            },
            {
              categoryName: '一线人数',
              targetValue: 4.27,
              actualValue: 10.71,
              unit: '万元',
              finishingRate: 250.81
            }
          ]
        }
      ],
      title: '',
      id: 0,
      timer: {},
      loading: false,
      tempRoute: {}
    }
  },
  computed: { },
  watch: { },
  created() {
    this.id = this.$route.params && this.$route.params.id
    this.tempRoute = Object.assign({}, this.$route)
    this.getPanel(this.id)
  },
  methods: {
    getPanel(id) {
      fetchPanel(id).then(response => {
        this.panel = response.data

        console.log('this.panel:', this.panel)
        this.setTagsViewTitle()
        this.setPageTitle()
      }).catch(err => {
        console.log(err)
      })
    },
    setTagsViewTitle() {
      const title = '报表-' + this.panel.title
      // const route = Object.assign({}, this.tempRoute, { title: `${title}-${this.id}` })
      const route = Object.assign({}, this.tempRoute, { title: `${title}` })
      this.$store.dispatch('tagsView/updateVisitedView', route)
    },
    setPageTitle() {
      const title = 'BPO运营数据分析工具系统'
      document.title = `月度经营分析-${title}`
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

