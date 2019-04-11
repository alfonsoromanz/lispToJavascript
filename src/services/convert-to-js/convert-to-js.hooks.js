const transpileLispToJavascript =require('../../transpiler/')

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [transpileLispToJavascript],
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
