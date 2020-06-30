<template>
  <div class="table-container">

    <el-table
      :data="tableData"
      style="width: 100%;margin-bottom: 20px;"
      row-key="name"
      border
      default-expand-all
      :tree-props="{children: 'childrenRow', hasChildren: 'hasChildren'}"
    >

      <el-table-column
        v-for="(item,index) in currentView.config.component.columns"
        :key="index"
        :label="item.title"
      >
        <template slot-scope="{row}">
          <span :class="item.highlight ? row.highlightStyle : ''">
            {{ row[item.value] }}

          </span>
          <br>
        </template>
      </el-table-column>

    </el-table>
  </div>
</template>

<script>
// import uuidv1 from 'uuid/v1'、

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
      id: 1,
      nowView: {},
      tableData: []
      /*      tableData: [
        {
          id: 1,
          title: '业务结算',
          res_y_value: '19.08',
          res_s_zb_value: '25.95',
          childrenRow: [{
            id: 11,
            title: '营业净额',
            res_y_value: '17.87',
            res_s_zb_value: '24.31'
          },
          {
            id: 12,
            title: '税额',
            res_y_value: '1.21',
            res_s_zb_value: '1.65'
          },
          {
            id: 13,
            title: '业务收入',
            res_y_value: '14.29',
            res_s_zb_value: '23.47'
          }]
        },
        {
          id: 2,
          title: '管理结算',
          res_y_value: '1.9',
          res_s_zb_value: '1.9',
          childrenRow: [{
            id: 14,
            title: '疑难支撑席',
            res_y_value: '1.4',
            res_s_zb_value: '1.4'
          },
          {
            id: 15,
            title: '项目经理席',
            res_y_value: '0.5',
            res_s_zb_value: '0.5'
          }]
        }
      ]*/
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
    // console.log('tableData:', this.tableData)
    // console.log('nowView=>',this.nowView)
  },
  mounted() {

  },
  methods: {
    formatDataSet(data) {
      // console.log('data.list:', data.list)
      // console.log('currentView:', this.currentView.title)
      this.tableData = []
      if (this.nowView.config.component.type === 'table_lirun') {
        console.log('data:', data)
        // console.log('data.list=>', data.list)
        // const employeeList = this.$store.state.group.employeeList
        // console.log('employeeList=>', employeeList)
        const arrs = []
        const lirunArray = []
        // const _idd = 0

        if (data.list.length <= 0) return

        // data.list[0].dimension.forEach((item) => {
        //   if (item.v_group_name) {
        //     item.data[0].v_group_name = item.v_group_name + '组'
        //     item.data[0].v_name = item.v_group_name + '组'
        //     item.data[0].v_cu = 'jiacu'
        //     arrs.push(item.data[0])
        //   } else {
        //     item.data.forEach((_item) => {
        //       if (_item.v_id) {
        //         employeeList.forEach((__item) => {
        //           if (__item.children) {
        //             __item.children.forEach((___item) => {
        //               ___item.children.forEach((____item) => {
        //                 if (_item.v_id === ____item.value) {
        //                   _item['v_name'] = ____item.label
        //                   _item['v_group_name'] = ___item.value + '组'
        //                   _item['v_cu'] = ''
        //                 }
        //               })
        //             })
        //           }
        //         })
        //         arrs.push(_item)
        //       }
        //     })
        //   }
        // })

        let __id = 0
        arrs.forEach((dt) => {
          dt.id = __id
          if (!dt.v_id) {
            lirunArray.push(dt)

            arrs.forEach((_dt) => {
              if (_dt.v_id && (_dt.v_group_name === dt.v_group_name)) {
                lirunArray.push(_dt)
              }
            })
          }
          __id++
        })

        // console.log('lirunArray=>',lirunArray)
        this.tableData = lirunArray
      }

      this.tableData = data.list

      // console.log('this.tableData:', this.tableData)
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
