<template>
  <div class="card info-container">
    <div class="info-avatar">
      <img :src="info.avatar_url">
    </div>
    <div>{{ info.name }}</div>
    <div class="info-detail">
      <div><span>文章</span><span>{{ articles }}</span></div>
      <div><span>分类</span><span>{{ categories }}</span></div>
      <div><span>仓库</span><span>{{ info.public_repos }}</span></div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue'
import { useStore } from 'vuex';

export default defineComponent({
  props: {
    data: {
      type: Object,
      required: true,
    }
  },
  setup(props) {
    const info = ref({});
    const store = useStore<State>();
    watch(() => props.data, (val) => {
      info.value = val;
    })
    // console.log(info)
    return {
      info,
      articles: computed(() => store.state.articles.length),
      categories: computed(() => store.state.categories.length),
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
