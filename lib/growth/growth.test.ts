import { describe, expect, it } from "vitest";
import { ageInMonths, parseIsoDate } from "./age";
import { classifyHeightForAge, classifyWeightForAge } from "./classify";
import { assessGrowth } from "./index";
import bbPb from "@/data/who/bb-pb.json";
import bbTb from "@/data/who/bb-tb.json";
import { valueAtZ } from "./zscore";

describe("ageInMonths", () => {
  it("menghitung bulan penuh", () => {
    expect(ageInMonths("2025-01-15", "2026-01-15")).toBe(12);
    expect(ageInMonths("2025-01-15", "2026-01-14")).toBe(11);
  });

  it("menolak tanggal yang tidak ada", () => {
    expect(parseIsoDate("2025-02-30")).toBeNull();
  });
});

describe("klasifikasi", () => {
  it("BB/U tepat di batas", () => {
    expect(classifyWeightForAge(-3.01).label).toBe("Berat badan sangat kurang");
    expect(classifyWeightForAge(-3).label).toBe("Berat badan kurang");
    expect(classifyWeightForAge(-2).label).toBe("Berat badan normal");
    expect(classifyWeightForAge(1).label).toBe("Berat badan normal");
    expect(classifyWeightForAge(1.01).label).toBe("Risiko berat badan lebih");
  });

  it("TB/U tepat di batas", () => {
    expect(classifyHeightForAge(-2.5).label).toBe("Pendek");
    expect(classifyHeightForAge(3).label).toBe("Normal");
    expect(classifyHeightForAge(3.01).label).toBe("Tinggi");
  });
});

describe("assessGrowth", () => {
  it("memakai tabel PB/U di bawah 24 bulan dan menambah 0,7 cm bila diukur berdiri", () => {
    const [, h] = assessGrowth({ sex: "male", ageMonths: 12, weightKg: 9.6, heightCm: 75, measurement: "standing" });
    expect(h?.key).toBe("pb-u");
    expect(h?.value).toBe(75.7);
  });

  it("memakai tabel TB/U mulai 24 bulan", () => {
    const [, h] = assessGrowth({ sex: "female", ageMonths: 24, weightKg: 11, heightCm: 86, measurement: "standing" });
    expect(h?.key).toBe("tb-u");
  });

  it("mengoreksi posisi ukur dan membulatkan dimensi untuk BB/PB", () => {
    const row = bbPb.male.find((r) => r.length === 75.5)!;
    const items = assessGrowth({ sex: "male", ageMonths: 12, weightKg: valueAtZ(row, 0), heightCm: 74.9, measurement: "standing" });
    expect(items.map(({ key }) => key)).toEqual(["bb-u", "pb-u", "bb-pb"]);
    expect(items[2]?.key).toBe("bb-pb");
    expect(items[2]?.z).toBeCloseTo(0, 1); // 74.9 + 0.7 rounds to the 75.5 cm row.
  });

  it("mengoreksi posisi ukur untuk BB/TB", () => {
    const items = assessGrowth({ sex: "female", ageMonths: 24, weightKg: 12, heightCm: 86, measurement: "lying" });
    expect(items.map(({ key }) => key)).toEqual(["bb-u", "tb-u", "bb-tb"]);
    expect(items[2]?.key).toBe("bb-tb");
  });

  it.each([
    [-3.5, "Gizi buruk", "danger"],
    [-2.5, "Gizi kurang", "warning"],
    [0, "Gizi baik", "good"],
    [1.5, "Berisiko gizi lebih", "warning"],
    [2.5, "Gizi lebih", "warning"],
    [3.5, "Obesitas", "danger"],
  ] as const)("mengklasifikasikan BB/PB pada z=%s", (z, label, tone) => {
    const row = bbPb.male.find((r) => r.length === 75)!;
    const [, , result] = assessGrowth({ sex: "male", ageMonths: 12, weightKg: valueAtZ(row, z), heightCm: 75, measurement: "lying" });
    expect(result?.z).toBeCloseTo(z, 1);
    expect(result?.status).toEqual({ label, tone });
  });

  it("menghitung BB/TB dari tabel tinggi badan resmi", () => {
    const row = bbTb.female.find((r) => r.height === 86)!;
    const [, , result] = assessGrowth({ sex: "female", ageMonths: 24, weightKg: valueAtZ(row, -2.5), heightCm: 86, measurement: "standing" });
    expect(result?.key).toBe("bb-tb");
    expect(result?.z).toBeCloseTo(-2.5, 1);
    expect(result?.status.label).toBe("Gizi kurang");
    expect(result?.normalRange.min).toBeCloseTo(valueAtZ(row, -2), 1);
    expect(result?.normalRange.max).toBeCloseTo(valueAtZ(row, 1), 1);
  });
});
