import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import vuetify from './plugins/vuetify'

Vue.config.productionTip = false

// Axios setting
Vue.prototype.$axios = axios
Vue.prototype.$host = 'http://' + process.env.API_HOST + ':' + process.env.API_PORT

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
