import { describe, expect, it } from "vitest";
import { ageInMonths, parseIsoDate } from "./age";
import { classifyHeightForAge, classifyWeightForAge } from "./classify";
import { assessGrowth } from "./index";

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
});
