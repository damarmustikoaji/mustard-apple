export type Tone = "danger" | "warning" | "good" | "info";

export interface Status {
  label: string;
  tone: Tone;
}

/** Kategori BB/U menurut Permenkes No. 2 Tahun 2020. */
export function classifyWeightForAge(z: number): Status {
  if (z < -3) return { label: "Berat badan sangat kurang", tone: "danger" };
  if (z < -2) return { label: "Berat badan kurang", tone: "warning" };
  if (z <= 1) return { label: "Berat badan normal", tone: "good" };
  return { label: "Risiko berat badan lebih", tone: "warning" };
}

/** Kategori PB/U atau TB/U menurut Permenkes No. 2 Tahun 2020. */
export function classifyHeightForAge(z: number): Status {
  if (z < -3) return { label: "Sangat pendek", tone: "danger" };
  if (z < -2) return { label: "Pendek", tone: "warning" };
  if (z <= 3) return { label: "Normal", tone: "good" };
  return { label: "Tinggi", tone: "info" };
}

/** Kategori BB/PB atau BB/TB menurut Permenkes No. 2 Tahun 2020. */
export function classifyWeightForLengthHeight(z: number): Status {
  if (z < -3) return { label: "Gizi buruk", tone: "danger" };
  if (z < -2) return { label: "Gizi kurang", tone: "warning" };
  if (z <= 1) return { label: "Gizi baik", tone: "good" };
  if (z <= 2) return { label: "Berisiko gizi lebih", tone: "warning" };
  if (z <= 3) return { label: "Gizi lebih", tone: "warning" };
  return { label: "Obesitas", tone: "danger" };
}
