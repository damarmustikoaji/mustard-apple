import { describe, expect, it } from "vitest";
import { getAgeGroup, getDevelopmentResult } from "./utils";

describe("development helpers", () => {
  it("selects the age group at its boundaries", () => {
    expect(getAgeGroup(0)?.id).toBe("0-1");
    expect(getAgeGroup(24)?.id).toBe("2-3 tahun");
    expect(getAgeGroup(72)).toBeNull();
  });
  it("summarizes checked milestones", () => {
    expect(getDevelopmentResult({ a: true, b: false, c: true }, 3)).toMatchObject({ achieved: 2, total: 3, percentage: 67, category: "Ada beberapa yang perlu diperhatikan" });
  });
});
