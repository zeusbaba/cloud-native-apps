import Vue from 'vue'
import Vuex from 'vuex'
import feathersVuex from 'feathers-vuex'
import feathersClient from '@/feathers-client'

const { service, auth, FeathersVuex } = feathersVuex(feathersClient, { idField: '_id' });

Vue.use(Vuex);
Vue.use(FeathersVuex);

export default new Vuex.Store({
  plugins: [
    service('links', { paginate: true }),
    service('users', { paginate: true }),

    /* // Specify custom options per service
    service('/v1/tasks', {
      idField: '_id', // The field in each record that will contain the id
      nameStyle: 'path', // Use the full service path as the Vuex module name, instead of just the last section
      namespace: 'custom-namespace', // Customize the Vuex module name.  Overrides nameStyle.
      autoRemove: true, // Automatically remove records missing from responses (only use with feathers-rest)
      enableEvents: false, // Turn off socket event listeners. It's true by default
      addOnUpsert: true, // Add new records pushed by 'updated/patched' socketio events into store, instead of discarding them. It's false by default
      skipRequestIfExists: true, // For get action, if the record already exists in store, skip the remote request. It's false by default
      modelName: 'OldTask' // Default modelName would have been 'Task'
    })
    */

    // Setup the auth plugin.
    auth({ userService: 'users' })
  ]
})
