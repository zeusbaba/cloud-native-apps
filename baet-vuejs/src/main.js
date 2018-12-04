import Vue from 'vue'
import App from './App.vue'
import router from './router'

import { isDev } from './app-config';

// ...general options
Vue.config.devtools = isDev;
Vue.config.performance = isDev;
Vue.config.silent = !isDev;
Vue.config.productionTip = !isDev;

// ...for using localStorage
// https://github.com/bazzite/vue-warehouse | https://www.bazzite.com/docs/vue-warehouse
import VueWarehouse from 'vue-warehouse'
Vue.use(VueWarehouse, {
  engine: require('store/src/store-engine'),
  plugins: [
    require('store/plugins/defaults'),
    require('store/plugins/expire')
  ],
  storages: [
    require('store/storages/localStorage'),
    require('store/storages/cookieStorage')
  ]
});

//import 'material-design-icons-iconfont/dist/material-design-icons.css'
import '@fortawesome/fontawesome-free/css/all.css'
import 'vuetify/dist/vuetify.min.css'
// ...Vuetify https://vuetifyjs.com/en/getting-started/quick-start
import Vuetify from 'vuetify'
Vue.use(Vuetify, {
  iconfont: 'fa'
});

/*
import VueFeathers from 'vue-feathers-services'
import feathersClient from '@/feathers-client';
Vue.use(VueFeathers, feathersClient);
*/

/*
import Vuex from 'vuex'
import feathersVuex from 'feathers-vuex'
import feathersClient from '@/feathers-client'
const { service, auth, FeathersVuex } = feathersVuex(feathersClient, { idField: '_id' });
Vue.use(Vuex);
Vue.use(FeathersVuex);
export default new Vuex.Store({
  plugins: [
    service('links', {paginate: true}),
    auth({ userService: 'users' })
  ]
})
*/
import store from '@/store';
router.beforeEach((to, from, next) => {
  const currentUser = store.state.auth.user
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  if (requiresAuth && !currentUser) {
    next('/login')
  } else {
    next()
  }
});

// Auth first before loading the app
store.dispatch('auth/authenticate')
.catch(() => {})
// Render the app
.then(() => {
  // eslint-disable-next-line no-new
  new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount('#app');
});
/*
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
*/