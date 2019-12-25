// Initializes the `clicks` service on path `/clicks`
const createService = require('feathers-mongodb');
const hooks = require('./clicks.hooks');

module.exports = function (app) {
  const paginate = app.get('paginate');
  const mongoClient = app.get('mongoClient');

  const serviceName = 'clicks';
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
};
