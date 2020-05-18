<template>
  <div class="project-container">
    <el-row type="flex" justify="center" style="margin-top: 50px">
      <el-col :span="24" style="color: white; text-align: center "><h2>请选择项目，点击进入……</h2></el-col>
    </el-row>
    <el-row class="row">
      <el-card
        v-for="(item) in projectList"
        :key="item.projectId"
        class="card"
        shadow="hover"
      >
        <img src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png" class="image">
        <el-row style="margin: 10px">{{ item.title }}</el-row>
        <el-row style="margin: 20px">
          <router-link to="/">
            <el-button type="primary" @click="linkTo">
              进入
            </el-button>
          </router-link>
        </el-row>

        <span style="font-size: 5px">{{ item.projectId }}</span>
      </el-card>
    </el-row>

  </div>
</template>
<script>
import { projectFetchList } from '@/api/project'

export default {
  name: 'Project',
  data() {
    return {
      projectList: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    linkTo() {
      console.log('linkTo..')
      console.log(this.$store.user.apiTemplate)
      this.$store.dispatch('user/getInfo')
    },

    getList() {
      this.listLoading = true
      projectFetchList(this.listQuery).then(response => {
        this.projectList = response.data
        this.listLoading = false
      })
    }
  },
  render: function(h) {
    return h() // avoid warning message
  }
}
</script>

<style lang="scss" scoped>
  $bg:#2d3a4b;
  $dark_gray:#889aa4;
  $light_gray:#eee;

  .project-container {
    min-height: 100%;
    width: 100%;
    background-color: $bg;
    overflow: hidden;
    .row{
      margin-top: 50px;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
    }
    .card{
      text-align: center;
      display: inline-block;
      margin: 10px;
      img{
        width: 180px;
      }
    }

  }
</style>
