const convertToJs = require('./convert-to-js/convert-to-js.service.js');
const isValidLisp = require('./is-valid-lisp/is-valid-lisp.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(convertToJs);
  app.configure(isValidLisp);
};
