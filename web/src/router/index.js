import Vue from 'vue'
import VueRouter from 'vue-router'

import HomeView from '@/router/views/HomeView.vue'
import SAPanelView from '@/router/views/SAPanelView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
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

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
