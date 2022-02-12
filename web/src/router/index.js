import { createRouter, createWebHashHistory } from 'vue-router'

import MainLayout from '@/router/layouts/MainLayout.vue'

import HomeView from '@/router/views/HomeView.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      component: MainLayout,
      redirect: '/home',
      children: [
        {
          path: '/home',
          name: 'HomeView',
          component: HomeView
        }
      ]
    }
  ]
})

export default router