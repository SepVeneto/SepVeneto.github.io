<template>
  <main class="main-container">
    <aside class="left-aside">
      <info :data="userInfo" />
      <div class="card">分类</div>
    </aside>
    <router-view />
  </main>
</template>

<script lang="ts">
import { defineComponent, reactive} from 'vue'
import { getUserInfo } from '@/api';
import info from './views/info.vue';

export default defineComponent({
  name: 'App',
  components: {
    info,
  },
  setup() {
    const userInfo = reactive({});
    getUserInfo().then(({ data }) => {
      Object.assign(userInfo, data)
    })
    return {
      userInfo,
    }
  }
})
</script>

<style lang="scss" scoped>
.main-container {
  display: grid;
  grid-template-columns: 250px auto;
  row-gap: 20px;
  column-gap: 20px;
  padding: 0 20px;
  width: 1440px;
  margin: 0 auto;
  .left-aside {
    display: grid;
    row-gap: 20px;
    height: fit-content;
  }
}
</style>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  /* margin-top: 60px; */
}
</style>
