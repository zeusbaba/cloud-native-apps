const logger = require('./logger');
const url = require('url');
const MongoClient = require('mongodb').MongoClient;

module.exports = function (app) {
  const dbConfig = app.get('mongodb');
  const dbName = url.parse(dbConfig).path.substring(1);
  const promise = MongoClient
    .connect(dbConfig, {useNewUrlParser: true})
    .then(client => {
      // For mongodb <= 2.2
      if(client.collection) {
        return client;
      }

      logger.info('MongoDB conn OK!');
      return client.db(dbName);
    }).catch(error =>
      logger.error('MongoDB conn FAIL! config: %s | err: %s', dbConfig, error)
    );

  app.set('mongoClient', promise);
};
