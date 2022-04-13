import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: '首页',
    component: () => import('../views/index.vue'),
    meta: {
      title: '首页'
    }
  },
  {
    path: '/about',
    name: '关于',
    component: () => import('../views/about.vue'),
    meta: {
      title: '关于页面'
    }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
