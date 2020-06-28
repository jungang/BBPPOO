<template>
  <el-col>
    <el-row>
      <el-col :offset="2" :span="20" class="checkbox">
        <el-checkbox-group v-model="checkedList" @change="handleCheckedChange">
          <el-checkbox style="width:150px;" v-for="itemTitle in barData.dataSet.data" :label="itemTitle.title" :key="itemTitle.id">{{itemTitle.title}}</el-checkbox>
        </el-checkbox-group>
      </el-col>
    </el-row>
    <el-row>
      <ChartsBarContrast :data="item" v-for="item in barData.dataSet.data" :key="item.id" :currentView="currentView"/>
    </el-row>
  </el-col>
</template>

<script>
  import { deepClone } from '@/utils'
  import { getFullData } from '@/utils/dataProce_v1'
  import ChartsBarContrast from '../charts/chartBar2_v1'
  import _ from 'underscore'

  export default {
    name: 'RowBox',
    components: { ChartsBarContrast },
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
        checkedList:[],
        barData: {
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
      async getData() {
        // console.log('currentView:', this.currentView)
        // console.log('query:', this.query)
        this.currentView = deepClone(this.data)
        this.currentView.query = this.query

        if(this.currentView.config.component.type === 'chart_bar_duibi'){
          var _arrqroup = [];
          this.$store.state.group.employeeList.forEach(async (item) => {
            var _arr = [];
            _arr.push(item.value)
            _arrqroup.push(_arr)

          })

          this.currentView.query.group = deepClone(_arrqroup)
        }

        this.fullData = await getFullData(this.currentView)

        this.checkedList = [];
        // 图表数据
        this.barData.dataSet = this.fullData.fillChartDate;
        if(this.barData.dataSet.data.length > 0){
          this.barData.dataSet.data.forEach((item,index) => {
            item.id = index;
            if(index < 6){
              item.isShow = true;
              this.checkedList.push(item.title);
            }else{
              item.isShow = false;
            }

          })
        }

        //console.log('barData=>',this.barData)
        //console.log('checkedList=>',this.checkedList)

        this.barData.dataSet.query = deepClone(this.query)
        this.barData.dataSet.query.date = this.query.date.getTime()
        this.barData.dataSet.currentView = deepClone(this.currentView)
      },
      handleCheckedChange(value){

        if(value.length > 6){
          this.checkedList = deepClone(_.rest(value));
        }else {
          this.checkedList = deepClone(value);
        }

        //控制图表显示/隐藏
        this.barData.dataSet.data.forEach((item) => {
          var _isTrue = _.find(this.checkedList,(im) => {return im === item.title});
          if(_isTrue){
            item.isShow = true;
          }else{
            item.isShow = false;
          }
        });

        this.$nextTick(() => {
          this.barData.dataSet.data = deepClone(this.barData.dataSet.data);
        })

        //console.log('修改后',this.barData.dataSet.data)

      }
    }
  }
</script>

<style lang="scss" scoped>
  .checkbox{
    margin-bottom: 30px;
  }

</style>
