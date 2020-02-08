// Initializes the `links` service on path `/links`
const createService = require('feathers-mongodb');
const hooks = require('./links.hooks');

module.exports = function (app) {
  const paginate = app.get('paginate');
  const mongoClient = app.get('mongoClient');

  const serviceName = 'links';
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
    // (optional, default false) - This will disable the objectify of the id field if you want to use normal strings
    service.disableObjectify = true
  });

  service.hooks(hooks);

};
