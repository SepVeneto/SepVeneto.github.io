<template>
  <ul>
    <li v-for="item in repoList" :key="item.id">{{item.name}}</li>
  </ul>
</template>

<script lang="ts">
import { getRepo } from '@/api';
import { defineComponent, reactive } from 'vue'
import HelloWorld from './components/HelloWorld.vue'

export default defineComponent({
  name: 'App',
  components: {
    HelloWorld
  },
  setup() {
    const repoList = reactive([]);
    getRepo().then(data=> {
      repoList.push(...(<[]>data.data))
    })
    return {
      repoList: repoList,
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
