/**
 * Transpilation function from Lisp to Javascript.
 *
 * @param {HookContext} hook
 * @returns {Promise<void>}
 * @author Alfonso
 */
const fs = require('fs');
const path = require('path');
const Lexer = require('lex');
const Parser = require('jison').Parser;
const Grammar = fs.readFileSync(path.join(__dirname,'grammar.jison'), 'utf8');

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

  lexer.addRule(/defvar/, function (lexeme) {
    this.yytext = lexeme;
    lexemes.push(lexeme);
    return "DEFVAR"
  });

  lexer.addRule(/setq/, function (lexeme) {
    this.yytext = lexeme;
    lexemes.push(lexeme);
    return "SETQ"
  });

  lexer.addRule(/defun/, function (lexeme) {
    this.yytext = lexeme;
    lexemes.push(lexeme);
    return "DEFUN"
  });

  lexer.addRule(/if/, function (lexeme) {
    this.yytext = lexeme;
    lexemes.push(lexeme);
    return "IF"
  });

  lexer.addRule(/'[a-z]*'/, function (lexeme) {
    if (lexeme!=="") {
      this.yytext = lexeme;
      lexemes.push(lexeme);
      return "STRING";
    }  
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
    return "("
  });
  
  lexer.addRule(/\)/, function (lexeme) {
    this.yytext = lexeme;
    lexemes.push(lexeme);
    return ")"
  });
  
  lexer.addRule(/\+/, function (lexeme) {
    this.yytext = lexeme;
    lexemes.push(lexeme);
    return '+'
  });
  
  lexer.addRule(/\-/, function (lexeme) {
    this.yytext = lexeme;
    lexemes.push(lexeme);
    return '-'
  });
  
  lexer.addRule(/\*/, function (lexeme) {
    this.yytext = lexeme;
    lexemes.push(lexeme);
    return "*"
  });
  
  lexer.addRule(/\//, function (lexeme) {
    this.yytext = lexeme;
    lexemes.push(lexeme);
    return "/"
  });
  
  lexer.addRule(/\=/, function (lexeme) {
    this.yytext = lexeme;
    lexemes.push(lexeme);
    return "="
  });

  lexer.addRule(/>/, function (lexeme) {
    this.yytext = lexeme;
    lexemes.push(lexeme);
    return ">"
  });

  lexer.addRule(/</, function (lexeme) {
    this.yytext = lexeme;
    lexemes.push(lexeme);
    return "<"
  });
  
  lexer.addRule(/$/, function () {
    return "EOF";
  });
  
  let javascript = undefined;

  try {
    javascript = parser.parse(lispCode);
  } catch (e) {
    errors.push(e.message);
  }
  
  
  hook.result = {
    success: errors.length===0,
    lisp: lispCode,
    javascript: javascript, 
    tokens: tokens,
    lexemes: lexemes,
    errors: errors
  }
  
};