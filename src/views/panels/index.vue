<!--page_index-->
<template>
  <div id="panel2" class="app-container">
    <panelDefault />
  </div>
</template>

<script>
// import { fetchPanel } from '@/api/panel'
// import Panel2 from './components/panel2'
import panelDefault from './components/panelDefault'
// eslint-disable-next-line no-unused-vars
// import chart from './charts/charts'
// import tabular from './tables/table'
// import uuidv1 from 'uuid/v1'
// import { deepClone } from '@/utils'

export default {
  name: 'Report',
  components: { panelDefault },
  props: { },
  data() {
    return { }
  },
  computed: { },
  watch: { },
  created() {
    if (localStorage.refresh) {
      this.$store.dispatch('tagsView/delAllViews').then(({ visitedViews }) => {
        console.log('visitedViews:', visitedViews)
      })
      localStorage.removeItem('refresh')
      // location.reload()
    }

    // DEL_OTHERS_VISITED_VIEWS
  },
  methods: {
  }
}
</script>

<style lang="scss">
  #panel2{
    .el-card__header{
      padding: 0;
    }
  }
</style>

<style lang="scss" scoped>
  .warp{
    margin-top: 50px;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
  }
  .card{
    width: 500px;
    padding: 0 !important;
    text-align: center;
    display: inline-block;
    margin: 10px;
    .title{
      background: #dbdbdb;
      padding: 10px;
    }
    .emphasize{
      font-size: 24px;
      font-weight: bold;
    }
    .gray{
      color: #bababa;
    }

    .el-divider{
      margin: 10px 0 ;
    }
    .row{
      border-bottom: 1px #d3d3d3 solid;
      padding: 10px 0;
    }
  }
</style>

