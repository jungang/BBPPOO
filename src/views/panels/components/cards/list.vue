<template>
  <div class="list-container">

    <el-row
      v-for="row in data"
      :key="row.categoryName"
      class="row"
    >
      <el-col :span="7" style="text-align: right; font-size: 14px">{{ row.slot1 }} <br>
        <span v-if="row.slot2" class="gray">目标 {{ row.slot2 }}</span>
      </el-col>
      <el-col v-if="row.slot3" :span="10" style="text-align: right">
        <span class="emphasize" :class="row.highlightStyle">

          {{ row.slot3 }}

        </span>
        <span class="gray" style="width: 40px; display: inline-block;text-align:left; text-indent: 5px">
          {{ row.slot4 }}
        </span>

      </el-col>
      <el-col v-if="row.slot3 && row.slot2" :span="5" style="text-align: right">{{ row.slot5 && row.slot5+ '%' }}</el-col>
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
  .list-container{
    min-height: 120px;
  }
    .title{
      background: #dbdbdb;
      padding: 10px;
    }

    .emphasize{
      /*color: #131313;*/
      font-size: 16px;
      /*font-weight: bold;*/
    }

    .gray{
      font-size: 12px;
      color: #bababa;
    }

    .el-divider{
      margin: 10px 0 ;
    }
    .row{
      display: flex;
      align-items:center;
      border-bottom: 1px #d3d3d3 solid;
      padding: 2px 0;
    }
</style>
