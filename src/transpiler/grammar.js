module.exports = {
  "bnf" : {
    "program" : ["list_of_sentences EOF"],
    "list_of_sentences": ["list_of_sentences sentence", "sentence"],
    "sentence": [["variable_declaration", "$$=$1;"]],
    "variable_declaration" : [["PARENTHESIS_OPEN LET BLANK IDENTIFIER BLANK expression PARENTHESIS_CLOSE", "return `let ${$4} = ${$6}`"]],
    "expression" : ["CONST_INT", "IDENTIFIER", "arithmetic_operation"],
    "arithmetic_operation" : [["expression PLUS expression", "$$ = `${$1} + ${$3}`"]]
    //"sentences" : ["sentences variable_declaration", "variable_declaration"]  
  }
}