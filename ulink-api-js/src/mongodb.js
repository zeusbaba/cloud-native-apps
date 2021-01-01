const logger = require('./logger');
const MongoClient = require('mongodb').MongoClient;

module.exports = function (app) {
  const dbUrl = app.get('mongodb');
  const dbName = "baet";

  //const mongoClient = MongoClient(dbUrl, {useNewUrlParser: true, useUnifiedTopology: true});
  //await mongoClient.connect();
  const mongoClient = MongoClient
    .connect(dbUrl, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(client => {
      // For mongodb <= 2.2
      if(client.collection) {
        return client;
      }

      logger.info('MongoDB conn OK!');
      return client.db(dbName);
    }).catch(error =>
      logger.error('MongoDB conn FAIL! config: %s | err: %s', dbUrl, error)
    );


  app.set('mongoClient', mongoClient);
};
