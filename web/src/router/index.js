import { createRouter, createWebHashHistory } from 'vue-router'

import MainLayout from '@/router/layouts/MainLayout.vue'

import HomeView from '@/router/views/HomeView.vue'
import DashboardView from '@/router/views/DashboardView.vue'

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
          name: 'Home',
          component: HomeView
        },
        {
          path: '/dashboard',
          name: 'Dashboard',
          component: DashboardView
        }
      ]
    }
  ]
})

export default router