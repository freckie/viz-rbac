import { createRouter, createWebHashHistory } from 'vue-router'

import HomeView from '@/router/views/HomeView.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomeView
    }
  ]
})

export default router