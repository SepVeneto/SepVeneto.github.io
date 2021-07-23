import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/views/home.vue'),
    // redirect: '/room',
  },
  {
    path: '/room',
    name: 'room',
    component: () => import('@/views/room/index.vue'),
  },
  {
    path: '/room_origin',
    name: 'roomOrigin',
    component: () => import('@/views/room/origin.vue'),
  },
  {
    path: '/detail',
    component: () => import('@/views/article.vue'),
  },
  // {
  //   path:'/repositry/vue/bcTable',
  //   component: () => import('@/views/repositry/vue/bcTable.vue'),
  // }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router;
