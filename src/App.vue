<template>
  <ul>
    <div v-for="item in repoList" :key="item.id" href @click="handleClick(item)">{{item.name}}</div>
  </ul>
  <div v-html="detail"></div>
</template>

<script lang="ts">
import { getRepo, getDetail } from '@/api';
import { defineComponent, reactive, ref } from 'vue'
import HelloWorld from './components/HelloWorld.vue'

export default defineComponent({
  name: 'App',
  components: {
    HelloWorld
  },
  setup() {
    const repoList = reactive([]);
    let detail = ref();
    getRepo().then(data=> {
      repoList.push(...(<[]>data.data))
    })

    async function handleClick(data: any) {
      const res = await getDetail(data.name);
      detail.value = res.data
    }
    return {
      repoList: repoList,
      handleClick,
      detail,
    }
  }
})
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
