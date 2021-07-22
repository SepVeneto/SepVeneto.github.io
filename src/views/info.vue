<template>
  <div class="card info-container">
    <div class="info-avatar">
      <img :src="info.avatar_url">
    </div>
    <div>{{ info.name }}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, watch } from 'vue'

export default defineComponent({
  props: {
    data: {
      type: Object,
      required: true,
    }
  },
  setup(props) {
    const info = reactive(props.data);
    return {
      info,
    }
  },
})
</script>

<style scoped>
.info-container {
}
.info-container .info-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  box-sizing: border-box;
}
.info-container img {
  width: 100%;
  height: 100%;
}
</style>
