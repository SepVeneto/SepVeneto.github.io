<template>
  <section class="container">
    <div>行内省略</div>
    <bc-table
      :config="tableConfig"
      :data="tableData"
      show-overflow-tooltip
    >
    </bc-table>
  </section>
</template>

<script>
import bcTable from '../components/bcTable/bcTable.jsx';
// import Mock from 'mockjs';
import basicData from './basicData.json';
export default {
  name: 'ExampleEllipsis',
  components: {
    bcTable,
  },
  data() {
    return {
      tableConfig: [
        { label: '国籍', prop: 'country' },
        { label: '生日', prop: 'date' },
        { label: '舰种', prop: 'catalog' },
        { label: '姓名', prop: 'name' },
        { label: '原名', prop: 'originName', showOverflowTooltip: true },
        { label: '地址', prop: 'address' },
        { label: '身高', prop: 'height' },
        { label: '体重', prop: 'weight' },
      ],
      tableData: basicData,
    }
  }
}
</script>
