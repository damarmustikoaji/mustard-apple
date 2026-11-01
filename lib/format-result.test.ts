import { describe, expect, it } from "vitest";
import { assessGrowth } from "./growth";
import { ageLabel, formatResultText } from "./format-result";

describe("ageLabel", () => {
  it("menampilkan tahun dan bulan", () => {
    expect(ageLabel(12)).toBe("1 tahun 0 bulan");
    expect(ageLabel(18)).toBe("1 tahun 6 bulan");
  });

  it("menampilkan bulan saja di bawah 1 tahun", () => {
    expect(ageLabel(6)).toBe("6 bulan");
  });
});

describe("formatResultText", () => {
  it("tidak menyertakan nama anak atau tanggal lahir, dan diakhiri disclaimer", () => {
    const items = assessGrowth({ sex: "female", ageMonths: 12, weightKg: 7.5, heightCm: 72, measurement: "lying" });
    const text = formatResultText({ ageMonths: 12, sex: "female", items });

    expect(text).toContain("Hasil cek pertumbuhan (Teman Buku Pink)");
    expect(text).toContain("Usia: 1 tahun 0 bulan, perempuan");
    expect(text).toContain("BB/U: 7,5 kg,");
    expect(text).toContain("PB/U: 72 cm,");
    expect(text).toContain("BB/PB: 7,5 kg,");
    expect(text.endsWith("Ini bukan diagnosis. Konsultasikan ke tenaga kesehatan.")).toBe(true);
    expect(text).not.toMatch(/\d{4}-\d{2}-\d{2}/);
  });
});
