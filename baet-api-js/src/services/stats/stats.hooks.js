//const { authenticate } = require('feathers-authentication').hooks;
const commonHooks = require('feathers-hooks-common');

module.exports = {
  before: {
    all: [
      //authenticate('jwt')
    ],
    find: [],
    get: [],
    create: [
      commonHooks.discard('meta_data'),
      hook => {
        if (!hook.data._id) {
          hook.data._id = hook.data.link_id;
        }
      },
      commonHooks.discard('link_id'),
      commonHooks.setNow('createdAt', 'updatedAt'),
    ],
    update: [
      commonHooks.discard('meta_data'),
      commonHooks.setNow('updatedAt')
    ],
    patch: [
      commonHooks.discard('meta_data'),
      commonHooks.setNow('updatedAt')
    ],
    remove: []
  },

  after: {
    all: [
      //commonHooks.discard('_id')
      /*hook => {
        hook.result.link_id = hook.result._id;
      }*/
    ],
    find: [],
    get: [
      hook => {
        hook.result.link_id = hook.result._id;
      },
      commonHooks.discard('_id')
    ],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
