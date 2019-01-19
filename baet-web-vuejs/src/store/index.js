import Vue from 'vue'
import Vuex from 'vuex'
import feathersVuex from 'feathers-vuex'
import feathersClient from '@/feathers-client'

const { service, auth, FeathersVuex } = feathersVuex(feathersClient, { idField: '_id' });

Vue.use(Vuex);
Vue.use(FeathersVuex);
// see https://feathers-plus.github.io/v1/feathers-vuex/service-module.html

export default new Vuex.Store({
  plugins: [
    service('links', { paginate: true }),
    service('stats', { paginate: true }),
    service('users', { paginate: true }),

    // Setup the auth plugin.
    auth({ userService: 'users' })
  ]
})
