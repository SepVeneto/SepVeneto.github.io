/**
 * { type, prop, name, api, customValue, customLabel, default }
 */
<script>
import advanceSearch from './advanceSearch';
// import serverSelect from './serverSelect';
import { generateInput } from '@/utils/tools';
export default {
  name: 'bc-search',
  props: {
    defaultValue: {
      type: Object,
      default: () => {}
    },
    create: Boolean,
    config: {
      type: Array,
      default: () => [],
    },
    params: Object,
    value: Object,
    search: Function,
    import: Boolean,
    export: {
      type: Boolean,
      default: true,
    },
    advance: Boolean,
    fields: {
      type: Array,
      default: () => [],
    },
    upload: Object,
    layout: {
      type: Array,
      default: () => ['create', 'search', 'reset', 'upload', 'export', 'advance'],
    }
  },
  components: {
    advanceSearch,
    // serverSelect,
  },
  data() {
    return {
      uploadVisible: false,
      visible: false,
      searchConfig: [],
      defaultParams: {},
    }
  },

  watch: {
    config: {
      deep: true,
      immediate: true,
      handler(val) {
        this.searchConfig = [...val];
      }
    },
    defaultValue: {
      deep: true,
      immediate: true,
      handler(val) {
        this.defaultParams = JSON.parse(JSON.stringify({ ...this.value, ...val }));
      }
    }
  },
  created() {
    // this.defaultParams = JSON.parse(JSON.stringify({ ...this.value, ...this.defaultValue }));
  },
  methods: {
    updateData(key, val) {
      // this.$emit('update:params', { ...this.params, [key]: val });
      // console.log(this.value.timerange)
      this.$emit('input', { ...this.value, [key]: val });
    },
    handleUpload() {
      this.uploadVisible = true;
    },
    getUpload() {
      return this.$refs.upload;
    },
    handleSubmit(e) {
      e.preventDefault();
    },
    handleSearch(params) {
      this.$nextTick().then(() => {
        this.$emit('input', { ...this.value, ...(params instanceof MouseEvent ? {} : params), page: 1 });
        this.search();
      })
    },
    handleReset() {
      const params = { ...this.defaultParams };
      for (const key in this.value) {
        const whiteList = Object.keys(params);
        if (!whiteList.includes(key)) {
          params[key] = Array.isArray(this.value[key]) ? [] : '';
        } else {
          params[key] = this.defaultParams[key];
        }
      }
      const advanceSearch = this.$refs.advanceSearch;
      advanceSearch && advanceSearch.reset();
      // this.$emit('update:params', params)
      this.$emit('input', params);
      this.$emit('reset');
      this.search();
    },
  },
  render(h) {
    const layout = {
      create: () => (this.$slots.create || (this.create && <bc-button type="primary" icon="bcCreate" on-click={() => this.$emit('create')}>新增</bc-button>)),
      search: () => (this.$slots.search || (<bc-button type="primary" icon="bcSearch" on-click={this.handleSearch}>搜索</bc-button>)),
      reset: () => (this.$slots.reset || (<bc-button type="primary" class="el-icon-refresh" on-click={this.handleReset}>重置</bc-button>)),
      // upload: () => (this.upload && upload()),
      upload: () => (this.$slots.upload || (this.upload && <bc-button type="primary" icon="bcImport" on-click={this.handleUpload}>{this.upload.text || '导入'}</bc-button>)),
      export: () => (this.$slots.export || (this.export && <bc-button type="primary" icon="bcExport" on-click={() => this.$emit('export')}>导出</bc-button>)),
      advance: () => (this.advance && <bc-button type="primary" on-click={() => { this.visible = true }}>高级搜索</bc-button>),
    };

    const node = (
      <bc-wrapper wrapperStyle={{ paddingBottom: 0 }}>
        <el-form class="search-containers" inline nativeOn-submit={this.handleSubmit}>
          {this.searchConfig.map(item => {
            return (
              <el-form-item>
                {generateInput(h, this.value, item, this)}
              </el-form-item>
            )
          })}
          <el-form-item>
            {this.layout.map(item => layout[item]())}
            {this.$slots.default}
          </el-form-item>
        </el-form>
        {this.upload && <bc-upload
          visible={this.uploadVisible}
          on-success={this.handleSearch}
          {...{
            attrs: this.upload,
            on: { 'update:visible': (val) => { this.uploadVisible = val } }
          }} />}
      </bc-wrapper>
    );
    const advance = () => (
      <advance-search
        ref="advanceSearch"
        visible={this.visible}
        fields={this.fields}
        config={this.searchConfig}
        { ...{
          on: {
            submit: this.handleSearch,
            'update:visible': (val) => { this.visible = val }
          }
        }}
      />)
    return this.advance ? (<div>{node}{advance()}</div>) : node;
  }
}
</script>

<style lang="scss" scoped>
.bcWrapper {
  & /deep/ .bc-wrapper-main {
    padding-bottom: 0;
  }
}
</style>
