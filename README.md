# Basic Lisp to Javascript Transpiler

This repository contains a Javascript transpiler for a simplified version of the LISP language. It was created using [Feathers](https://feathersjs.com) (nodeJS) as the backend framework and other tools such as [Lex](https://www.npmjs.com/package/lex) for the lexical analysis and [Jison](https://www.npmjs.com/package/jison) for the parser.


## Live demo:

Give it a try at
[http://lisptojavascript.com](http://lisptojavascript.com)

## Test programs

### Factorial

Lisp:
```lisp
(defun factorial (n) 
(if (= n 0) (return-from factorial 1) 
(return-from factorial (* n (factorial (- n 1)))))
)

(print (factorial 10))
```
Transpiles to:
````javascript
function factorial(n) {
if (n === 0) {
return 1
} else {
return n * factorial(n - 1)
};
};
console.log(factorial(10));
````

### Simple iteration
Lisp:

````lisp
(defvar count 10)
(loop (if (> count 1) 
(setq count (- count 1)) 
(progn 
(setq count (- count 1))
(print "last iteration"))) 
(when (> count 0) (return count)))
````

Transpiles to:

````javascript
var count = 10;
while (count > 0) {
  if (count > 1) {
    count = count - 1;
  } else {
    count = count - 1;
    console.log("last iteration")
  };
};
````

### Other examples

Check more test programs [here](https://github.com/onfleet/alfonso-backend-homework/tree/master/test_programs)

# Supported features

## Arithmetic operations

Basic arithmetic is supported: addition, subtraction, multiplication and division.

````lisp
(+ 3 2) //3 + 2 
(- a b) //a - b
(- a (* b 3)) // a - b * 3
(/ (* a 2) (- a (+ 3 5))) // a * 2 / a - 3 + 5;
````
## Variable declarations
Gobal and local variables are supported using `defvar` and `let`
````lisp
(defvar a 2) ; var a = 2;
(defvar b 3) ; var b = 3;
(defvar c (- a (* b 3))) ; var c = a - b * 3;
(let c b) ; let c = b;
````

## Variable assignments
Values can be assigned to variables during declaration (see above) or using `setq`

````lisp
(setq a 2) ; a = 2;
(setq c (- a (* b 3))) ; c = a - b * 3;
(setq x (sum y z)) ; x = sum(y, z) if sum is a declared function
```` 
## Conditions
The following operators are supported: `>`, `<`, `=`, and `/=`

````lisp
(> a b) ; a > b
(< a 1) ; a > 1
(= a (+ 2 2)) ; a === 2+2
(/= 1 2) ; 1 !== 2
````

## If-else statements

Syntax:

`(if <condition> <sentence_then> <sentence_else>)`

Lisp only allows to have one sentence in the `then` branch and one sentence in the `else` branch. If you need to execute several sentences within any of the branches, you can use the special sentence `progn`:

`(progn <list_of_sentences>)`

### Examples

Simple if-else sentence:

````lisp
(if (> a b) (setq b a) (setq a b))
```` 
Is equivalent to:

````javascript
if (a > b) {
  b = a;
} else {
  a = b;
};
```` 

Using `prog-n` we can have multiple sentences in any of the branches:

````lisp
(if (= a b) (progn (setq a 0) (setq b 0)) (progn 
(print a) (print b)))
```` 

````javascript
if (a === b) {
  a = 0;
  b = 0;
} else {
  console.log(a);
  console.log(b)
};
```` 

## Loops
Syntax for loops:

`(loop <list_of_sentences> [(when <condition> return <expression>)])`

### Examples:

````lisp
(loop (setq a (+ a 1)) (when (> a 10) (return a)))
```` 
Is equivalent to: 

````javascript
while (a > 10) {
  a = a + 1;
};
```` 

If the `when` clause is not provided, it will produce an infinite loop:

````lisp
(loop (setq a (+ a 1)))
```` 

Javascript:

````javascript
while (true) {
  a = a + 1;
};
```` 

## Function declarations
Functions are declared using the token `defun`. 

Syntax for function declaration:

```
(defun <function_name> (<params>) <list_of_sentences>)
```
Where:
+ `<function_name>`: should be an identifier (one or more letters)
+ `<params>`: are zero or more expressions separated by blanks
+ `<list_of_sentences>`: one or more sentence (variable declaration, assignment, function declaration, function call, arithmetic operations, etc)

**Important**: a function in LISP returns the value of the last expression evaluated as the return value, but this is not supported in this simplified LISP version. Instead, to return a value from a function it is required to use the `return-from` statement explicitly.

```lisp
return-from myfunction 10
````

### Some Examples:

Sum two numbers:

````lisp
(defun sum (a b) (return-from sum (+ a b)))
```` 

Transpiles to:
````javascript
function sum(a, b) {
  return a + b;
};
````

**Recursive functions are also supported**. The following function:
````lisp
(defun printUntilZero (a) 
(if (> a 0) (progn (print a) (setq a (- a 1)) (printUntilZero a)) (print a))
)

(printUntilZero 10)
````

Transpiles to:

````javascript
function printUntilZero(a) {
  if (a > 0) {
    console.log(a);
    a = a - 1;
    printUntilZero(a)
  } else {
    console.log(a)
  };
};
printUntilZero(10);
````

## Function calls
Syntax for function calls:

`(<function_name>  <params>)`

Where:
+ `<function_name>`: must be an identifier (one or more letters) and should match an already declared function. Otherwhise, the sentence will be recognized as a list.
+ `<params>`: zero or more expressions


### Example:

````lisp
(defun sumThreeNumbers (a b c) 
(return-from sumThreeNumbers (+ a (+ b c)))
)

(sumThreeNumbers 10 5 1)
````

Transpiles to:

```javascript
function sumThreeNumbers(a, b, c) {
  return a + b + c;
};
sumThreeNumbers(10, 5, 1);
````


# Limitations and problems encountered
To do.

# API
To do.

# Getting Started

Getting up and running is as easy as 1, 2, 3.

1. Make sure you have [NodeJS](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed.
2. Clone the repo and install your dependencies

    ```
   git clone https://github.com/alfonsoromanz/lispToJavascript.git;
   cd path/to/lispToJavascript;
   npm install
   ```

3. Start your app

    ```
    npm start