// Initializes the `convertToJS` service on path `/convertToJS`
const createService = require('feathers-memory');
const hooks = require('./convert-to-js.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/convertToJS', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('convertToJS');

  service.hooks(hooks);
};
