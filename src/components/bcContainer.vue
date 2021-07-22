<template>
  <section class="bc-container">
    <slot />
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'BcContainer',
  setup() {
    
  },
})
</script>

<style scoped>
.bc-container {
  display: flex;
}
</style>
