/* eslint-disable import/no-unresolved */
/* eslint-disable no-undef */
import Matrix from '../src/index';

function expectMatrixTToBeCloseTo(a : any, b : any, precision : number = 10) {
  expect(a[0]).toBeCloseTo(b[0], precision);
  expect(a[1]).toBeCloseTo(b[1], precision);
}

function expectMatrixToBe(a : any, b : any) {
  expect(a[0]).toBe(b[0]);
  expect(a[1]).toBe(b[1]);
}

describe('Vector2.js', () => {
  it('constructor', () => {
    const a = new Matrix([1, 2, 3, 4]);
    expect(a.data).toStrictEqual([1, 2, 3, 4]);
    expect(a.rows).toBe(1);
    expect(a.columns).toBe(4);

    const b = new Matrix([[1, 2], [3, 4]]);
    expect(b.data).toStrictEqual([1, 2, 3, 4]);
    expect(b.rows).toBe(2);
    expect(b.columns).toBe(2);

    const c = new Matrix([[1, 2, 3], [4, 5, 6], [7, 8, 9], [10, 11, 12]]);
    expect(c.data).toStrictEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    expect(c.rows).toBe(4);
    expect(c.columns).toBe(3);

    const d = new Matrix([]);
    expect(d.data).toStrictEqual([]);
    expect(d.rows).toBe(0);
    expect(d.columns).toBe(0);

    const e = new Matrix([1, 2, 3, 4, 5, 6], 3, 2);
    expect(e.data).toStrictEqual([1, 2, 3, 4, 5, 6]);
    expect(e.rows).toBe(3);
    expect(e.columns).toBe(2);
  });

  it('set', () => {
    const a = Matrix.zeros(2);
    a.set(1, 0, 2);

    expect(a.equal(
      new Matrix([[0, 0], [2, 0]]),
    )).toBeTruthy();

    a.set(0, 1, 3);

    expect(a.equal(
      new Matrix([[0, 3], [2, 0]]),
    )).toBeTruthy();
  });

  it('get', () => {
    const a = new Matrix([[1, 2, 3], [4, 5, 6]]);

    expect(a.get(0, 1)).toBe(2);
    expect(a.get(1, 2)).toBe(6);
  });

  it('transpose', () => {
    const a = new Matrix([[1, 2, 3], [4, 5, 6]]).transpose();
    const b = new Matrix([[1, 4], [2, 5], [3, 6]]);
    expect(a.equal(b)).toBeTruthy();

    const c = a.transpose();
    const d = new Matrix([[1, 2, 3], [4, 5, 6]]);
    expect(c.equal(d)).toBeTruthy();

    const e = new Matrix([[1], [2], [3]]).transpose();
    const f = new Matrix([1, 2, 3]);
    expect(e.equal(f)).toBeTruthy();

    const g = new Matrix([1]).transpose();
    expect(g.equal(g)).toBeTruthy();
  });

  it('row', () => {
    const a = Matrix.identity(3);
    expect(a.row(1)).toStrictEqual([0, 1, 0]);

    const b = new Matrix([[1, 2], [3, 4], [5, 6], [7, 8]]);
    expect(b.row(2)).toStrictEqual([5, 6]);
  });

  it('column', () => {
    const a = Matrix.identity(3);
    expect(a.column(2)).toStrictEqual([0, 0, 1]);

    const b = new Matrix([[1, 2], [3, 4], [5, 6], [7, 8]])
    expect(b.column(1)).toStrictEqual([2, 4, 6, 8]);
  });

  it('swapRows', () => {
    const a = Matrix.identity(3).swapRows(0, 1);
    const b = new Matrix([[0, 1, 0], [1, 0, 0], [0, 0, 1]]);
    expect(a.equal(b)).toBeTruthy();

    const c = new Matrix([[1, 2], [3, 4], [5, 6], [7, 8]]).swapRows(1, 2);
    const d = new Matrix([[1, 2], [5, 6], [3, 4], [7, 8]]);
    expect(c.equal(d)).toBeTruthy();
  });

  it('swapColumns', () => {
    const a = Matrix.identity(3).swapColumns(0, 2);
    const b = new Matrix([[0, 0, 1], [0, 1, 0], [1, 0, 0]]);
    expect(a.equal(b)).toBeTruthy();

    const c = new Matrix([[1, 2], [3, 4], [5, 6], [7, 8]]).swapColumns(0, 1);
    const d = new Matrix([[2, 1], [4, 3], [6, 5], [8, 7]]);
    expect(c.equal(d)).toBeTruthy();
  });

  it('equal', () => {
    const a = new Matrix([[1, 2, 3], [4, 5, 6]]);
    const b = new Matrix([[1, 2.00001, 3], [4, 5, 6]]);
    const c = new Matrix([[6, 5, 4], [3, 2, 1]]);
    expect(a.equal(b)).toBeFalsy();
    expect(a.equal(b, 0.0001)).toBeTruthy();
    expect(a.equal(b, 0.000001)).toBeFalsy();
    expect(a.equal(a)).toBeTruthy();
    expect(a.equal(c)).toBeFalsy();
  });

  it('scale', () => {
    const a = Matrix.identity(4).scale(3);
    const b = new Matrix([[3, 0, 0, 0], [0, 3, 0, 0], [0, 0, 3, 0], [0, 0, 0, 3]]);
    expect(a.equal(b)).toBeTruthy();
  });

  it('identity', () => {
    const a = Matrix.identity(2, 3);
    const b = new Matrix([[1, 0, 0], [0, 1, 0]]);
    expect(a.equal(b)).toBeTruthy();

    const c = Matrix.identity(3);
    const d = new Matrix([[1, 0, 0], [0, 1, 0], [0, 0, 1]]);
    expect(c.equal(d)).toBeTruthy();

    const e = Matrix.identity(4, 2);
    const f = new Matrix([[1, 0], [0, 1], [0, 0], [0, 0]]);
    expect(e.equal(f)).toBeTruthy();
  });

  it('diag', () => {
    const a = Matrix.diag(1, 2, 3);
    const b = new Matrix([[1, 0, 0], [0, 2, 0], [0, 0, 3]]);
    expect(a.equal(b)).toBeTruthy();

    const c = Matrix.diag([2, 3, 4, 5])
    const d = new Matrix([[2, 0, 0, 0], [0, 3, 0, 0], [0, 0, 4, 0], [0, 0, 0, 5]]);
    expect(c.equal(d)).toBeTruthy();
  });

  it('zeros', () => {
    const a = Matrix.zeros(2, 3);
    const b = new Matrix([[0, 0, 0], [0, 0, 0]]);
    expect(a.equal(b)).toBeTruthy();

    const c = Matrix.zeros(3);
    const d = new Matrix([[0, 0, 0], [0, 0, 0], [0, 0, 0]]);
    expect(c.equal(d)).toBeTruthy();
  });

  it('ones', () => {
    const a = Matrix.ones(2, 3);
    const b = new Matrix([[1, 1, 1], [1, 1, 1]]);
    expect(a.equal(b)).toBeTruthy();

    const c = Matrix.ones(3);
    const d = new Matrix([[1, 1, 1], [1, 1, 1], [1, 1, 1]]);
    expect(c.equal(d)).toBeTruthy();
  });

  it('toString', () => {
    const a = new Matrix([[1, 2, 3], [4, 5, 6]]);
    expect(a.toString()).toBe('1 2 3\n4 5 6');

    const b = Matrix.identity(3);
    expect(b.toString()).toBe('1 0 0\n0 1 0\n0 0 1');
  });
})
