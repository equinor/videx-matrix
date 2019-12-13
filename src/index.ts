
import {
  VectorLike,
  add as baseAdd,
  sub as baseSub,
  scale as baseScale,
  magnitude as baseMagnitude,
  normalize as baseNormalize,
  dist,
  dot as baseDot,
  mix,
  isZeroVector,
  modify as baseModify,
} from '@equinor/videx-linear-algebra';

/*
import {

} from './functions';
*/

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

  rows: number = 0;

  columns: number = 0;

  constructor(arr2D: number[][])

  constructor(arr: number[])

  constructor(a: number[] | number[][]) {
    // If no data, return default
    if (a.length === 0) return;

    const first = a[0];

    // Handle input as 1D matrix
    if (typeof first === 'number') {
      this.data[0] = first;
      for (let i = 1; i < a.length; i++) {
        const temp = a[i];
        if (typeof temp !== 'number') throw 'Error: Mix of numeric and non-numeric parameters.'
        this.data[i] = temp;
      }
      this.rows = 1;
      this.columns = this.data.length;
    } else { // handle input as 2D matrix

    }
  }
}
