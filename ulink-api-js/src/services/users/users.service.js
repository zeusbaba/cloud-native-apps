// Initializes the `users` service on path `/users`
const createService = require('feathers-mongodb');
const hooks = require('./users.hooks');

const logger = require('./../../logger');
var rp = require('request-promise');

module.exports = function (app) {
  const paginate = app.get('paginate');
  const mongoClient = app.get('mongoClient');

  const serviceName = 'users';
  const collectionName = app.get('mongodb_dataprefix')+serviceName;
  const dbOptions = {
    name: collectionName,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/'+serviceName, createService(dbOptions));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service(serviceName);

  mongoClient.then(db => {
    service.Model = db.collection(dbOptions.name);
  });

  service.hooks(hooks);

  // custom endpoint for k8s probe
  app.use('/k8s-status', {
    find(params) {
      //logger.info('k8s-status', params);
      return new Promise((resolve, reject) => {
        return resolve('OK');
      });
    }
  });

  // custom endpoint for ReCaptcha!!!
  app.use('/validate_recaptcha', {
    create(data, params) {// eslint-disable-line
      //logger.info('data', data);
      let userResponse = data.q;//params.query.q;
      //logger.info('userResponse', userResponse);
      const appconfig = app.get('appconfig');
      const googleRequest = {
        response: userResponse,
        secret: appconfig.recaptcha.secretkey
      };
      logger.info('googleRequest', JSON.stringify(googleRequest));

      return new Promise((resolve, reject) => {
        rp({
          method: 'POST',
          uri: 'https://www.google.com/recaptcha/api/siteverify',
          form: googleRequest
          //json: true,
          //body: googleRequest
        }).then(function (body) {
          // POST succeeded...
          const googleResponse = JSON.parse(body);
          logger.info('OK! google response', JSON.stringify(googleResponse));
          //resolve('OK!');
          if (googleResponse && googleResponse.success) {
            resolve('OK!');
          }
          else {
            throw(body);
          }
        }).catch(function (err) {
          // POST failed...
          logger.info('ERR! google response', err);
          reject(err);
        });
      });
    }
  });

};
