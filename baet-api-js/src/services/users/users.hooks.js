const { authenticate } = require('@feathersjs/authentication').hooks;

const {
  hashPassword, protect
} = require('@feathersjs/authentication-local').hooks;

const { restrictToOwner } = require('feathers-authentication-hooks');
const restrict = [
  authenticate('jwt'),
  restrictToOwner({
    idField: '_id',
    ownerField: 'userid'
  })
];

const logger = require('./../../logger');

module.exports = {
  before: {
    all: [
      async function(context) {
        logger.info('users before.all', context.data, context.params);
      }
    ],
    find: [ ...restrict ],
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
      //-hashPassword({passwordField: passwordField}),
      hashPassword(),
    ],
    update: [
      ...restrict,
      hashPassword() // hashPassword({passwordField: passwordField})
    ],
    patch: [
      ...restrict,
      hashPassword() // hashPassword({passwordField: passwordField})
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
        logger.info('(users) path: %s | method: ', context.path, context.method);
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
