<template>
  <div class="table-container">
    <el-table
      :data="tableData"
      style="width: 100%;margin-bottom: 20px;"
      row-key="index"
      border
      default-expand-all
      :tree-props="{children: 'childrenRow', hasChildren: 'hasChildren'}"
    >
      <el-table-column
        v-if="nowView.config.rowTitle !=='单人利润'"
        prop="title"
        label="名称"
        :min-width="50"
      />
      <el-table-column
        v-if="nowView.config.compare"
        prop="dimension[0].data[0].targetValue"
        label="目标（万元）"
        :min-width="25"
      />
      <el-table-column
        v-if="nowView.config.rowTitle ==='收入' || nowView.config.rowTitle ==='成本'"
        prop="dimension[0].data[0].actualValue"
        label="实际（万元）"
        :min-width="25"
      />
      <el-table-column
        v-if="nowView.config.rowTitle ==='单人平均'"
        prop="dimension[0].data[0].actualValue"
        label="达成值（万元）"
        :min-width="25"
      />
      <el-table-column
        v-if="nowView.config.rowTitle ==='单人利润'"
        prop="v_group_name"
        label="组别"
        :min-width="25"
      >
        <template slot-scope="{row}">
          <span :class="row.v_cu"> {{ row.v_group_name }}</span>
        </template>

      </el-table-column>
      <el-table-column
        v-if="nowView.config.rowTitle ==='单人利润'"
        prop="v_name"
        label="姓名"
        :min-width="25"
      >
        <template slot-scope="{row}">
          <span :class="row.v_cu"> {{ row.v_name }}</span>
        </template>

      </el-table-column>
      <el-table-column
        v-if="nowView.config.rowTitle ==='单人利润'"
        prop="actualValue"
        label="毛利（万元）"
        :min-width="25"
      >
        <template slot-scope="{row}">
          <span :class="row.v_cu"> {{ row.actualValue }}</span>
        </template>

      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import uuidv1 from 'uuid/v1'

export default {
  name: 'Table',
  components: {},
  props: {
    data: {
      type: Object,
      required: true
    },
    currentView: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      id: uuidv1(),
      nowView: {},
      tableData: [
        {
          id: 1,
          res_s_title: '业务结算',
          res_y_value: '19.08',
          res_s_zb_value: '25.95',
          children: [{
            id: 11,
            res_s_title: '营业净额',
            res_y_value: '17.87',
            res_s_zb_value: '24.31'
          },
          {
            id: 12,
            res_s_title: '税额',
            res_y_value: '1.21',
            res_s_zb_value: '1.65'
          },
          {
            id: 13,
            res_s_title: '业务收入',
            res_y_value: '14.29',
            res_s_zb_value: '23.47'
          }]
        },
        {
          id: 2,
          res_s_title: '管理结算',
          res_y_value: '1.9',
          res_s_zb_value: '1.9',
          children: [{
            id: 14,
            res_s_title: '疑难支撑席',
            res_y_value: '1.4',
            res_s_zb_value: '1.4'
          },
          {
            id: 15,
            res_s_title: '项目经理席',
            res_y_value: '0.5',
            res_s_zb_value: '0.5'
          }]
        }]
    }
  },
  watch: {
    data: {
      deep: true,
      handler() {
        this.formatDataSet(this.data)
      }
    }
  },
  created() {
    this.nowView = this.currentView
    // console.log('nowView=>',this.nowView)
  },
  mounted() {

  },
  methods: {
    formatDataSet(data) {
      this.tableData = data.list
      if (this.nowView.config.component.type === 'table_lirun') {
        console.log('dasfd', this.tableData)
        const employeeList = this.$store.state.group.employeeList
        const arrs = []
        const lirunArray = []
        this.tableData[0].dimension.forEach((item) => {
          if(item.v_group_name){
            item.data[0].v_group_name = item.v_group_name + '组';
            item.data[0].v_name = item.v_group_name+ '组';
            item.data[0].v_cu = 'jiacu';
            arrs.push(item.data[0]);
          }else{
            item.data.forEach((_item) => {
              if (_item.v_id) {
                employeeList.forEach((__item) => {
                  __item.children.forEach((___item) => {
                    if(_item.v_id === ___item.value){
                      _item['v_name'] = ___item.label;
                      _item['v_group_name'] = __item.label;
                      _item['v_cu'] = '';
                    }
                  })
                })
                arrs.push(_item)
              }
            })
          }
        })

        arrs.forEach((dt) => {
          if (!dt.v_id) {
            lirunArray.push(dt)
            arrs.forEach((_dt) => {
              if (_dt.v_id && (_dt.v_group_name === dt.v_group_name)) {
                lirunArray.push(_dt)
              }
            })
          }
        })

        console.log('arrs=>', lirunArray)
        this.tableData = lirunArray
      }
    }

  }
}

</script>

<style lang="scss" scoped>
  .charts-container {
    width: 100%;
    height: 30vh;
  }
  .jiacu{
    font-weight: bolder;
  }
</style>
