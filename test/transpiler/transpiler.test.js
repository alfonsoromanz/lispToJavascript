const assert = require('assert');
const transpiler = require('../../src/transpiler/index.js');

describe('Lisp to JavaScript Transpiler', () => {
  let mockHook;

  beforeEach(() => {
    mockHook = {
      data: { lispCode: '' },
      result: {}
    };
  });

  describe('Variable Declarations', () => {
    it('should transpile defvar correctly', async () => {
      mockHook.data.lispCode = '(defvar a 42)';
      await transpiler(mockHook);
      
      assert.strictEqual(mockHook.result.success, true);
      assert.strictEqual(mockHook.result.javascript.trim(), 'var a = 42;');
    });

    it('should transpile let correctly', async () => {
      mockHook.data.lispCode = '(let x 100)';
      await transpiler(mockHook);
      
      assert.strictEqual(mockHook.result.success, true);
      assert.strictEqual(mockHook.result.javascript.trim(), 'let x = 100;');
    });

    it('should handle variable declaration with arithmetic', async () => {
      mockHook.data.lispCode = '(defvar result (+ 10 5))';
      await transpiler(mockHook);
      
      assert.strictEqual(mockHook.result.success, true);
      assert.strictEqual(mockHook.result.javascript.trim(), 'var result = 10 + 5;');
    });
  });

  describe('Variable Assignments', () => {
    it('should transpile setq correctly', async () => {
      mockHook.data.lispCode = '(setq x 25)';
      await transpiler(mockHook);
      
      assert.strictEqual(mockHook.result.success, true);
      assert.strictEqual(mockHook.result.javascript.trim(), 'x = 25;');
    });

    it('should handle assignment with expression', async () => {
      mockHook.data.lispCode = '(setq y (* 3 4))';
      await transpiler(mockHook);
      
      assert.strictEqual(mockHook.result.success, true);
      assert.strictEqual(mockHook.result.javascript.trim(), 'y = 3 * 4;');
    });
  });

  describe('Arithmetic Operations', () => {
    it('should transpile addition correctly', async () => {
      mockHook.data.lispCode = '(+ 5 3)';
      await transpiler(mockHook);
      
      assert.strictEqual(mockHook.result.success, true);
      assert.strictEqual(mockHook.result.javascript.trim(), '5 + 3;');
    });

    it('should transpile subtraction correctly', async () => {
      mockHook.data.lispCode = '(- 10 4)';
      await transpiler(mockHook);
      
      assert.strictEqual(mockHook.result.success, true);
      assert.strictEqual(mockHook.result.javascript.trim(), '10 - 4;');
    });

    it('should transpile multiplication correctly', async () => {
      mockHook.data.lispCode = '(* 6 7)';
      await transpiler(mockHook);
      
      assert.strictEqual(mockHook.result.success, true);
      assert.strictEqual(mockHook.result.javascript.trim(), '6 * 7;');
    });

    it('should transpile division correctly', async () => {
      mockHook.data.lispCode = '(/ 15 3)';
      await transpiler(mockHook);
      
      assert.strictEqual(mockHook.result.success, true);
      assert.strictEqual(mockHook.result.javascript.trim(), '15 / 3;');
    });

    it('should handle nested arithmetic', async () => {
      mockHook.data.lispCode = '(+ 1 (* 2 3))';
      await transpiler(mockHook);
      
      assert.strictEqual(mockHook.result.success, true);
      assert.strictEqual(mockHook.result.javascript.trim(), '1 + 2 * 3;');
    });
  });

  describe('Conditions', () => {
    it('should transpile equality correctly', async () => {
      mockHook.data.lispCode = '(= a b)';
      await transpiler(mockHook);
      
      assert.strictEqual(mockHook.result.success, true);
      assert.strictEqual(mockHook.result.javascript.trim(), 'a === b;');
    });

    it('should transpile inequality correctly', async () => {
      mockHook.data.lispCode = '(/= x y)';
      await transpiler(mockHook);
      
      assert.strictEqual(mockHook.result.success, true);
      assert.strictEqual(mockHook.result.javascript.trim(), 'x !== y;');
    });

    it('should transpile greater than correctly', async () => {
      mockHook.data.lispCode = '(> a 5)';
      await transpiler(mockHook);
      
      assert.strictEqual(mockHook.result.success, true);
      assert.strictEqual(mockHook.result.javascript.trim(), 'a > 5;');
    });

    it('should transpile less than correctly', async () => {
      mockHook.data.lispCode = '(< b 10)';
      await transpiler(mockHook);
      
      assert.strictEqual(mockHook.result.success, true);
      assert.strictEqual(mockHook.result.javascript.trim(), 'b < 10;');
    });
  });

  describe('Logic Operations', () => {
    it('should transpile OR correctly', async () => {
      mockHook.data.lispCode = '(or (> a 5) (< b 10))';
      await transpiler(mockHook);
      
      assert.strictEqual(mockHook.result.success, true);
      assert.strictEqual(mockHook.result.javascript.trim(), '(a > 5 || b < 10);');
    });

    it('should transpile AND correctly', async () => {
      mockHook.data.lispCode = '(and (> x 0) (< x 100))';
      await transpiler(mockHook);
      
      assert.strictEqual(mockHook.result.success, true);
      assert.strictEqual(mockHook.result.javascript.trim(), '(x > 0 && x < 100);');
    });

    it('should transpile NOT correctly', async () => {
      mockHook.data.lispCode = '(not (= a b))';
      await transpiler(mockHook);
      
      assert.strictEqual(mockHook.result.success, true);
      assert.strictEqual(mockHook.result.javascript.trim(), '!a === b;');
    });
  });

  describe('If Statements', () => {
    it('should transpile simple if-else correctly', async () => {
      mockHook.data.lispCode = '(if (> a b) (setq max a) (setq max b))';
      await transpiler(mockHook);
      
      assert.strictEqual(mockHook.result.success, true);
      const expected = 'if (a > b) {\nmax = a;\n} else {\nmax = b;\n};';
      assert.strictEqual(mockHook.result.javascript.trim(), expected);
    });

    it('should handle progn in if statements', async () => {
      mockHook.data.lispCode = '(if (= a 0) (progn (setq a 1) (print a)) (setq a 2))';
      await transpiler(mockHook);
      
      assert.strictEqual(mockHook.result.success, true);
      assert(mockHook.result.javascript.includes('if (a === 0)'));
      assert(mockHook.result.javascript.includes('a = 1'));
      assert(mockHook.result.javascript.includes('console.log(a)'));
    });
  });

  describe('Functions', () => {
    it('should transpile function declaration correctly', async () => {
      mockHook.data.lispCode = '(defun add (x y) (return-from add (+ x y)))';
      await transpiler(mockHook);
      
      assert.strictEqual(mockHook.result.success, true);
      const expected = 'function add(x, y) {\nreturn x + y;\n};';
      assert.strictEqual(mockHook.result.javascript.trim(), expected);
    });

    it('should handle function calls', async () => {
      mockHook.data.lispCode = '(defun double (n) (return-from double (* n 2))) (double 5)';
      await transpiler(mockHook);
      
      assert.strictEqual(mockHook.result.success, true);
      assert(mockHook.result.javascript.includes('function double(n)'));
      assert(mockHook.result.javascript.includes('double(5)'));
    });

    it('should handle recursive functions', async () => {
      mockHook.data.lispCode = '(defun factorial (n) (if (= n 0) (return-from factorial 1) (return-from factorial (* n (factorial (- n 1))))))';
      await transpiler(mockHook);
      
      assert.strictEqual(mockHook.result.success, true);
      assert(mockHook.result.javascript.includes('function factorial(n)'));
      assert(mockHook.result.javascript.includes('factorial(n - 1)'));
    });
  });

  describe('Loops', () => {
    it('should transpile infinite loop correctly', async () => {
      mockHook.data.lispCode = '(loop (setq x (+ x 1)))';
      await transpiler(mockHook);
      
      assert.strictEqual(mockHook.result.success, true);
      assert(mockHook.result.javascript.includes('while (true)'));
      assert(mockHook.result.javascript.includes('x = x + 1'));
    });

    it('should transpile loop with condition correctly', async () => {
      mockHook.data.lispCode = '(loop (setq x (+ x 1)) (when (> x 10) (return x)))';
      await transpiler(mockHook);
      
      assert.strictEqual(mockHook.result.success, true);
      assert(mockHook.result.javascript.includes('while (true)'));
      assert(mockHook.result.javascript.includes('if (x > 10) break'));
    });
  });

  describe('Print Statements', () => {
    it('should transpile print with variable correctly', async () => {
      mockHook.data.lispCode = '(print x)';
      await transpiler(mockHook);
      
      assert.strictEqual(mockHook.result.success, true);
      assert.strictEqual(mockHook.result.javascript.trim(), 'console.log(x);');
    });

    it('should transpile print with string correctly', async () => {
      mockHook.data.lispCode = '(print "Hello World")';
      await transpiler(mockHook);
      
      assert.strictEqual(mockHook.result.success, true);
      assert.strictEqual(mockHook.result.javascript.trim(), 'console.log("Hello World");');
    });
  });

  describe('Lists', () => {
    it('should transpile quoted list correctly', async () => {
      mockHook.data.lispCode = '\'(1 2 3)';
      await transpiler(mockHook);
      
      assert.strictEqual(mockHook.result.success, true);
      assert.strictEqual(mockHook.result.javascript.trim(), '[1, 2, 3];');
    });

    it('should distinguish between lists and function calls', async () => {
      mockHook.data.lispCode = '(defun test (a) (return-from test a)) (test 1) (unknown 2)';
      await transpiler(mockHook);
      
      assert.strictEqual(mockHook.result.success, true);
      assert(mockHook.result.javascript.includes('test(1)'));
      assert(mockHook.result.javascript.includes('[unknown, 2]'));
    });
  });

  describe('Complex Programs', () => {
    it('should handle multiple statements', async () => {
      const lispCode = `
        (defvar x 5)
        (defvar y 10)
        (if (> x y) (print x) (print y))
      `;
      mockHook.data.lispCode = lispCode;
      await transpiler(mockHook);
      
      assert.strictEqual(mockHook.result.success, true);
      assert(mockHook.result.javascript.includes('var x = 5'));
      assert(mockHook.result.javascript.includes('var y = 10'));
      assert(mockHook.result.javascript.includes('if (x > y)'));
    });

    it('should handle parser state reset between calls', async () => {
      // First call with function
      mockHook.data.lispCode = '(defun test (x) (return-from test x))';
      await transpiler(mockHook);
      assert.strictEqual(mockHook.result.success, true);
      
      // Second call should not remember first function
      const secondHook = {
        data: { lispCode: '(test 5)' },
        result: {}
      };
      await transpiler(secondHook);
      assert.strictEqual(secondHook.result.success, true);
      // Should be treated as list, not function call
      assert(secondHook.result.javascript.includes('[test, 5]'));
    });
  });
});