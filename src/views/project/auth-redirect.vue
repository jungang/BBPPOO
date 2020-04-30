<template>
  <div class="project-container">
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
            <el-button type="primary">
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
export default {
  name: 'Project',
  data() {
    return {
      projectList: [
        {
          title: '项目队列AAAAAA',
          projectId: '00000000-0000-0000-0000-000000000000'
        },
        {
          title: '项目队列BBBBBB',
          projectId: '00000000-0000-0000-0000-000000000001'
        },
        {
          title: '项目队列CCCC',
          projectId: '00000000-0000-0000-0000-000000000002'
        },
        {
          title: '项目队列D',
          projectId: '00000000-0000-0000-0000-000000000003'
        },
        {
          title: '项目队列D',
          projectId: '00000000-0000-0000-0000-000000000004'
        },
        {
          title: '项目队列D',
          projectId: '00000000-0000-0000-0000-000000000005'
        },
        {
          title: '项目队列D',
          projectId: '00000000-0000-0000-0000-000000000006'
        },
        {
          title: '项目队列D',
          projectId: '00000000-0000-0000-0000-000000000007'
        },
        {
          title: '项目队列D',
          projectId: '00000000-0000-0000-0000-000000000008'
        }
      ]
    }
  },
  created() {
    console.log('Project')
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
      margin-top: 200px;
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
