import jwtDecode from "jwt-decode";
import moment from "moment";

export const isLocalHost = hostname => {
    // call like this; isLocalHost(window.location.hostname)
    return !!(
        hostname === 'localhost' ||
        hostname === '[::1]' ||
        hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
    );
};

//export const isDev = process.env.NODE_ENV!=='production'? true : false;
export const isDev =
    process.env.NODE_ENV !== 'production' &&
    isLocalHost(window.location.hostname); // ? true : false;

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
            authenticate: {strategy: 'local'},
        },
        restClientOptions: {
            id: '_id',
        },
    },
    backend: {
        development: 'http://localhost:4042',
        production: 'https://api.baet.no',
        placeholder: 'https://jsonplaceholder.typicode.com',
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
            sitekey: 'RECAPTCHA_SITEKEY',
            secretkey: 'RECAPTCHA_SECRETKEY',
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

export const jwtHeaderName = myConfig.authentication.storageKey
    ? myConfig.authentication.storageKey
    : 'baet-jwt';
export const getUserIdFromToken = (token) => {
    const decodedToken = jwtDecode(token);
    return decodedToken['userId'];
};
export const isValidToken = (currentToken) => {
    if (!currentToken) {
        currentToken = localStorage.getItem(jwtHeaderName);
    }

    if (currentToken) {
        const decodedToken = jwtDecode(currentToken);
        if (isDev) {
            console.log("decodedToken -> " + JSON.stringify(decodedToken));
            /*
            decodedToken -> {
            "userId":"e426a2da-0dca-4163-9a08-3d935994e747",
            "custom":"baet.no yry.no diz.link lfc.link","iat":1505048249,
            "exp":1536584249,"aud":"baet.no","iss":"baet.no","sub":"baet.no"
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
