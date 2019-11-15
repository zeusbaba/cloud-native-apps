const authentication = require('@feathersjs/authentication');
const jwt = require('@feathersjs/authentication-jwt');
const local = require('@feathersjs/authentication-local');

const logger = require('./logger');

const isDev = process.env.NODE_ENV !== 'production'; // eslint-disable-line
//module.exports = function (app) {
module.exports = app => {
  const config = app.get('authentication');

  // Set up authentication with the secret
  app.configure(authentication(config));
  app.configure(jwt());
  app.configure(local());

  // The `authentication` service is used to create a JWT.
  // The before `create` hook registers strategies that can be used
  // to create a new valid JWT (e.g. local or oauth2)
  app.service('authentication').hooks({
    before: {
      all: [
        context => {
          if (isDev) {
            logger.info('authentication before.all', context.data, context.params);
          }
        }
      ],
      create: [
        authentication.hooks.authenticate(config.strategies),

        // This hook adds a custom attribute to the JWT payload by modifying params.payload.
        context => {
          // make sure params.payload exists
          context.params.payload = context.params.payload || {};
          // merge in a custom property
          Object.assign(context.params.payload, {custom: config.custom.jwt_payload});
        }
      ],
      remove: [
        authentication.hooks.authenticate('jwt')
      ]
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
  });
};
