<template>
  <div
    :class="['custom-switch', { active: isActive, 'is-disabled': disabled }]"
    @click="handleClick"
  >
    <span class="core" :style="`background: ${isActive ? activeColor : inactiveColor}`">
      <span class="label open">{{activeText}}</span>
      <span class="label close">{{inactiveText}}</span>
    </span>
  </div>
</template>

<script>
export default {
  name: 'bc-switch',
  props: {
    disabled: Boolean,
    value: [Boolean, String, Number],
    activeColor: {
      type: String,
      default: '#409EFF',
    },
    inactiveColor: {
      type: String,
      default: '#999',
    },
    activeText: {
      type: String,
      default: '开启',
    },
    inactiveText: {
      type: String,
      default: '关闭',
    },
    activeValue: {
      type: [String, Boolean, Number],
      default: true,
    },
    inactiveValue: {
      type: [String, Boolean, Number],
      default: false,
    }
  },
  computed: {
    isActive: {
      get() {
        return this.value === this.activeValue;
      },
      set(bool) {
        this.$emit('input', bool ? this.activeValue : this.inactiveValue);
        this.$emit('change', bool);
      }
    }
  },
  methods: {
    handleClick() {
      if (this.disabled) {
        return;
      }
      this.isActive = !this.isActive;
    }
  }
}
</script>

<style lang="scss" scoped>
.custom-switch {
  display: flex;
  cursor: pointer;
  color: #fff;
  &.is-disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  .core {
    display: inline-block;
    width: 60px;
    border-radius: 10px;
    height: 20px;
    line-height: 20px;
    background: #dcdfe6;
    position: relative;
    .open {
      position: absolute;
      left: 10px;
      // top: -1px;
      opacity: 0;
      transition: all .3s;
    }
    .close {
      opacity: 1;
      position: absolute;
      right: 10px;
      // top: -1px;
      transition: all .3s;
    }
    &::after {
      content: '';
      display: block;
      height: 16px;
      width: 16px;
      border-radius: 50%;
      background: #fff;
      position: absolute;
      top: 2px;
      left: 2px;
      transition: all .3s;
    }
  }
  &.active {
    .core {
      .close {
        opacity: 0;
      }
      .open{
        opacity: 1;
      }
      &::after {
        content: '';
        left: 100%;
        margin-left: -20px;
      }
    }
  }
}
</style>
