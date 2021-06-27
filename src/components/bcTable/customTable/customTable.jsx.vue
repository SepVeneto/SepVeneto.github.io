<script>
// import tools from '@/utils/tools'
import cellEdit from './cellEdit';
const visibleHeight = window.innerHeight;
export default {
  name: 'custom-table',
  props: {
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
    cellEdit,
  },
  render(h) {
    const moveHeader = (column, $index) => {
      return (
        <span
          class={{ 'wrap-header': this.wrapHeader }}
          on-mouseenter={this.handleMouseEnter}
          on-mouseleave={this.handleMouseLeave}
        >{column.label}</span>
        // <move-header
        //   columnOperate={this.columnOperate}
        //   column={column}
        //   layout={this.generateLayout($index)}
        //   fnMoveColumn={direct => this.handleMoveColumn(column, direct)}
        //   fnRemove={this.handleRemove}
        // />
      )
    }
    const renderRadio = (row, config) => {
      return (
        <el-radio
          onInput={val => {
            this.radio = val;
            this.$emit('radio', this.radio, row);
            this.$emit('select', [row]);
          }}
          value={this.radio}
          label={this.getRowKey(row, this.$attrs['row-key'])}
          disabled={config.selectable ? !config.selectable(row) : false}
        />
      )
    };
    const tableItem = (config) => {
      if (config.type === 'selection') {
        return (
          <el-table-column
            {...{
              attrs: config,
            }}
          ></el-table-column>
        )
      }
      return (
        <el-table-column
          {...{
            attrs: config,
            scopedSlots: {
              // default: ({ row, column, $index }) => {
              default: (data) => {
                const { row, column, $index } = data;
                if (config.type === 'expand') {
                  return this.$scopedSlots.expand({ row, column, $index });
                } else if (config.type === 'radio') {
                  return renderRadio(row, config);
                }
                return this.$scopedSlots[config.prop]
                  ? this.$scopedSlots[config.prop]({ row, column, $index })
                  : this.generateValue(row, column, config)
              },
              header: ({ column, $index }) => {
                return config.header
                  ? this.$scopedSlots[`${config.prop}-header`]
                  : moveHeader(column, $index)
              }
            }
          }}
          show-overflow-tooltip={this.showOverflowTooltip || config.showOverflowTooltip}
        >
          {config.children && config.children.length > 0 && config.children.map(item => tableItem(item))}
        </el-table-column>
      )
    }
    const table = (
      <el-scrollbar id="fix-scrollbar" ref="ledger-scroll">
        <el-table
          class={[
            'custom-table',
            { 'custom-icon': this.customIcon },
            { 'current-hover': this.hiddenCurrent }
          ]}
          ref="elTable"
          border
          data={this.data}
          header-cell-class-name="custom-header"
          { ...{
            attrs: this.$attrs,
            on: this.$listeners,
          }}
          on-current-change={this.handleCurrentChange}
          on-cell-click={this.handleCellClick}
          on-row-contextmenu={this.handleRowContextmenu}
        >
          {this.tableConfig.map(item => {
            return tableItem(item)
          })}
        </el-table>
      </el-scrollbar>
    )
    const wrapper = () => {
      // return table
      return (
        <main>
          {table}
          <el-tooltip class="test" effect="dark" ref="tooltip" content={this.tooltipContent} placement="top-start" />
        </main>
      )
    }
    return wrapper();
  },
  computed: {
    tableConfig() {
      // console.log('change');
      // this.$forceUpdate();
      // const sumlProp = ['envName'];
      const sumlProp = [];
      const devProp = ['serviceIp'];
      this.forceUpdate();
      this.$emit('update-config');
      return [...this.config].filter(item => {
        if (this.$currentEnv === 'moni') {
          return !sumlProp.includes(item.prop)
        } else if (this.$currentEnv === 'dev') {
          return !devProp.includes(item.prop)
        }
        return true;
      });
    },
    buttonControl() {
      if (this.data.length === 1) {
        return ['delete'];
      }
      return [];
    }
  },
  data() {
    return {
      radio: '',
      editing: false,
      activeTooltip: null,
      cellSelect: [],
      cellRowSelect: [],
      currentRow: [],
      objFunction: Function,
      contextmenuData: {},
      tooltipContent: '',
    }
  },
  watch: {
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
    // this.activeTooltip = tools.debounce(tooltip => tooltip.handleShowPopper(), 100);
    this.activeTooltip = function() {};
  },
  mounted() {
    this.$nextTick().then(() => {
      requestAnimationFrame(this.updateScrollX)
    })
  },
  methods: {
    getRowKey(row, rowKey) {
      if (typeof rowKey === 'function') {
        return rowKey(row)
      } else {
        return row[rowKey];
      }
    },
    toggleEdit(row, column, cell, event) {
      const config = this.tableConfig.find(item => item.prop === column.property) || {};
      if (!config.editable) {
        return;
      }
      console.log(cell)
    },
    updateScrollX() {
      if (!this.$refs['ledger-scroll']) {
        return;
      }
      const node = this.$refs['ledger-scroll'].$el.querySelector('.is-horizontal');
      const rect = node.getBoundingClientRect();
      const offset = rect.y - visibleHeight;
      if (node.style.bottom === '') {
        node.style.bottom = '1px';
      }
      const current = Number(node.style.bottom.split('px')[0] || 0);
      if (current === 0) {
        if (offset > 0) {
          node.style.bottom = current + offset + 40 + 'px';
        }
      }
      if (current > 0) {
        node.style.bottom = current + offset + 40 + 'px';
      } else if (current < 0) {
        node.style.bottom = '0px';
      }
      requestAnimationFrame(this.updateScrollX)
    },
    forceUpdate() {
      this.updateScrollX();
      const table = this.$refs.basicTable;
      const scroll = this.$refs['ledger-scroll'];
      table && table.$forceUpdate();
      // 不知道为什么nextTick没有效果
      setTimeout(() => {
        scroll && scroll.update();
      }, 200);
    },
    handleMouseLeave(event) {
      const tooltip = this.$refs.tooltip;
      if (tooltip) {
        tooltip.setExpectedState(false);
        tooltip.handleClosePopper();
      }
    },
    handleMouseEnter(event) {
      const tooltip = this.$refs.tooltip;
      this.tooltipContent = event.srcElement.innerText;
      tooltip.referenceElm = event.srcElement;
      tooltip.$refs.popper && (tooltip.$refs.popper.style.display = 'none');
      tooltip.doDestroy();
      tooltip.setExpectedState(true);
      // this.activeTooltip(tooltip);
    },
    parseArray(arr) {
      return arr.map(item => <div>{item}</div>)
    },
    generateValue(row, column, config) {
      if (column.type !== 'default') {
        return;
      }
      function getPathValue(data, keys, index) {
        const key = keys[index];
        const isArray = key.includes('[');
        if (isArray) {
          const res = /(.*)\[(\d*)\]/.exec(key);
          const [, arr, i] = res;
          return getPathValue(data[arr] ? data[arr][i] || {} : {}, keys, index + 1);
        }
        if (data[key] instanceof Object && !Array.isArray(data[key])) {
          return getPathValue(data[key], keys, index + 1);
        } else if (Array.isArray(data[key]) && typeof data[key] === 'object') {
          return data[key];
        } else {
          return data[key];
        }
      }
      // let editing = false;
      // const editInput = (val) => {
      //   let value = val;
      //   return editing ? <bc-input value={value} on-input={val => { value = val }}/> : <div onClick={() => { editing = true }}>{value}</div>
      // };
      const path = column.property.split('.');
      let res = '';
      res = getPathValue(row, path, 0)
      if (config.filter) {
        res = typeof config.filter === 'function'
          ? config.filter(res) || res
          : config.filter[res] || res
      } else if (Array.isArray(res) && res.length === 0) {
        res = '';
      }
      if (Array.isArray(res)) {
        return this.parseArray(res)
      }
      let resStr = '';
      if (res !== '' && (res || res === 0)) {
        resStr = res + (config.unit || '');
      } else {
        res = 'N/A';
        resStr = 'N/A';
      }
      return config.editable ? <cell-edit value={res} unit={(config.unit || '')} on-save={(cell) => { this.$parent.$emit('save', parseData(cell), config.prop, cell) }} /> : resStr;
      function parseData(value) {
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
      }
    },

    handleRowContextmenu(row, column, event) {
      if (!this.contextmenu) {
        return;
      }
      event.preventDefault();
      this.currentRow = row;
      this.$emit('contextmenu', { column, row, event });
    },
    handleCurrentChange(currentRow, oldRow) {
      oldRow && (oldRow.editable = false);
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
      this.$emit('cell-click', row, column, cell, event, this.ctrlClick ? [...this.cellRowSelect] : undefined);
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
      this.$emit('moveColumn', column, direct);
    },
    handleRemove(column) {
      this.$emit('removeColumn', column);
    }
  },
}
</script>

<style scoped lang="scss">
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
    white-space: pre-wrap !important;
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
