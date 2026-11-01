/** Parse "YYYY-MM-DD" as a calendar date, avoiding timezone shifts from `new Date(string)`. */
export function parseIsoDate(value: string): { y: number; m: number; d: number } | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const [y, m, d] = [Number(match[1]), Number(match[2]), Number(match[3])];
  const check = new Date(Date.UTC(y, m - 1, d));
  if (check.getUTCFullYear() !== y || check.getUTCMonth() !== m - 1 || check.getUTCDate() !== d) return null;
  return { y, m, d };
}

/** Age in completed months between two calendar dates, as used by KMS/WHO tables. */
export function ageInMonths(birthDate: string, measureDate: string): number {
  const b = parseIsoDate(birthDate);
  const t = parseIsoDate(measureDate);
  if (!b || !t) throw new Error("Tanggal tidak valid");
  let months = (t.y - b.y) * 12 + (t.m - b.m);
  if (t.d < b.d) months -= 1;
  return months;
}

export function todayIso(now = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}
