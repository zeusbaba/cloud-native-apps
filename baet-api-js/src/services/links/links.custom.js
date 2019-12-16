const logger = require('./../../logger');
const commonHooks = require('feathers-hooks-common');
const errors = require('@feathersjs/errors'); // https://www.npmjs.com/package/feathers-errors
const Validator = require('validator');

const isDev = process.env.NODE_ENV !== 'production'; // eslint-disable-line

module.exports = function () {
  const app = this;

  // FIXME impl hook to discard Crawlers etc

  let linksServiceName = 'links';
  let linkMeta = '/:link_id.json';
  let linkStats = '/:link_id/stats';
  let linkClicks = '/:link_id/clicks';
  let linkRoute = '/:link_id';

  // --- linkClicks as json ---
  app.use(linkClicks, {
    find(params) {
      return new Promise((resolve, reject) => {
        const link_id = params.query.link_id?
          params.query.link_id : params.link_id;
        app.service('clicks')
          .find({
            query: {
              $or: [
                { link_id: link_id },
                { req_link_id: link_id }
              ],
              $sort: {
                createdAt: -1
              },
              $limit: 50,
            }
          })
          .then(item => {

            resolve(item);//return item; // as json object
          }).catch(error => {
            logger.error(error);
            //return Promise.reject(error);
            reject(error);
          });
      });
    },
  });
  app.service(linkClicks).hooks({
    before: {
      all: [
        hook => {
          // params: { "route":{"link_id":"gh80mh"} ... }
          let link_id = '';
          if (hook.params.route && hook.params.route.link_id) {
            link_id = hook.params.route.link_id;
          }
          else if (hook.params.link_id) {
            link_id = hook.params.link_id;
          }
          else {
            return Promise.resolve(hook);
          }

          if (isDev) {
            logger.info('hook.before request for', linkClicks, link_id);
          }

          return new Promise((resolve) => {

            hook.app.service(linksServiceName).find({
              query: {
                $or: [
                  { _id: link_id },
                  { link_id: link_id },
                  { simple_links: link_id },
                ],
                $select: ['_id']
              }
            }).then(records => {
              if (isDev) {
                logger.info('hook.before found records for link_id', hook.params.link_id, records);
              }
              if (records.data.length>0) {
                const item = records.data[0];
                hook.params.query.link_id = item._id;
              }
              resolve(hook);
            });

          });

        }
      ],
    },
    after: {
      all: [
        hook => {
          hook.result.link_id = hook.result._id;
        },
        commonHooks.discard('_id', 'meta_data', 'updatedAt')
      ],
    }
  });

  // --- linkStats as json ---
  app.use(linkStats, {
    find(params) {
      return new Promise((resolve, reject) => {
        const link_id = params.query.link_id?
          params.query.link_id : params.link_id;
        app.service('stats')
          .get(link_id)
          .then(record => {
            //logger.info(record);
            if (!record.stats) {
              throw new errors.NotFound(
                'linkStats does NOT exists!!!',
                {linkStats: params.link_id}
              );
            }
            else {
              resolve(record);
            }
          }).catch(error => {
            logger.error(error);
            reject(error);
          });
      });
    },
  });
  app.service(linkStats).hooks({
    before: {
      all: [
        hook => {
          // params: { "route":{"link_id":"gh80mh"} ... }
          let link_id = '';
          if (hook.params.route && hook.params.route.link_id) {
            link_id = hook.params.route.link_id;
          }
          else if (hook.params.link_id) {
            link_id = hook.params.link_id;
          }
          else {
            return Promise.resolve(hook);
          }

          if (isDev) {
            logger.info('hook.before request for', linkClicks, link_id);
          }

          return new Promise((resolve) => {

            hook.app.service(linksServiceName).find({
              query: {
                $or: [
                  { _id: link_id },
                  { link_id: link_id },
                  { simple_links: link_id },
                ],
                $select: ['_id']
              }
            }).then(records => {
              if (records.data.length>0) {
                const item = records.data[0];
                hook.params.query.link_id = item._id;
              }
              resolve(hook);
            });

          });

        }
      ],
    },
    after: {
      all: [
        hook => {
          hook.result.link_id = hook.result._id;
        },
        commonHooks.discard('_id')
      ],
    }
  });

  // --- link meta as json ---
  app.use(linkMeta, {
    find(params) {
      // params: { "route":{"link_id":"gh80mh"} ... }
      let link_id = '';
      if (params.route && params.route.link_id) {
        link_id = params.route.link_id;
      }
      else if (params.link_id) {
        link_id = params.link_id;
      }
      else {
        return Promise.resolve();
      }

      if (isDev) {
        logger.info('hook.before request for', linkMeta, link_id);
      }

      return new Promise((resolve, reject) => {
        app.service(linksServiceName)
          .find({
            query: {
              $or: [
                { _id: link_id },
                { simple_links: link_id },
              ]
            }
          })
          .then(item => {
            logger.info('>>.json link service .find', item);
            /*if (item.data && item.data.length>0) {
              item = item.data[0];
            }
            else {*/
            if (item.data && item.data.length==0) {
              throw new errors.NotFound(
                'link does NOT exists!!!',
                {link: params.link_id}
              );
            }
            resolve(item);//return item; // as json object
          }).catch(error => {
            logger.error(error);
            //return Promise.reject(error);
            reject(error);
          });
      });
    },
  });

  app.service(linkMeta).hooks({
    after: {
      all: [
        //commonHooks.pluck('_id','short_link', 'simple_links', 'long_link', 'createdAt'), // 'userid',
        commonHooks.iff(commonHooks.isProvider('external'), commonHooks.keep('_id','short_link', 'simple_links', 'long_link', 'createdAt')),
        hook => {
          let items = commonHooks.getItems(hook);
          if (Array.isArray(items) && items.length>0) {
            hook.result = items[0];
          }
        }
      ],
    }
  });

  // --- link click & redirect ---
  app.use(linkRoute,
    function (req, res) { // using expressjs!!
      let params = req.params;

      // params: { "route":{"link_id":"gh80mh"} ... }
      let link_id = '';
      if (params.route && params.route.link_id) {
        link_id = params.route.link_id;
      }
      else if (params.link_id) {
        link_id = params.link_id;
      }
      else {
        return Promise.resolve();
      }

      // force lowerCase, because this is what we do when create link
      link_id = link_id.toLowerCase();

      if (isDev) {
        logger.info('hook.before request for %s | link_id: %s', linkRoute, link_id);
        logger.info('check if requested link_id is one of the service paths!');
      }
      //commonHooks.debug('check if requested link_id is one of the service paths!');

      for (let r of app._router.stack) {
        //logger.info('r.route.path: %s', r.route.path);
        if (r.route && r.route.path
          && Validator.contains(r.route.path, '/'+link_id+'/')
          ) {

          throw new errors.Conflict(
            'link_id is one of the service paths!',
            {link: link_id}
          );

        }
      }

      return app.service('links')
        .find({
          query: {
            $or: [
              { _id: link_id },
              { simple_links: link_id },
            ]
          }
        })
        .then(item => {
          if (isDev) {
            logger.info('>>link service .find', item);
          }

          if (Array.isArray(item.data) && item.data.length>0) {
          //if (item.data && item.data.length>0) {
            item = item.data[0];
          }
          else {
            throw new errors.NotFound(
              'link does NOT exists!!!',
              {link: params.link_id}
            );
          }

          // -> record clicks & stats
          /*
          app.service('clicks').create(
            {
              req_link_id: link_id,
              link_id: item.short_link,
              req_meta_data: req.headers['reqExtras'] ? {
                ip: req.headers['reqExtras'].ip,
                user_agent: req.headers['reqExtras'].userAgent,
                //ua_parsed: req.headers['reqExtras'].uaParsed,
                //referer: req.headers['reqExtras'].referer,
                //method: req.headers['reqExtras'].method
              } : {}
            }
          );
          app.service('makestats').create(
            {
              req_link_id: link_id,
              link_id: item.short_link,
              link_simple_links: item.simple_links,
              req_meta_data: req.headers['reqExtras'] ? {
                ip: req.headers['reqExtras'].ip,
                user_agent: req.headers['reqExtras'].userAgent,
                ua_parsed: req.headers['reqExtras'].uaParsed,
                referer: req.headers['reqExtras'].referer
              } : {}
            }
          );
          */

          // using https://github.com/feathersjs/feathers-batch
          app.service('batch').create(
            {
              'type': 'series', // "type": "<series/parallel>",
              'call': [
                [ 'clicks::create',
                  {
                    req_link_id: params.link_id,
                    link_id: item.short_link,
                    req_meta_data: req.headers['reqExtras'] ? {
                      ip: req.headers['reqExtras'].ip,
                      user_agent: req.headers['reqExtras'].userAgent,
                      //ua_parsed: req.headers['reqExtras'].uaParsed,
                      //referer: req.headers['reqExtras'].referer,
                      //method: req.headers['reqExtras'].method
                    } : {}
                  }
                ],
                [ 'makestats::create',
                  {
                    req_link_id: params.link_id,
                    link_id: item.short_link,
                    link_simple_links: item.simple_links,
                    req_meta_data: req.headers['reqExtras'] ? {
                      ip: req.headers['reqExtras'].ip,
                      user_agent: req.headers['reqExtras'].userAgent,
                      ua_parsed: req.headers['reqExtras'].uaParsed,
                      referer: req.headers['reqExtras'].referer
                    } : {}
                  }
                ],
                //[ 'clicks::find', {} ]
              ]
            }
          ).then( resp => {
            throw resp;
          }).catch(fish => {
            if(isDev) {
              logger.info('>> fish', fish);
            }
          });


          // -> redirect to long_link
          res.redirect(301, item.long_link);
        }).catch(error => {
          if(typeof error.toJSON === 'function') {
            logger.error(error.toJSON());
          }
          else {
            logger.error(error);
          }

          //res.status(404).json({ error: error });
          res.status(error.code).send(error.name);//({ error: error });
        });
    });

  /*
  function recordClicks(item, params, wrapperCb) {

    if (!item) throw new Error('unknown error');

    // -> record clicks (interaction)
    app.service('clicks').create(
      {
        link_id: item.short_link,
        req_link_id: params.link_id
      }
    ).then(res => {
      logger.info('recordClicks-result', res);

      // -> update stats

      wrapperCb(res);
    }).catch(err => {
      logger.info('recordClicks-error', err);
      //result(err);
      throw err;
    });
  }
  */


  /*app.service(linkRoute).hooks({
    before: {
      all: [
        //hook => {
        //}
      ]
    },
    after: {
      all: [
        hook => {
          logger.info('hook after '+linkRoute + ' | '+hook);
        }
      ]
    }
  });*/


  /*app.use('/:link_id', {  // tried testing
    find(params) {
      return new Promise((resolve, reject) => {
        app.service(linksServiceName)
          .find({
            query: {
              $or: [
                { _id: params.link_id },
                { simple_links: params.link_id },
              ]
            }
          })
          .then(item => {
            logger.info('>>link service .find', item);

            if (item.data && item.data.length>0) {
              item = item.data[0];
            }
            else {
              throw new errors.NotFound(
                'link does NOT exists!!!',
                {link: params.link_id}
              );
            }
            // 1. record clicks (interaction)
            if (item && item._id) {
              app.service('clicks').create(
                {
                  link_id: item._id,
                  req_link_id: params.link_id
                }
              );
            }

            // 2. update stats

            // 3. redirect to long_link
            //res.redirect(301, item.long_link);
            resolve(item);
          }).catch(error => {
            logger.error(error.toJSON());
            reject(error);
            //res.status(404).send({ error: error });
          });
      });
    }
  });*/

};
