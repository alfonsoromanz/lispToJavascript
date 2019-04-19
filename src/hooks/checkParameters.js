module.exports = function(hook){
  if (!hook.data.lispCode || typeof(hook.data.lispCode)!=='string') {
    throw new Error('lispCode (string) is required.');
  }
};