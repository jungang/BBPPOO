<template>
  <div class="list-container">

    <div
      v-for="row in listData"
      :key="row.categoryName"
      class="warp"
    >
      <el-row class="row">
        <el-col :span="7" style="text-align: right; font-size: 14px">{{ row.slot1 }}  <span v-if="row.slot4">({{ row.slot4 }})</span></el-col>
        <el-col :span="7" style="text-align: right">
          <span v-if="row.slot3" class="emphasize" :class="row.highlightStyle"> {{ row.slot3 }}</span>
        </el-col>
        <el-col :span="3">
          <span v-if="row.slot2" class="gray" style="width: 80px; display: inline-block;text-align:left; text-indent: 5px">
            (目标 <span style="color: #5e5eff; font-weight: bold">{{ row.slot2 }}</span>)
          </span>

        </el-col>
        <el-col v-if="row.slot3 && row.slot2" :span="5" style="text-align: right">{{ row.slot5 && row.slot5+ '%' }}</el-col>
        <br>
      </el-row>

      <div v-if="row.property">
        <!--        {{ row.property }}-->
        <el-row
          v-for="(item,index) in row.property"
          :key="index"
          class="row"
          style="text-align: right; font-size: 12px"
        >
          <!--          {{ typeof item }}-->
          <el-col :span="7">{{ item.slot1 }}</el-col>
          <el-col :span="7"> <span v-if="item.slot3" style="text-align: right; font-size: 12px" :class="item.highlightStyle"> {{ item.slot3 }}</span></el-col>
        </el-row>
      </div>

    </div>

  </div>
</template>

<script>
import { deepClone } from '@/utils'

export default {
  name: 'List',
  props: {
    data: {
      type: Array,
      required: true
    },
    view: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      listData: []
    }
  },
  watch: {
    data: {
      deep: true,
      handler(val) {
        this.renderData()
      }
    }
  },
  created() { },
  methods: {
    renderData() {
      const _relation = this.view.config.component.config.relation
      this.listData = deepClone(this.data)
      const _del = []
      if (_relation) {
        // console.log('_relation:', _relation)
        _relation.forEach(item => {
          const _main = this.data.find(a => a.name === item.main)
          if (_main) {
            _main.property = item.property.map(a => {
              _del.push(a)
              return this.data.find(b => b.name === a)
            })
            // console.log(' _main.property:', _main.property)
          }
          // console.log('_main:', _main)
        })

        const _data = this.data.filter(item => {
          // console.log('item:', item)
          const _v = _del.includes(item.name)
          return _v ? false : deepClone(item)
        })
        // console.log(' _data:', _data)
        this.listData = _data
        // console.log('this.listData:', this.listData)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .list-container{
    min-height: 120px;
  }
    .title{
      background: #dbdbdb;
      padding: 10px;
    }

    .emphasize{
      /*color: #131313;*/
      font-size: 26px;
      font-weight: bold;
    }

    .gray{
      font-size: 12px;
      /*color: #bababa;*/
    }

    .el-divider{
      margin: 10px 0 ;
    }
    .warp{
      border-bottom: 1px #d3d3d3 solid;
    }
    .row{
      display: flex;
      align-items:center;
      padding: 2px 0;
    }
</style>
