<script>
import { generateInput } from '@/utils/tools';
const conditionOptions = Object.freeze([
  { label: '精确', value: 'eq' },
  { label: '模糊', value: 'lk' },
]);
const relationOptions = Object.freeze([
  { label: '并且', value: 'and' },
  { label: '或者', value: 'or' },
]);
export default {
  name: 'advance-search',
  render(h) {
    const searchItem = (params) => (
      <div class="search-item">
        <bc-select
          class="item-content"
          {...{
            props: {
              value: params.condition,
              options: this.conditionOptions,
              placeholder: '查询范围',
              clearable: false,
            },
            on: {
              input: val => { params.condition = val },
            }
          }}
        />
        <bc-select
          class="item-content"
          {...{
            props: {
              value: params.key,
              options: this.filterFields,
              customValue: 'query',
              filterable: true,
              placeholder: '查询字段',
              itemDisabled: this.disableOptions,
              group: true,
            },
            on: {
              input: val => { params.key = val },
            }
          }}
        />
        {this.inputItem(h, params)}
        <bc-select
          class="item-content"
          {...{
            props: {
              value: params.relation,
              options: this.relationOptions,
              placeholder: '查询关系',
              clearable: false,
            }
          }}
        />
        <bc-button
          class="icon el-icon-minus"
          type="primary"
          onclick={() => this.handleDelete(params)}
        />
      </div>
    )
    const node = () => (
      <el-drawer
        class="search-wrapper"
        {...{
          props: {
            visible: this.dialogVisible,
            title: '高级搜索'
          },
          on: {
            'update:visible': (val) => { this.dialogVisible = val },
          }
        }}
      >
        <main class="search-containers">
          {this.searchModel.map(item => searchItem(item))}
          <bc-button
            slot="reference"
            class="btn-add el-icon-plus"
            type="text"
            on-click={this.handleAddCondition}
          />
        </main>
        <footer class="advance-footer">
          <bc-button onclick={this.handleSubmit} type="primary">确定</bc-button>
          <bc-button onclick={this.reset}>重置</bc-button>
        </footer>
      </el-drawer>
    )
    return node();
  },
  props: {
    config: Array,
    visible: Boolean,
    fields: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    dialogVisible: {
      get() {
        return this.visible;
      },
      set(bool) {
        this.$emit('update:visible', bool);
      }
    },
    selectProp() {
      return this.searchModel.map(item => item.key);
    },
    filterFields() {
      function filterField(item) {
        if (item.children && Array.isArray(item.children)) {
          item.children = item.children.filter(each => filterField(each));
          return true;
        } else {
          item.query = item.query || item.prop;
          return !item.ignore && item.prop && item.prop !== 'operate';
        }
      }
      const res = this.fields.filter(item => filterField(item));
      // const res = this.fields.filter(item => {
      //   item.query = item.query || item.prop;
      //   return !item.ignore && item.prop && item.prop !== 'operate';
      // });
      return res;
    }
  },
  data() {
    return {
      relationOptions,
      conditionOptions,
      searchModel: [{ key: '', condition: 'lk', content: '', relation: 'and' }],
      disableOptions: item => this.selectProp.includes(item.prop),
    }
  },
  methods: {
    inputItem(h, params) {
      const input = this.config.find(item => item.prop === params.key);
      if (input) {
        return generateInput(h, params, { ...input, property: input.prop, prop: 'content' }, this);
      } else {
        return <bc-input
          class='item-content'
          {...{
            attrs: {
              value: params.content,
              placeholder: '查询内容',
            },
            on: {
              input: val => { this.$set(params, 'content', val) },
            }
          }}
        />
      }
    },
    reset() {
      this.searchModel = [{ key: '', condition: 'lk', content: '', relation: 'and' }];
    },
    handleDelete(data) {
      const index = this.searchModel.findIndex(item => item.key === data.key);
      this.searchModel.splice(index, 1);
    },
    handleAddCondition() {
      this.searchModel.push({ key: '', condition: 'lk', content: '', relation: 'and' });
    },
    handleSubmit() {
      const params = {
        lkParam: {},
        eqParam: {},
      };
      this.searchModel.forEach(item => {
        params[item.condition === 'lk' ? 'lkParam' : 'eqParam'][item.key] = [item.content, item.relation];
      })
      this.$emit('submit', params);
      this.dialogVisible = false;
    },
    handleCancel() {
      this.dialogVisible = false;
    }
  }
}
</script>

<style lang="scss" scoped>
.search-wrapper {
  & /deep/ .el-drawer {
    min-width: 550px;
  }
  & /deep/ .el-drawer__body {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 20px;
    padding-top: 0;
  }
  .advance-footer {
    display: flex;
    & /deep/ .el-button {
      flex: 1;
    }
  }
  .btn-add {
    margin-top: 10px;
    font-size: 2em;
    width: 100%;
    height: 40px !important;
    border: 2px dashed #dcdfe6;
  }
  // .item-content {
  //   margin-right: 10px;
  // }
}
.search-containers {
  flex: 1;
}
.search-item {
  display: grid;
  grid-template-columns: 80px 120px auto 80px 32px;
  gap: 10px;
  &:not(:last-of-type) {
    margin-bottom: 10px;
  }
  .icon {
    width: 32px;
    height: 32px;
    padding: 0 10px !important;
  }
}
</style>
