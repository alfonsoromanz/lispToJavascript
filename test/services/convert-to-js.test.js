const assert = require('assert');
const app = require('../../src/app');

describe('\'convertToJS\' service', () => {
  it('registered the service', () => {
    const service = app.service('convertToJS');

    assert.ok(service, 'Registered the service');
  });
});
