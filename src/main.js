import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import mint from 'mint-ui'
import axios from 'axios'
import 'mint-ui/lib/style.css'
import './assets/styles/base.css'
import './assets/styles/reset.scss'
// import { createPow } from "@textile/powergate-client"
Vue.use(mint)
Vue.prototype.$http = axios

new Vue({
  router,
  store,
  components: { App },
  render: h => h(App),
  template: '<App />'
}).$mount('#app')
