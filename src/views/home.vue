<template>
  <bc-container class="container">
    <bc-col :span="6">
      <info :data="userInfo" />
    </bc-col>
    <bc-col :span="12">
      <ul class="article-list card">
        <div
          class="list-item"
          v-for="item in repoList"
          :key="item.id"
          @click="handleClick(item)"
        >
          <span>{{item.title}}</span>
          <span>{{item.created_at}}</span>
        </div>
      </ul>
    </bc-col>
  </bc-container>
</template>

<script lang="ts">
import { getRepo, getUserInfo } from '@/api';
import { defineComponent, reactive, ref } from 'vue'
import { useRouter } from 'vue-router';
import info from './info.vue';

export default defineComponent({
  name: 'home',
  components: {
    info,
  },
  setup() {
    const router = useRouter();
    const repoList = reactive([]);
    const detail = ref();
    const userInfo = reactive({});
    getRepo().then(data => {
      repoList.push(...(<[]>data.data))
    })
    getUserInfo().then(({ data }) => {
      Object.assign(userInfo, data);
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
      userInfo,
    }
  },
})
</script>

<style scoped>
.container {
  max-width: 1200px;
}
.article-list {
  width: 50%;
}
.list-item {
  cursor: pointer;
}
</style>

