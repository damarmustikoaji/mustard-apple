import { describe, expect, it } from "vitest";
import { calculatePregnancy, dateDaysAgo } from "./hpl";

describe("kalkulator HPL", () => {
  it.each([
    ["2026-01-01", "2026-10-08"],
    ["2026-02-14", "2026-11-21"],
    ["2024-02-29", "2024-12-05"],
    ["2025-05-31", "2026-03-07"],
    ["2026-11-08", "2027-08-15"],
  ])("menghitung HPL dari HPHT %s", (hpht, hpl) => {
    expect(calculatePregnancy(hpht, hpht)?.hpl).toBe(hpl);
  });

  it("menghitung usia kehamilan, hari sisa, dan trimester", () => {
    expect(calculatePregnancy("2026-08-01", "2026-11-08")).toMatchObject({
      gestationalDays: 99,
      weeks: 14,
      days: 1,
      trimester: 2,
    });
  });

  it("menolak tanggal tidak valid, tanggal depan, dan HPHT lebih dari 42 minggu", () => {
    expect(calculatePregnancy("2026-02-30", "2026-11-08")).toBeNull();
    expect(calculatePregnancy("2026-11-09", "2026-11-08")).toBeNull();
    expect(calculatePregnancy(dateDaysAgo("2026-11-08", 295), "2026-11-08")).toBeNull();
    expect(calculatePregnancy(dateDaysAgo("2026-11-08", 294), "2026-11-08")).not.toBeNull();
  });
});
