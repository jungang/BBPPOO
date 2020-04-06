<template>
  <div class="app-container">

    <el-row type="flex">
      <el-col :span="12">
        <h3>
          报表
        </h3>
      </el-col>
      <el-col :span="12" style="text-align: end">
        <el-button type="primary">新建图表</el-button>
      </el-col>
    </el-row>

    <draggable
      :list="panel.list"
      v-bind="dragOptions"
      tag="ul"
      :set-data="setData"
      handle=".handle-drag"
      @start="drag = true"
      @end="onEnd"
    >
      <transition-group type="transition" :name="!drag ? 'flip-list' : null" class="list-group">

        <li
          v-for="element in panel.list"
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
            <component
              :is="element.component"
              :data="element"
              :panel.sync="panel"
              :view="element.viewName"
            />

          </vue-draggable-resizable>

          <div class="title handle-drag">{{ element.title }}</div>

        </li>
      </transition-group>

    </draggable>

  </div>
</template>

<script>
import { fetchPanel, saveLayout } from '@/api/panel'
import draggable from 'vuedraggable'
import VueDraggableResizable from 'vue-draggable-resizable'
import 'vue-draggable-resizable/dist/VueDraggableResizable.css'
// eslint-disable-next-line no-unused-vars
import charts from './charts/charts'
import charts2 from './charts/charts2'

export default {
  name: 'Panel',
  components: {
    draggable,
    VueDraggableResizable,
    charts,
    charts2
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
      timer: {},
      loading: false,
      drag: false,
      tempRoute: {},
      panel: {
        id: 0,
        title: '',
        isCreate: false,
        dateType: '',
        dateValue: 1,
        list: []
      },

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
  watch: {
    'panel.list'(val, oldVal) {
      if (oldVal.length !== 0) {
        this.saveLayout()
      }
    }
  },
  created() {
    this.id = this.$route.params && this.$route.params.id
    this.tempRoute = Object.assign({}, this.$route)
    this.getPanel(this.id)
    // this.setTagsViewTitle()
    // this.setPageTitle()
    // this.loadLayout()
  },
  methods: {
    getPanel(id) {
      fetchPanel(id).then(response => {
        this.panel = response.data
        this.setTagsViewTitle()
        this.setPageTitle()
      }).catch(err => {
        console.log(err)
      })
    },
    onEnd() {
      this.drag = false
      // this.saveLayout()
    },
    saveLayout() {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        // console.log('saveLayout....')

        saveLayout({ id: this.id, layout: this.panel.list }).then(response => {
          this.$message({
            message: '版式布局更新',
            type: 'success'
          })
        })

        localStorage.setItem('layout' + this.id, JSON.stringify(this.panel.list))
        // console.log(JSON.parse(localStorage.getItem('layout' + this.id)))
      }, 1000)
    },
    loadLayout() {
      // console.log('loadLayout....')
      this.panel.list = JSON.parse(localStorage.getItem('layout' + this.id)) || this.panel.list
      // console.log(this.list)
    },
    onResize: function(x, y, width, height, el) {
      el.width = width
      el.height = height
      this.saveLayout()
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
      const title = '报表-' + this.panel.title
      // const route = Object.assign({}, this.tempRoute, { title: `${title}-${this.id}` })
      const route = Object.assign({}, this.tempRoute, { title: `${title}` })
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
    margin: 12px 12px 0 0;
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
    +.handle-drag{
      background: rgba(130, 129, 168, 0.75);
    }
    /*box-shadow: 5px 5px 10px 10px rgba(124, 124, 124, 0.6);*/
  }
  ul{
    padding: 0;
    margin: 0;
  }
</style>

