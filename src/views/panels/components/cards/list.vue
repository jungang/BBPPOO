<template>
  <div class="list-container">

    <el-row
      v-for="row in data"
      :key="row.categoryName"
      class="row"
    >
      <el-col :span="7">{{ row.slot1 }} <br> <span v-if="row.slot2" class="gray">目标{{ row.slot2 }}</span> </el-col>
      <el-col v-if="row.slot3" :span="8"><span class="emphasize">{{ row.slot3 }}</span> {{ row.slot4 }}</el-col>
      <el-col v-if="row.slot3 && row.slot2" :span="7">{{ row.slot5 }}%</el-col>
    </el-row>

  </div>
</template>

<script>

export default {
  name: 'List',
  props: {
    data: {
      type: Array,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
    .title{
      background: #dbdbdb;
      padding: 10px;
    }
    .emphasize{
      font-size: 24px;
      font-weight: bold;
    }
    .gray{
      color: #bababa;
    }

    .el-divider{
      margin: 10px 0 ;
    }
    .row{
      border-bottom: 1px #d3d3d3 solid;
      padding: 10px 0;
    }
</style>
