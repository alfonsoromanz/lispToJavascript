/**
 * Transpilation function from Lisp to Javascript.
 *
 * @param {HookContext} hook
 * @returns {Promise<void>}
 * @author Alfonso
 */
const Lexer = require('lex');

module.exports = async function transpileLispToJavascript (hook)  {
  const lispCode = hook.data.lispCode;
  let token = null;
  let tokens = [];
  let lexemes = [];
  let errors = [];
  let line = 1;
  const lexer = new Lexer;
  
  //TO-DO: define tokens and give them a numerical ID instead of a string
  lexer.addRule(/ /, function (lexeme) {
    lexemes.push(lexeme);
    return "BLANK";
  });
  
  lexer.addRule(/\n/, function () {  
    line++;
  }, []);
  
  lexer.addRule(/[0-9]/, function (lexeme) {
    lexemes.push(lexeme);
    return "CONST_INT";
  });
  
  lexer.addRule(/[a-z]*/, function (lexeme) {
    if (lexeme!=="") {
      lexemes.push(lexeme);
      return "IDENTIFIER";
    }  
  });
  
  lexer.addRule(/\(/, function (lexeme) {
    lexemes.push(lexeme);
    return "PARENTHESIS_OPEN"
  });
  
  lexer.addRule(/\)/, function (lexeme) {
    lexemes.push(lexeme);
    return "PARENTHESIS_CLOSE"
  });
  
  lexer.addRule(/$/, function () {
    return "EOF";
  });
  
  //Read and tokenize the input
  lexer.input = lispCode;
  try {
    while (token!==undefined) {
      token = lexer.lex();
      if (token)
        tokens.push(token);  
    } 
  } catch (e) {
    errors.push('Unexpected token at line number ' + line + '.');
  }
  
  hook.result = {
    success: errors.length===0,
    javascript: "TO-DO", 
    lisp: lispCode,
    tokens: tokens,
    lexemes: lexemes,
    errors: errors
  }
  
};