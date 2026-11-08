import type { Measurement, Sex } from "@/lib/growth";

export type SavedMeasurement = { id: string; date: string; weightKg: number; heightCm?: number; measurement: Measurement };
export type SavedChild = { id: string; nickname: string; sex: Sex; birthDate: string; measurements: SavedMeasurement[] };
const KEY = "teman-buku-pink-growth-history-v1";

export function readGrowthHistory(storage: Pick<Storage, "getItem"> = localStorage): SavedChild[] {
  try {
    const value: unknown = JSON.parse(storage.getItem(KEY) ?? "[]");
    if (!Array.isArray(value)) return [];
    return value.filter((child): child is SavedChild => child && typeof child.id === "string" && (child.sex === "male" || child.sex === "female") && typeof child.birthDate === "string" && Array.isArray(child.measurements));
  } catch { return []; }
}

export function writeGrowthHistory(children: SavedChild[], storage: Pick<Storage, "setItem"> = localStorage): void {
  storage.setItem(KEY, JSON.stringify(children));
}

export function clearGrowthHistory(storage: Pick<Storage, "removeItem"> = localStorage): void { storage.removeItem(KEY); }
