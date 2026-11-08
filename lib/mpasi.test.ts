import { describe, expect, it } from "vitest";
import { clearMpasiData, formatFoodEntries, readMpasiData, writeMpasiData, type FoodEntry, type MpasiStorage } from "@/lib/mpasi";

function memoryStorage(): MpasiStorage {
  const values = new Map<string, string>();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => { values.set(key, value); },
    removeItem: (key) => { values.delete(key); },
  };
}

const entry: FoodEntry = { id: "1", childName: "Nana", foodName: "Alpukat", firstTried: "2026-11-08", response: "Suka", reaction: "Tidak ada reaksi", reactionNote: "" };

describe("MPASI local storage", () => {
  it("stores entries and checklist values across reads", () => {
    const storage = memoryStorage();
    writeMpasiData({ entries: [entry], checkedItems: ["kursi-makan"] }, storage);
    expect(readMpasiData(storage)).toEqual({ entries: [entry], checkedItems: ["kursi-makan"] });
  });

  it("clears all MPASI data", () => {
    const storage = memoryStorage();
    writeMpasiData({ entries: [entry], checkedItems: [] }, storage);
    clearMpasiData(storage);
    expect(readMpasiData(storage)).toEqual({ entries: [], checkedItems: [] });
  });

  it("formats a readable shareable record", () => {
    expect(formatFoodEntries([entry])).toContain("2026-11-08 — Nana: Alpukat\nRespons: Suka\nReaksi: Tidak ada reaksi");
  });
});
