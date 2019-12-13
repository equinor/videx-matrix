
import {
  transpose,
  toString,
} from './functions';

import {
  scale as baseScale,
} from '@equinor/videx-linear-algebra';

/**
 * Matrix class
 * @class
 * @alias Matrix
 */
export default class Matrix {

  /**
   * Data contained by the matrix.
   */
  data: number[] = [];

  /**
   * Amount of rows in matrix.
   */
  rows: number = 0;

  /**
   * Amount of columns in matrix.
   */
  columns: number = 0;

  constructor(arr: number[])

  constructor(arr: number[], rows: number, columns: number)

  constructor(length: number, rows: number, columns: number)

  constructor(arr2D: number[][])

  constructor(a: number | number[] | number[][], rows?: number, columns?: number) {
    // Create empty matrix with pre-assigned length
    if (typeof a === 'number') {
      if (!rows || !columns) throw 'Error: Rows or columns not defined.';
      this.data = new Array(a);
      this.rows = rows;
      this.columns = columns;
      return;
    }

    // If no data, return default
    if (a.length === 0) return;

    const first: number | number[] = a[0];

    // Function for appending a single row of numbers
    const appendRow = (arr: number[] | number[][]) => {
      for (let i = 0; i < arr.length; i++) {
        const num: number | number[] = arr[i];
        if (typeof num !== 'number') throw `Error: Expected numeric, but got ${typeof num}.`
        this.data.push(num);
      }
    }

    if (typeof first === 'number') { // First parameter is 1D array
      if (typeof rows !== 'number' || typeof columns !== 'number') {
        appendRow(a);
        this.rows = 1;
        this.columns = a.length;
      } else { // If rows and columns defined
        if (rows * columns !== a.length) throw 'Row and column length does not equal data length.'
        appendRow(a);
        this.rows = rows;
        this.columns = columns;
      }
      // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    } else if (Array.isArray(first)) { // First parameter is 2D array
      const targetColumns: number = first.length;
      for (let i: number = 0; i < a.length; i++) {
        const arr: number | number[] = a[i];
        if (!Array.isArray(arr)) throw `Error: Expected array, but got ${typeof arr}.`
        if (arr.length !== targetColumns) throw `Error: Different length of given rows.`
        appendRow(arr);
      }
      this.rows = a.length;
      this.columns = targetColumns;
      // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    } else { // failure
      throw `Error: Expected first element to be number or array, but got ${typeof first}.`
    }
  }

  /**
   * Set value in matrix at given position
   * @param row Target row
   * @param column Target column
   * @param value Target value
   */
  set(row: number, column: number, value: number): void {
    this.data[column + row * this.columns] = value;
  }

  /**
   * Get value in matrix at given position
   * @param row Target row
   * @param column Target column
   * @returns Value at position
   */
  get(row: number, column: number): number {
    return this.data[column + row * this.columns];
  }

  /**
   * Compare two matrices.
   * @param matrix Matrix to compare with
   * @param epsilon Minimum allowed difference in components
   * @returns Returns true if matrices are equal
   */
  equal(matrix: Matrix, epsilon: number = 0): boolean {
    if (this.rows !== matrix.rows || this.columns !== matrix.columns) return false;
    if (matrix.data.length != this.data.length) return false; // If data error
    for (let i: number = 0; i < this.data.length; i++) {
      const thisData = this.data[i];
      const matrixData = matrix.data[i];
      if (thisData === undefined || matrixData === undefined) return false;
      if (Math.abs(matrixData - thisData) > epsilon) return false;
    }
    return true;
  }

  /**
   * Scale matrix by given factor.
   * @param factor Scaling factor
   * @returns Scaled matrix
   */
  scale(factor: number): Matrix {
    return new Matrix(
      baseScale(this.data, factor, new Array(this.data.length)),
      this.rows,
      this.columns,
    );
  }

