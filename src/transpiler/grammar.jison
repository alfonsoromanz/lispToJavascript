%start lisp_program

%{
var functions = [];
%}

%% /* language grammar */

lisp_program 
    : list_of_sentences EOF
        {   //remove the excess of semicolons caused by blanks
            let final_sentences = $1;
            final_sentences = final_sentences.replace(/;+/g, '; ');
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
    | s_expression
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
    | atom_list
    | PAREN_OPEN arithmetic_operation PAREN_CLOSE
        {$$ = $2}
    ;

s_expression_list
    : s_expression_list BLANK s_expression
        {$$=`${$1} ${$3}`}
    | s_expression
    ;


function_declaration
    : PAREN_OPEN DEFUN BLANK IDENTIFIER BLANK PAREN_OPEN list PAREN_CLOSE BLANK list_of_sentences PAREN_CLOSE
        {   
            let sentences = String($10).split(';');
            sentences = sentences.map(s=>s.trim()).filter(s=>s!=='');
            //add return to last expression
            sentences[sentences.length - 1] = `return ${sentences[sentences.length - 1]}`;
            let buffer = "";
            sentences.map(s=>{
                buffer += `${s};`;
            })
            functions.push($4);
            $$=`function ${$4}(${$7}) { ${buffer} }` 
        }
    ;


atom_list
    : PAREN_OPEN list PAREN_CLOSE
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