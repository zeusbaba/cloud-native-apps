const logger = require('./../logger');
const uaparser = require('ua-parser-js');
const isDev = process.env.NODE_ENV !== 'production'; // eslint-disable-line
module.exports = function () { //(options = {}) {
  return function reqExtras(req, res, next) {

    if (req.originalUrl === '/k8s-status') {
      //logger.info("k8s-status");
      next();
    }

    if (isDev) {
      logger.info('>> req.headers', req.headers);
    }

    req.headers['reqExtras'] = {};
    req.headers['reqExtras'].method = req.method;
    req.headers['reqExtras'].originalUrl = req.originalUrl;
    req.headers['reqExtras'].hostname = req.hostname;
    req.headers['reqExtras'].referer = req.headers['referer']? req.headers['referer'] : '';
    req.headers['reqExtras'].userAgent = req.headers['user-agent']? req.headers['user-agent'] : '';

    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    if (ip.substr(0, 7) == '::ffff:') {
      ip = ip.substr(7);
    }
    else if (ip === '::1') {
      ip = 'localhost';
    }
    req.headers['reqExtras'].ip = ip;//-req.ip;//? req.ip:req.ips;

    req.headers['reqExtras'].uaParsed = uaparser(req.headers['reqExtras'].userAgent);

    if (isDev) {
      logger.info('>> reqExtras', req.headers['reqExtras']);
    }

    /*
    if (req.cookies) {
      req.headers['reqExtras'].cookies = req.cookies;
      req.cookies = null;
    }
    if (req.signedCookies) {
      req.headers['reqExtras'].signedCookies = req.signedCookies;
      req.signedCookies = null;
    }
    */

    next();
  };
};
