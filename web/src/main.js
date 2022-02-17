import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import vuetify from './plugins/vuetify'

Vue.config.productionTip = false

// Axios setting
Vue.prototype.$axios = axios

// ENV
Vue.prototype.$host = ''
Vue.prototype.$setHost = (host) => {
  Vue.prototype.$host = host
}

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
