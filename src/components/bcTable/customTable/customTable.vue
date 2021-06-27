<template>
  <!-- <main> -->
    <el-table
      :class="['custom-table', { 'custom-icon': customIcon }, { 'current-hover': hiddenCurrent }, { 'body-border': bodyBorder}]"
      ref="elTable"
      border
      :data="data"
      header-cell-class-name="custom-header"

      v-bind="$attrs"
      v-on="$listeners"
      @current-change="handleCurrentChange"
      @cell-click="handleCellClick"
      @row-contextmenu="handleRowContextmenu"
    >
      <template v-if="config">
        <el-table-column
          v-for="item in tableConfig"
          :key="item.prop"
          v-bind="{...item}"
          :show-overflow-tooltip="showOverflowTooltip || item.showOverflowTooltip"
        >
          <template v-if="item.children && item.children.length > 0">
            <el-table-column
              v-for="each in item.children"
              :key="each.prop"
              v-bind="each"
            >
              <template #header="{column, $index}">
                <slot v-if="each.header" :name="`${each.prop}-header`" v-bind="{column, $index}" />
                <span v-else :class="{'wrap-header': wrapHeader}">{{column.label}}</span>
              </template>
              <template #default="{row, column, $index}" >
                <slot
                  :name="each.prop"
                  v-bind="{row, column, $index}"
                >
                  {{each.filter
                    ? (typeof each.filter === 'function'
                      ? each.filter(row[column.property]) || 'N/A'
                      : each.filter[row[column.property]] || row[column.property]) || 'N/A'
                    : generateValue(row, column, each)}}
                </slot>
              </template>
            </el-table-column>
          </template>
          <template #header="{column, $index}">
            <slot v-if="item.header" :name="`${item.prop}-header`" v-bind="{column, $index}" />
            <move-header
              v-else-if="columnOperate"
              :columnOperate="columnOperate"
              :column="column"
              :layout="generateLayout($index)"
              :fnMoveColumn="direct => handleMoveColumn(column, direct)"
              :fnRemove="handleRemove"
            />
            <span v-else :class="{'wrap-header': wrapHeader}">{{column.label}}</span>
          </template>
          <template v-if="item.type === 'expand'" #default="{row, column, $index}">
            <slot name="expand" v-bind="{row, column, $index}" />
          </template>
          <template v-else-if="item.editable" #default="{row, column}">
            <cell-edit :value="generateValue(row, column, item)" :unit="(config.unit || '')" @save="(cell) => { $parent.$emit('save', parseData(cell, row, column), column.property, cell) }" />
          </template>
          <template v-else-if="!item.type" #default="{row, column, $index}" >
            <slot
              :name="item.prop"
              v-bind="{row, column, $index}"
            >
              {{item.filter
                ? (typeof item.filter === 'function'
                  ? item.filter(row[column.property]) || 'N/A'
                  : item.filter[row[column.property]] || row[column.property]) || 'N/A'
                : generateValue(row, column, item)}}
            </slot>
          </template>
          <template v-else-if="item.type === 'radio'" #default="{row}">
            <el-radio
              v-model="radio"
              :label="getRowKey(row, $attrs['row-key'])"
              :disabled="item.selectable ? !item.selectable(row) : false"
              @input="() => { emit('radio', radio, row); emit('select', [row]) }"
            ><span></span></el-radio>
          </template>
        </el-table-column>
      </template>
      <slot v-else />
    </el-table>
    <!-- <el-tooltip ref="tooltip" />
  </main> -->
  <!-- <contextmenu
    ref="contextmenu"
    @contextmenu="handleContextmenuEvent"
    :buttonControl="buttonControl"
    :contextItem="contextItem"
  ><slot name="contextmenu" v-bind="contextmenuData" /></contextmenu> -->
</template>

