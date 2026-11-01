export interface LmsRow {
  month?: number;
  length?: number;
  height?: number;
  L: number;
  M: number;
  S: number;
}

/** Measurement value at a given z-score (inverse of the LMS formula). */
export function valueAtZ(row: LmsRow, z: number): number {
  const { L, M, S } = row;
  return L === 0 ? M * Math.exp(S * z) : M * Math.pow(1 + L * S * z, 1 / L);
}

/** Plain LMS z-score. */
export function lmsZ(x: number, row: LmsRow): number {
  const { L, M, S } = row;
  return L === 0 ? Math.log(x / M) / S : (Math.pow(x / M, L) - 1) / (L * S);
}

/**
 * WHO z-score for weight-based indicators: beyond ±3 SD the distribution is
 * extrapolated linearly using the 2–3 SD distance (WHO Anthro procedure).
 */
export function weightZ(x: number, row: LmsRow): number {
  const z = lmsZ(x, row);
  if (z > 3) {
    const sd3 = valueAtZ(row, 3);
    return 3 + (x - sd3) / (sd3 - valueAtZ(row, 2));
  }
  if (z < -3) {
    const sd3neg = valueAtZ(row, -3);
    return -3 + (x - sd3neg) / (valueAtZ(row, -2) - sd3neg);
  }
  return z;
}

export const round2 = (n: number) => Math.round(n * 100) / 100;
