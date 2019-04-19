const transpileLispToJavascript=require('../../transpiler/');
const checkParameters=require('../../hooks/checkParameters');

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [checkParameters, transpileLispToJavascript, function(hook){
      hook.result = {
        isValidLisp: hook.result.success
      };
    }],
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
};