<script>
import cellEdit from './cellEdit';
import moveHeader from './moveHeader';
import Vue from 'vue';
export default Vue.extend({
  name: 'custom-table',
  inheritAttrs: false,
  props: {
    disableTravel: Boolean,
    bodyBorder: Boolean,
    wrapHeader: Boolean,
    showOverflowTooltip: Boolean,
    hiddenCurrent: Boolean,
    contextItem: Array,
    contextmenu: Boolean,
    rowEdit: Boolean,
    ctrlClick: Boolean,
    banSelectAll: Boolean,
    refs: String,
    customIcon: Boolean,
    data: {
      type: Array,
      // required: true,
      default: () => [],
    },
    config: {
      type: Array,
    },
    columnOperate: {
      type: Boolean,
    },
    htmlContent: [Boolean],
    header: {
      type: Array,
      default: () => ['remove', 'right', 'left'],
    }
  },
  components: {
    moveHeader,
    cellEdit,
    // contextmenu,
  },
  computed: {
    // tableConfig() {
    //   // console.log('change');
    //   // this.$forceUpdate();
    //   // const sumlProp = ['envName'];
    //   const sumlProp = [];
    //   const devProp = ['serviceIp'];
    //   this.$emit('update-config');
    //   return [...this.config].filter(item => {
    //     if (this.$currentEnv === 'suml') {
    //       return !sumlProp.includes(item.prop)
    //     } else if (this.$currentEnv === 'dev') {
    //       return !devProp.includes(item.prop)
    //     }
    //     return true;
    //   });
    // },
    buttonControl() {
      if (this.data.length === 1) {
        return ['delete'];
      }
      return [];
    }
  },
  watch: {
    config: {
      deep: true,
      immediate: true,
      handler(val) {
        if (!val || !Array.isArray(val)) {
          this.tableConfig = [];
          return;
        }
        const sumlProp = [];
        const devProp = ['serviceIp'];
        this.emit('update-config');
        this.tableConfig = [...val].filter(item => {
          if (this.$currentEnv === 'moni') {
            return !sumlProp.includes(item.prop)
          } else if (this.$currentEnv === 'dev') {
            return !devProp.includes(item.prop)
          }
          return true;
        });
      }
    },
    cellSelect(newList, oldList) {
      oldList.forEach(item => {
        if (!newList.includes(item)) {
          item.classList.remove('is-select');
        }
      });
      newList.forEach(item => {
        if (!item.className.includes('is-select')) {
          item.classList.add('is-select')
        }
      })
    }
  },
  created() {
    // this.ctrlClick && (this.$listeners['cell-click'] = this.handleCellClick);
    // this.dbClickEdit && (this.$listeners['row-dblclick'] = this.handleDbClickEdit);
    if (!this.hasListen) {
      document.addEventListener('click', this.clearCellSelect)
      this.hasListen = true;
    }
  },
  beforeDestroy() {
    document.removeEventListener('click', this.clearCellSelect);
  },
  data() {
    return {
      tableConfig: [],
      radio: '',
      cellSelect: [],
      cellRowSelect: [],
      currentRow: [],
      objFunction: Function,
      contextmenuData: {},
    }
  },
  mounted() {
    if (this.banSelectAll) {
      this.$nextTick().then(() => {
        const node = this.$refs.elTable.$el.querySelector('.custom-header');
        const checkbox = node.querySelector('.el-checkbox');
        checkbox && checkbox.remove();
      })
    }
  },
  methods: {
    setCurrentRow(row) {
      this.$refs.elTable.setCurrentRow(row);
    },
    parseData(value, row, column) {
      function getObject(res, index) {
        const key = path[index];
        if (res[key] instanceof Object) {
          return getObject(res[key], index + 1);
        } else {
          return { obj: res, key: key };
        }
      }

      const path = column.property.split('.');
      const { obj, key } = getObject(row, 0);
      obj[key] = value;
      return row;
    },
    getRowKey(row, rowKey) {
      if (typeof rowKey === 'function') {
        return rowKey(row)
      } else {
        return row[rowKey];
      }
    },
    emit(event, ...params) {
      if (this.$parent.$options._componentTag === 'bc-table') {
        this.$parent.$emit(event, ...params)
      } else {
        this.$emit(event, ...params);
      }
    },
    generateValue(row, column, config) {
      const emptyText = config.noNA ? '' : 'N/A';
      if (this.disableTravel) {
        return row[column.property] || emptyText;
      }
      function getPathValue(data, keys, index) {
        const key = keys[index];
        if (data[key] instanceof Object && !Array.isArray(data[key])) {
          return getPathValue(data[key], keys, index + 1);
        } else {
          return data[key];
        }
      }
      const path = column.property.split('.');
      let res = '';
      res = getPathValue(row, path, 0)
      if (Array.isArray(res) && res.length === 0) {
        res = '';
      }
      if (res !== '' && (res || res === 0)) {
        return res + (config.unit || '');
      } else {
        return emptyText;
      }
    },

    handleRowContextmenu(row, column, event) {
      if (!this.contextmenu) {
        return;
      }
      event.preventDefault();
      this.currentRow = row;
      this.emit('contextmenu', { column, row, event });
    },
    handleCurrentChange(currentRow, oldRow) {
      this.rowEdit && oldRow && (oldRow.editable = false);
    },
    clearCellSelect(e) {
      // const contextmenu = this.$refs.contextmenu;
      // contextmenu && !e.path.includes(contextmenu.$el) && contextmenu.hide();
      if (!e.ctrlKey) {
        this.cellSelect = [];
        this.cellRowSelect = []
      }
      if (this.rowEdit) {
        const node = this.$refs.elTable.$el;
        // if (!e.path.includes(node) && !e.path.includes(contextmenu.$el)) {
        if (!e.path.includes(node)) {
          (this.currentRow.editable = false);
        }
      }
    },
    handleCellClick(row, column, cell, event) {
      const list = [...this.cellSelect];
      if (event.ctrlKey && this.ctrlClick) {
        if (row !== this.currentRow) {
          list.length = 0;
          this.cellRowSelect = []
        }
        if (!list.includes(cell)) {
          list.push(cell);
          this.cellRowSelect.push([column.property, row[column.property]]);
        } else {
          const index = list.findIndex(item => item === cell);
          list.splice(index, 1);
          this.cellRowSelect.splice(index, 1);
        }
        this.currentRow = row;
      }
      this.cellSelect = [...list]
      this.emit('cell-click', row, column, cell, event, this.ctrlClick ? [...this.cellRowSelect] : undefined);
    },
    clearSelection() {
      this.$refs.elTable.clearSelection();
    },
    clearFilter(columnKey) {
      this.$refs.elTable.clearFilter(columnKey);
    },
    toggleRowSelection (row, selected) {
      this.$refs.elTable.toggleRowSelection(row, selected);
    },
    toggleRadio(row, selected) {
      if (typeof row !== 'object') {
        return;
      }
      const rowKey = this.$attrs['row-key']
      const key = typeof rowKey === 'function' ? rowKey(row) : rowKey;
      if (selected == null) {
        this.radio = this.radio ? '' : typeof rowKey === 'function' ? key : row[rowKey];
      } else {
        this.radio = !selected ? '' : (typeof rowKey === 'function' ? key : row[rowKey]);
      }
      this.emit('radio', this.radio, row);
    },
    toggleRowExpansion(row, expanded) {
      this.$refs.elTable.toggleRowExpansion(row, expanded);
    },
    generateLayout(index) {
      const layout = this.header.includes('remove') ? ['remove'] : [];
      if (index < 2) {
        return [];
      }
      this.header.includes('left') && index > 2 && layout.push('left');
      this.header.includes('right') && index !== this.config.length - 1 && layout.push('right');
      return layout;
    },
    handleMoveColumn(column, direct) {
      this.emit('moveColumn', column, direct);
    },
    handleRemove(column) {
      this.emit('removeColumn', column);
    }
  }
})
</script>

