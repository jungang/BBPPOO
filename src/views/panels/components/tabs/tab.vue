<template>
  <div class="tab-container">
    <Table v-if="data.config.component.type === 'table'" :data="cardData" />
    <chartLine v-if="data.config.component.type === 'chart_line'" :data="cardData.dataSet" />
  </div>
</template>

<script>

import { deepClone } from '@/utils'
import { getFullData } from '@/utils/dataProce_v1'
import chartLine from '../charts/chartLine_v1'
import Table from '../tables/table_v1'
import { parseTime } from '@/utils'
// import _ from 'underscore'

export default {
  name: 'Tab',
  components: { chartLine, Table },
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
        dataSet: {
          legendSelectMode: '',
          data: []
        }
      }
    }
  },
  watch: { },
  created() {
    this.getData()
  },
  mounted() {
  },
  methods: {
    linkTo() {
      // console.log('linkTo...')
      // console.log(this.data.name)
      this.$router.push({ path: this.data.name })
    },
    async getData() {
      // console.log('currentView:', this.currentView)
      // console.log('query:', this.query)
      // console.log('this.data=>',this.data)
      // 判断图例是否为单选
      if (this.data.config.component.legendSelectMode) {
        this.cardData.dataSet.legendSelectMode = this.data.config.component.legendSelectMode
      }
      this.currentView = deepClone(this.data)
      this.currentView.query = this.query
      // console.log('currentView=>',this.currentView)
      this.fullData = await getFullData(this.currentView)
      // console.log('this.fullData:::', this.fullData)

      // 摘要数据
      this.cardData.list = []
      // console.log('this.fullData:', this.fullData)
      this.fullData.res.forEach(subject => {
        const _len = subject.dimension[0].data.length - 1
        const _item = {}
        _item.slot1 = subject.title
        _item.slot2 = subject.dimension[0].data[_len].targetValue
        _item.slot3 = subject.dimension[0].data[_len].actualValue
        _item.slot4 = subject.dimension[0].data[_len].unit
        _item.slot5 = subject.dimension[0].data[_len].finish_rate
        this.cardData.list.push(_item)
      })

      // 数据

      if (this.currentView.config.component.type === 'table') {
        // console.log(this.fullData.tableDate)
        /* _.each(this.fullData.tableDate,(_ele, _index) => {
                let _obj={};
                let __obj = {};
                _.each(_ele.dimension[0].data,(ele,index1) => {
                  if(ele.time == parseInt(this.getTableQueryTime())){
                    _obj = ele;
                  }
                });
                _ele.dimension = [];
                _ele.dimension.push(_obj);

                if(_ele.childrenRow.length > 0){
                  _.each(_ele.childrenRow,(__ele) => {
                    _.each(__ele.dimension[0].data,(___ele,index1) => {
                      if(___ele.time == parseInt(this.getTableQueryTime())){
                        __obj = ___ele;
                      }
                    });
                    __ele.dimension = [];
                    __ele.dimension.push(__obj);

                  })
                }

              });*/
        this.cardData.list = []
        this.cardData.list = this.fullData.tableDate

        // console.log('list=>',this.cardData.list)
      } else {
        this.cardData.dataSet.data = this.fullData.chartDate.data
      }
    },
    getTableQueryTime() {
      const nowTime = parseTime(this.query.date, '{y}{m}')
      return nowTime
    }

  }
}
</script>

<style lang="scss" scoped>
.tab-container{
  /*display: inline-block;*/
}

</style>
