import Vue from 'vue'
import Vuex from 'vuex'
import feathersVuex from 'feathers-vuex'
import feathersClient from '@/feathers-client'

//const { service, auth, FeathersVuex } = feathersVuex(feathersClient, { idField: '_id' });
const { FeathersVuex } = feathersVuex(feathersClient, { idField: '_id' });

Vue.use(Vuex);
Vue.use(FeathersVuex);
// see https://feathers-plus.github.io/v1/feathers-vuex/service-module.html

const requireModule = require.context(
    // The path where the service modules live
    './services',
    // Whether to look in subfolders
    false,
    // Only include .js files (prevents duplicate imports`)
    /.js$/
);
const servicePlugins = requireModule
    .keys()
    .map(modulePath => requireModule(modulePath).default)
import auth from './store.auth'
export default new Vuex.Store({
  plugins: [
    //service('links', { paginate: true }),
    //service('stats', { paginate: true }),
    //service('users', { paginate: true }),
    ...servicePlugins,
    auth
  ]
})
