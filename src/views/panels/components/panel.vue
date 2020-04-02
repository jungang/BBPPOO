<template>
  <div class="board-column">

    <draggable
      :list="list"
      v-bind="dragOptions"
      tag="ul"
      :set-data="setData"
      handle=".handle"
      @start="drag = true"
      @end="drag = false"
    >
      <transition-group type="transition" :name="!drag ? 'flip-list' : null">

        <li
          v-for="element in list"
          :key="element.id"
          class="list-group-item"
          :style="{ width: element.width + 'px', height: element.height + 'px' }"
        >
          <div class="title handle">{{ element.name }} {{ element.id }}</div>
        </li>
      </transition-group>

    </draggable>

    <div class="panel" style="width: 550px">
      <iframe
        src="http://172.20.95.130:8086/hi?dir=Sample%20Reports/panel-1&file=sample_dashboard.efw&mode=open"
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
      drag: false,
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
    dragOptions() {
      return {
        animation: 200,
        group: 'description',
        disabled: false,
        ghostClass: 'ghost'
      }
    }
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
  .flip-list-move {
    transition: transform 0.5s;
  }
  .no-move {
    transition: transform 0s;
  }
  .ghost {
    opacity: 0.5;
    background: #c8ebfb;
  }
  .list-group {
    min-height: 20px;
    display: flex;
  }
  .handle {
    cursor: move;
  }
  .list-group-item i {
    cursor: pointer;
  }
</style>
