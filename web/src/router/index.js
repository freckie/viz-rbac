import { createRouter, createWebHashHistory } from 'vue-router'

import MainLayout from '@/router/layouts/MainLayout.vue'

import HomeView from '@/router/views/HomeView.vue'
import SAPanelView from '@/router/views/SAPanelView.vue'

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
          name: 'ServiceAccount Panel',
          component: SAPanelView
        },
        {
          path: '/ua',
          name: 'UserAccount Panel',
          component: SAPanelView
        },
        {
          path: '/csr',
          name: 'CSR Panel',
          component: SAPanelView
        }
      ]
    }
  ]
})

export default router