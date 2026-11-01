import { describe, expect, it } from "vitest";
import { ageOnDate, getGroupStatus, getScheduleGroups } from "./schedule";

describe("jadwal imunisasi", () => {
  it("mengelompokkan usia sebelumnya, bulan ini, dan jadwal terdekat", () => {
    expect(getGroupStatus(2, 3)).toBe("past");
    expect(getGroupStatus(3, 3)).toBe("due");
    expect(getGroupStatus(4, 3)).toBe("upcoming");
    expect(getScheduleGroups(3).filter((group) => group.status === "due")[0].month).toBe(3);
  });

  it("menghitung usia kalender dan menangani tanggal akhir bulan", () => {
    expect(ageOnDate("2026-01-31", "2026-02-28")).toEqual({ months: 1, days: 0 });
    expect(ageOnDate("2026-01-15", "2026-04-25")).toEqual({ months: 3, days: 10 });
  });
});
