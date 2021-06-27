import customTable from './customTable';
import customTableJsx from './customTable/customTable.jsx.vue';
import customPagination from './customPagination.vue';
export default {
  name: 'bc-table',
  inheritAttrs: false, // 不被作为props的attributes不会暴露在组件的根元素上
  components: {
    customTable,
    customPagination,
    customTableJsx,
  },
  props: {
    colspanOptions: Object,
    padding: {
      type: Boolean,
      default: true,
    },
    custom: {
      type: Boolean,
      default: true,
    },
    data: Array,
    filter: Function,
    immediate: {
      type: Boolean,
      default: true,
    },
    pagination: Boolean,
    api: Function,
    params: Object,
    config: Array,
    total: {
      type: Number,
      default: 0,
    },
    fixXScroll: Boolean,
    simple: Boolean,
    load: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    totalColumn() {
      const { includes = [], parentProp = null } = this.colspanOptions;
      const totalColumn = {};
      const whiteList = {};
      includes.forEach(item => {
        whiteList[item] = 0;
      });
      this.tableData.forEach(item => {
        Object.keys(item).forEach(key => {
          if (!Object.keys(whiteList).includes(key)) {
            return;
          }
          const spanKey = parentProp
            ? `${item[parentProp]}_${key}_${item[key]}`
            : `${key}_${item[key]}`;
          const column = totalColumn[spanKey];
          if (!item[key]) {
            whiteList[key] += 1;
            return;
          }
          if (column != null) {
            Object.assign(totalColumn[spanKey], { num: column.num + 1 });
          } else {
            totalColumn[spanKey] = {
              index: whiteList[key],
              num: 1
            };
          }
          whiteList[key] += 1;
        })
      })
      return totalColumn;
    },
    searchModel: {
      get() {
        return this.params;
      },
      set(obj) {
        this.$emit('update:params', obj);
      }
    },
    customTable() {
      return this.$refs['bc-table'];
    },
    tableData() {
      if (this.custom) {
        return [...this.data || []];
      } else {
        return this.filter ? this.filter(this.arrayData) : [...this.arrayData];
      }
    },
    simpleData() {
      const { page, rows } = this.simpleTable;
      const start = (page - 1) * rows;
      const end = page * rows;
      return this.data.slice(start, end);
    }
  },
  data() {
    return {
      arrayData: [],
      arrayTotal: 0,
      rowSpanConfig: {},
      simpleTable: {
        page: 1,
        rows: 5,
      },
      loading: false
    }
  },
  watch: {
    config: {
      handler(val) {
        val && (this.tableConfig = [...val])
      },
      deep: true,
      immediate: true,
    }
  },
  created() {
    if (this.custom) {
      this.api && this.immediate && this.api()
    } else {
      if (this.load && this.immediate && this.api) {
        this.loading = true
      }
      this.api && this.immediate && this.getList();
    }
  },
  methods: {
    setCurrentRow(row) {
      this.customTable.setCurrentRow(row);
    },
    toggleRadio(row, selected) {
      this.customTable.toggleRadio(row, selected);
    },
    spanMethod({ row, column, rowIndex, columnIndex }) {
      const { includes = [], parentProp = null } = this.colspanOptions;
      const key = column.property;
      const spanKey = parentProp
        ? `${row[parentProp]}_${key}_${row[key]}`
        : `${key}_${row[key]}`;
      if (!includes.includes(key) || row[key] == null) {
        return {
          colspan: 1,
          rowspan: 1,
        };
      }
      if (rowIndex === this.totalColumn[spanKey].index) {
        return {
          colspan: 1,
          rowspan: this.totalColumn[spanKey].num,
        }
      } else {
        return [0, 0];
      }
    },
    getParams(key) {
      return this[key];
    },
    getPathValue(data, keys, index) {
      const key = keys[index];
      if (data[key] instanceof Object && !Array.isArray(data[key])) {
        return this.getPathValue(data[key], keys, index + 1);
      } else {
        return data[key];
      }
    },
    getList() {
      if (!this.custom && this.load) {
        this.loading = true
      }
      return this.api().then((data) => {
        this.arrayData = data.data.rows || [];
        this.loading = false
        // if (this.rowSpan.length > 0) {
        //   this.rowSpan.forEach(key => {
        //     Object.assign(this.rowSpanConfig, this.calData(this.arrayData, key));
        //   })
        // }
        this.arrayTotal = data.data.total || 0;
        return Promise.resolve(this.arrayData);
      }).catch(() => {
        this.loading = false
        this.arrayData = [];
        this.arrayTotal = 0;
      })
    },
    getListData() {
      return this.tableData;
    },
    calData(data, key) {
      let total = 0;
      return data.reduce((count, curr) => {
        if (count[curr[key]]) {
          ++count[curr[key]].num;
        } else {
          count[curr[key]] = {
            index: total,
            num: 1,
          }
        }
        ++total;
        return count;
      }, {})
    },
    handleSimplePageChange(page) {
      this.simpleTable.page = page;
    },
    handleSimpleRowsChange(rows) {
      this.simpleTable.rows = rows;
    },
    handlePageChange(page) {
      if (this.custom) {
        this.searchModel.page = page
        this.api();
      } else {
        this.searchModel.page = page;
        this.getList();
      }
    },
    handleRowsChange(rows) {
      // this.custom ? this.searchModel.rows = rows : this.pageParams.rows = rows;
      // this.custom ? this.searchModel.page = 1 : this.pageParams.page = 1;
      this.searchModel.rows = rows;
      this.searchModel.page = 1;
      this.handlePageChange(1);
    },
    updateFilters(key, options) {
      const findRes = this.tableConfig.find(item => item.columnKey === key);
      if (!findRes) {
        throw new Error('表头筛选项更新失败，缺少指定表头');
      }
      findRes.filters = options;
    },
    clearSelection() {
      this.customTable.clearSelection();
    },
    clearFilter(columnKey) {
      this.customTable.clearFilter(columnKey);
    },
    toggleRowSelection(row, selected) {
      this.customTable.toggleRowSelection(row, selected);
    },
    toggleRowExpansion(row, expanded) {
      this.customTable.toggleRowExpansion(row, expanded);
    },
  },
  render(h) {
    return (
      <div class={['bc-table', { padding: this.padding }, { 'bc-table-scroll': this.fixXScroll }]}>
        {this.fixXScroll
          ? <custom-table-jsx
            ref="bc-table"
            v-loading={this.loading}
            config={this.tableConfig}
            data={this.simple ? this.simpleData : this.tableData}
            spanMethod={this.$attrs['span-method'] || (this.colspanOptions ? this.spanMethod : null)}
            hidden-current={!!this.colspanOptions}
            body-border={this.$attrs['body-border'] || !!this.colspanOptions}
            {...{
              attrs: this.$attrs,
              scopedSlots: this.$scopedSlots,
              on: this.$listeners
            }}
          />
          : <custom-table
            ref="bc-table"
            v-loading={this.loading}
            config={this.tableConfig}
            data={this.simple ? this.simpleData : this.tableData}
            spanMethod={this.$attrs['span-method'] || (this.colspanOptions ? this.spanMethod : null)}
            hidden-current={!!this.colspanOptions}
            body-border={this.$attrs['body-border'] || !!this.colspanOptions}
            {...{
              attrs: this.$attrs,
              scopedSlots: this.$scopedSlots,
              on: this.$listeners
            }}
          />}
        {this.pagination && !this.simple &&
          <custom-pagination
            currentPage={this.searchModel.page}
            pageSize={this.searchModel.rows}
            total={this.custom ? this.total : this.arrayTotal}
            on-current-change={this.handlePageChange}
            on-size-change={this.handleRowsChange}
          />
        }
        {this.simple &&
          <custom-pagination
            currentPage={this.simpleTable.page}
            pageSize={this.simpleTable.rows}
            total={this.tableData.length}
            layout="prev, pager, next"
            on-current-change={this.handleSimplePageChange}
            on-size-change={this.handleSimpleRowsChange}
          />
        }
      </div>
    )
  }
}
