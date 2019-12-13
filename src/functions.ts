import Matrix from './index';

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
