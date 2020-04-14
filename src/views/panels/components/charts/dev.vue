<template>
  <div class="app-container">
    <div style="height: 800px">
      <component
        :is="element.component"
        :ref="element.id"
        :data="element"
        :view="element.viewName"
      />
    </div>

  </div>
</template>

<script>
import chart2 from './charts2'
// import drill from './drill-down'

export default {
  name: 'Dev',
  components: {
    chart2
  },
  props: {},
  data() {
    return {
      element: {
        id: '2850eb70-7e1b-11ea-87fb-1bcd7a46e512',
        type: 'def',
        title: '当月利润分析',
        width: 693,
        height: 532,
        viewName: 'profit_income_expanse',
        component: 'chart2',
        _drillName: 'profit_income_expanse',
        parameters: {
          year: 2020,
          month: '01'
        }
      }
    }
  },
  computed: {
  },
  watch: {},
  created() {},
  mounted() {
    this.init()
  },
  methods: {
    init() {
    }

  }
}

</script>

<style lang="scss" scoped>
  .app-container{
    padding: 40px 5px 5px 5px;
    height: 100%;
  }

</style>

