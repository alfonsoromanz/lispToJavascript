const assert = require('assert');
const transpiler = require('../../src/transpiler/index.js');

describe('Edge Cases and Error Scenarios', () => {
  let mockHook;

  beforeEach(() => {
    mockHook = {
      data: { lispCode: '' },
      result: {}
    };
  });

  describe('Parser State Management', () => {
    it('should reset function state between transpilations', async () => {
      // First transpilation with function
      mockHook.data.lispCode = '(defun testFunc (x) (return-from testFunc x))';
      await transpiler(mockHook);
      assert.strictEqual(mockHook.result.success, true);
      
      // Second transpilation should not remember the function
      const secondHook = {
        data: { lispCode: '(testFunc 42)' },
        result: {}
      };
      await transpiler(secondHook);
      assert.strictEqual(secondHook.result.success, true);
      // Should be treated as a list, not function call
      assert(secondHook.result.javascript.includes('[testFunc, 42]'));
    });

    it('should handle multiple function definitions in single transpilation', async () => {
      mockHook.data.lispCode = `
        (defun add (a b) (return-from add (+ a b)))
        (defun multiply (x y) (return-from multiply (* x y)))
        (add 2 3)
        (multiply 4 5)
      `;
      await transpiler(mockHook);
      
      assert.strictEqual(mockHook.result.success, true);
      assert(mockHook.result.javascript.includes('function add(a, b)'));
      assert(mockHook.result.javascript.includes('function multiply(x, y)'));
      assert(mockHook.result.javascript.includes('add(2, 3)'));
      assert(mockHook.result.javascript.includes('multiply(4, 5)'));
    });
  });

  describe('Malformed Input', () => {
    it('should handle empty string gracefully', async () => {
      mockHook.data.lispCode = '';
      await transpiler(mockHook);
      
      assert.strictEqual(mockHook.result.success, false);
      assert(mockHook.result.errors.length > 0);
    });

    it('should handle whitespace-only input', async () => {
      mockHook.data.lispCode = '   \n\t  ';
      await transpiler(mockHook);
      
      assert.strictEqual(mockHook.result.success, false);
      assert(mockHook.result.errors.length > 0);
    });

    it('should handle unclosed parentheses', async () => {
      mockHook.data.lispCode = '(defvar x 42';
      await transpiler(mockHook);
      
      assert.strictEqual(mockHook.result.success, false);
      assert(mockHook.result.errors.length > 0);
      assert(mockHook.result.errors[0].includes('Parse error'));
    });

    it('should handle extra closing parentheses', async () => {
      mockHook.data.lispCode = '(defvar x 42))';
      await transpiler(mockHook);
      
      assert.strictEqual(mockHook.result.success, false);
      assert(mockHook.result.errors.length > 0);
    });

    it('should handle invalid characters', async () => {
      mockHook.data.lispCode = '(defvar x @#$)';
      await transpiler(mockHook);
      
      assert.strictEqual(mockHook.result.success, false);
      assert(mockHook.result.errors.length > 0);
      assert(mockHook.result.errors[0].includes('Unexpected character'));
    });

    it('should handle incomplete expressions', async () => {
      mockHook.data.lispCode = '(defvar)';
      await transpiler(mockHook);
      
      assert.strictEqual(mockHook.result.success, false);
      assert(mockHook.result.errors.length > 0);
    });

    it('should handle nested unmatched parentheses', async () => {
      mockHook.data.lispCode = '(if (> x (+ y z) (print x))';
      await transpiler(mockHook);
      
      assert.strictEqual(mockHook.result.success, false);
      assert(mockHook.result.errors.length > 0);
    });
  });

  describe('Lexical Analysis Edge Cases', () => {
    it('should handle standalone numbers', async () => {
      mockHook.data.lispCode = '42';
      await transpiler(mockHook);
      
      // In this simplified transpiler, standalone numbers are accepted
      assert.strictEqual(mockHook.result.success, true);
      assert.strictEqual(mockHook.result.javascript.trim(), '42;');
    });

    it('should handle single parenthesis', async () => {
      mockHook.data.lispCode = '(';
      await transpiler(mockHook);
      
      assert.strictEqual(mockHook.result.success, false);
      assert(mockHook.result.errors.length > 0);
    });

    it('should handle mixed valid and invalid tokens', async () => {
      mockHook.data.lispCode = '(defvar x$ 42)';
      await transpiler(mockHook);
      
      assert.strictEqual(mockHook.result.success, false);
      assert(mockHook.result.errors.length > 0);
    });

    it('should handle very long identifiers', async () => {
      const longIdentifier = 'a'.repeat(1000);
      mockHook.data.lispCode = `(defvar ${longIdentifier} 42)`;
      await transpiler(mockHook);
      
      assert.strictEqual(mockHook.result.success, true);
      assert(mockHook.result.javascript.includes(`var ${longIdentifier} = 42`));
    });
  });

  describe('Grammar Edge Cases', () => {
    it('should handle deeply nested expressions', async () => {
      mockHook.data.lispCode = '(+ 1 (+ 2 (+ 3 (+ 4 5))))';
      await transpiler(mockHook);
      
      assert.strictEqual(mockHook.result.success, true);
      assert(mockHook.result.javascript.includes('1 + 2 + 3 + 4 + 5'));
    });

    it('should handle functions with no parameters', async () => {
      mockHook.data.lispCode = '(defun getName () (return-from getName "test"))';
      await transpiler(mockHook);
      
      assert.strictEqual(mockHook.result.success, true);
      assert(mockHook.result.javascript.includes('function getName()'));
    });

    it('should handle empty lists', async () => {
      mockHook.data.lispCode = '\'()';
      await transpiler(mockHook);
      
      assert.strictEqual(mockHook.result.success, true);
      assert(mockHook.result.javascript.includes('[]'));
    });

    it('should handle multiple return statements in function', async () => {
      mockHook.data.lispCode = `
        (defun conditionalReturn (x) 
          (if (> x 0) 
            (return-from conditionalReturn x) 
            (return-from conditionalReturn 0)))
      `;
      await transpiler(mockHook);
      
      assert.strictEqual(mockHook.result.success, true);
      assert(mockHook.result.javascript.includes('return x'));
      assert(mockHook.result.javascript.includes('return 0'));
    });
  });

  describe('Whitespace and Formatting', () => {
    it('should handle extreme whitespace variations', async () => {
      mockHook.data.lispCode = '(    defvar     x        42    )';
      await transpiler(mockHook);
      
      assert.strictEqual(mockHook.result.success, true);
      assert.strictEqual(mockHook.result.javascript.trim(), 'var x = 42;');
    });

    it('should handle newlines in expressions', async () => {
      mockHook.data.lispCode = `(defvar
        x
        42)`;
      await transpiler(mockHook);
      
      assert.strictEqual(mockHook.result.success, true);
      assert(mockHook.result.javascript.includes('var x = 42'));
    });

    it('should handle tabs and mixed whitespace', async () => {
      mockHook.data.lispCode = '(\tdefvar\t\tx\t\t42\t)';
      await transpiler(mockHook);
      
      assert.strictEqual(mockHook.result.success, true);
      assert(mockHook.result.javascript.includes('var x = 42'));
    });
  });

  describe('String Handling', () => {
    it('should handle empty strings', async () => {
      mockHook.data.lispCode = '(print "")';
      await transpiler(mockHook);
      
      assert.strictEqual(mockHook.result.success, true);
      assert(mockHook.result.javascript.includes('console.log("")'));
    });

    it('should handle strings with spaces', async () => {
      mockHook.data.lispCode = '(print "hello world")';
      await transpiler(mockHook);
      
      assert.strictEqual(mockHook.result.success, true);
      assert(mockHook.result.javascript.includes('console.log("hello world")'));
    });

    it('should handle strings with special characters', async () => {
      mockHook.data.lispCode = '(print "Hello\\nWorld\\t!")';
      await transpiler(mockHook);
      
      assert.strictEqual(mockHook.result.success, true);
      assert(mockHook.result.javascript.includes('console.log("Hello\\nWorld\\t!")'));
    });
  });

  describe('Numeric Edge Cases', () => {
    it('should handle zero', async () => {
      mockHook.data.lispCode = '(defvar x 0)';
      await transpiler(mockHook);
      
      assert.strictEqual(mockHook.result.success, true);
      assert(mockHook.result.javascript.includes('var x = 0'));
    });

    it('should handle large numbers', async () => {
      mockHook.data.lispCode = '(defvar big 999999999)';
      await transpiler(mockHook);
      
      assert.strictEqual(mockHook.result.success, true);
      assert(mockHook.result.javascript.includes('var big = 999999999'));
    });

    it('should handle single digit numbers', async () => {
      mockHook.data.lispCode = '(+ 1 2)';
      await transpiler(mockHook);
      
      assert.strictEqual(mockHook.result.success, true);
      assert(mockHook.result.javascript.includes('1 + 2'));
    });
  });

  describe('Token and Lexeme Tracking', () => {
    it('should track all tokens correctly for complex expression', async () => {
      mockHook.data.lispCode = '(defvar result (+ x (* y 2)))';
      await transpiler(mockHook);
      
      assert.strictEqual(mockHook.result.success, true);
      assert(Array.isArray(mockHook.result.tokens));
      assert(Array.isArray(mockHook.result.lexemes));
      assert(mockHook.result.tokens.length > 0);
      assert(mockHook.result.lexemes.length > 0);
      assert.strictEqual(mockHook.result.tokens.length, mockHook.result.lexemes.length);
    });

    it('should track tokens even for failed parsing', async () => {
      mockHook.data.lispCode = '(defvar x';
      await transpiler(mockHook);
      
      assert.strictEqual(mockHook.result.success, false);
      assert(Array.isArray(mockHook.result.tokens));
      assert(Array.isArray(mockHook.result.lexemes));
      // Should have tokens up to the point of failure
      assert(mockHook.result.tokens.includes('('));
      assert(mockHook.result.tokens.includes('DEFVAR'));
      assert(mockHook.result.tokens.includes('IDENTIFIER'));
    });
  });
});