<script>
const SPECIAL = Object.freeze(['edit', 'more', 'delete', 'create']);
export default {
  name: 'bc-button',
  props: {
    confirm: [Boolean, String],
    tooltip: Boolean,
    icon: String,
    mini: Boolean,
    type: {
      type: String,
      validator: (val) => {
        const elementui = ['primary', 'success', 'warning', 'danger', 'info', 'text'];
        return [...elementui, ...SPECIAL].includes(val);
      }
    },
  },
  computed: {
    isSpecialButton() {
      return SPECIAL.includes(this.type);
    },
    specialIcon() {
      if (!this.isSpecialButton) {
        return undefined;
      }
      return `bc${this.type.replace(/\S?/, letter => letter.toUpperCase())}`
    }
  },
  render(h) {
    const tooltip = (node) => (<el-tooltip placement="top"><div slot="content">{this.$slots.default}</div>{node}</el-tooltip>)
    const button = (
      <el-button
        class={['bc-button', { mini: this.mini || this.isSpecialButton }]}
        {...{
          attrs: {
            ...this.$attrs,
            type: this.type === 'delete' ? 'danger' : (this.isSpecialButton ? 'primary' : this.type),
            tooltip: this.isSpecialButton || this.tooltip,
          },
          on: {
            ...this.$listeners,
            click: this.handleClick,
          }
        }}>{(this.icon || this.isSpecialButton) && !this.$attrs.loading && <svg-icon icon={this.icon || this.specialIcon} />}{this.isSpecialButton || this.tooltip || this.$slots.default}
      </el-button>
    );
    return (this.$slots.default && (this.tooltip || this.isSpecialButton)) ? tooltip(button) : button;
  },
  methods: {
    generateCatalog(str) {
      return 'bc' + str.replace(/^./, str.slice(0, 1).toUpperCase());
    },
    handleClick(event) {
      if (this.confirm || this.type === 'delete' || this.type === 'danger') {
        const confirmText = typeof this.confirm === 'boolean' ? '此操作将无法撤销，是否继续？' : this.confirm;
        this.$confirm(confirmText, '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          this.$emit('click', event);
        }).catch(() => {})
      } else {
        this.$emit('click', event);
        // this.$listeners.click(event);
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.bc-button {
  // & /deep/ span {
  //   display: flex;
  //   height: 30px;
  // }
  font-size: 13px;
  .svg-container {
    margin-right: 12px;

    // height: 30px;
  }
}
.bc-button[class*=el-icon-] {
  &::before {
    margin-right: 12px;
  }
}
// .bc-button[class*=el-icon-], .mini {
//   & /deep/ span {
//     display: initial;
//     height: initial;
//   }
// }
.mini {
  height: 24px !important;
  width: 24px;
  padding: 5px !important;
  line-height: normal !important;
  box-sizing: border-box;
  .svg-container {
    margin-right: 0;
  }
}
</style>
