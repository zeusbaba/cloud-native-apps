const { authenticate } = require('@feathersjs/authentication').hooks;
const commonHooks = require('feathers-hooks-common');

const {
  hashPassword, protect
} = require('@feathersjs/authentication-local').hooks;

// see https://github.com/feathersjs-ecosystem/feathers-authentication-hooks
/* // before v1
const { restrictToOwner } = require('feathers-authentication-hooks');
const restrict = [
  authenticate('jwt'),
  restrictToOwner({
    idField: '_id',
    ownerField: 'userid'
  })
];
*/
// after v1
const { setField } = require('feathers-authentication-hooks');
const restrict = [
  authenticate('jwt'),
  setField({
    from: 'params.user._id',
    as: 'params.query.userid'
  })
];

const logger = require('./../../logger');

module.exports = {
  before: {
    all: [
      context => {
        logger.info('users before.all', context.data, context.params);
      }
    ],
    find: [
      context => {
        logger.info('context users.find', context.data, context.params);
      },
      ...restrict
    ],
    get: [], //[ ...restrict ], // no restriction, because we are using by our react app for user-check
    create: [
      context => {
        logger.info('context users.create', context.data);
      },
      /*context => { // moved this check to client side
        const dizlinkOldCookie = context.data.extra.dizlinkOldCookie;
        if (!Validator.isEmpty(dizlinkOldCookie)) {
          let cookieItems = dizlinkOldCookie.split('&');
          //logger.info('cookieItems -> ' + cookieItems);
          for (let cookieItem of cookieItems) {
            if (Validator.contains(cookieItem, 'ID=')) {
              context.data.userid = cookieItem.substring( cookieItem.indexOf('=')+1 );
            }
          }
        }
      },*/
      /* context => { // custom action regarding old dizlink users
        const dizlinkOldUserId = context.data.extra.dizlinkOldUserId;
        if (!Validator.isEmpty(dizlinkOldUserId)) {

        }
      }, */
      context => {
        //logger.info('context.data.userid -> ' + context.data.userid);
        if (context.data.userid) {
          context.data._id = context.data.userid;
        }
      },
      hashPassword('password'),
      commonHooks.setNow('createdAt', 'updatedAt'),
    ],
    update: [
      ...restrict,
      hashPassword('password'),
      commonHooks.setNow('updatedAt')
    ],
    patch: [
      ...restrict,
      hashPassword('password'),
      commonHooks.setNow('updatedAt')
    ],
    remove: [ ...restrict ]
  },

  after: {
    all: [
      /*commoncontexts.when(
        context => context.params.provider,
        commoncontexts.discard(passwordField)
      )*/
      // Make sure the password field is never sent to the client
      // Always must be the last context
      protect('password')
    ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [
      context => {
        logger.info('(users) hook.error: %s', JSON.stringify(context.error));
        logger.info('(users) path: %s | method: %s', context.path, context.method);
      }
    ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
