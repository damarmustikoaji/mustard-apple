/**
 * TEST ACUAN — hanya boleh diubah manusia.
 * Nilai diambil dari tabel z-score resmi WHO Child Growth Standards (dibulatkan 0,1 kg/cm),
 * jadi z-score hasil hitung harus mendekati garis SD yang bersangkutan.
 */
import { describe, expect, it } from "vitest";
import { assessGrowth, type Sex } from "@/lib/growth";

// Tabel SD dibulatkan ke 0,1 kg/cm; pada berat bayi baru lahir (~2,5 kg) pembulatan itu setara ~0,1 SD.
const TOL = 0.15;

const weightCases: [Sex, number, number, number][] = [
  // sex, bulan, berat (kg), z yang diharapkan
  ["male", 0, 3.3464, 0],
  ["male", 0, 2.5, -2],
  ["male", 12, 7.7, -2],
  ["male", 12, 10.8, 1],
  ["male", 36, 10.0, -3],
  ["male", 60, 24.2, 2],
  ["female", 6, 5.7, -2],
  ["female", 24, 14.8, 2],
  ["female", 24, 17.0, 3],
];

describe("BB/U sesuai tabel WHO", () => {
  it.each(weightCases)("%s %i bulan, %f kg → z ≈ %f", (sex, month, kg, z) => {
    const [bb] = assessGrowth({ sex, ageMonths: month, weightKg: kg });
    expect(Math.abs(bb!.z - z)).toBeLessThanOrEqual(TOL);
  });
});

describe("PB/U dan TB/U sesuai tabel WHO", () => {
  it("laki-laki 12 bulan, 71,0 cm berbaring → z ≈ -2 (Pendek di batas)", () => {
    const [, h] = assessGrowth({ sex: "male", ageMonths: 12, weightKg: 9, heightCm: 71.0, measurement: "lying" });
    expect(Math.abs(h!.z - -2)).toBeLessThanOrEqual(TOL);
  });

  it("perempuan 48 bulan, 94,1 cm berdiri → z ≈ -2", () => {
    const [, h] = assessGrowth({ sex: "female", ageMonths: 48, weightKg: 15, heightCm: 94.1, measurement: "standing" });
    expect(Math.abs(h!.z - -2)).toBeLessThanOrEqual(TOL);
  });

  it("perempuan 48 bulan, 102,7312 cm → z = 0 (median)", () => {
    const [, h] = assessGrowth({ sex: "female", ageMonths: 48, weightKg: 15, heightCm: 102.7312, measurement: "standing" });
    expect(Math.abs(h!.z)).toBeLessThanOrEqual(0.01);
  });
});
