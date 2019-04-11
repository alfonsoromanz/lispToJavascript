// Initializes the `isValidLisp` service on path `/isValidLisp`
const createService = require('feathers-memory');
const hooks = require('./is-valid-lisp.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/isValidLisp', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('isValidLisp');

  service.hooks(hooks);
};
