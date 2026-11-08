export type MpasiStageId = "6-8" | "9-11" | "12-23";

export type MpasiStage = {
  id: MpasiStageId;
  label: string;
  minMonths: number;
  maxMonths: number;
  textureNote: string;
};

export type Allergen = "Telur" | "Susu sapi" | "Kacang" | "Gluten" | "Seafood" | "Kedelai";

export type MpasiRecipe = {
  id: string;
  name: string;
  stageId: MpasiStageId;
  texture: string;
  prepMinutes: number;
  ingredients: string[];
  steps: string[];
  allergens: Allergen[];
  tip?: string;
};
