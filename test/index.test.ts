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
    expect(a.rows).toBe(1);
    expect(a.columns).toBe(4);

  });
})
