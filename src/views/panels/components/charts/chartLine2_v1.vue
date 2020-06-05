<template>
  <div id="chartBox" class="charts-container">
    <el-radio-group v-model="selectRadio" class="radiobox"  @change="radioChange">
      <el-radio :label="item.index" v-for="item in chartData">{{item.title}}</el-radio>
    </el-radio-group>
    <div :id="id" class="chart" style="width:100%; height:20vh" />
  </div>
</template>

<script>
  const echarts = require('echarts')
  import uuidv1 from 'uuid/v1'
  import _ from 'underscore'

  export default {
    name: 'chartLineComparison',
    components: { },
    props: {
      data: {
        type: Object,
        required: true
      },
      query: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        id: uuidv1(),
        chart: {},
        selectRadio:1,
        options: {
          legend: {
            show:false
          },
          grid: {
            left: 70,
            top: 30,
            bottom: 20
          },
          tooltip: {
            formatter: (params) => this.handleFormatter(params)
          },
          dataset: {
            dimensions: [],
            source: []
          },
          xAxis: { type: 'category' },
          yAxis: {},
          series: []
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
      handleFormatter(params) {
        let res = '';
        if(params.dimensionNames.length > 2){
          res += `${params.dimensionNames[params.dataIndex + 1]} : ${params.value[params.dimensionNames[params.dataIndex + 1]]}`
        }else{
          res += `${params.seriesName} : ${params.value[params.seriesName]}`
        }

        switch (this.data.data[this.selectRadio -1].type) {
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
      radioChange(value){
        this.selectRadio = value;
//        console.log('selectRadio=>',this.selectRadio)
        this.initData();
      },
      formatDataSet(response) {
      //  console.log('response=>',response.data)

        //init
        this.options.dataset.dimensions = [];
        this.options.dataset.source = [];
        this.options.series = [];

       // console.log('清除=>',this.options)
        let _data = [];
        let num = 0;
        if(this.query.group === 'null' || this.query.group.length === 0){
          response.data.forEach((item) => {
            num ++ ;
            let obj = {};
            obj.title = item.title;
            obj.type = item.type;
            obj.index = num;
            obj.source = [];
            obj.dimensions = ['time'];

            obj.dimensions.push(item.title)

            item.dimension[0].data.forEach((_item) => {
              obj.source.push({time: _item.time, [item.title]: _item.actualValue})
            });

            this.options.series.push({ type: 'line' });

            _data.push(obj);
          });

        }else{
         // console.log('persons=>',this.$store.state.group.persons)
         // console.log('group=>',this.query.group)

          let _obj = {
            source:[],
            dimensions:['time']
          };

          //this.options.series = [];//清除type=line

          this.query.group.forEach((item) => {
            if(item.length === 2){
              _obj.dimensions.push(item[1])
            }

            if(item.length === 3){
              _obj.dimensions.push(_.find(this.$store.state.group.persons,items => {return item[2] == items.v_project_work_id}).v_name)
            }

            this.options.series.push({ type: 'line' });
          });

         // console.log(' _obj.dimensions=>',_obj.dimensions)

          let __data = [];

          response.data.forEach((_item) => {
            let _arr = [];
            _item.dimension.forEach((__item) => {
              let __arr = [];
              __item.data.forEach((___item) => {
                let __obj = {};
                if(__item.v_group_name){
                  __obj.name = __item.v_group_name
                }else{
                  //__obj.name = ___item.v_id
                  __obj.name = _.find(this.$store.state.group.persons,items => {return ___item.v_id == items.v_project_work_id}).v_name
                }
                __obj.time = ___item.time
                __obj.actualValue = ___item.actualValue
                __obj.title = _item.title

                __arr.push(__obj);
              })
              _arr.push(__arr);
            })

            _arr.forEach((aitem) => {
              aitem.forEach((_aitem) => {
                __data.push(_aitem);
              })
            })

          });
          let _num = 0;
          response.data.forEach((_item) => {
            let _obj1 = {};
            _num ++ ;
            //console.log(_item.title)
            _obj1.title = _item.title;
            _obj1.type = _item.type;
            _obj1.index = _num;

            let arr =_.where(__data,{title:_item.title});
            //console.log('arr=>',arr);
            let __arr = [];

            _.forEach(arr,(__item) => {
              let __objs = {};
              let isPush = _.find(__arr,(___item) => {
                return __item.time == ___item.time;
              });

              //console.log('isPush=>',isPush);

              if(!isPush){
                __objs.time = __item.time;
                __objs[__item.name] = __item.actualValue;
                __arr.push(__objs);
              }else{
                isPush[__item.name] = __item.actualValue
              }


            });
            //console.log(_obj1.title)
            _obj1.source = __arr;
            _obj1.dimensions = _obj.dimensions;
            _data.push(_obj1);

            //console.log('_data',_data)

          })

        }

        this.chartData = _.sortBy(_data, 'index');

        //console.log('chartData=>',this.chartData);

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
      initData(){

        this.options.series.push({ type: 'line',name: this.chartData[this.selectRadio - 1].title  });

        this.options.dataset.source = this.chartData[this.selectRadio - 1].source;
        this.options.dataset.dimensions = [];
        this.options.dataset.dimensions = this.chartData[this.selectRadio - 1].dimensions;

        console.log('options=>',this.options)

        this.$nextTick(() => {
          this.chart.clear();
          this.chart.setOption(this.options)
        });

      }

    }
  }

</script>

<style lang="scss">
  .charts-container{
    width: 100%;
    height: 23vh;
    position: relative;
    .radiobox{
      height: 3vh;
      z-index: 999;
      margin-left: 15%;
    }
  }
</style>
