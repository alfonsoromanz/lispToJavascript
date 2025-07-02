const assert = require('assert');
const app = require('../../src/app');

describe('\'convertToJS\' service', () => {
  let service;

  before(() => {
    service = app.service('convertToJS');
  });

  it('registered the service', () => {
    assert.ok(service, 'Registered the service');
  });

  describe('Service Integration Tests', () => {
    it('should convert simple variable declaration', async () => {
      const result = await service.create({ lispCode: '(defvar x 42)' });
      
      assert.strictEqual(result.success, true);
      assert.strictEqual(result.javascript.trim(), 'var x = 42;');
      assert.strictEqual(result.lisp, '(defvar x 42)');
      assert(Array.isArray(result.tokens));
      assert(Array.isArray(result.lexemes));
      assert.strictEqual(result.errors.length, 0);
    });

    it('should convert function with recursion', async () => {
      const lispCode = '(defun factorial (n) (if (= n 0) (return-from factorial 1) (return-from factorial (* n (factorial (- n 1))))))';
      const result = await service.create({ lispCode });
      
      assert.strictEqual(result.success, true);
      assert(result.javascript.includes('function factorial(n)'));
      assert(result.javascript.includes('factorial(n - 1)'));
      assert(result.javascript.includes('return'));
    });

    it('should convert loop with condition', async () => {
      const lispCode = '(loop (setq x (+ x 1)) (when (> x 10) (return x)))';
      const result = await service.create({ lispCode });
      
      assert.strictEqual(result.success, true);
      assert(result.javascript.includes('while (true)'));
      assert(result.javascript.includes('if (x > 10) break'));
    });

    it('should handle multiple statements', async () => {
      const lispCode = `
        (defvar count 5)
        (defun countdown (n) 
          (if (> n 0) 
            (progn 
              (print n) 
              (countdown (- n 1)))
            (print "Done")))
        (countdown count)
      `;
      const result = await service.create({ lispCode });
      
      assert.strictEqual(result.success, true);
      assert(result.javascript.includes('var count = 5'));
      assert(result.javascript.includes('function countdown(n)'));
      assert(result.javascript.includes('countdown(count)'));
    });

    it('should handle arithmetic and logic operations', async () => {
      const lispCode = '(if (and (> x 0) (< x 100)) (setq result (+ x (* y 2))) (setq result 0))';
      const result = await service.create({ lispCode });
      
      assert.strictEqual(result.success, true);
      assert(result.javascript.includes('(x > 0 && x < 100)'));
      assert(result.javascript.includes('result = x + y * 2'));
    });

    it('should distinguish function calls from lists', async () => {
      const lispCode = `
        (defun myFunc (a b) (return-from myFunc (+ a b)))
        (myFunc 1 2)
        (unknownFunc 3 4)
      `;
      const result = await service.create({ lispCode });
      
      assert.strictEqual(result.success, true);
      assert(result.javascript.includes('myFunc(1, 2)'));
      assert(result.javascript.includes('[unknownFunc, 3, 4]'));
    });

    it('should handle quoted lists', async () => {
      const lispCode = '\'(1 2 3 (4 5) 6)';
      const result = await service.create({ lispCode });
      
      assert.strictEqual(result.success, true);
      assert(result.javascript.includes('[1, 2, 3, [4, 5], 6]'));
    });

    it('should return tokens and lexemes', async () => {
      const result = await service.create({ lispCode: '(+ 1 2)' });
      
      assert.strictEqual(result.success, true);
      assert(result.tokens.includes('('));
      assert(result.tokens.includes('+'));
      assert(result.tokens.includes('CONST_INT'));
      assert(result.tokens.includes(')'));
      
      assert(result.lexemes.includes('('));
      assert(result.lexemes.includes('+'));
      assert(result.lexemes.includes('1'));
      assert(result.lexemes.includes('2'));
      assert(result.lexemes.includes(')'));
    });
  });

  describe('Error Handling', () => {
    it('should handle syntax errors gracefully', async () => {
      const result = await service.create({ lispCode: '(defvar x' });
      
      assert.strictEqual(result.success, false);
      assert(result.errors.length > 0);
      assert(result.errors[0].includes('Parse error'));
    });

    it('should handle invalid tokens', async () => {
      const result = await service.create({ lispCode: '(defvar x @#$)' });
      
      assert.strictEqual(result.success, false);
      assert(result.errors.length > 0);
    });

    it('should handle empty input', async () => {
      const result = await service.create({ lispCode: '' });
      
      assert.strictEqual(result.success, false);
      assert(result.errors.length > 0);
    });

    it('should handle unmatched parentheses', async () => {
      const result = await service.create({ lispCode: '((defvar x 1)' });
      
      assert.strictEqual(result.success, false);
      assert(result.errors.length > 0);
    });
  });

  describe('Whitespace Handling', () => {
    it('should handle extra whitespace correctly', async () => {
      const result = await service.create({ lispCode: '(  defvar   x    42  )' });
      
      assert.strictEqual(result.success, true);
      assert.strictEqual(result.javascript.trim(), 'var x = 42;');
    });

    it('should handle newlines in code', async () => {
      const lispCode = `(defvar x 1)
                        (defvar y 2)
                        (+ x y)`;
      const result = await service.create({ lispCode });
      
      assert.strictEqual(result.success, true);
      assert(result.javascript.includes('var x = 1'));
      assert(result.javascript.includes('var y = 2'));
      assert(result.javascript.includes('1 + 2'));
    });
  });
});
