/**
 * Transpilation function from Lisp to Javascript.
 *
 * @param {HookContext} hook
 * @returns {Promise<void>}
 * @author Alfonso
 */
const Lexer = require('lex');
const Parser = require("jison").Parser;
const Grammar = require('./grammar')

module.exports = async function transpileLispToJavascript (hook)  {
  const lispCode = hook.data.lispCode;
  let token = null;
  let tokens = [];
  let lexemes = [];
  let errors = [];
  let line = 1;
  
  const parser = new Parser(Grammar);
  const lexer = parser.lexer = new Lexer;
  
  lexer.addRule(/ /, function (lexeme) {
    this.yytext = lexeme;
    lexemes.push(lexeme);
    return "BLANK";
  });
  
  lexer.addRule(/\n/, function () {  
    line++;
  }, []);
  
  lexer.addRule(/[0-9]/, function (lexeme) {
    this.yytext = lexeme;
    lexemes.push(lexeme);
    return "CONST_INT";
  });
  
  lexer.addRule(/or/, function (lexeme) {
    this.yytext = lexeme;
    lexemes.push(lexeme);
    return "OR"
  });
  
  lexer.addRule(/and/, function (lexeme) {
    this.yytext = lexeme;
    lexemes.push(lexeme);
    return "AND"
  });
  
  lexer.addRule(/not/, function (lexeme) {
    this.yytext = lexeme;
    lexemes.push(lexeme);
    return "NOT"
  });
  
  lexer.addRule(/nil/, function (lexeme) {
    this.yytext = lexeme;
    lexemes.push(lexeme);
    return "NIL"
  });
  
  lexer.addRule(/defvar/, function (lexeme) {
    this.yytext = lexeme;
    lexemes.push(lexeme);
    return "DEFVAR"
  });
  
  lexer.addRule(/let/, function (lexeme) {
    this.yytext = lexeme;
    lexemes.push(lexeme);
    return "LET"
  });
  
  lexer.addRule(/[a-z]*/, function (lexeme) {
    if (lexeme!=="") {
      this.yytext = lexeme;
      lexemes.push(lexeme);
      return "IDENTIFIER";
    }  
  });
  
  lexer.addRule(/\(/, function (lexeme) {
    this.yytext = lexeme;
    lexemes.push(lexeme);
    return "PARENTHESIS_OPEN"
  });
  
  lexer.addRule(/\)/, function (lexeme) {
    this.yytext = lexeme;
    lexemes.push(lexeme);
    return "PARENTHESIS_CLOSE"
  });
  
  lexer.addRule(/\+/, function (lexeme) {
    this.yytext = lexeme;
    lexemes.push(lexeme);
    return "PLUS"
  });
  
  lexer.addRule(/\-/, function (lexeme) {
    this.yytext = lexeme;
    lexemes.push(lexeme);
    return "MINUS"
  });
  
  lexer.addRule(/\*/, function (lexeme) {
    this.yytext = lexeme;
    lexemes.push(lexeme);
    return "MULT"
  });
  
  lexer.addRule(/\//, function (lexeme) {
    this.yytext = lexeme;
    lexemes.push(lexeme);
    return "DIV"
  });
  
  lexer.addRule(/\=/, function (lexeme) {
    this.yytext = lexeme;
    lexemes.push(lexeme);
    return "EQUALS"
  });
  
  lexer.addRule(/$/, function () {
    return "EOF";
  });
  
  const javascript = parser.parse(lispCode);
  
  hook.result = {
    success: errors.length===0,
    lisp: lispCode,
    javascript: javascript, 
    tokens: tokens,
    lexemes: lexemes,
    errors: errors
  }
  
};