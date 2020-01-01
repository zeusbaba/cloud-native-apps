import feathers from '@feathersjs/client';
//import rest from '@feathersjs/rest-client';

import {appConfig, isDev, isLocalHost} from './AppConfig'; // eslint-disable-line
const jwtHeaderName = appConfig.authentication.storageKey
    ? appConfig.authentication.storageKey
    : 'ulink-jwt';

let restHost;
if (process.env.REACT_APP_API_URL) {
    restHost = process.env.REACT_APP_API_URL;
} else {
    if (process.env.NODE_ENV === 'development'
        || (window.location && isLocalHost(window.location.hostname))
        ) {
        restHost = appConfig.backend.development;
    } /*else if (process.env.NODE_ENV === 'prod-k8s') {
        restHost = appConfig.backend.k8s;
    }*/ else {
        restHost = appConfig.backend.production;
    }
}

// FIXME to force using only a specific backend uncomment this below
//restHost = appConfig.backend.production;
console.log('env: '+JSON.stringify(process.env)+' | restHost: ' + restHost);

if (isDev) {
    console.log(
        'NODE_ENV: ' +
        process.env.NODE_ENV +
        ' - REACT_APP_API_URL: ' +
        process.env.REACT_APP_API_URL +
        ' - restHost: ' +
        restHost,
    );
}

// https://docs.feathersjs.com/api/client/rest.html
//const restClient = rest(restHost);

// https://docs.feathersjs.com/api/authentication/client.html
const feathersClient = feathers()
//.configure(feathers.hooks())
    .configure(feathers.rest(restHost).fetch(window.fetch.bind(window)))
    //.configure(restClient.fetch(window.fetch.bind(window)))
    .configure(
        feathers.authentication({
            jwtStrategy: 'jwt',
            storageKey: jwtHeaderName,
            storage: window.localStorage,
            //storage: crossStorageClient
        }),
    );

export default feathersClient;