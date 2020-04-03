<template>
  <div class="app-container">

    <draggable
      :list="list"
      v-bind="dragOptions"
      tag="ul"
      :set-data="setData"
      handle=".handle-drag"
      @start="drag = true"
      @end="onEnd"
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

            <component :is="element.component" :data="element" />

          </vue-draggable-resizable>

          <div class="title handle-drag">{{ element.name }} {{ element.id }}</div>

        </li>
      </transition-group>

    </draggable>

  </div>
</template>

<script>
import { fetchData } from '@/api/chart-data'
import draggable from 'vuedraggable'
import VueDraggableResizable from 'vue-draggable-resizable'
import 'vue-draggable-resizable/dist/VueDraggableResizable.css'

// eslint-disable-next-line no-unused-vars
import charts from './charts/charts'

export default {
  name: 'Panel',
  components: {
    draggable,
    VueDraggableResizable,
    charts
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
      list: [
        { name: '视图',
          id: 1,
          component: 'charts',
          parameters: {},
          width: 500,
          height: 300
        },
        { name: '视图',
          id: 2,
          component: 'charts',
          parameters: {},
          width: 400,
          height: 200
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
    this.loadLayout()

    this.getData()
  },
  methods: {
    onEnd() {
      this.drag = false
      this.saveLayout()
    },
    getData() {
      // console.log('getData........')
      const data1 = {
        'dir': 'Sample Reports/panel-1',
        'start_date': '2015-01-01 12:00:00',
        'end_date': '2016-01-01 12:00:00',
        'vf_id': 2,
        'vf_file': 'sample_dashboard2.efwvf'
      }

      /*      const data2 = {
        'dir': 'Sample Reports/subject-0b394b00-fd83-48f2-9bb3-f13facf61c8a1473a497-87bd-4020-abf9-25388c1a539e',
        'start_date': '2015-01-01 12:00:00',
        'end_date': '2015-02-01 12:00:00',
        'vf_id': 1,
        'vf_file': 'sample_dashboard.efwvf'
      }*/

      fetchData(JSON.stringify(data1)).then(response => {
        console.log(response)
        // console.log(typeof response.data.script)
      })
    },

    saveLayout() {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        // console.log('saveLayout....')
        localStorage.setItem('layout' + this.id, JSON.stringify(this.list))
        // console.log(JSON.parse(localStorage.getItem('layout' + this.id)))
      }, 1000)
    },
    loadLayout() {
      // console.log('loadLayout....')
      this.list = JSON.parse(localStorage.getItem('layout' + this.id)) || this.list
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
  }
</style>

