<template>
  <div class="charts-container">
    <el-radio-group v-model="selectRadio" class="radiobox" @change="radioChange">
      <el-radio :label="item.index" v-for="item in chartData">{{item.title}}</el-radio>
    </el-radio-group>
    <div :id="id" class="chart" style="width:100%; height:30vh;"/>
  </div>
</template>

<script>
  const echarts = require('echarts')
  import uuidv1 from 'uuid/v1'
  import {parseTime} from '@/utils'
  import moment from 'moment' // 导入模块
  import _ from 'underscore'
  moment.locale('zh-cn') // 设置语言 或 moment.lang('zh-cn');

  export default {
    name: 'ChartsBarContrast',
    components: {},
    props: {
      data: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        id: uuidv1(),
        selectRadio: 0,
        chart: {},
        itemStyle: {
          normal: {
            color: function(params) {
              var colorList = ['#feb64d', '#6ad9d5', '#48b885', '#60acfc', '#fd4b4f', '#9287e7']
              return colorList[params.dataIndex]
            }
          }
        },
        options: {
          tooltip: {
            //formatter: (params) => this.handleFormatter(params)
          },
          grid: {
            left: '20%'
          },
          dataset: {
            dimensions: ['company', '202001', '202002'],
            source: [
              {company: '通软', '202001': 50, '202002': 40},
              {company: '惟帆', '202001': 100, '202002': 80}
            ]

          },
          // 声明一个 X 轴，类目轴（category）。默认情况下，类目轴对应到 dataset 第一列。
          xAxis: {
            type: 'category',
            axisLabel: {}
          },
          yAxis: {
            axisLabel: {
              formatter: (value) => {
                return value
              }
            }
          },
          series: [
           /* {type: 'bar'},
            {type: 'bar'}*/
          ]
        },
        chartData: []
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
    },
    mounted() {
      this.renderChart()
    },
    methods: {
      formatDataSet(data) {
        this.chartData = [];
        this.options.dataset.dimensions = [];
        this.options.dataset.source = [];
        this.options.series = [];

        let _arr = [];
        let _num = 0;
        //console.log('data.data',  data.data)
        data.data.forEach((item) => {//遍历出有值的项
          if(item.dimension.length > 0){
            item.dimension.forEach((_item) => {
              let obj ={};
              if(_item.v_company){
                obj.title = item.title;
                obj.type = item.type;
                obj.company = _item.v_company
                obj.time = _item.data[0].time
                obj.actualValue = _item.data[0].actualValue
                obj.original = _item.data[0].original
                _arr.push(obj);//遍历出有值的项
              }
            })
          }
        });

        //console.log('_arr',  _arr)

        data.data.forEach((_item) => {
          let _obj = {};
          _obj.index = _num;
          _obj.title = _item.title;
          _obj.dimensions = ['company'];
          _obj.source = [];

          let dimensionsArray = _.uniq(_arr,true,'time');
          dimensionsArray.forEach((ti) => {
            _obj.dimensions.push(ti.time)
          })

          let arr =_.where(_arr,{title:_item.title});


          let __arr = [];
          _.forEach(arr,(__item) => {
            let __objs = {};
            let isPush = _.find(__arr,(___item) => {
              return __item.company == ___item.company;
            });

            if(!isPush){
              __objs.company = __item.company;
              __objs[__item.time] = __item.actualValue;
              __arr.push(__objs);

            }else{
              isPush[__item.time] = __item.actualValue
            }


          });
          _obj.source = __arr;
          _num ++;

          this.chartData.push(_obj)
        })

        console.log(this.chartData)

        this.initData();
      },
      initChart() {
        this.chart = echarts.init(document.getElementById(this.id))
      },
      renderChart() {
        !this.chart.id && this.initChart()
        this.chart.hideLoading()
        this.chart.setOption(this.options)
      },
      radioChange(value) {
        this.selectRadio = value;
        this.initData();
      },
      handleFormatter(params) {
        console.log('params=>',params)
        let res = '';
        res += `${params.dimensionNames[params.dataIndex + 1]} : ${this.chartData[this.selectRadio].source[params.dataIndex]}`

        switch (this.data.data[this.selectRadio].type) {
          case 'Percentage':
            res += `%`
            break
          case 'Integer':
            // res +=
            break
          case 'Duration':
            // res +=
            break
        }

        return res
      },
      initData(){
        this.options.series = [];
        this.options.dataset.dimensions = [];

        this.options.series.push({ type: 'bar',name: this.chartData[this.selectRadio].title  });
        this.options.dataset.source = this.chartData[this.selectRadio].source;
        this.options.dataset.dimensions = this.chartData[this.selectRadio].dimensions;

        console.log('options=>',this.options)

        this.$nextTick(() => {
          this.chart.clear();
          this.chart.setOption(this.options)
        });

      }

    }
  }

</script>

<style lang="scss" scoped>
  .charts-container {
    width: 100%;
    height: 35vh;

    .radiobox {
      height: 60px;
      z-index: 999;
      margin-left: 5%;
      .el-radio {
        margin-bottom: 5px;
        margin-top: 5px;
      }
    }
  }
</style>
