const assert = require('assert');
const app = require('../../src/app');

describe('\'k8s\' service', () => {
  it('registered the service', () => {
    const service = app.service('k8s');

    assert.ok(service, 'Registered the service');
  });
});
