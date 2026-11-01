import bbU from "@/data/who/bb-u.json";
import pbU from "@/data/who/pb-u.json";
import tbU from "@/data/who/tb-u.json";
import { classifyHeightForAge, classifyWeightForAge, type Status } from "./classify";
import { lmsZ, round2, valueAtZ, weightZ, type LmsRow } from "./zscore";

export type Sex = "male" | "female";
export type Measurement = "lying" | "standing";

interface Table {
  male: LmsRow[];
  female: LmsRow[];
}

export interface GrowthInput {
  sex: Sex;
  ageMonths: number;
  weightKg: number;
  heightCm?: number;
  measurement?: Measurement;
}

export interface IndicatorResult {
  key: "bb-u" | "pb-u" | "tb-u";
  name: string;
  value: number;
  unit: string;
  z: number;
  status: Status;
  /** Rentang nilai yang termasuk kategori normal untuk usia ini. */
  normalRange: { min: number; max: number };
}

function rowFor(table: Table, sex: Sex, month: number): LmsRow {
  const row = table[sex].find((r) => r.month === month);
  if (!row) throw new RangeError(`Tidak ada tabel WHO untuk usia ${month} bulan (standar mencakup 0-60 bulan).`);
  return row;
}

const oneDecimal = (n: number) => Math.round(n * 10) / 10;

export function assessGrowth(input: GrowthInput): IndicatorResult[] {
  const { sex, ageMonths, weightKg } = input;
  const results: IndicatorResult[] = [];

  const w = rowFor(bbU, sex, ageMonths);
  const wz = round2(weightZ(weightKg, w));
  results.push({
    key: "bb-u",
    name: "Berat badan menurut umur (BB/U)",
    value: weightKg,
    unit: "kg",
    z: wz,
    status: classifyWeightForAge(wz),
    normalRange: { min: oneDecimal(valueAtZ(w, -2)), max: oneDecimal(valueAtZ(w, 1)) },
  });

  if (input.heightCm !== undefined) {
    // WHO: under 24 months use recumbent length, from 24 months standing height.
    // Convert between the two with ±0.7 cm when measured the other way.
    const useLength = ageMonths < 24;
    let height = input.heightCm;
    if (useLength && input.measurement === "standing") height += 0.7;
    if (!useLength && input.measurement === "lying") height -= 0.7;

    const h = rowFor(useLength ? pbU : tbU, sex, ageMonths);
    const hz = round2(lmsZ(height, h));
    results.push({
      key: useLength ? "pb-u" : "tb-u",
      name: useLength ? "Panjang badan menurut umur (PB/U)" : "Tinggi badan menurut umur (TB/U)",
      value: oneDecimal(height),
      unit: "cm",
      z: hz,
      status: classifyHeightForAge(hz),
      normalRange: { min: oneDecimal(valueAtZ(h, -2)), max: oneDecimal(valueAtZ(h, 3)) },
    });
  }

  return results;
}
