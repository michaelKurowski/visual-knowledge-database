import Vue from 'vue'
import App from './App.vue'
import VueMeta from 'vue-meta'
import './registerServiceWorker'
import router from './router'
import store from './store'
import './index.css'

Vue.config.productionTip = false
Vue.use(VueMeta, {
  refreshOnceNavigation: true
})
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
