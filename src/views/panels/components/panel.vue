<template>
  <div class="app-container">
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
          :style="{
            width: element.width + 'px',
            minWidth: element.width + 'px',
            height: element.height + 'px' }"
        >
          <vue-draggable-resizable
            :w="element.width"
            :h="element.height"
            :min-width="400"
            :min-height="400"
            :parent="false"
            :draggable="false"
            :resizable="true"
            class-name="my-class"
            @resizing="(x, y, width, height)=>onResize(x, y, width, height, element)"
          >
            <drill
              :ref="element.id"
              :data="element"
              :panel.sync="panel"
              :title.sync="element.panelTitle"
              :view="element.viewName"
            />

          </vue-draggable-resizable>

          <div class="title handle-drag">
            <el-row>
              <el-col :span="12">{{ element.panelTitle }}</el-col>
              <el-col :span="12" align="end">
                <i class="el-icon-arrow-up" @click="maxPanel(element)" />
                <!--                <div @click="maxPanel(element)">-->
                <!--                  放大-->
                <!--                </div>-->
              </el-col>
            </el-row>

          </div>

        </li>
      </transition-group>

    </draggable>

    <el-dialog
      :title="max_element.panelTitle"
      :visible.sync="maxVisible"
      width="100%"
      top="0"
      style="height: 100vh"
    >
      <drill
        ref="maxPanel"
        :key="max_element.id"
        :data="max_element"
        :panel.sync="panel"
        :title.sync="max_element.panelTitle"
        :view="max_element.viewName"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="maxVisible = false">关闭</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { fetchPanel, saveLayout } from '@/api/panel'
import draggable from 'vuedraggable'
import VueDraggableResizable from 'vue-draggable-resizable'
import 'vue-draggable-resizable/dist/VueDraggableResizable.css'
// eslint-disable-next-line no-unused-vars
// import chart from './charts/charts'
// import tabular from './tables/table'
import uuidv1 from 'uuid/v1'
import drill from './charts/drill-down'
import { deepClone } from '@/utils'

export default {
  name: 'Panel',
  components: {
    draggable,
    VueDraggableResizable,
    // chart,
    // tabular,
    drill
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      max_element: {},
      maxVisible: false,
      title: '',
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
        console.log('watch....')
        this.saveLayout()
      }
    }
  },
  created() {
    // console.log(this.$route.params)
    this.id = this.$route.params && this.$route.params.id
    this.tempRoute = Object.assign({}, this.$route)
    this.getPanel(this.id)
    // this.setTagsViewTitle()
    // this.setPageTitle()
    // this.loadLayout()
  },
  methods: {
    maxPanel(element) {
      const _max_element = deepClone(element)
      _max_element.id = uuidv1()
      _max_element.chartId = uuidv1()

      this.max_element = _max_element
      this.maxVisible = true
      this.$nextTick(() => {
        console.log(this.$refs.maxPanel)
        console.log(this.$refs.maxPanel.chart.id)
        if (this.$refs.maxPanel.chart.id) {
          // this.$refs.maxPanel.chart.dispose()
          // this.$refs.maxPanel.init()
        }
        // this.$refs.maxPanel.init()
        // this.maxChart = echarts.init(document.getElementById('maxChart'))
        // this.maxChart.setOption(this.options)
      })
    },
    getPanel(id) {
      fetchPanel(id).then(response => {
        this.panel = response.data

        // console.log('this.panel.list', this.panel.list)

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
        // console.log(this.id)
        // console.log(this.panel.id)
        // this.panel.id = this.id

        saveLayout(this.panel).then(response => {
          this.$message({
            message: '版式布局更新',
            type: 'success'
          })
        })

        // localStorage.setItem('layout' + this.id, JSON.stringify(this.panel.list))
        // console.log(JSON.parse(localStorage.getItem('layout' + this.id)))
      }, 1000)
    },
    onResize: function(x, y, width, height, el) {
      el.width = width
      el.height = height
      this.saveLayout()
    },
    setData(dataTransfer) {
      dataTransfer.setData('Text', '')
    },
    setTagsViewTitle() {
      const title = '报表-' + this.panel.title
      // const route = Object.assign({}, this.tempRoute, { title: `${title}-${this.id}` })
      const route = Object.assign({}, this.tempRoute, { title: `${title}` })
      this.$store.dispatch('tagsView/updateVisitedView', route)
    },
    setPageTitle() {
      const title = 'BPO运营数据分析工具系统'
      document.title = `月度经营分析-${title}`
    }
  }
}
</script>

<style lang="scss">
  .handle-tr,
  .handle-tl,
  .handle-ml,
  .handle-mr,
  .handle-tm,
  .handle-bl,
  .handle-bm,
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
    position: absolute;
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

