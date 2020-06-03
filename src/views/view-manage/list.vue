<template>
  <div class="app-container">
    <el-table v-loading="listLoading" :data="list" size="mini" max-height="900" border stripe fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="name" prop="name" width="150" />
      <el-table-column align="center" label="title" prop="title" width="150" />
      <el-table-column align="center" label="description" prop="description" width="150" />
      <el-table-column align="left" label="items" width="300">
        <template slot-scope="{row}">

          <el-row v-if="row.items.all" type="flex" align="middle" style="border-bottom: solid 1px #d3d3d3">
            <el-col :span="5"><el-tag>all</el-tag></el-col>
            <el-col :span="19">
              <span v-for="item in row.items.all" :key="item"> {{ item }}<br></span>
            </el-col>
          </el-row>
          <el-row v-if="row.items.group" type="flex" align="middle" style="border-bottom: solid 1px #d3d3d3">
            <el-col :span="5"><el-tag>group</el-tag></el-col>
            <el-col :span="19">
              <span v-for="item in row.items.group" :key="item"> {{ item }}<br></span>
            </el-col>
          </el-row>
          <el-row v-if="row.items.local" type="flex" align="middle">
            <el-col :span="5"><el-tag>local</el-tag></el-col>
            <el-col :span="19">
              <span v-for="item in row.items.local" :key="item"> {{ item }}<br></span>
            </el-col>
          </el-row>
          <el-row v-if="row.items['*']" type="flex" align="middle">
            <el-col :span="5"><el-tag>*</el-tag></el-col>
            <el-col :span="19">
              <span v-for="(item, index) in row.items['*']" :key="index"> {{ item }}<br></span>
            </el-col>
          </el-row>

        </template>
      </el-table-column>
      <el-table-column align="center" label="location" prop="location" width="100" />
      <el-table-column align="center" label="parameters" prop="parameters" width="100" />
      <el-table-column align="center" label="config.rule" width="150">
        <template slot-scope="{row}">
          <span v-for="(item, index) in row.config.rule" :key="index"> {{ item }}<br></span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="config.dashboardName" prop="config.dashboardName" width="100" />
      <el-table-column align="center" label="config.pagesName" prop="config.pagesName" width="100" />
      <el-table-column align="center" label="config.panelName" prop="config.panelName" width="100" />
      <el-table-column align="center" label="config.zoneName" prop="config.zoneName" width="100" />
      <el-table-column align="center" label="config.index" prop="config.index" width="100" />
      <el-table-column align="center" label="config.viewIndex" prop="config.viewIndex" width="100" />
      <el-table-column align="center" label="config.component" prop="config.component" width="200">
        <template slot-scope="{row}">
          <div v-if="row.config.component">
            <span>type:{{ row.config.component.type }}</span><br>
            <span>fold:{{ row.config.component.fold }}</span><br>
            <span>sort:{{ row.config.component.sort }}</span><br>
            <span>ratio:{{ row.config.component.ratio }}</span><br>
            <span>style:{{ row.config.component.style }}</span><br>
            <span>legendSelectMode:{{ row.config.component.legendSelectMode }}</span><br>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="config.param" prop="config.param" width="100" />
      <el-table-column align="center" label="config.compare" prop="config.compare" width="100" />
      <el-table-column align="center" label="config.completion" prop="config.completion" width="100" />
      <el-table-column align="center" label="config.rowIndex" prop="config.rowIndex" width="100" />
      <el-table-column align="center" label="config.rowTitle" prop="config.rowTitle" width="100" />
      <el-table-column align="center" label="config.tabIndex" prop="config.tabIndex" width="100" />
      <el-table-column align="center" label="config.tabTitle" prop="config.tabTitle" width="100" />
      <el-table-column align="center" label="Actions" width="120">
        <template slot-scope="scope">
          <router-link :to="'/example/edit/'+scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit">
              编辑
            </el-button>
          </router-link>
        </template>
      </el-table-column>
    </el-table>

    <!--    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />-->
  </div>
</template>

<script>
// import { fetchList } from '@/api/article'
// import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'ArticleList',
  // components: { Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.list = this.$store.state.options.views
      console.log('this.list:', this.list)
      this.listLoading = false
    }
  }
}
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>
