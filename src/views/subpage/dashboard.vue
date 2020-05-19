<!--suppress ALL -->
<template>
  <div id="wf" class="app-container">
    <Pages v-for="item in pagesObj"
           :data="item"
           :views = "currentView"
    />
  </div>
</template>

<script>
  import _ from "underscore";
  import Pages from './components/pages';
  import dashboardData from '../../assets/dashboard';

  export default {
    name: 'dashboard',
    components: {Pages},
    props: {},
    data() {
      return {
        pagesObj:[],
        currentView:[]
      };
    },
    computed: {

    },
    watch: {},
    created() {
      this.getPageData();
      this.getCurrentView();
    },
    methods: {
      getPageData(){
        _.each(dashboardData.pages,(_val, _key, _list) => {
          if(_val.name == this.$route.name){
            this.pagesObj.push(_val);
          }
        });
        //console.log('pagesObj=>',this.pagesObj)
      },
       getCurrentView(){
         _.map(this.$store.state.options.views,(_val, _index,_list) => {
           if(_val.config.pagesName == this.$route.name){
             this.currentView.push(_val);
           }
           return this.currentView;
         });

         console.log('currentView=>',this.currentView)
      }
    }
  }
</script>

<style scoped>

</style>
