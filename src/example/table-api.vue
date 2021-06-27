<template>
  <section class="container">
    <div>分页表格(接口数据)</div>
    <bc-table
      :config="tableConfig"
      :data="tableData"
      pagination
      :params.sync="params"
      :api="getList"
      :custom="false"
    >
    </bc-table>
  </section>
</template>

<script>
import Mock from 'mockjs';
export default {
  name: 'tablePage',
  data() {
    return {
      params: {
        page: 1,
        rows: 20,
      },
      total: 100,
      tableConfig: [
        { label: '姓名', prop: 'name' },
        { label: '年龄', prop: 'age' },
        { label: '身高', prop: 'height', unit: 'm' },
        { label: '体重', prop: 'weight', unit: 'kg' },
      ],
      tableData: [],
    }
  },
  methods: {
    getList() {
      const { rows } = this.params;
      const data = Mock.mock({
        [`rows|${rows}`]: [{
          name: '@cname',
          age: '@integer(1,100)',
          height: '@float(100, 180, 2, 2)',
          weight: '@float(40, 100, 2, 2)'
        }]
      })
      return Promise.resolve({
        data: {
          ...data,
          total: 100,
        }
      })
    }
  }
}
</script>
