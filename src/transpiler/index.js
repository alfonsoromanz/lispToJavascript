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
  let lispCode = hook.data.lispCode;
  let tokens = [];
  let lexemes = [];
  let errors = [];
  
  
  const parser = new Parser(Grammar);
  const lexer = parser.lexer = new Lexer(function (char) {
    //throw new Error(`Unexpected character ${char} on line ${parser.yy.lines}`);
    errors.push(`Unexpected character ${char} on line ${parser.yy.lines}`);
  });

  // Configure the parser
  parser.yy.lines=1;
  parser.yy.parseError = function (err, hash) {
    const error = err.split(':')[1];
    throw new SyntaxError(`Parse error on line ${parser.yy.lines}: ${error}`);
  };

  // Configure the lexer
  lexer.addRule(/ /, function (lexeme) {
    this.yytext = lexeme;
    lexemes.push(lexeme);
    tokens.push("BLANK")
    return "BLANK";
  });
  
  lexer.addRule(/\n/, function () {  
    parser.yy.lines++;
  }, []);
  
  lexer.addRule(/[0-9]*/, function (lexeme) {
    this.yytext = lexeme;
    lexemes.push(lexeme);
    tokens.push("CONST_INT")
    return "CONST_INT";
  });
  
  lexer.addRule(/or/, function (lexeme) {
    this.yytext = lexeme;
    lexemes.push(lexeme);
    tokens.push("OR")
    return "OR"
  });
  
  lexer.addRule(/and/, function (lexeme) {
    this.yytext = lexeme;
    lexemes.push(lexeme);
    tokens.push("AND")
    return "AND"
  });
  
  lexer.addRule(/not/, function (lexeme) {
    this.yytext = lexeme;
    lexemes.push(lexeme);
    tokens.push("NOT")
    return "NOT"
  });
  
  lexer.addRule(/nil/, function (lexeme) {
    this.yytext = lexeme;
    lexemes.push(lexeme);
    tokens.push("NIL")
    return "NIL"
  });
  
  lexer.addRule(/defvar/, function (lexeme) {
    this.yytext = lexeme;
    lexemes.push(lexeme);
    tokens.push("DEFVAR")
    return "DEFVAR"
  });
  
  lexer.addRule(/let/, function (lexeme) {
    this.yytext = lexeme;
    lexemes.push(lexeme);
    tokens.push("LET")
    return "LET"
  });

  lexer.addRule(/return-from/, function (lexeme) {
    this.yytext = lexeme;
    lexemes.push(lexeme);
    tokens.push("RETURNFROM")
    return "RETURNFROM"
  });

  lexer.addRule(/progn/, function (lexeme) {
    this.yytext = lexeme;
    lexemes.push(lexeme);
    tokens.push("PROGN")
    return "PROGN"
  });

  lexer.addRule(/loop/, function (lexeme) {
    this.yytext = lexeme;
    lexemes.push(lexeme);
    tokens.push("LOOP")
    return "LOOP"
  });

  lexer.addRule(/return/, function (lexeme) {
    this.yytext = lexeme;
    lexemes.push(lexeme);
    tokens.push("RETURN")
    return "RETURN"
  });

  lexer.addRule(/when/, function (lexeme) {
    this.yytext = lexeme;
    lexemes.push(lexeme);
    tokens.push("WHEN")
    return "WHEN"
  });

  lexer.addRule(/defvar/, function (lexeme) {
    this.yytext = lexeme;
    lexemes.push(lexeme);
    tokens.push("DEFVAR")
    return "DEFVAR"
  });

  lexer.addRule(/setq/, function (lexeme) {
    this.yytext = lexeme;
    lexemes.push(lexeme);
    tokens.push("SETQ")
    return "SETQ"
  });

  lexer.addRule(/defun/, function (lexeme) {
    this.yytext = lexeme;
    lexemes.push(lexeme);
    tokens.push("DEFUN")
    return "DEFUN"
  });

  lexer.addRule(/print/, function (lexeme) {
    this.yytext = lexeme;
    lexemes.push(lexeme);
    tokens.push("PRINT")
    return "PRINT"
  });

  lexer.addRule(/if/, function (lexeme) {
    this.yytext = lexeme;
    lexemes.push(lexeme);
    tokens.push("IF")
    return "IF"
  });

  lexer.addRule(/"[\s\S]*"/, function (lexeme) {
    if (lexeme!=="") {
      this.yytext = lexeme;
      lexemes.push(lexeme);
      tokens.push("STRING")
      return "STRING";
    }  
  });
  
  lexer.addRule(/[A-Za-z]*/, function (lexeme) {
    if (lexeme!=="") {
      this.yytext = lexeme;
      lexemes.push(lexeme);
      tokens.push("IDENTIFIER")
      return "IDENTIFIER";
    }  
  });
  
  lexer.addRule(/\(/, function (lexeme) {
    this.yytext = lexeme;
    lexemes.push(lexeme);
    tokens.push("(")
    return "("
  });
  
  lexer.addRule(/\)/, function (lexeme) {
    this.yytext = lexeme;
    lexemes.push(lexeme);
    tokens.push(")")
    return ")"
  });
  
  lexer.addRule(/\+/, function (lexeme) {
    this.yytext = lexeme;
    lexemes.push(lexeme);
    tokens.push("+")
    return '+'
  });
  
  lexer.addRule(/\-/, function (lexeme) {
    this.yytext = lexeme;
    lexemes.push(lexeme);
    tokens.push("-")
    return '-'
  });
  
  lexer.addRule(/\*/, function (lexeme) {
    this.yytext = lexeme;
    lexemes.push(lexeme);
    tokens.push("*")
    return "*"
  });
  
  lexer.addRule(/\//, function (lexeme) {
    this.yytext = lexeme;
    lexemes.push(lexeme);
    tokens.push("/")
    return "/"
  });
  
  lexer.addRule(/\=/, function (lexeme) {
    this.yytext = lexeme;
    lexemes.push(lexeme);
    tokens.push("=")
    return "="
  });

  lexer.addRule(/\/=/, function (lexeme) {
    this.yytext = lexeme;
    lexemes.push(lexeme);
    tokens.push("/=")
    return "/=";
  });

  lexer.addRule(/>/, function (lexeme) {
    this.yytext = lexeme;
    lexemes.push(lexeme);
    tokens.push(">")
    return ">";
  });

  lexer.addRule(/</, function (lexeme) {
    this.yytext = lexeme;
    lexemes.push(lexeme);
    tokens.push("<")
    return "<";
  });
  
  lexer.addRule(/$/, function () {
    return "EOF";
  });
  
  let javascript = undefined;

  /*
  * Code preprocessing:
  *   1 - Remove all repeated blanks
  *   2 - Remove conflictive blanks before
  *       and after parenthesis
  */ 
  lispCode = 
    lispCode
      .replace(/ +/g, ' ')
      .replace(/\( +/g, '(')
      .replace(/ +\)/g, ')');


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