  transpose(): Matrix {
    return transpose(this, new Matrix(this.data.length, this.rows, this.columns));
  }

  /**
   * Get row of matrix at given index.
   * @param index Index of row
   * @returns Row at index
   */
  row(index: number): number[] {
    if (index < 0 || index >= this.rows) throw 'Row does not exist.'
    const output: number[] = [];
    for (let c = 0; c < this.columns; c++) {
      output.push(this.get(index, c));
    }
    return output;
  }

  /**
   * Get column of matrix at given index.
   * @param index Index of column
   * @returns Column at index
   */
  column(index: number): number[] {
    if (index < 0 || index >= this.columns) throw 'Row does not exist.'
    const output: number[] = [];
    for (let r = 0; r < this.rows; r++) {
      output.push(this.get(r, index));
    }
    return output;
  }

  /**
   * Create a clone of a matrix.
   */
  clone(): Matrix {
    return new Matrix(this.data, this.rows, this.columns);
  }

  /**
   * Get an identity matrix of given size.
   * @param size Size of rows and columns
   * @return Identity matrix
   */
  static identity(size: number): Matrix

  /**
   * Get an identity matrix of given rows and columns.
   * @param rows Amount of rows
   * @param columns Amount of columns
   * @return Identity matrix
   */
  static identity(rows: number, columns: number): Matrix

  static identity(a: number, b: number = a): Matrix {
    const entries: number = a * b;
    const diag: number = Math.min(a, b); // Size of diagonal
    const stride: number = b + 1; // Distance between 1s
    const data: number[] = new Array(entries);
    for (let i: number = 0; i < entries; i++) data[i] = 0;
    for (let n: number = 0; n < diag; n++) data[n * stride] = 1;
    return new Matrix(data, a, b);
  }

  static diag(arr: number[]): Matrix;

  static diag(...val: number[]): Matrix;

  static diag(a: number | number[], ...arr: number[]): Matrix {
    const size: number = (typeof a === 'number') ? arr.length + 1 : a.length;
    const entries: number = size * size;
    const stride: number = size + 1; // Distance between 1s
    const data: number[] = new Array(entries);

    if (typeof a === 'number') {
      data[0] = a;
      for (let i: number = 1; i < entries; i++) data[i] = 0;
      for (let n: number = 1; n < size; n++) data[n * stride] = arr[n - 1];
      return new Matrix(data, size, size);
    } else {
      for (let i: number = 0; i < entries; i++) data[i] = 0;
      for (let n: number = 0; n < size; n++) data[n * stride] = a[n];
      return new Matrix(data, size, size);
    }
  }

  /**
   * Get a matrix with only zeros.
   * @param size Size of rows and columns
   * @return Matrix with only zero components
   */
  static zeros(size: number): Matrix

  /**
   * Get a matrix with only zeros.
   * @param rows Amount of rows
   * @param columns Amount of columns
   * @return Matrix with only zero components
   */
  static zeros(rows: number, columns: number): Matrix

  static zeros(a: number, b: number = a): Matrix {
    const entries: number = a * b;
    const data: number[] = new Array(entries);
    for (let i: number = 0; i < entries; i++) data[i] = 0;
    return new Matrix(data, a, b);
  }

  /**
   * Get a matrix with only ones.
   * @param size Size of rows and columns
   * @return Matrix with only one components
   */
  static ones(size: number): Matrix

  /**
   * Get a matrix with only ones.
   * @param rows Amount of rows
   * @param columns Amount of columns
   * @return Matrix with only one components
   */
  static ones(rows: number, columns: number): Matrix

  static ones(a: number, b: number = a): Matrix {
    const entries: number = a * b;
    const data: number[] = new Array(entries);
    for (let i: number = 0; i < entries; i++) data[i] = 1;
    return new Matrix(data, a, b);
  }

  /**
   * Retuns a string representation of the matrix object.
   * @Returns Formatted matrix string
   */
  toString(): string {
    return toString(this);
  }
}
