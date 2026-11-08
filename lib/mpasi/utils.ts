import { recipes } from "./recipes";
import { stages } from "./stages";
import type { MpasiRecipe, MpasiStage } from "./types";

export { ageOnDate } from "@/lib/development/utils";

export function getStageForMonths(months: number): MpasiStage | null {
  if (months < 6) return null;
  return stages.find((stage) => months >= stage.minMonths && months <= stage.maxMonths) ?? stages[stages.length - 1];
}

export function getRecipesForStage(stageId: MpasiStage["id"]): MpasiRecipe[] {
  return recipes.filter((recipe) => recipe.stageId === stageId);
}
