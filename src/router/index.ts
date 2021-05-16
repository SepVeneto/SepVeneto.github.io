import { createWebHistory, createRouter, RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/views/home.vue'),
  },
  {
    path: '/detail',
    component: () => import('@/views/article.vue'),
  },
  {
    path:'/repositry/vue/bcTable',
    component: () => import('@/views/repositry/vue/bcTable.vue'),
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router;