<style scoped lang="scss">
.custom-table.body-border {
  & /deep/ .el-table__row td {
    border-right: 1px solid #d9d9d9;
    padding: 2px 0px;
    // height: 46px;
  }
}
.custom-table {
  border: 1px solid #d9d9d9;
  &.el-table--border {
    border-right: none;
    border-bottom: none;
  }
  & /deep/ .el-table__row td {
    border-right: none;
    padding: 2px 0px;
    // height: 46px;
  }
  & /deep/ .custom-header {
    background: #f7f7f7 !important;
    color: #333;
    border-bottom: 1px solid #d9d9d9 !important;
    border-right : 1px solid #d9d9d9 !important;
  }
  & /deep/ td, & /deep/ th.is-leaf {
    border-bottom: 1px solid #d9d9d9 !important;
  }
  &::after, &::before {
    z-index: 4;
    background-color: #d9d9d9;
  }
}
.custom-table.current-hover {
  & /deep/ .el-table__body tr:hover>td {
    background-color: transparent;
  }
}
.custom-table {
  .wrap-header {
    white-space: pre-wrap;
  }
  & /deep/ .cell {
    min-height: 23px;
  }
  // & /deep/ .cell > span {
  //   display: inline-block;
  // }
  & /deep/ .is-select {
    background: yellow;
  }
  & /deep/ .gutter, .custom-header {
    background: #f5f7fa;
  }
  /* 隐藏表格expand原先的图标 */
  & /deep/ .custom-icon .el-table__expand-column .el-icon-arrow-right {
    display: none;
  }
  & /deep/ .custom-icon .el-table__expand-icon {
    &::before {
      transition: all .4s;
      content: '';
      display: block;
      background: #222;
      position: absolute;
      width: 10px;
      height: 1px;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
    &::after {
      transition: all .4s;
      content: '';
      display: block;
      background: #222;
      position: absolute;
      width: 1px;
      height: 10px;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
  & /deep/ .custom-icon .el-table__expand-icon--expanded {
    transition: all .4s;
    transform: none;
    &::before {
      transform: translate(-50%, -50%) rotate(180deg);
    }
    &::after {
      transform: translate(-50%, -50%) rotate(-90deg);
    }
  }
}
</style>
