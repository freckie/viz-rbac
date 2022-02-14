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
          path: '/sa',
          name: 'ServiceAccount Dashboard',
          component: DashboardView
        },
        {
          path: '/ua',
          name: 'UserAccount Dashboard',
          component: DashboardView
        },
        {
          path: '/csr',
          name: 'CSR Panel',
          component: DashboardView
        }
      ]
    }
  ]
})

export default router