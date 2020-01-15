const { authenticate } = require('@feathersjs/authentication').hooks;
const commonHooks = require('feathers-hooks-common');
const authHooks = require('feathers-authentication-hooks');
const logger = require('./../../logger');
const errors = require('@feathersjs/errors'); // https://www.npmjs.com/package/feathers-errors
const Validator = require('validator'); // https://github.com/chriso/validator.js
const string = require('string'); // https://www.npmjs.com/package/string

const _ = require("lodash");

const shortid = require('shortid'); // https://github.com/dylang/shortid
//shortid.characters('0123456789abcdefghijklmnopqrstuvwxyz');
shortid.seed(2480);

let appconfig;

module.exports = {
  before: {
    all: [
      hook => {
        logger.info('links.hook-all -> '
          + ' | data: %s' + ' | params: %s' + ' | headers: %s',
          hook.data, hook.params, hook.params.headers
        );
      },

      authenticate('jwt'), // authHooks.restrictToAuthenticated()
      hook => {
        appconfig = hook.app.get('appconfig');
      }
    ],
    find: [
      //authHooks.queryWithCurrentUser({ idField: 'userid', as: 'userid' }),
      authHooks.setField({
        from: 'params.user.userid',
        as: 'params.query.userid'
      }),
    ],
    get: [],
    create: [

      /* // FIXME when done with migration, comment this out!!!
      hook => { // backdoor: our importers to ignore all other hooks
        //commonHooks.info('check if requested from our importers');
        if (hook.data.importedAt) {
          logger.info('it is our importer!!!', hook.data);
          return Promise.resolve(hook);
        }
      }, */

      hook => {
        //commonHooks.info('check the basics');

        if (!hook.data || string(hook.data.long_link).isEmpty()) {
          return Promise.reject(
            new errors.BadRequest(
              'long_link is required! ',
              {long_link: hook.data.long_link}
            )
          );
        }

        //let simple_links = commonHooks.getByDot(hook.data, 'simple_links');
        let simple_links = _.get(hook.data, 'simple_links');

        if (!simple_links) {
          simple_links = [];
        }
        if (!Array.isArray(simple_links)
          && !string(simple_links).isEmpty()) {
          simple_links = [simple_links];
        }

        for (let index = 0; index < simple_links.length; index++) {
          simple_links[index] = simple_links[index].toString().toLowerCase();
        }

        //commonHooks.setByDot(hook.data, 'simple_links', simple_links);
        _.set(hook.data, 'simple_links', simple_links);
        /*if(simple_links.length===0) {
          commonHooks.deleteByDot(hook.data, 'simple_links');
        }
        else {
          commonHooks.setByDot(hook.data, 'simple_links', simple_links);
        }*/

        //logger.info(JSON.stringify(hook.data));
      },

      hook => {
        if(hook.data.simple_links.length===0) {
          //commonHooks.deleteByDot(hook.data, 'simple_links');
          _.omit(hook.data, 'simple_links');
        }
      },

      //authHooks.associateCurrentUser({ idField: '_id', as: 'userid' }),
      authHooks.setField({
        from: 'params.user._id',
        as: 'data.userid'
      }),

      hook => {
        commonHooks.debug('link content validation');

        if (Validator.isEmpty(hook.data.long_link)
          || !Validator.isLength(hook.data.long_link, appconfig.diz.long_link.len)
          || !Validator.isURL(hook.data.long_link, {
            protocols: ['http','https','ftp'],
            require_tld: true, require_protocol: false, require_host: true, require_valid_protocol: true,
            allow_underscores: true, host_whitelist: false, host_blacklist: false,
            allow_trailing_dot: false, allow_protocol_relative_urls: false
          })
        ) {
          return Promise.reject(
            new errors.BadRequest(
              'long_link is NOT a proper url! ',
              {long_link: hook.data.long_link}
            )
          );
        }
        else {
          if(!hook.data.simple_links) return;

          // validate simple_links
          for (let simple_link of hook.data.simple_links) {
            //logger.info('simple_link', simple_link);
            //if (!Validator.isLength(simple_link, {min:5, max:22})) {
            if (!Validator.isLength(simple_link, appconfig.diz.simple_link.len)) {
              return Promise.reject(
                new errors.BadRequest(
                  'The simple_link must be more than '+appconfig.diz.simple_link.len.min+' and less than '+appconfig.diz.simple_link.len.max+' characters long',
                  {simple_link: hook.data.simple_links}
                )
              );
            }
            else if (!Validator.isAlphanumeric(simple_link)) {
              if (!Validator.contains(simple_link, '_') && !Validator.contains(simple_link, '-')) {
                return Promise.reject(
                  new errors.BadRequest(
                    'The simple_link can consist of only alphanumeric chars (letter, number), underscore (_) and dash (-)',
                    {simple_link: hook.data.simple_links}
                  )
                );
              }
            }
          }
        }
      },

      hook => { // check if long_link in PhishTank!
        commonHooks.debug('check if long_link in PhishTank');

        return hook.app.service('phishtank')
          .find({
            query: {
              online: 'yes',
              verified: 'yes',
              url: hook.data.long_link
            }
            /*query: {
              $and: [
                {online: 'yes'},
                {verified: 'yes'},
                {url: hook.data.long_link},
              ]
            }*/
          })
          .then(item => {
            if (item.data && item.data.length>0) {
              item = item.data[0];
            }
            //logger.info('>>check phishtank', item);
            if (item && item._id) {
              //return Promise.reject(
              throw new errors.BadRequest(
                'long_link is NOT allowed! for more details see: http://phishtank.com',
                {long_link: hook.data.long_link}
              );
              //);
            }
            //return item; // as json object
          }).catch(error => {
            logger.error(error);
            //return error;
            return Promise.reject(error);
          });
      },

      hook => {
        if(!hook.data.simple_links) return;

        commonHooks.debug('check if requested simple_link is one of the service paths!');

        for (let r of hook.app._router.stack) {
          if (r.route && r.route.path) {
            for (let simple_link of hook.data.simple_links) {
              if (Validator.contains(r.route.path, '/'+simple_link+'/')
                || Validator.contains(r.route.path, '/'+simple_link+'.json')
              ) {
                logger.info(simple_link + ' -> ' + r.route.path);
                return Promise.reject(
                  new errors.BadRequest(
                    'The simple_link is NOT allowed, reserved names are forbidden! ',
                    {simple_link: hook.data.simple_links}
                  )
                );
              }
            }
          }
        }
        /*hook.app._router.stack.forEach(function(r){
          if (r.route && r.route.path){
            //logger.info(r.route.path);

            for (let simple_link of hook.data.simple_links) {
              if (Validator.contains(r.route.path, '/'+simple_link+'/')
                || Validator.contains(r.route.path, '/'+simple_link+'.json')
              ) {
                logger.info(simple_link + ' -> ' + r.route.path);
                //return Promise.reject(
                throw new errors.BadRequest(
                  'The simple_link is NOT allowed, reserved names are forbidden! ',
                  {simple_link: hook.data.simple_links}
                );
                //);
              }
            }
          }
        }).catch(error => {
          logger.error('->inline error', error);
          //return error;
          if (error) {
            return Promise.reject(error);
          }
        });
        */

        //return Promise.resolve(hook);
      },

      hook => {
        if(!hook.data.simple_links || hook.data.simple_links.length===0) return;

        commonHooks.debug('check if requested simple_link already exists in simple_links');

        let theOr = [];
        for (let simple_link of hook.data.simple_links) {
          theOr.push( { simple_links: simple_link } );
        }
        //logger.info('simple_links.theOr', theOr);
        return hook.app.service('links')
          .find({
            /*query: { simple_links: hook.data.simple_links }*/
            query: {
              $or: theOr
            }
          })
          .then(item => {

            /*if (commonHooks.getByDot(item.data, 'simple_links')) {
              throw new errors.BadRequest(
                'simple_link already exists!!!',
                {simple_link: hook.data.simple_links}
              );
            }*/
            if (item.data && Array.isArray(item.data) && item.data.length>0) {
              item = item.data[0];
            }
            //logger.info('>>check simple_links', item);
            if (item && item.simple_links) {
              throw new errors.BadRequest(
                'simple_link already exists!!!',
                {simple_link: hook.data.simple_links}
              );
            }

          }).catch(error => {
            //logger.error('inline error', error);
            return Promise.reject(error);
          });
      },

      hook => {
        if(!hook.data.simple_links) return;

        //commonHooks.debug('check if requested simple_link is one of the RESERVED names!');

        // TODO implement this!!!
      },

      hook => {
        if (!hook.data._id) {
          // generate uniqueid
          hook.data._id = shortid.generate();
          hook.data._id = string(hook.data._id).replaceAll('-', '');
          hook.data._id = string(hook.data._id).replaceAll('_', '');
          hook.data._id = hook.data._id.toLowerCase();
          if (string(hook.data._id).length > appconfig.diz.short_link.len) {
            hook.data._id = string(hook.data._id).left(appconfig.diz.short_link.len).s;
          }
          /* hook.data._id = anyid()
            .time('ms')
            .seq().resetByTime()
            .encode('a0')
            .length(appconfig.diz.short_link.len)
            .random()
            .id();
            */
        }
        //-logger.info('>> normalized data', JSON.stringify(hook.data));
      },

      hook => {
        if (!hook.data.isActive) {
          hook.data.isActive = true;
        }
        if (!hook.data.isPublic) {
          hook.data.isPublic = false;
        }
      },

      commonHooks.setNow('createdAt', 'updatedAt')
    ],
    update: [
      commonHooks.setNow('updatedAt')
    ],
    patch: [
      commonHooks.setNow('updatedAt')
    ],
    remove: []
  },

  after: {
    all: [
      hook => {
        appconfig = hook.app.get('appconfig');
      },

      //commonHooks.pluck('_id','short_link', 'simple_links', 'long_link', 'createdAt'), // 'userid',
      commonHooks.iff(commonHooks.isProvider('external'), commonHooks.keep('_id','short_link', 'simple_links', 'long_link', 'createdAt')),
      hook => {
        let items = commonHooks.getItems(hook);
        !Array.isArray(items) ?
          (items.short_link = items._id)
          : (items.forEach(item => { item.short_link = item._id; }));
        commonHooks.replaceItems(hook, items);
      },
      //commonHooks.discard('_id') // we always need _id field for aor List display
      hook => {
        if (appconfig.isDev) {
          logger.info(JSON.stringify(hook.result));
        }
      }
    ],
    find: [],
    get: [],
    create: [
      /*function(hook) {
        // Override the original data
        hook.result.short_link = hook.result._id;

        // Hooks can either return nothing or a promise
        // that resolves with the `hook` object for asynchronous operations
        return Promise.resolve(hook);
      }*/
      //, commonHooks.discard('_id')
      //, commonHooks.pluck('short_link', 'long_link', 'simple_links')
    ],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [
      hook => {
        logger.error('links.hook-all -> Error in '+hook.path+' service method '+hook.method + ' | %s', hook.error.stack);
      }
    ],
    find: [],
    get: [],
    create: [
      hook => {
        logger.error('links.hook-create -> Error in '+hook.path+' service method '+hook.method + ' | %s', hook.error.stack);
      }
    ],
    update: [],
    patch: [],
    remove: []
  }
};
