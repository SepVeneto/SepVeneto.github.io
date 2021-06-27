<template>
  <section class="container">
    <div>多级表头</div>
    <bc-table
      :config="tableConfig"
      :data="tableData"
    >
    </bc-table>
  </section>
</template>

<script>
import bcTable from '../components/bcTable/bcTable.jsx';
import Mock from 'mockjs';
export default {
  name: 'ExampleMultileHeader',
  components: {
    bcTable,
  },
  data() {
    return {
      tableConfig: [
        { label: '姓名', prop: 'name' },
        { label: '年龄', prop: 'age' },
        {
          label: '个人信息',
          props: 'personal-info',
          children: [
            { label: '身高', prop: 'height' },
            { label: '体重', prop: 'weight' },
          ]
        }
      ],
      tableData: Mock.mock({
        'rows|10': [{
          name: '@cname',
          age: '@integer(1,100)',
          height: '@float(100, 180, 2, 2)',
          weight: '@float(40, 100, 2, 2)'
        }],
      }).rows
    }
  }
}
</script>
