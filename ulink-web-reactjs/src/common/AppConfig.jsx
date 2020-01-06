import jwtDecode from "jwt-decode";
import moment from "moment";

export const isLocalHost = hostname => {
    // call like this; isLocalHost(window.location.hostname)
    return !!(
        hostname === 'localhost' ||
        //hostname === '[::1]' ||
        hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
    );
};

//export const isDev = process.env.NODE_ENV!=='production'? true : false;
export const isDev =
    // eslint-disable-next-line no-undef
    process.env.NODE_ENV !== 'production' &&
    // eslint-disable-next-line no-undef
    isLocalHost(window.location.hostname); // ? true : false;

export const appConfig = {
    authentication: {
        path: '/authentication',
        header: 'Authorization',
        service: 'users',
        cookie: 'ulink',
        storageKey: 'ulink-jwt',
        clientOptions: {
            storageKey: 'ulink-jwt',
            cookie: 'ulink-jwt',
            authenticate: {strategy: 'local'},
        },
        restClientOptions: {
            id: '_id',
        },
    },
    backend: {
        development: 'http://localhost:4042',
        production: 'https://api.ulink.no',
        //k8s: 'http://ulink-api-js-service', // .catpet.svc.cluster.local
        uuidSourceValue: 'uLINK-2020-yxxx-xxxxxxxxxxxx'
    },
    web: {
        defaultLocale: 'en',
        baseUrl: 'https://ulink.no/',
        sharerText: 'Shorten & Simplify via uLINK.no',
        header: {
            title: 'uLINK.no :: Shorten & Simplify Links!',
            description:
                'URL shortener service that is fast, open, and easy to use. You can even assign multiple custom names for each link!',
            author: 'BeerStorm.net',
            keywords:
                'URL shortener, url shortener custom, short link free, shorten web address, make short url, shorten url for twitter, shorten diz link, liverpool supporters link shortener',
        },
        recaptcha: {
            //FIXME sitekey: process.env.REACT_APP_RECAPTCHA_SITEKEY
            sitekey: '6LeJK8wUAAAAAInbyy_bQ7CLkIPtdN6u7uqhCdrF'
        },
    },
    diz: {
        long_link: {
            len: {
                min: 10,
                max: 2000,
            },
            // options is an object which defaults to {
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

export const jwtHeaderName = appConfig.authentication.storageKey
    ? appConfig.authentication.storageKey
    : 'ulink-jwt';
export const getUserIdFromToken = (token) => {
    const decodedToken = jwtDecode(token);
    return decodedToken['userId'];
};
export const isValidToken = (currentToken) => {
    if (!currentToken) {
        // eslint-disable-next-line no-undef
        currentToken = localStorage.getItem(jwtHeaderName);
    }

    if (currentToken) {
        const decodedToken = jwtDecode(currentToken);
        if (isDev) {
            // eslint-disable-next-line no-undef
            console.log("decodedToken -> " + JSON.stringify(decodedToken));
            /*
            decodedToken -> {
            "userId":"e426a2da-0dca-4163-9a08-3d935994e747",
            "custom":"ulink.no yry.no diz.link lfc.link","iat":1505048249,
            "exp":1536584249,"aud":"ulink.no","iss":"ulink.no","sub":"ulink.no"
            }
            */
        }
        const tokenExpiration = decodedToken.exp;
        const tokenExpirationTimeInSeconds = (tokenExpiration - moment(Math.floor(Date.now() / 1000)));
        if (!tokenExpiration || tokenExpirationTimeInSeconds > 60) {
            return true;
        }
        /*const dateNow = new Date();
        if (decodedToken.exp > dateNow.getTime) {
            return true;
        }*/

    }

    return false;
};
