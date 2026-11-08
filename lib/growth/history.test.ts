import { describe, expect, it } from "vitest";
import { clearGrowthHistory, readGrowthHistory, writeGrowthHistory, type SavedChild } from "./history";

function memoryStorage() {
  const values = new Map<string, string>();
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => { values.set(key, value); },
    removeItem: (key: string) => { values.delete(key); },
  };
}

describe("riwayat pertumbuhan lokal", () => {
  it("menyimpan dan membaca beberapa anak tanpa jaringan", () => {
    const storage = memoryStorage();
    const children: SavedChild[] = ["a", "b"].map((id) => ({ id, nickname: id, sex: "female" as const, birthDate: "2025-01-01", measurements: [] }));
    writeGrowthHistory(children, storage);
    expect(readGrowthHistory(storage)).toEqual(children);
  });

  it("mengosongkan seluruh data riwayat", () => {
    const storage = memoryStorage();
    writeGrowthHistory([{ id: "a", nickname: "", sex: "male", birthDate: "2025-01-01", measurements: [] }], storage);
    clearGrowthHistory(storage);
    expect(readGrowthHistory(storage)).toEqual([]);
  });

  it("mengembalikan daftar kosong untuk JSON rusak", () => {
    const storage = memoryStorage();
    storage.setItem("teman-buku-pink-growth-history-v1", "{");
    expect(readGrowthHistory(storage)).toEqual([]);
  });
});
