import type { IndicatorResult, Sex } from "./growth";

export function ageLabel(ageMonths: number): string {
  const years = Math.floor(ageMonths / 12);
  const months = ageMonths % 12;
  return years > 0 ? `${years} tahun ${months} bulan` : `${months} bulan`;
}

/** Teks ringkas untuk dibagikan (mis. lewat WhatsApp). Tidak menyertakan nama anak atau tanggal lahir. */
export function formatResultText(opts: { ageMonths: number; sex: Sex; items: IndicatorResult[] }): string {
  const fmt = (n: number) => n.toLocaleString("id-ID", { maximumFractionDigits: 2 });
  const sexLabel = opts.sex === "female" ? "perempuan" : "laki-laki";
  return [
    "Hasil cek pertumbuhan (Teman Buku Pink)",
    `Usia: ${ageLabel(opts.ageMonths)}, ${sexLabel}`,
    ...opts.items.map((r) => `${r.key.toUpperCase().replace("-", "/")}: ${fmt(r.value)} ${r.unit}, ${r.status.label}`),
    "Ini bukan diagnosis. Konsultasikan ke tenaga kesehatan.",
  ].join("\n");
}
