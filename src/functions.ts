import Matrix from './index';

/**
 * Transpose a matrix.
 * @param matrix Matrix to transpose
 * @param target Target for storing results
 * @returns Transposed matrix
 */
export function transpose(matrix: Matrix, target: Matrix): Matrix {
  target.rows = matrix.columns;
  target.columns = matrix.rows;
  const data: number[] = matrix.data;
  let idx: number = 0;
  for (let row: number = 0; row < target.rows; row++) {
    for (let col: number = 0; col < target.columns; col++) {
      target.data[idx++] = data[row + col * target.rows];
    }
  }
  return target;
}

/**
 * Modifies a row based on given function.
 * @param index Index of row to modify
 * @param modifier Modifier function
 * @param target Target for storing results
 * @returns Modified matrix
 */
export function modifyRow(matrix: Matrix, index: number, modifier: (val: number) => number, target: Matrix): Matrix {
  if (index < 0 || index >= matrix.rows) throw 'Row does not exist.';
  for (let col: number = 0; col < matrix.columns; col++) {
    const val: number = matrix.get(index, col);
    target.set(index, col, modifier(val));
  }
  return target;
}

/**
 * Modifies a row based on given function. Also sends values from a secondary row to modifier function.
 * @param index Index of row to modify
 * @param index2 Index of secondary row
 * @param modifier Modifier function
 * @param target Target for storing results
 * @returns Modified matrix
 */
export function modifyRow2(matrix: Matrix, index1: number, index2: number, modifier: (val: number, val2: number) => number, target: Matrix): Matrix {
  if (index1 < 0 || index1 >= matrix.rows || index2 < 0 || index2 >= matrix.rows) throw 'Row does not exist.';
  for (let col: number = 0; col < matrix.columns; col++) {
    const val1: number = matrix.get(index1, col);
    const val2: number = matrix.get(index2, col);
    target.set(index1, col, modifier(val1, val2));
  }
  return target;
}

/**
 * Swap two rows within a matrix.
 * @param matrix Matrix to use
 * @param index1 Index of first row
 * @param index2 Index of second row
 * @param target Target to store results
 * @returns Matrix with swapped rows
 */
export function swapRows(matrix: Matrix, index1: number, index2: number, target: Matrix): Matrix {
  if (index1 < 0 || index1 >= matrix.rows || index2 < 0 || index2 >= matrix.rows) throw 'Row does not exist.';
  let v1: number;
  let v2: number;
  for (let c: number = 0; c < matrix.columns; c++) {
    v1 = matrix.get(index1, c);
    v2 = matrix.get(index2, c);
    target.set(index1, c, v2);
    target.set(index2, c, v1);
  }
  return target;
}

/**
 * Swap two column within a matrix.
 * @param matrix Matrix to use
 * @param index1 Index of first column
 * @param index2 Index of second column
 * @param target Target to store results
 * @returns Matrix with swapped columns
 */
export function swapColumns(matrix: Matrix, index1: number, index2: number, target: Matrix): Matrix {
  if (index1 < 0 || index1 >= matrix.columns || index2 < 0 || index2 >= matrix.columns) throw 'Column does not exist.';
  let v1: number;
  let v2: number;
  for (let r: number = 0; r < matrix.rows; r++) {
    v1 = matrix.get(r, index1);
    v2 = matrix.get(r, index2);
    target.set(r, index1, v2);
    target.set(r, index2, v1);
  }
  return target;
}

/**
   * Generates a formatted string from a given matrix.
   * @param matrix Matrix to generate string from
   * @Returns Formatted matrix string
   */
export function toString(matrix: Matrix): string {
  let idx = 0;
  let output: string = "";

  // Get greatest power of number
  let maxPower: number = -Infinity;
  matrix.data.forEach(d => {
    const power = d ? Math.floor(Math.log10(d)) : 0;
    if (power > maxPower) maxPower = power;
  });

  // Build grid of matrix
  const finalRow = matrix.rows - 1;
  for (let row: number = 0; row < matrix.rows; row++) {
    let prev = matrix.data[idx++];
    output += prev.toString();
    for (let col: number = 1; col < matrix.columns; col++) {
      const cur = matrix.data[idx++];
      const power = prev ? Math.floor(Math.log10(prev)) : 0;
      for (let i = maxPower - power; i >= 0; i--) output += ' ';
      output += cur;
      prev = cur;
    }
    if (row !== finalRow) output += '\n';
  }

  return output;
}
