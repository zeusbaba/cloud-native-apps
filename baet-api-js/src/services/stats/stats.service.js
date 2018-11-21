// Initializes the `stats` service on path `/stats`
const createService = require('feathers-mongodb');
const hooks = require('./stats.hooks');

const logger = require('./../../logger');

var string = require('string'); // https://www.npmjs.com/package/string
var fetch = require('node-fetch');
// TODO make use of restful https://github.com/marmelab/restful.js
// import request from 'request';
// import restful, { requestBackend } from 'restful.js';

module.exports = function (app) {
  const paginate = app.get('paginate');
  const mongoClient = app.get('mongoClient');

  const serviceName = 'stats';
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

  // custom endpoints
  let createStats = '/makestats';
  app.use(createStats, {
    create(data, params) {
      logger.info(createStats, 'data->', JSON.stringify(data));
      logger.info(createStats, 'params->', params);

      let linkStats = {};
      return new Promise((resolve, reject) => {
        app.service('stats')
          .find({
            query: {
              $or: [
                { _id: data.link_id },
                { link_id: data.link_id },
              ]
            }
          })
          .then(item => {
            logger.info(createStats+' >> ', item);

            if (Array.isArray(item.data) && item.data.length>0) {
              //if (item.data && item.data.length>0) {
              linkStats = item.data[0];
            }
            else {
              linkStats.link_id = data.link_id;
              // just for testing
              /*linkStats.stats = {
                req_link_id: data.req_link_id,
                req_meta_data: data.req_meta_data
              };*/
            }

            if (!linkStats.stats) {
              linkStats.stats = {};
            }
            let dkeys = ['d_clicks', 'd_types', 'd_referers', 'd_country_codes', 'd_browsers', 'd_platforms'];
            for (let dkey of dkeys) {
              if (!linkStats.stats[dkey]) {
                linkStats.stats[dkey] = {};
              }
            }

            if (data.link_simple_links) {
              for (let simple_link of data.link_simple_links) {
                if (!linkStats.stats.d_clicks[simple_link]) {
                  linkStats.stats.d_clicks[simple_link] = 0;
                }
              }
            }
            if (!linkStats.stats.d_clicks[data.link_id]) {
              linkStats.stats.d_clicks[data.link_id] = 0;
            }
            if (!linkStats.stats.d_clicks['all']) {
              linkStats.stats.d_clicks['all'] = 0;
            }
            logger.info(createStats+' pre >> ', JSON.stringify(linkStats));

            /*
            info: /makestats data->
            {"req_link_id":"dizdiz1","link_id":"0aLLjxG4pDbqU32T","link_simple_links":["dizdiz1","dizdiz2"],
            "req_meta_data":{"ip":"localhost","user_agent":"curl/7.51.0","referer":""},
            ...}

            */

            // CLICKS
            linkStats.stats.d_clicks['all'] += 1;
            linkStats.stats.d_clicks[data.req_link_id] += 1;

            if (data.req_meta_data) {
              if (!data.req_meta_data['referer'] || data.req_meta_data['referer'] === '') {
                if (!linkStats.stats.d_referers['direct']) {
                  linkStats.stats.d_referers['direct'] = 0;
                }
                linkStats.stats.d_referers['direct'] += 1;
              }
              else {
                if (!linkStats.stats.d_referers[ data.req_meta_data['referer'] ]) {
                  linkStats.stats.d_referers[ data.req_meta_data['referer'] ] = 0;
                }
                linkStats.stats.d_referers[ data.req_meta_data['referer'] ] += 1;
              }

              if (data.req_meta_data['ua_parsed']) {
                let ua_parsed = data.req_meta_data['ua_parsed'];
                /*
                "uaParsed":{"ua":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36",
                "browser":{"name":"Chrome","version":"59.0.3071.115","major":"59"},
                "engine":{"name":"WebKit","version":"537.36"},
                "os":{"name":"Mac OS","version":"10.12.5"},
                "device":{},"cpu":{}}}
                ...
                "uaParsed":{"ua":"curl/7.51.0",
                "browser":{},"engine":{},"os":{},"device":{},"cpu":{}}
                */
                //if (ua_parsed.ua.indexOf('curl/') !== -1) {
                if (string(ua_parsed.ua).contains('curl/')) {
                  ua_parsed.browser.name = 'curl';
                }
                if (ua_parsed.browser.name) {
                  if (!linkStats.stats.d_browsers[ ua_parsed.browser.name ]) {
                    linkStats.stats.d_browsers[ ua_parsed.browser.name ] = 0;
                  }
                  linkStats.stats.d_browsers[ ua_parsed.browser.name ] += 1;
                }

                if (ua_parsed.os.name) {
                  if (!linkStats.stats.d_platforms[ ua_parsed.os.name ]) {
                    linkStats.stats.d_platforms[ ua_parsed.os.name ] = 0;
                  }
                  linkStats.stats.d_platforms[ ua_parsed.os.name ] += 1;
                }
              }

              if (data.req_meta_data['ip'] === 'localhost') {
                logger.info('ignore ipinfodb for... localhost!');

                logger.info(createStats+' post >> ', JSON.stringify(linkStats));
                if (linkStats._id) {
                  app.service('stats').update( linkStats._id, linkStats );
                }
                else {
                  app.service('stats').create( linkStats );
                }
                resolve(linkStats);
              }
              else {
                let appconfig = app.get('appconfig');
                let ipinfodb = appconfig.ipinfodb.api_url + appconfig.ipinfodb.api_params;
                ipinfodb += '&ip='+data.req_meta_data['ip'];
                //ipinfodb += '&ip=176.11.57.206'; // remove this!!!
                fetch( ipinfodb )
                  .then(res => res.json())
                  .then(json => {
                    logger.info('>> ipinfodb', JSON.stringify(json));
                    /*
                    info: >> ipinfodb {"statusCode":"OK","statusMessage":"","ipAddress":"176.11.57.206","countryCode":"NO","countryName":"Norway"}
                    */
                    throw json;
                  })
                  .catch(function(fish) {
                    logger.info('>> ipinfodb fish', JSON.stringify(fish));

                    if (fish && fish['countryCode']) {
                      if (!linkStats.stats.d_country_codes[fish['countryCode']]) {
                        linkStats.stats.d_country_codes[fish['countryCode']] = 0;
                      }
                      linkStats.stats.d_country_codes[fish['countryCode']] += 1;
                    }

                    logger.info(createStats+' post >> ', JSON.stringify(linkStats));
                    if (linkStats._id) {
                      app.service('stats').update( linkStats._id, linkStats );
                    }
                    else {
                      app.service('stats').create( linkStats );
                    }
                    resolve(linkStats);
                  });
              }
            }

          }).catch(error => {
            logger.error(createStats+' error>> ', error);
            //return Promise.reject(error);
            reject(error);
          });
      });

    }
  });
  app.service(createStats).hooks({
    before: {
      all: []
    },
    after: {
      all: []
    }
  });
};
