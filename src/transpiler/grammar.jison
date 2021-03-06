%start lisp_program

%{
var functions = [];
%}

%% /* language grammar */

lisp_program 
    : list_of_sentences EOF
        {   //remove the excess of semicolons caused by blanks
            let final_sentences = $1;
            final_sentences = final_sentences.replace(/;+/g, ';');
            final_sentences = final_sentences.replace(/\n;/g, '');
            final_sentences = final_sentences.replace(/\n\n/g, '\n');
            return final_sentences;    
       }
    ;

list_of_sentences
    : list_of_sentences sentence
        {   
            $$= `${$1};\n${$2}`
        } 
    | sentence
        {   
            if ($1!=='') {
                $$=`${$1};\n`    
            }
           
        }
    ;

sentence
    : variable_declaration
    | variable_assignment
    | function_declaration
    | if_sentence
    | s_expression
    | print_sentence
    | return_sentence 
    | loop_sentence
    ;

variable_declaration
    : '(' DEFVAR identifier s_expression ')'
        {$$ = `var ${$3} = ${$4}`}
    | '(' LET identifier s_expression ')'
        {$$ = `let ${$3} = ${$4}`}
    ;

variable_assignment
    : '(' SETQ identifier s_expression ')'
        {$$= `${$3} = ${$4}`}
    ;

s_expression
    : atom
    | atom_list
    | condition
    | logic_operation
    | arithmetic_operation
    ;

return_sentence
    : '(' RETURNFROM identifier s_expression ')'
        {$$=`return ${$4}`}
    ;

loop_sentence
    : '(' LOOP list_of_sentences '(' WHEN condition  '(' RETURN s_expression ')' ')' ')'
        {$$=`while (${$6}) {\n${$3}\n}`}
    | '(' LOOP list_of_sentences ')'
        {$$=`while (true) {\n${$3}\n}`}
    ;
print_sentence
    : '(' PRINT s_expression ')'
        {$$=`console.log(${$3})`}}
    | '(' PRINT string ')'
        {$$=`console.log(${$3})`}}
    ;

function_declaration
    : '(' function_name '(' list ')' list_of_sentences ')'
        {   
            $$=`function ${$2}(${$4}) {\n${$6}}`
        }
    ;

function_name
    : DEFUN identifier
        {
            functions.push($2);
            $$=$2;
        }
    ;
atom_list
    : '(' list ')'
        {   
            /* 
            * Checking if the first symbol matches
            * a previously declared function. If it 
            * does then convert the list into a function
            * call.
            */
            
            let elements = String($2).split(',');
            let first = elements[0].trim();
            if (functions.indexOf(first)!==-1) {
                let bffer = "";
                for (let i=1; i<elements.length; i++) {
                    const el = elements[i];
                    if (i===elements.length-1)
                        bffer += el.trim();
                    else
                        bffer += `${el.trim()}, `;
                }
                $$ = `${first}(${bffer})`
            } else {
                $$ = `[${$2}]`
            }      
        }
    | "'" '(' list ')' 
        {$$ = `[${$3}]`}
    ;

list
    : list s_expression
        {$$=`${$1}, ${$2}`}
    | s_expression
        {$$=$1}
    ;

arithmetic_operation
    : '(' '+' s_expression s_expression ')'
        {$$ = `${$3} + ${$4}`}
    | '(' '-' s_expression s_expression ')'
        {$$ = `${$3} - ${$4}`}
    | '(' '*' s_expression s_expression ')'
        {$$ = `${$3} * ${$4}`}
    |  '(' '/' s_expression s_expression ')'
        {$$ = `${$3} / ${$4}`}
    ;

logic_operation
    : '(' OR condition condition ')'
        {$$ = `(${$3} || ${$4})`}
    | '(' AND condition condition ')'
        {$$ = `(${$3} && ${$4})`}
    | '(' NOT condition ')'
        {$$ = `!${$3}`}
    | condition
    ;

condition 
    : '(' '=' s_expression s_expression ')'
        {$$ = `${$3} === ${$4}`}
    | '(' '>' s_expression s_expression ')'
        {$$ = `${$3} > ${$4}`}
    | '(' '<' s_expression s_expression ')'
        {$$ = `${$3} < ${$4}`}
    | '(' '/=' s_expression s_expression ')'
        {$$ = `${$3} !== ${$4}`}
    | s_expression
    ;

if_sentence
    : '(' IF condition sentence sentence ')'
        {
            $$=`if (${$3}) {\n${$4}\n} else {\n${$5}\n}`
        }
    | '(' IF condition '(' PROGN list_of_sentences ')' sentence ')'
        {
            $$=`if (${$3}) {\n${$6}\n} else {\n${$8}\n}`
        }
    | '(' IF condition '(' PROGN list_of_sentences ')' '(' PROGN list_of_sentences ')' ')'
        {
            $$=`if (${$3}) {\n${$6}\n} else {\n${$10}\n}`
        }
     | '(' IF condition sentence '(' PROGN list_of_sentences ')' ')'
        {
            $$=`if (${$3}) {\n${$4}\n} else {\n${$7}\n}`
        }
    ;

atom
    : identifier
    | const_int 
    ;

identifier
    : IDENTIFIER
    | BLANK IDENTIFIER
        {$$=$2}
    ;

const_int
    : CONST_INT 
    | BLANK CONST_INT
        {$$=$2}
    ;

string 
    : STRING 
    | BLANK STRING
        {$$=$2}
    ;