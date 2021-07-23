<template>
  <section class="home-container">
    <ul class="article-list">
      <li
        v-for="item in repoList"
        :key="item.id"
        class="card"
        @click="handleClick(item)"
      >
        <div>{{ formatTime(item.created_at) }}</div>
        <div>{{ item.title }}</div>
      </li>
    </ul>
    <aside class="right-aside">
      <div class="card">最近</div>
      <div class="card">档案</div>
    </aside>
  </section>
</template>

<script lang="ts">
import { getRepo } from '@/api';
import { defineComponent, reactive, ref } from 'vue'
import { useRouter } from 'vue-router';
import { formatTime } from '@/utils/tools';

export default defineComponent({
  name: 'Home',
  setup() {
    const router = useRouter();
    const repoList = reactive([]);
    const detail = ref();
    getRepo().then(data => {
      repoList.push(...(data.data as []))
    })

    function handleClick(data: any) {
      router.push({
        path: 'detail',
        query: {
          issuesNumber: data.number,
        }
      })
    }
    return {
      repoList: repoList,
      handleClick,
      detail,

      formatTime,
    }
  },
})
</script>

<style scoped lang="scss">
.home-container {
  width: 100%;
  display: grid;
  grid-template-columns: auto 250px;
  row-gap: 20px;
  column-gap: 20px;
  .right-aside {
    display: grid;
    row-gap: 20px;
  }
}
.article-list {
  display: grid;
  row-gap: 20px;
}
.container {
  max-width: 1200px;
}
.list-item {
  cursor: pointer;
}
</style>

