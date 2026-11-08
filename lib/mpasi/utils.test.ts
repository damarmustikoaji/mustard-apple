import { describe, expect, it } from "vitest";
import { getRecipesForStage, getStageForMonths } from "./utils";
import { recipes } from "./recipes";

describe("mpasi helpers", () => {
  it("returns null before 6 months", () => {
    expect(getStageForMonths(5)).toBeNull();
  });
  it("selects the stage at its boundaries", () => {
    expect(getStageForMonths(6)?.id).toBe("6-8");
    expect(getStageForMonths(8)?.id).toBe("6-8");
    expect(getStageForMonths(9)?.id).toBe("9-11");
    expect(getStageForMonths(12)?.id).toBe("12-23");
  });
  it("falls back to the oldest stage past 23 months", () => {
    expect(getStageForMonths(36)?.id).toBe("12-23");
  });
  it("filters recipes by stage", () => {
    const result = getRecipesForStage("6-8");
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((r) => r.stageId === "6-8")).toBe(true);
  });
  it("every recipe belongs to a known stage", () => {
    const stageIds = new Set(["6-8", "9-11", "12-23"]);
    expect(recipes.every((r) => stageIds.has(r.stageId))).toBe(true);
  });
});
