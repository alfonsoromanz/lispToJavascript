const assert = require('assert');
const app = require('../../src/app');

describe('\'isValidLisp\' service', () => {
  let service;

  before(() => {
    service = app.service('isValidLisp');
  });

  it('registered the service', () => {
    assert.ok(service, 'Registered the service');
  });

  describe('Valid Lisp Code', () => {
    it('should validate simple variable declaration', async () => {
      const result = await service.create({ lispCode: '(defvar x 42)' });
      assert.strictEqual(result.isValidLisp, true);
    });

    it('should validate function declaration', async () => {
      const result = await service.create({ lispCode: '(defun add (a b) (return-from add (+ a b)))' });
      assert.strictEqual(result.isValidLisp, true);
    });

    it('should validate if statement', async () => {
      const result = await service.create({ lispCode: '(if (> a b) (setq max a) (setq max b))' });
      assert.strictEqual(result.isValidLisp, true);
    });

    it('should validate loop', async () => {
      const result = await service.create({ lispCode: '(loop (setq x (+ x 1)) (when (> x 10) (return x)))' });
      assert.strictEqual(result.isValidLisp, true);
    });

    it('should validate complex nested expressions', async () => {
      const lispCode = '(if (and (> x 0) (< x 100)) (progn (setq y (+ x 1)) (print y)) (setq y 0))';
      const result = await service.create({ lispCode });
      assert.strictEqual(result.isValidLisp, true);
    });

    it('should validate quoted lists', async () => {
      const result = await service.create({ lispCode: '\'(1 2 3 (4 5))' });
      assert.strictEqual(result.isValidLisp, true);
    });

    it('should validate multiple statements', async () => {
      const lispCode = `
        (defvar x 5)
        (defun test (n) (return-from test (* n 2)))
        (print (test x))
      `;
      const result = await service.create({ lispCode });
      assert.strictEqual(result.isValidLisp, true);
    });
  });

  describe('Invalid Lisp Code', () => {
    it('should reject unmatched opening parenthesis', async () => {
      const result = await service.create({ lispCode: '(defvar x 42' });
      assert.strictEqual(result.isValidLisp, false);
    });

    it('should reject unmatched closing parenthesis', async () => {
      const result = await service.create({ lispCode: 'defvar x 42)' });
      assert.strictEqual(result.isValidLisp, false);
    });

    it('should reject invalid tokens', async () => {
      const result = await service.create({ lispCode: '(defvar x @#$)' });
      assert.strictEqual(result.isValidLisp, false);
    });

    it('should reject incomplete expressions', async () => {
      const result = await service.create({ lispCode: '(+)' });
      assert.strictEqual(result.isValidLisp, false);
    });

    it('should reject malformed function definition', async () => {
      const result = await service.create({ lispCode: '(defun)' });
      assert.strictEqual(result.isValidLisp, false);
    });

    it('should reject empty input', async () => {
      const result = await service.create({ lispCode: '' });
      assert.strictEqual(result.isValidLisp, false);
    });

    it('should reject mismatched nested parentheses', async () => {
      const result = await service.create({ lispCode: '((defvar x 1)' });
      assert.strictEqual(result.isValidLisp, false);
    });
  });

  describe('Edge Cases', () => {
    it('should handle whitespace-only input', async () => {
      const result = await service.create({ lispCode: '   \n\t  ' });
      assert.strictEqual(result.isValidLisp, false);
    });

    it('should handle single character input', async () => {
      const result = await service.create({ lispCode: '(' });
      assert.strictEqual(result.isValidLisp, false);
    });

    it('should validate with extra whitespace', async () => {
      const result = await service.create({ lispCode: '(  defvar   x    42  )' });
      assert.strictEqual(result.isValidLisp, true);
    });
  });
});
