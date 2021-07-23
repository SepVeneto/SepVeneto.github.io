<template>
  <div class="card info-container">
    <div class="info-avatar">
      <img :src="info.avatar_url">
    </div>
    <div>{{ info.name }}</div>
    <div class="info-detail">
      <div><span>文章</span><span>39</span></div>
      <div><span>分类</span><span>9</span></div>
      <div><span>仓库</span><span>{{ info.public_repos }}</span></div>
    </div>
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
    // console.log(info)
    return {
      info,
    }
  },
})
</script>

<style scoped lang="scss">
.info-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  .info-detail {
    width: 100%;
    display: flex;
    justify-content: space-around;
    margin-top: 20px;
    span {
      display: block;
      text-align: center;
    }
  }
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
