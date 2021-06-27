<template>
  <span
    :class="['svg-container', { 'is-disabled': disabled }]"
    :style="{width, height}"
  >
    <slot />
    <svg
      v-if="!isIconFont && icon"
      :class="svgClass"
      :style="{width, height}"
      aria-hidden="true"
      @click="$emit('click', $event)"
    >
      <use :xlink:href="iconName" />
    </svg>
    <i
      v-else-if="isIconFont && icon"
      :class="icon"
      aria-hidden="true"
      @click="$emit('click', $event)"
    >
    </i>
    <span v-if="!icon" class="placeholder"></span>
    <div class="svg-badge" v-if="badge">{{badge}}</div>
  </span>
</template>

<script>
export default {
  name: 'svg-icon',
  props: {
    width: [String, Number],
    height: [String, Number],
    icon: {
      type: String,
    },
    className: {
      default: '',
      type: String,
    },
    badge: [String, Number],
    disabled: Boolean,
  },
  computed: {
    isIconFont() {
      return this.icon && this.icon.includes('iconfont');
    },
    svgClass() {
      const { className } = this;
      return className ? `svg-icon ${className}` : 'svg-icon';
    },
    iconName() {
      const { icon } = this;
      const splitList = icon.split('-');
      const splitDict = icon.split('/');
      if (splitList && splitList.length !== 1) {
        return `#icon-${splitList[1]}`
      } else if (splitDict && splitDict.length !== 1) {
        const [dict, name] = splitDict;
        const parseName = name && name.toLowerCase();
        return `#icon-${dict}${parseName.replace(/\S/, val => val.toUpperCase())}`;
      }
      return `#icon-${icon}`;
    },
  },
};
</script>

<style lang="scss" scoped>
.svg-container {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  .svg-badge {
    padding: 2px;
    font-size: 12px;
    text-align: center;
    position: absolute;
    top: 0;
    right: 0;
    min-width: 16px;
    border-radius: 16px;
    transform: translate(50%, -50%);
    transform-origin: 100%;
    background-color: #ee0a24;
    color: #fff;
  }
}
.placeholder {
  display: inline-block;
}
.svg-icon, .placeholder {
  width: 1em;
  height: 1em;
  fill: currentColor;
  overflow: hidden;
}
.svg-container.is-disabled {
  pointer-events: none;
}
</style>
