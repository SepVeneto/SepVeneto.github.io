<template>
  <section class="home-container">
    <ul class="article-list">
      <li
        v-for="item in articles"
        :key="item.id"
        class="card article-item"
        @click="handleClick(item)"
      >
        <div>{{ formatTime(item.created_at) }}</div>
        <h2 class="title">{{ item.title }}</h2>
      </li>
    </ul>
    <aside class="right-aside">
      <div class="card">
        <div class="label">最近</div>
        <ul class="article-list">
          <li
            v-for="item in recent"
            :key="item.id"
            class="article-item"
            @click="handleClick(item)"
          >
            <div style="font-size: 12px; color: #7a7a7a">{{ formatTime(item.created_at) }}</div>
            <div class="title">{{ item.title }}</div>
          </li>
        </ul>
      </div>
      <div class="card">
        <div>相关工具</div>
        <a href="//sepveneto.github.io/vue-tools/#/table" target="_blank">组件库</a>
      </div>
    </aside>
  </section>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router';
import { formatTime } from '@/utils/tools';
import { useStore } from 'vuex';
import { State } from '@/store';

export default defineComponent({
  name: 'Home',
  setup() {
    const router = useRouter();
    const detail = ref();
    const store = useStore<State>();
    const articles = computed(() => {
      return store.state.articles;
    })

    const recentArticles = computed(() => {
      return articles.value.slice(0, 3);
    })

    function handleClick(data: Record<string, unknown>) {
      router.push({
        path: 'detail',
        query: {
          issuesNumber: data.number as number,
        }
      })
    }
    return {
      articles,
      recent: recentArticles,
      handleClick,
      detail,
      formatTime,
    }
  },
})
</script>

<style scoped lang="scss">
.label {
  color: #7a7a7a;
  padding: 10px 0;
}
.home-container {
  width: 100%;
  display: grid;
  grid-template-columns: auto 250px;
  row-gap: 20px;
  column-gap: 20px;
  .right-aside {
    display: grid;
    row-gap: 20px;
    height: fit-content;
  }
}
.article-list {
  display: grid;
  row-gap: 20px;
  .article-item {
    cursor: pointer;
    &:hover .title {
      color: #4089ef;
    }
  }
}
.container {
  max-width: 1200px;
}
.list-item {
  cursor: pointer;
}
</style>

