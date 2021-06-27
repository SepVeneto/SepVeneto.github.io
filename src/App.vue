<template>
  <div id="app">
    <aside class="menu">
      <ul>
        <li
          :class="['menu-link', { 'is-active': active === item.prop }]"
          v-for="item in menus"
          :key="item.prop"
          @click="handleClick(item.prop)"
        >{{item.name}}</li>
      </ul>
    </aside>
    <section class="wrapper" v-if="active === 'table'">
      <svg-icon icon="bcEdit" />
      <basic />
      <custom-cell />
      <custom-header />
      <multile-header />
      <row-span />
      <ellipsis />
      <radio />
      <cell-edit />
      <simple-table />
      <table-page />
      <table-api />
    </section>
  </div>
</template>

<script>
import basic from './example/basic.vue';
import customCell from './example/custom-cell.vue';
import customHeader from './example/custom-header.vue';
import multileHeader from './example/multile-header.vue';
import rowSpan from './example/row-span.vue';
import ellipsis from './example/ellipsis.vue';
import radio from './example/radio.vue';
import cellEdit from './example/cell-edit.vue';
import simpleTable from './example/simple-table.vue';
import tablePage from './example/table-page.vue';
import tableApi from './example/table-api.vue';

export default {
  name: 'App',
  components: {
    basic,
    customCell,
    customHeader,
    multileHeader,
    rowSpan,
    ellipsis,
    radio,
    cellEdit,
    simpleTable,
    tablePage,
    tableApi,
  },
  data() {
    return {
      active: '',
      menus: [
        { name: '表格', prop: 'table' },
        { name: '输入框', prop: 'input' },
        { name: '选择框', prop: 'select' },
        { name: '按钮', prop: 'button' },
        { name: '搜索栏', prop: 'search' },
        { name: '开关', prop: 'switch' },
      ]
    }
  },
  methods: {
    handleClick(prop) {
      this.active = prop;
    }
  }
}
</script>

<style lang="scss">
#app {
  display: flex;
}
.menu {
  width: 200px;
}
.wrapper {
  margin: 0 auto;
}
.is-active {
  background: #4903ff;
  color: #fff;
}
.menu-link {
  cursor: pointer;
  padding: 10px 20px;
  transition: all .3s;
  &:hover {
    background: #490eff;
    color: #fff;
  }
}
</style>
