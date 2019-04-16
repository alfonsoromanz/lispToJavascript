%start lisp_program

%% /* language grammar */

lisp_program 
    : list_of_sentences EOF
        {return $1;}
    ;

list_of_sentences
    : list_of_sentences sentence
        {$$=`${$1} ${$2}`} 
    | sentence
        {$$=$1;}
    ;

sentence
    : variable_declaration
        {$$=$1}
    | variable_assignment
        {$$=$1}
    | BLANK
        {$$=''}
    ;

variable_declaration
    : PAREN_OPEN DEFVAR BLANK IDENTIFIER BLANK s_expression PAREN_CLOSE
        {$$ = `let ${$4} = ${$6};`}
    ;

variable_assignment
    : PAREN_OPEN SETQ BLANK IDENTIFIER BLANK s_expression PAREN_CLOSE
        {$$= `${$4} = ${$6};`}
    ;

s_expression
    : atom
    | PAREN_OPEN s_expression DOT s_expression PAREN_CLOSE
    | PAREN_OPEN list PAREN_CLOSE
        {$$ = `[${$2}]`}
    | PAREN_OPEN arithmetic_operation PAREN_CLOSE
        {$$ = $2}
    ;
list
    : list BLANK s_expression
        {$$=`${$1}, ${$3}`}
    | s_expression
        {$$=$1}
    ;

arithmetic_operation
    : PLUS BLANK s_expression BLANK s_expression
        {$$ = `${$3} + ${$5}`}
    | MINUS BLANK s_expression BLANK s_expression
        {$$ = `${$3} - ${$5}`}
    | MULT BLANK s_expression BLANK s_expression
        {$$ = `${$3} * ${$5}`}
    |  DIV BLANK s_expression BLANK s_expression
        {$$ = `${$3} / ${$5}`}
    ;

atom
    : IDENTIFIER
    | CONST_INT 
    ;