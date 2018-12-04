// see https://github.com/feathers-plus/feathers-vuex

import { myConfig, isDev, isLocalHost } from './app-config'; // eslint-disable-line
const jwtHeaderName = myConfig.authentication.storageKey
    ? myConfig.authentication.storageKey
    : 'baet-jwt';

let restHost;
if (process.env.NODE_ENV === 'development') {
  restHost = myConfig.backend.development;
} else {
  restHost = myConfig.backend.production;
}

// NOTE if you want to force use specific endpoint on your local instance, see below
if (window.location && isLocalHost(window.location.hostname)) {
  restHost = myConfig.backend.development; // .development // .production
}
// NOTE force using only a specific backend as below
//restHost = myConfig.backend.production;

if (isDev) {
  console.log(
      'NODE_ENV: ' + process.env.NODE_ENV
      + ' | restHost: ' + restHost
      //+ ' | ' + JSON.stringify(process.env)
  );
}

import feathers from '@feathersjs/feathers'
import feathersAuth from '@feathersjs/authentication-client'
import rest from '@feathersjs/rest-client';
import axios from 'axios';
const restClient = rest(restHost);
const feathersClient = feathers()
  //.configure(restClient.fetch(window.fetch.bind(window)))
  .configure(restClient.axios(axios))
  .configure(feathersAuth({
    jwtStrategy: 'jwt',
    storageKey: jwtHeaderName,
    storage: window.localStorage
  }));
export default feathersClient
