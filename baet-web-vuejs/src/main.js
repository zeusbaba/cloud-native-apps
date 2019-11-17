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

/*
import '@fortawesome/fontawesome-free/css/all.css'
import 'vuetify/dist/vuetify.min.css'
// ...Vuetify https://vuetifyjs.com/en/getting-started/quick-start

import Vuetify from 'vuetify'
// Helpers
import colors from 'vuetify/es5/util/colors'
Vue.use(Vuetify, {
  icons: {
    iconfont: 'fa'
  },
  theme: {
    dark: false,
    themes: {
      light: {
        primary: colors.orange.darken4,
        secondary: colors.orange.darken1,
        accent: colors.orange.accent3
      }
    }
  }
});
*/
import vuetify from './plugins/vuetify' // path to vuetify export

import VueClipboard from 'vue-clipboard2'
VueClipboard.config.autoSetContainer = true; // add this line
Vue.use(VueClipboard);

import { FeathersVuexFind, FeathersVuexGet } from 'feathers-vuex'
Vue.component('feathers-vuex-find', FeathersVuexFind);
Vue.component('feathers-vuex-get', FeathersVuexGet);

import store from '@/store';
router.beforeEach((to, from, next) => {
  const currentUser = store.state.auth.user;
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  if (requiresAuth && !currentUser) {
    next('/login')
  } else {
    next()
  }
});

import i18n from '@/i18n'

// Auth first before loading the app
store.dispatch('auth/authenticate')
.catch(() => {})
// Render the app
.then(() => {
  // eslint-disable-next-line no-new
  new Vue({
    vuetify,
    router,
    store,
    i18n,
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

