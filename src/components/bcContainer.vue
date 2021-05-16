<template>
  <section class="bc-container">
    <slot></slot>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'bc-container',
  setup() {
    
  },
})
</script>

<style scoped>
.bc-container {
  display: flex;
}
</style>
