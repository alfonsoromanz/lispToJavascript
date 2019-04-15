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
    ;

variable_declaration
    : PAREN_OPEN LET BLANK IDENTIFIER BLANK expression PAREN_CLOSE
        {$$ = `let ${$4} = ${$6};`}
    ;

expression 
    : CONST_INT
    | IDENTIFIER
    | arithmetic_operation
    ; 

arithmetic_operation
    : expression PLUS expression
        {$$ = `${$1} + ${$3}`}
    | expression MINUS expression
        {$$ = `${$1} - ${$3}`}
    | expression DIV expression
        {$$ = `${$1} - ${$3}`}
    | expression MULT expression
        {$$ = `${$1} * ${$3}`}
    ;