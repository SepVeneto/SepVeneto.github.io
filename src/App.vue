<template>
  <main class="main-container">
    <aside class="left-aside">
      <info :data="userInfo" />
      <div class="card">分类</div>
    </aside>
    <section style="position: relative">
      <router-view v-slot="{ Component, route }" class="child-view">
        <transition :name="route.meta.transition">
          <component :is="Component" />
        </transition>
      </router-view>
    </section>
  </main>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useStore } from 'vuex';
import { State } from '@/store';
import info from './views/info.vue';

export default defineComponent({
  name: 'App',
  components: {
    info,
  },
  setup() {
    // onBeforeRouteUpdate((to, from, next) => {
    //   const toDepth = to.path.split('/').length
    //   const fromDepth = from.path.split('/').length
    //   to.meta.transition = toDepth < fromDepth ? 'slide-right' : 'slide-left';
    //   console.log(to.meta)
    //   next();
    // })
    const store = useStore<State>();
    store.dispatch('updateInfo');
    store.dispatch('updateArticles');
    return {
      userInfo: computed(() => store.state.userInfo),
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
.page-enter-to {
  transform: translateX(10px);
  opacity: 0;
}
.page-leave-to {
  transform: translateX(10px);
  opacity: 0;
}
.page-enter-active, .page-leave-active {
  transition: all 1s linear;
}
</style>
