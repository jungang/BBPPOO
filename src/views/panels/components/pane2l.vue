<template>
  <div class="board-column">

    <draggable
      :list="list"
      v-bind="$attrs"
      class="board-column-content"
      :set-data="setData"
    >
      <div
        v-for="element in list"
        :key="element.id"
        class="board-item"
        :style="{ width: element.width + 'px', height: element.height + 'px' }"
      >
        {{ element.name }} {{ element.id }}
      </div>
    </draggable>

    <div class="panel" style="width: 550px">
      <iframe
        src="http://172.20.95.130:8086/hi.html?dir=Sample%20Reports/panel-1&file=sample_dashboard.efw&mode=open"
        height="100%"
        width="100%"
        class="ifm"
      />
    </div>
    <div class="panel">
      <iframe
        src="http://172.20.95.130:8086/hi.html?dir=Sample%20Reports/panel-1&file=sample_dashboard.efw&mode=open"
        height="100%"
        width="100%"
        class="ifm"
      />
    </div>
    <div class="panel">
      <iframe
        src="http://172.20.95.130:8086/hi.html?dir=Sample%20Reports/panel-1&file=sample_dashboard.efw&mode=open"
        height="100%"
        width="100%"
        class="ifm"
      />
    </div>

  </div>
</template>

<script>

import draggable from 'vuedraggable'

export default {
  name: 'Panel',
  components: {
    draggable
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      id: 0,
      loading: false,
      tempRoute: {},
      list: [
        { name: '视图',
          id: 1,
          width: 500,
          height: 300
        },
        { name: '视图',
          id: 2,
          width: 400,
          height: 200
        },
        { name: '视图',
          id: 3,
          width: 300,
          height: 500
        },
        { name: '视图',
          id: 4,
          width: 200,
          height: 600
        },
        { name: '视图',
          id: 5,
          width: 800,
          height: 700
        },
        { name: '视图',
          id: 6,
          width: 800,
          height: 500
        },
        { name: '视图',
          id: 7,
          width: 800,
          height: 400
        }
      ]
    }
  },
  computed: {
  },
  created() {
    this.id = this.$route.params && this.$route.params.id
    this.tempRoute = Object.assign({}, this.$route)
    this.setTagsViewTitle()
    this.setPageTitle()
  },
  methods: {
    setData(dataTransfer) {
      // to avoid Firefox bug
      // Detail see : https://github.com/RubaXa/Sortable/issues/1012
      dataTransfer.setData('Text', '')
    },
    setTagsViewTitle() {
      const title = '面板'
      const route = Object.assign({}, this.tempRoute, { title: `${title}-${this.id}` })
      this.$store.dispatch('tagsView/updateVisitedView', route)
    },
    setPageTitle() {
      const title = '面板'
      document.title = `${title} - ${this.id}`
    }
  }
}
</script>

<style lang="scss" scoped>
  .board-column {
    min-width: 300px;
    min-height: 100px;
    height: auto;
    overflow: hidden;
    background: #f0f0f0;
    border-radius: 3px;

    .board-column-header {
      height: 50px;
      line-height: 50px;
      overflow: hidden;
      padding: 0 20px;
      text-align: center;
      background: #333;
      color: #fff;
      border-radius: 3px 3px 0 0;
    }

    .board-column-content {
      height: auto;
      overflow: hidden;
      border: 10px solid transparent;
      min-height: 60px;
      display: flex;
      justify-content: flex-start;
      flex-direction: row;
      flex-wrap:wrap;
      /*align-items: center;*/

      .board-item {
        cursor: pointer;
        width: 100%;
        height: 64px;
        margin: 5px;
        background-color: #fff;
        text-align: left;
        line-height: 54px;
        padding: 5px 10px;
        box-sizing: border-box;
        box-shadow: 0px 1px 3px 0 rgba(0, 0, 0, 0.2);
      }
    }
  }
</style>
