export type Domain = "Gerak Motorik Kasar" | "Gerak Motorik Halus" | "Bahasa & Bicara" | "Sosial & Kemandirian";
export type Milestone = { id: string; text: string; domain: Domain };
export type AgeGroup = { id: string; label: string; minMonths: number; maxMonths: number; milestones: Milestone[] };
export type DevelopmentResult = { achieved: number; total: number; percentage: number; category: string; advice: string };
