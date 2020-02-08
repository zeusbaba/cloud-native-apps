const commonHooks = require('feathers-hooks-common');

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [
      commonHooks.setNow('createdAt'),
      commonHooks.alterItems(rec => rec._id = rec.phish_id)
    ],
    update: [
      commonHooks.setNow('updatedAt'),
      commonHooks.alterItems(rec => rec._id = rec.phish_id)
    ],
    patch: [
      commonHooks.setNow('updatedAt'),
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
