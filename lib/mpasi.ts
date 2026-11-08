export type FoodResponse = "Suka" | "Biasa" | "Menolak";
export type Reaction = "Tidak ada reaksi" | "Ruam" | "Muntah" | "Diare" | "Lainnya";

export type FoodEntry = {
  id: string;
  childName: string;
  foodName: string;
  firstTried: string;
  response: FoodResponse;
  reaction: Reaction;
  reactionNote: string;
};

export type MpasiData = { entries: FoodEntry[]; checkedItems: string[] };
export type MpasiStorage = Pick<Storage, "getItem" | "setItem" | "removeItem">;

const STORAGE_KEY = "teman-buku-mpasi-v1";

export const PREPARATION_ITEMS = [
  { id: "kursi-makan", label: "Kursi makan" },
  { id: "alat-makan", label: "Alat makan bayi" },
  { id: "celemek", label: "Celemek atau slaber" },
  { id: "wadah", label: "Wadah penyimpanan" },
  { id: "penghalus", label: "Alat penghalus" },
  { id: "kebersihan", label: "Cuci tangan dan alat sebelum menyiapkan makanan" },
] as const;

export function readMpasiData(storage: MpasiStorage = localStorage): MpasiData {
  try {
    const parsed = JSON.parse(storage.getItem(STORAGE_KEY) || "null") as Partial<MpasiData> | null;
    return {
      entries: Array.isArray(parsed?.entries) ? parsed.entries : [],
      checkedItems: Array.isArray(parsed?.checkedItems) ? parsed.checkedItems : [],
    };
  } catch {
    return { entries: [], checkedItems: [] };
  }
}

export function writeMpasiData(data: MpasiData, storage: MpasiStorage = localStorage): void {
  storage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function clearMpasiData(storage: MpasiStorage = localStorage): void {
  storage.removeItem(STORAGE_KEY);
}

export function formatFoodEntries(entries: FoodEntry[]): string {
  const ordered = [...entries].sort((a, b) => b.firstTried.localeCompare(a.firstTried));
  if (!ordered.length) return "Belum ada catatan makanan.";
  return ordered.map((entry) => [
    `${entry.firstTried} — ${entry.childName || "Anak"}: ${entry.foodName}`,
    `Respons: ${entry.response}`,
    `Reaksi: ${entry.reaction}${entry.reactionNote ? ` — ${entry.reactionNote}` : ""}`,
  ].join("\n")).join("\n\n");
}

export function recordMpasiEntryAdded(): void {
  if (typeof window !== "undefined") window.dispatchEvent(new Event("mpasi-entry-added"));
}
