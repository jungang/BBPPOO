<template>
  <div class="project-container">
    <el-row type="flex" justify="center" style="margin-top: 50px">
      <el-col :span="24" style="color: white; text-align: center "><h2>BPO运营数据分析工具系统</h2></el-col>
    </el-row>
    <el-row class="row">
      <el-card
        v-for="(item) in projectList"
        :key="item.projectId"
        class="card"
        shadow="hover"
      >
        <img :src="bg" class="image">
        <el-row style="margin: 10px">{{ item.description }}</el-row>
        <el-row style="margin: 20px">
          <router-link to="/">
            <el-button type="primary" @click="linkTo(item)">
              进入
            </el-button>
          </router-link>
        </el-row>

        <!--        <span style="font-size: 5px">{{ item.create_time || "2020-00" }}</span>-->
      </el-card>
    </el-row>

  </div>
</template>
<script>
import { fetchData } from '@/api/panel'
import bg from '@/assets/bg.jpg'
export default {
  name: 'Project',
  data() {
    return {
      projectList: [],
      bg: bg
    }
  },
  created() {
    this.getList()
  },
  methods: {
    linkTo(item) {
      this.$store.dispatch('user/setProjectId', item)
      localStorage.projectId = item.id
    },

    getList() {
      this.listLoading = true

      const data = {
        'vf_id': 0,
        'dir': 'Sample Reports/project',
        'vf_file': 'dashboard.efwvf'
      }
      // console.log('data:', data)
      fetchData(data).then(response => {
        console.log(response)
        this.projectList = response
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
