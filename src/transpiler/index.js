/**
 * Transpilation function from Lisp to Javascript.
 *
 * @param {HookContext} hook
 * @returns {Promise<void>}
 * @author Alfonso
 */

module.exports = async function transpileLispToJavascript (hook)  {
  let lispCode = hook.data.lispCode;
  
  /*
  *
  * TODO: transpile code here
  *
  */
  
  hook.result = {
    success:true,
    javascript: "let a = 3;", //hardcoded data for now :-)
    lisp: lispCode
  }

};