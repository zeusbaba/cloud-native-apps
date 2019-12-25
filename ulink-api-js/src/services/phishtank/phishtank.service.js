// Initializes the `phishtank` service on path `/phishtank`
const createService = require('feathers-mongodb');
const hooks = require('./phishtank.hooks');

const logger = require('./../../logger');

module.exports = function (app) {
  const paginate = app.get('paginate');
  const mongoClient = app.get('mongoClient');

  const serviceName = 'phishtank';
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

  /*
  const feathersFs = require('feathers-fs');
  app.use('/importphishtank', feathersFs({
    root: 'src',
    type: 'json' // the default value.
  }));
  Model.count({}, function (err, count) {
    logger.info('phishtank/import count', count);
    if (count == 0) {
      app.service('/importphishtank')
        .get('/data_import/extra_phishtank_data.json')
        .then(phishtankItems => {
          logger.info('importing phishtank_data', phishtankItems.length);
          phishtankItems.forEach(function(phishtankItem) {
            if (phishtankItem.phish_id) {
              phishtankItem._id = phishtankItem.phish_id;
            }
            app.service('phishtank').create( phishtankItem );
          });
          count = phishtankItems.length;
        });
    }
  });*/

  app.use('/importphishtank', {
    find(params) {
      logger.info('phishtankimport', params);

      /*return Promise.resolve(
        Model.count({}, function (err, count) {
          logger.info('phishtank/import count', count);
          if (count == 0) {
            // re-import from local json
            let fileName = './../../../data_import/extra_phishtank_data.json';
            const phishtankItems = require(fileName);
            logger.info('importing phishtank_data', phishtankItems.length);
            phishtankItems.forEach(function(phishtankItem) {
              if (phishtankItem.phish_id) {
                phishtankItem._id = phishtankItem.phish_id;
              }
              app.service('phishtank').create( phishtankItem );
            });
            count = phishtankItems.length;
          }
          return {count: count, meta_data:'meta_data'};
        })
      );*/

      return new Promise((resolve, reject) => {

        service.Model.count({}, function (err, count) {
          logger.info('phishtank/import count', count);
          if (count == 0) {
            let fileName = './data_import/extra_phishtank_data.json';
            require('fs').readFile(fileName, (error, data) => {
              // Check if the callback got an error, if so reject the promise and return
              if(error) {
                return reject(error);
              }

              let phishtankItems = JSON.parse(data.toString());
              logger.info('importing phishtank_data', phishtankItems.length);

              /*phishtankItems.forEach(function(phishtankItem) {
                if (phishtankItem.phish_id) {
                  phishtankItem._id = phishtankItem.phish_id;
                }
                app.service('phishtank').create( phishtankItem );
              });*/
              let batchCalls = [];
              for (let phishtankItem of phishtankItems) {
                /*if (phishtankItem.phish_id) {
                  phishtankItem._id = phishtankItem.phish_id;
                }*/

                if (batchCalls.length <= app.get('batcher_limit')) {
                  batchCalls.push(['phishtank::create', phishtankItem]);
                }
                else {
                  app.service('batch').create(
                    {
                      'type': 'series', // "type": "<series/parallel>",
                      'call': batchCalls
                    }
                  );
                  batchCalls = [];
                }
              }
              if (batchCalls.length > 0) {
                logger.info('extra batchCalls', batchCalls.length);
                app.service('batch').create(
                  {
                    'type': 'parallel', // "type": "<series/parallel>",
                    'call': batchCalls
                  }
                );
                batchCalls = [];
              }

              count = phishtankItems.length;
              logger.info('phishtank/import count (imported)', count);
              return resolve({count: count});
            });
          }
          else {
            return resolve({count: count});
          }

        });
      });
    }
  });
};
