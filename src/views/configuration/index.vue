<template>
  <div class="app-container">
    <el-tabs v-model="activeName">
      <el-tab-pane label="基础数据配置" name="base">
        <baseConfig />
      </el-tab-pane>
      <el-tab-pane label="项目基础配置" name="project">
        <projectConfig />
      </el-tab-pane>
      <el-tab-pane label="科目配置" name="subject">
        <subjectConfig />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import baseConfig from './baseConfig'
import projectConfig from './projectConfig'
import subjectConfig from './subjectConfig'

export default {
  name: 'Configuration',
  components: { baseConfig, projectConfig, subjectConfig },
  data() {
    return {
      activeName: 'base'
    }
  },
  created() {},
  methods: {}
}
</script>
