const { authenticate } = require('@feathersjs/authentication').hooks;
const commonHooks = require('feathers-hooks-common');
//var anyid = require('anyid').anyid;
var shortid = require('shortid');
//shortid.characters('0123456789abcdefghijklmnopqrstuvwxyz');
shortid.seed(2480);

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [
      hook => {
        const { query = {} } = hook.params;
        if (!query.$sort) {
          query.$sort = {
            createdAt: -1
          };
        }

        hook.params.query = query;
      }
    ],
    get: [],
    create: [
      commonHooks.discard('meta_data'),
      hook => {
        if (!hook.data._id) {
          //hook.data._id = '' + Date.now();
          hook.data._id = Date.now()+'-'
            + shortid.generate().toLowerCase();
          /*+ anyid()
              .time('ms')
              .seq().resetByTime()
              .encode('a0')
              .length(10)
              .random()
              .id(); */
        }
      },
      commonHooks.setNow('createdAt', 'updatedAt')
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
    all: [],
    find: [],
    get: [],
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
