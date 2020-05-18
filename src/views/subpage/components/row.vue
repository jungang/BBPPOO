<template>
  <el-col :span="8">
    <h4>{{ data.title }}</h4>
    <chartBar :data="cardData.dataSet" />
  </el-col>
</template>

<script>
import { deepClone } from '@/utils'
import { getFullData } from '@/utils/dataProce_v1'
import chartBar from './chartBar_v1'

export default {
  name: 'Row',
  components: { chartBar },
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
      this.$router.push({ path: this.data.name })
    },
    async getData() {
      this.currentView = deepClone(this.data)
      this.currentView.query = this.query
      this.fullData = await getFullData(this.currentView)
      //console.log('this.fullData:::', this.fullData)

      // 摘要数据
      this.cardData.list = []
      //console.log('this.fullData.res:', this.fullData.res)
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

      // 图表数据
      this.cardData.dataSet = this.fullData.chartDate
    }
  }
}
</script>

<style lang="scss" scoped>
.row-container{
  h4{
    text-align: center;
    margin: 0;
  }

}

</style>
