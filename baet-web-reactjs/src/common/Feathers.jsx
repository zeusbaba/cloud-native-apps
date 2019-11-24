import feathers from '@feathersjs/client';
//import rest from '@feathersjs/rest-client';

import {myConfig, isDev, isLocalHost} from './MyConfig'; // eslint-disable-line
const jwtHeaderName = myConfig.authentication.storageKey
    ? myConfig.authentication.storageKey
    : 'baet-jwt';

let restHost;
if (process.env.REACT_APP_API_URL) {
    restHost = process.env.REACT_APP_API_URL;
} else {
    if (process.env.NODE_ENV === 'development') {
        restHost = myConfig.backend.development;
    } else {
        restHost = myConfig.backend.production;
    }
}
// NOTE if you want to force use specific endpoint on your local instance, see below
if (window.location && isLocalHost(window.location.hostname)) {
    restHost = myConfig.backend.development; // .development // .production
}
// NOTE you can also force using only a specific backend as below
//restHost = myConfig.backend.production;

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