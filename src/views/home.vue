<template>
  <ul>
    <div v-for="item in repoList" :key="item.id" href @click="handleClick(item)">{{item.name}}</div>
  </ul>
</template>

<script lang="ts">
import { getRepo } from '@/api';
import { defineComponent, reactive, ref } from 'vue'
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'home',
  setup() {
    const router = useRouter();
    const repoList = reactive([]);
    let detail = ref();
    getRepo().then(data=> {
      repoList.push(...(<[]>data.data))
    })

    function handleClick(data: any) {
      router.push({
        path: 'detail',
        query: {
          name: data.name,
        }
      })
    }
    return {
      repoList: repoList,
      handleClick,
      detail,
    }
  },
})
</script>

