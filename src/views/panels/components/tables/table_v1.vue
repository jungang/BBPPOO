<template>
  <div class="table-container">
    table-container...
  </div>
</template>

<script>
import uuidv1 from 'uuid/v1'

export default {
  name: 'Table',
  components: { },
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      id: uuidv1(),
      chartData: []
    }
  },
  watch: {
    data: {
      deep: true,
      handler() {
        this.formatDataSet(this.data)
        // this.options.dataset = this.data
      }
    }
  },
  created() {
    console.log('this.data:', this.data)
  },
  mounted() {
    // this.renderChart()
  },
  methods: {
    formatDataSet(data) {
      console.log('formatDataSet...')
      // console.log(data.data)
    }

  }
}

</script>

<style lang="scss">
  .charts-container{
    width: 100%;
    height: 30vh;
  }
</style>
