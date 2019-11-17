import feathersClient, { makeServicePlugin, BaseModel } from '../../feathers-client'

class Stat extends BaseModel {
    constructor(data, options) {
        super(data, options)
    }
    // Required for $FeathersVuex plugin to work after production transpile.
    static modelName = 'Stat';
    // Define default properties here
    static instanceDefaults() {
        /*return {
            userid: '',
            password: ''
        }*/
    }
}
const servicePath = 'stats';
const statServicePlugin = makeServicePlugin({
    Model: Stat,
    service: feathersClient.service(servicePath),
    servicePath
});

// Setup the client-side Feathers hooks.
feathersClient.service(servicePath).hooks({
    before: {
        all: [],
        find: [],
        get: [],
        create: [],
        update: [],
        patch: [],
        remove: []
    },
    after: {
        all: [],
        find: [],
        get: [],
        create: [],
        update: [],
        patch: [],
        remove: []
    },
    error: {
        all: [],
        find: [],
        get: [],
        create: [],
        update: [],
        patch: [],
        remove: []
    }
});

export default statServicePlugin
