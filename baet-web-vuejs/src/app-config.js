
export const isLocalHost = hostname => {
  // call like this; isLocalHost(window.location.hostname)
  return !!(
      hostname === 'localhost' ||
      hostname === '[::1]' ||
      hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
  );
};

//export const isDev = process.env.NODE_ENV!=='production'? true : false;
export const isDev = process.env.NODE_ENV !== 'production'
    && isLocalHost(window.location.hostname);

export const generateUUID = () => {
  var datetime = new Date().getTime();
  return 'BAET-2019-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = ((datetime + Math.random() * 16) % 16) | 0;
    datetime = Math.floor(datetime / 16);
    return (c === 'x' ? r : (r & 0x7) | 0x8).toString(16);
  });
};

export const myConfig = {
  authentication: {
    path: '/authentication',
    header: 'Authorization',
    service: 'users',
    cookie: 'baet',
    storageKey: 'baet-jwt',
    clientOptions: {
      storageKey: 'baet-jwt',
      cookie: 'baet-jwt',
      authenticate: { strategy: 'local' },
    },
    restClientOptions: {
      id: '_id',
    },
  },
  backend: {
    development: 'http://localhost:4042',
    production: 'https://api.baet.no'
  },
  web: {
    defaultLocale: 'en',
    baseUrl: 'https://baet.no/',
    sharerText: 'Shorten & Simplify via BAET.no',
    header: {
      title: 'BAET.no :: Shorten & Simplify Links!',
      description:
          'URL shortener service that is fast, open, and easy to use. You can even assign multiple custom names for each link!',
      author: 'BeerStorm.net',
      keywords:
          'URL shortener, url shortener custom, short link free, shorten web address, make short url, shorten url for twitter, shorten diz link, liverpool supporters link shortener',
    },
    recaptcha: {
      sitekey: process.env['VUE_APP_RECAPTCHA_SITEKEY']
    },
  },
  diz: {
    long_link: {
      len: {
        min: 10,
        max: 2000,
      },
      // see https://github.com/chriso/validator.js
      // validator options is an object which defaults to {
      // protocols: ['http','https','ftp'], require_tld: true, require_protocol: false,
      // require_host: true, require_valid_protocol: true,
      // allow_underscores: false, host_whitelist: false,
      // host_blacklist: false, allow_trailing_dot: false,
      // allow_protocol_relative_urls: false }.
      validation: {
        protocols: ['http', 'https', 'ftp'],
        require_tld: true,
        require_protocol: false,
        require_host: true,
        require_valid_protocol: true,
        allow_underscores: true,
        host_whitelist: false,
        host_blacklist: false,
        allow_trailing_dot: false,
        allow_protocol_relative_urls: false,
      },
    },
    simple_link: {
      len: {
        min: 5,
        max: 22,
      },
      limit: 5,
    },
  },
};
