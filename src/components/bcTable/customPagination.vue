<template>
  <el-pagination
    class="custom-pagination"
    :background="background"
    style="text-align: right"
    :page-sizes="pageSizes || [5, 10, 20, 50]"
    :layout="layout"
    v-bind="$attrs"
    v-on="$listeners"
  />
</template>

<script>
export default {
  name: 'custom-pagination',
  props: {
    pageSizes: Array,
    layout: {
      type: String,
      default: 'total, prev, pager, next, sizes, jumper'
    },
    background: {
      type: Boolean,
      default: true,
    }
  },
}
</script>

<style lang="scss" scoped>
.custom-pagination {
  background: #fff;
  padding: 10px 40px;
  border: 1px solid #d9d9d9;
  border-top: none;
  border-bottom: none;
  position: relative;
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    height: 1px;
    width: 100%;
    background: #d9d9d9;
  }
}
</style>
