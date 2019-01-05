import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/'

import { VueAxios } from '@/utils/request'

import Viser from 'viser-vue'

import '@/core/use' // base components use
import '@/permission' // permission control
import '@/utils/filter' // base filter
import Initializer from '@/core/bootstrap'

Vue.config.productionTip = false

Vue.use(VueAxios, router)
Vue.use(Viser)

new Vue({
  router,
  store,
  created () {
    Initializer()
  },
  render: h => h(App)
}).$mount('#app')
