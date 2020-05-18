<template>
  <div id="panels">
    <Zone
      v-for="item in zoneObj"
      :data="item"
    />
  </div>
</template>

<script>
  import Zone from './zone'
  export default {
    name: 'panels',
    components: { Zone },
    props: {
      data: {
        type: Object,
        default: function() {
          return {
          }
        }
      }
    },
    data() {
      return {
        zoneObj:[]
      };
    },
    computed: {},
    watch: {},
    created() {
      this.getPanelData();
    },
    methods: {
      async getPanelData(){
        //console.log('panels-data=>',this.data);
        this.zoneObj = this.data.zone
      }
    }
  }
</script>

<style scoped>

</style>
