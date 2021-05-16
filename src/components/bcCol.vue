<template>
  <div class="bc-col" :style="{width}">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { getType } from '@/utils/tools';

export default defineComponent({
  name: 'bc-col',
  props: {
    span: {
      type: [Number, String],
      defautl: 24,
    }
  },
  setup(props, ) {
    const width = computed(() => {
      if (getType(props.span) === 'String') {
        return parseInt(<string>props.span) / 24 * 100 + '%'
      } else {
        return <number>props.span / 24 * 100 + '%';
      }
    })
    return {
      width,
    }
  },
})
</script>

