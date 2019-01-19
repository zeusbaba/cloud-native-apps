const commonHooks = require('feathers-hooks-common');

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [
      commonHooks.setNow('createdAt', 'updatedAt'),
    ],
    update: [
      commonHooks.setNow('updatedAt'),
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
