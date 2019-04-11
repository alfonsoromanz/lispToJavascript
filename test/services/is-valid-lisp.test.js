const assert = require('assert');
const app = require('../../src/app');

describe('\'isValidLisp\' service', () => {
  it('registered the service', () => {
    const service = app.service('isValidLisp');

    assert.ok(service, 'Registered the service');
  });
});
