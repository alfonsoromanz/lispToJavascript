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
    | return_sentence
        {$$=$1}
    | loop_sentence
    | BLANK
        {$$=''}
    ;

variable_declaration
    : '(' DEFVAR BLANK IDENTIFIER BLANK s_expression ')'
        {$$ = `var ${$4} = ${$6};`}
    | '(' LET BLANK IDENTIFIER BLANK s_expression ')'
        {$$ = `let ${$4} = ${$6};`}
    ;

variable_assignment
    : '(' SETQ BLANK IDENTIFIER BLANK s_expression ')'
        {$$= `${$4} = ${$6};`}
    ;

s_expression
    : atom
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

return_sentence
    : '(' RETURNFROM BLANK IDENTIFIER BLANK s_expression ')'
        {$$=`return ${$6}`}
    ;

loop_sentence
    : '(' LOOP list_of_sentences '(' WHEN BLANK condition BLANK  '(' RETURN BLANK IDENTIFIER ')' ')' ')'
        {$$=`while (${$7}) {\n${$3}\n}`}
    | '(' LOOP list_of_sentences ')'
        {$$=`while (true) {\n${$3}\n}`}
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
            * Adding a return to the last statement of a function - this will be removed.
            * in LISP functions, the last expression is returned. This works fine now 
            * except for the cases where the last sentence is a conditional. This transpiler  
            * is adding a return to that sentence too and its wrong.
            * 
            * For this version of LISP, a return statement will be required for returning
            * the value of a function. Programmer will have to explicitly return values using
            * 'return-from myfunc value'
            */

            //Commenting below because now a return statement is mandatory

            //let sentences = String($8).split(';');
            //sentences = sentences.map(s=>s.trim()).filter(s=>s!=='');
            //add return to last expression
            //sentences[sentences.length - 1] = `return ${sentences[sentences.length - 1]}`;
            //let buffer = "";
            //sentences.map(s=>{
                //buffer += `${s};`;
            //})
           
            //$$=`function ${$2}(${$5}) {\n${buffer}}`

            $$=`function ${$2}(${$5}) {\n${$8}}`


            /* More Comments about the commented code above:
            *
            * in LISP functions, the last expression is returned. Because of that I was adding 
            * a return statement to the last sentence of the lisp function. The thing is, 
            * the IF statement is also considered a sentence, so if the last sentence of a 
            * function was a conditional, the parser was adding a return to the IF sentence and
            * that doesn't make sense. We can't know the context of where the conditional is being
            * used, so I can't decide where should I add a return statement. 
            * 
            * For that reason, I stopped adding a return statement to the last sentence of a lisp
            * function. Instead, the programmer will be required to add a return-from statement 
            * explicitly to return a value inside a function.
            *
            */
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
    : '(' OR BLANK condition BLANK condition ')'
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
    | '(' AND BLANK condition BLANK condition ')'
        {$$ = `${$3} && ${$5}`}
    | '(' NOT BLANK condition ')'
        {$$ = `!${$3}`}
    | condition
    ;

condition 
    : '(' '=' BLANK s_expression BLANK s_expression ')'
        {$$ = `${$4} === ${$6}`}
    | '(' '>' BLANK s_expression BLANK s_expression ')'
        {$$ = `${$4} > ${$6}`}
    | '(' '<' BLANK s_expression BLANK s_expression ')'
        {$$ = `${$4} < ${$6}`}
    | '(' '/=' BLANK s_expression BLANK s_expression ')'
        {$$ = `${$4} !== ${$6}`}
    | s_expression
    ;

if_sentence
    : '(' IF BLANK condition BLANK sentence BLANK sentence ')'
        {
            $$=`if (${$4}) {\n${$6}\n} else {\n${$8}\n}`
        }
    | '(' IF BLANK condition BLANK '(' PROGN BLANK list_of_sentences ')' BLANK sentence ')'
        {
            $$=`if (${$4}) {\n${$9}\n} else {\n${$12}\n}`
        }
    | '(' IF BLANK condition BLANK '(' PROGN BLANK list_of_sentences ')' BLANK '(' PROGN BLANK list_of_sentences ')' ')'
        {
            $$=`if (${$4}) {\n${$9}\n} else {\n${$15}\n}`
        }
     | '(' IF BLANK condition BLANK sentence BLANK '(' PROGN BLANK list_of_sentences ')' ')'
        {
            $$=`if (${$4}) {\n${$6}\n} else {\n${$11}\n}`
        }
    ;
atom
    : IDENTIFIER
    | CONST_INT 
    ;