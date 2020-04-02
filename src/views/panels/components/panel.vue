<template>
  <div class="app-container">

    <el-button type="primary" @click="saveLayout">保存版式</el-button>
    <el-button @click="loadLayout">读取版式</el-button>

    <draggable
      :list="list"
      v-bind="dragOptions"
      tag="ul"
      :set-data="setData"
      handle=".handle-drag"
      @start="drag = true"
      @end="drag = false"
    >
      <transition-group type="transition" :name="!drag ? 'flip-list' : null" class="list-group">

        <li
          v-for="element in list"
          :key="element.id"
          class="list-group-item"
          :style="{ width: element.width + 'px', height: element.height + 'px' }"
        >

          <vue-draggable-resizable
            :w="element.width"
            :h="element.height"
            :min-width="100"
            :min-height="100"
            :parent="false"
            :draggable="false"
            :resizable="true"
            class-name-active="my-active-class"
            class-name="my-class"
            @resizing="(x, y, width, height)=>onResize(x, y, width, height, element)"
          >

            <div class="chartDiv">

              图表
            </div>
          </vue-draggable-resizable>

          <div class="title handle-drag">{{ element.name }} {{ element.id }}</div>

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
import VueDraggableResizable from 'vue-draggable-resizable'
import 'vue-draggable-resizable/dist/VueDraggableResizable.css'

export default {
  name: 'Panel',
  components: {
    draggable,
    VueDraggableResizable
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
      ],
      width: 0,
      height: 0,
      x: 0,
      y: 0
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
    saveLayout() {
      console.log('saveLayout....')
      localStorage.setItem('layout' + this.id, JSON.stringify(this.list))
      console.log(JSON.parse(localStorage.getItem('layout' + this.id)))
    },
    loadLayout() {
      console.log('loadLayout....')
      this.list = JSON.parse(localStorage.getItem('layout' + this.id)) || this.list
      console.log(this.list)
    },
    onResize: function(x, y, width, height, el) {
      el.width = width
      el.height = height
    },
    onResizeStart: function(el) {
    },
    onDrag: function(x, y) {
      this.x = x
      this.y = y
    },
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

<style lang="scss">
  .handle-tr,
  .handle-tl,
  .handle-ml,
  .handle-tm,
  .handle-bl,
  {
    display: none !important;
  }
</style>

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
    flex-direction: row;
    flex-wrap: wrap;
  }
  .handle-drag {
    position: absolute;
    width: 100%;
    background: #d8e1f3;
    padding: 5px;
    cursor: move;
  }
  .list-group-item{
    background: white;
    position: relative;
    border: 1px solid #cecece;
    list-style: none;
    margin: 10px 10px 0 0;
  }
  .chartDiv{
    margin-top: 25px;
    padding: 5px;
  }
  .my-class {
    border: none;
    transition: background-color 200ms linear;
  }

  .my-active-class {
    border: none;
    /*box-shadow: 5px 5px 10px 10px rgba(124, 124, 124, 0.6);*/
  }
  ul{
    padding: 0;
  }
</style>

