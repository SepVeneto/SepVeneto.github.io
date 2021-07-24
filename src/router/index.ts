import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    // component: () => import('@/layout.vue'),
    component: () => import('@/App.vue'),
    redirect: '/list',
    children: [
      {
        path: '/list',
        component: () => import('@/views/home.vue'),
        meta: {
          transition: 'slide-left',
        }
      },
      {
        path: '/detail',
        component: () => import('@/views/article.vue'),
        meta: {
          transition: 'slide-left',
        }
      },
    ]
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
