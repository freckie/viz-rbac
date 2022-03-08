import Vue from 'vue'
import VueRouter from 'vue-router'

import SettingView from '@/router/views/SettingView.vue'
import SAPanelView from '@/router/views/SAPanelView.vue'
import UAPanelView from '@/router/views/UAPanelView.vue'
import CSRPanelView from '@/router/views/CSRPanelView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/setting'
  },
  {
    path: '/setting',
    name: 'Setting',
    component: SettingView
  },
  {
    path: '/sa',
    name: 'ServiceAccount Panel',
    component: SAPanelView
  },
  {
    path: '/ua',
    name: 'UserAccount Panel',
    component: UAPanelView
  },
  {
    path: '/csr',
    name: 'CertificateSigningRequest Panel',
    component: CSRPanelView
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
