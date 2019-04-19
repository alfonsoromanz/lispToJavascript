# Basic Lisp to Javascript Transpiler

This repository contains a Javascript transpiler for a simplified version of the LISP language. It was created using [Feathers](https://feathersjs.com) (nodeJS) as the backend framework and other tools such as [Lex](https://www.npmjs.com/package/lex) for the lexical analysis and [Jison](https://www.npmjs.com/package/jison) for the parser.


## Live demo:

Give it a try at
[http://lisptojavascript.com](http://lisptojavascript.com)

### Test programs

#### Factorial

Lisp:
```
(defun factorial (n) 
(if (= n 0) (return-from factorial 1) 
(return-from factorial (* n (factorial (- n 1)))))
)

(print (factorial 10))
```
Transpiles to:
````
function factorial(n) {
if (n === 0) {
return 1
} else {
return n * factorial(n - 1)
};
};
console.log(factorial(10));
````

#### Sum of two numbers (function)
Lisp:

````
(defvar count 10)
(loop (if (> count 1) 
(setq count (- count 1)) 
(progn 
(setq count (- count 1))
(print "last iteration"))) 
(when (> count 0) (return count)))
````

Transpiles to:

````
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

#### Other examples

Check more test programs [here](https://github.com/onfleet/alfonso-backend-homework/tree/master/test_programs)

## Supported features

### Arithmetic operations
To do.
### Variable declarations
To do.
### Variable assignments
To do.
### Function declarations
To do.
### Function calls
To do.


## Limitations and problems encountered
To do.

## API
To do

## Getting Started

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