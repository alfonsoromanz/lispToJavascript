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
            return final_sentences;    
        }
    ;

list_of_sentences
    : list_of_sentences sentence
        {   
            $$= `${$1};${$2}`
        } 
    | sentence
        {   
            if ($1!=='') 
                $$=`${$1}`
            else 
                $$='';
        }
    ;

sentence
    : variable_declaration
        {$$=$1}
    | variable_assignment
        {$$=$1}
    | function_declaration
        {$$=$1}
    | if_sentence
        {$$=$1}
    | s_expression
        {$$=$1}
    | print_sentence
        {$$=$1}
    | BLANK
        {$$=''}
    ;

variable_declaration
    : '(' DEFVAR BLANK IDENTIFIER BLANK s_expression ')'
        {$$ = `let ${$4} = ${$6};`}
    ;

variable_assignment
    : '(' SETQ BLANK IDENTIFIER BLANK s_expression ')'
        {$$= `${$4} = ${$6};`}
    ;

s_expression
    : atom
    | '(' s_expression DOT s_expression ')'
    | atom_list
    | condition
    | logic_operation
    | '(' arithmetic_operation ')'
        {$$ = $2}
    ;

s_expression_list
    : s_expression_list BLANK s_expression
        {$$=`${$1} ${$3}`}
    | s_expression
    ;


print_sentence
    : '(' PRINT BLANK s_expression ')'
        {$$=`console.log(${$4})`}}
    | '(' PRINT BLANK STRING ')'
        {$$=`console.log(${$4})`}}
    ;

function_declaration
    : '(' function_name BLANK '(' list ')' BLANK list_of_sentences ')'
        {   
            /*
            * Adding a return to the last statement of a function - this will be removed
            * in LISP functions, the last expression is returned. This works fine now 
            * except for the cases where the last sentence is a conditional. This transpiler  
            * is adding a return to that sentence too and its wrong.
            * 
            * For this version of LISP, a return statement will be required for returning
            * the value of a function. Programmer will have to explicitly return values using
            * 'return-from myfunc value'
            */
            
            let sentences = String($8).split(';');
            sentences = sentences.map(s=>s.trim()).filter(s=>s!=='');
            //add return to last expression
            sentences[sentences.length - 1] = `return ${sentences[sentences.length - 1]}`;
            let buffer = "";
            sentences.map(s=>{
                buffer += `${s};`;
            })
           
            $$=`function ${$2}(${$5}) {\n${buffer}}` 
        }
    ;

function_name
    : DEFUN BLANK IDENTIFIER
        {
            functions.push($3);
            $$=$3;
        }
    ;
atom_list
    : '(' list ')'
        {   
            /* We can't distinguish an atom_list from a function call at
            *  compilation time. In LISP, this is done by the interpreter.
            *  To solve that problem, every time I find an atom_list, I check
            *  if its a function call by checking if the first symbol matches
            *  a previously declared function.
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
    ;

list
    : list BLANK s_expression
        {$$=`${$1}, ${$3}`}
    | s_expression
        {$$=$1}
    ;

arithmetic_operation
    : '+' BLANK s_expression BLANK s_expression
        {$$ = `${$3} + ${$5}`}
    | '-' BLANK s_expression BLANK s_expression
        {$$ = `${$3} - ${$5}`}
    | '*' BLANK s_expression BLANK s_expression
        {$$ = `${$3} * ${$5}`}
    |  '/' BLANK s_expression BLANK s_expression
        {$$ = `${$3} / ${$5}`}
    ;

logic_operation
    : OR BLANK s_expression BLANK s_expression
        {
            /*
            * Currently this format doesn't allow to have conditions
            * with more than 2 expressions (like > and < in LISP)
            * That feature is problematic since we use the non-terminal
            * "list" not only for expressions but also for arrays and 
            * function calls. 
            *
            * One way to solve that is: instead of generating code when
            * a list is being recognized we can save the last expressions
            * into a stack and decide how to use them later when a new rule is
            * found (e.g array, function call, or logic_operations)
            */
            $$ = `${$3} || ${$5}`
        }
    | AND BLANK s_expression BLANK s_expression
        {$$ = `${$3} && ${$5}`}
    | NOT BLANK s_expression
        {$$ = `!${$3}`}
    | s_expression
    ;

condition 
    : '(' '=' BLANK s_expression BLANK s_expression ')'
        {$$ = `${$4} === ${$6}`}
    | '(' '>' BLANK s_expression BLANK s_expression ')'
        {$$ = `${$4} > ${$6}`}
    | '(' '<' BLANK s_expression BLANK s_expression ')'
        {$$ = `${$4} < ${$6}`}
    ;

if_sentence
    : '(' IF BLANK logic_operation BLANK sentence BLANK sentence ')'
        {
            /*
            * The IF in lisp can only accept one statement for the then and else clause.
            * To add several statements, 'PROGN' should be used but it is not supported
            * here.
            * One issue encountered is that sometimes the IF is used within a function to
            * return certain values and I couldn't figure out yet when an 
            * statement inside an if should contain a return statement
            */

            $$=`if (${$4}) {\n${$6}\n} else {\n${$8}\n}`
        }
    ;
atom
    : IDENTIFIER
    | CONST_INT 
    ;