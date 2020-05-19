<template>
  <div id="pages">
    <Panels
      v-for="item in this.panelObj"
      :data="item"
    />
  </div>
</template>

<script>
  import Panels from './panels';
  export default {
    name: 'pages',
    components: {Panels},
    props: {
      data: {
        type: Object,
        default: function() {
          return {
          }
        }
      },
      pageViews:{
        type:Array,
        default:function() {

        }
      }
    },
    data() {
      return {
        panelObj:[]
      };
    },
    computed: {},
    watch: {},
    created() {
      console.log('pageViews=>',this.pageViews)
      this.getPanelData();
    },
    methods: {
      async getPanelData(){
        //console.log('pages-data=>',this.data);
        this.panelObj = this.data.panel;
        //console.log('panelObj=>',this.panelObj);
      }
    }
  }
</script>

<style scoped>

</style>
