
import {
  transpose,
  modifyRow,
  modifyRow2,
  swapRows,
  swapColumns,
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

  /**
   * Does the matrix mutate?
   */
  isMutating: boolean = false;

  /**
   * Constructs a matrix with given values along a single row.
   * @param arr Collection of values
   */
  constructor(arr: number[])

  /**
   * Constructs a matrix with given values, rows and columns.
   * @param arr Collection of values
   * @param rows Amount of rows in matrix
   * @param columns Amount of columns in matrix
   */
  constructor(arr: number[], rows: number, columns: number)

  /**
   * Constructs a matrix with specified dimensions, but no values.
   * @param rows Amount of rows in matrix
   * @param columns Amount of columns in matrix
   */
  constructor(rows: number, columns: number)

  /**
   * Constructs a matrix with given values. Each sub-array is assigned a single row.
   * @param arr2D Collection of values as 2D array
   */
  constructor(arr2D: number[][])

  constructor(a: number | number[] | number[][], rows?: number, columns?: number) {
    // Create empty matrix with pre-assigned length
    if (typeof a === 'number') {
      if (!rows) throw 'Error: Columns not defined.';
      const length = a * rows;
      this.data = new Array(length);
      this.rows = a;
      this.columns = rows;
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
   * Set mutable and return reference to self.
   * @returns Reference to self
   */
  get mutable(): Matrix {
    this.isMutating = true;
    return this;
  }

  /**
   * Set immutable and return reference to self.
   * @returns Reference to self
   */
  get immutable(): Matrix {
    this.isMutating = false;
    return this;
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

  /**
   * Transpose the matrix.
   * @returns Transposed matrix
   */
  transpose(): Matrix {
    return transpose(this, new Matrix(this.rows, this.columns));
  }

  /**
   * Row reduction of matrix. (Used to find determinant)
   */
  rowReduce(): Matrix {
    let output: Matrix = this.clone();
    const rowCount = output.rows;
    const columnCount = output.columns;

    const iterations = Math.min(rowCount, columnCount);

    for (let c = 0; c < iterations; c++) {
      let val = output.get(c, c);
      if (val === 0) { // If lead is zero
        let success = false;
        for (let r = c; r < rowCount; r++) {
          val = output.get(r, c);
          if (val > 0) {
            swapRows(output, c, r, output);
            success = true;
            break;
          }
        }
        // If no row
        if(!success) continue;
      }
    }

    return output;
  }

  /**
   * Performs row reduced echelon function on matrix
   * @returns Reduced matrix
   */
  rref(): Matrix {
    let output: Matrix = this.clone();

    let lead: number = 0;
    const rowCount = output.rows;
    const columnCount = output.columns;

    outer: for (let r = 0; r < rowCount; r++) {
      if (columnCount <= lead) {
        break;
      }
      let i = r;
      while (output.get(i, lead) === 0) {
        i++;
        if (rowCount === i) {
          i = r;
          lead++;
          if (columnCount === lead) {
            break outer;
          }
        }
      }
      swapRows(output, i, r, output);
      const val = output.get(r, lead);
      if (val !== 0) modifyRow(output, r,  d => d / val, output);
      for (let i = 0; i < rowCount; i++) {
        if (i === r) continue;
        const val2 = output.get(i, lead);
        modifyRow2(output, i, r, (d, d2) => d - val2 * d2, output);
      }
      lead++;
    }

    return output;
  }

  /**
   * Get row of matrix at given index.
   * @param index Index of row
   * @returns Row at index
   */
  row(index: number): number[] {
    if (index < 0 || index >= this.rows) throw 'Row does not exist.';
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
    if (index < 0 || index >= this.columns) throw 'Row does not exist.';
    const output: number[] = [];
    for (let r = 0; r < this.rows; r++) {
      output.push(this.get(r, index));
    }
    return output;
  }

  /**
   * Modifies a row based on given function.
   * @param index Index of row to modify
   * @param modifier Modifier function
   * @returns Modified matrix
   */
  modifyRow(index: number, modifier: (val: number) => number): Matrix

  /**
   * Modifies a row based on given function. Also sends values from a secondary row to modifier function.
   * @param index Index of row to modify
   * @param index2 Index of secondary row
   * @param modifier Modifier function
   * @returns Modified matrix
   */
  modifyRow(index: number, index2: number, modifier: (val: number, val2: number) => number): Matrix

  modifyRow(row: number, b: ((val: number) => number) | number, c?: (val: number, val2: number) => number): Matrix {
    if (typeof b === 'function') return modifyRow(this, row, b, this.isMutating ? this : this.clone());
    return modifyRow2(this, row, b, c, this.isMutating ? this : this.clone());
  }

  /**
   * Modifies a column based on given function.
   * @param index Index of column to modify
   * @param modifier Modifier function
   * @returns Modified matrix
   */
  modifyColumn(index: number, modifier: (val: number) => number): Matrix

  /**
   * Modifies a column based on given function. Also sends values from a secondary column to modifier function.
   * @param index Index of column to modify
   * @param index2 Index of secondary column
   * @param modifier Modifier function
   * @returns Modified matrix
   */
  modifyColumn(index: number, index2: number, modifier: (val: number, val2: number) => number): Matrix

  modifyColumn(col: number, b: ((val: number) => number) | number, c?: (val: number, val2: number) => number): Matrix {
    if (col < 0 || col >= this.columns || col < 0 || col >= this.columns) throw 'Column does not exist.';

    const output: Matrix = this.clone();

    if (typeof b === 'number') {
      if (b < 0 || b >= this.columns || b < 0 || b >= this.columns) throw 'Row does not exist.';
      for (let row: number = 0; row < this.rows; row++) {
        const val1: number = this.get(row, col);
        const val2: number = this.get(row, b);
        output.set(row, col, c(val1, val2));
      }
    } else {
      for (let row: number = 0; row < this.rows; row++) {
        const val: number = this.get(row, col);
        output.set(row, col, b(val));
      }
    }

    return output;
  }

  /**
   * Swap two rows within the matrix.
   * @param index1 Index of first row
   * @param index2 Index of second row
   * @returns Matrix with swapped rows
   */
  swapRows(index1: number, index2: number): Matrix {
    return swapRows(this, index1, index2, this.isMutating ? this : this.clone());
  }

  /**
   * Swap two columns within the matrix.
   * @param index1 Index of first column
   * @param index2 Index of second column
   * @returns Matrix with swapped columns
   */
  swapColumns(index1: number, index2: number): Matrix {
    return swapColumns(this, index1, index2, this.isMutating ? this : this.clone());
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

  /**
   * Creates a new matrix with provided values along diagonal.
   * @param arr Collection of values
   * @returns Matrix with provided diagonal
   */
  static diag(arr: number[]): Matrix;

  /**
   * Creates a new matrix with provided values along diagonal.
   * @param val Collection of values
   * @returns Matrix with provided diagonal
   */
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
