const transpileLispToJavascript =require('../../transpiler/')

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [transpileLispToJavascript, function(hook){
      hook.result = {
        isValidLisp: hook.result.success
      }
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
