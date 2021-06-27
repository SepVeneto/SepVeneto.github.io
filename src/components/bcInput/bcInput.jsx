import './style.scss';
export default {
  name: 'bc-input',
  inheritAttrs: false, // 不被作为props的attributes不会暴露在组件的根元素上
  props: {
    defaultValue: [String, Number],
    onlyDisplay: Boolean,
    border: {
      type: String,
      validator(val) {
        return ['none', 'bottom', 'all'].includes(val);
      }
    },
    width: {
      type: [String, Number],
      default: '100%',
    },
    password: Boolean,
  },
  computed: {
    inputWidth() {
      if (typeof this.width === 'number') {
        return `${this.width}px`;
      } else {
        return this.width;
      }
    },
    passwordStyle() {
      const { type } = this.$attrs
      if (type === 'password') {
        return '';
      } else if (this.password && !this.passwordVisible) {
        return 'disc'
      } else {
        return '';
      }
    }
  },
  data() {
    return {
      passwordVisible: false,
    }
  },
  created() {
    !this.$attrs.value && this.defaultValue && this.$emit('input', this.defaultValue);
  },
  methods: {
    showPassword(bool) {
      this.passwordVisible = bool;
      console.log(bool)
    },
    focus() {
      this.$refs.input.focus();
    },
    blur() {
      this.$refs.input.blur();
    }
  },
  render(h) {
    const borderClass = {
      none: 'no-border',
      bottom: 'bottom-border',
      all: '',
    }[this.border];
    const input = () => (
      <el-input
        ref="input"
        class={['bc-input', borderClass]}
        style={{ width: this.inputWidth, 'text-security': this.passwordStyle }}
        {...{
          attrs: { placeholder: '请输入', ...this.$attrs },
          on: this.$listeners,
        }}
      >
        {this.$scopedSlots.prepend && this.$scopedSlots.prepend().map(item => <template slot="prepend">{item}</template>)}
        {this.$scopedSlots.append && this.$scopedSlots.append().map(item => <template slot="append">{item}</template>)}
        {this.$scopedSlots.prefix && this.$scopedSlots.prefix().map(item => <template slot="prefix">{item}</template>)}
        {this.$scopedSlots.suffix
          ? this.$scopedSlots.suffix().map(item => <template slot="suffix">{item}</template>)
          : (this.password &&
            <i
              slot="suffix"
              class="el-input__icon el-icon-view el-input__clear"
              style="text-security: none"
              onClick={() => this.showPassword(!this.passwordVisible)}
            ></i>)
        }
      </el-input>
    )
    const text = () => (
      <span>{this.$attrs.value}</span>
    )
    return this.onlyDisplay ? text() : input();
  }
}
