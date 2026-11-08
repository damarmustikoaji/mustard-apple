"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { clearMpasiData, formatFoodEntries, PREPARATION_ITEMS, readMpasiData, recordMpasiEntryAdded, writeMpasiData, type FoodEntry, type FoodResponse, type Reaction } from "@/lib/mpasi";
import { FEATURE_MPASI_AFFILIATE } from "@/lib/features";

const responses: FoodResponse[] = ["Suka", "Biasa", "Menolak"];
const reactions: Reaction[] = ["Tidak ada reaksi", "Ruam", "Muntah", "Diare", "Lainnya"];
const inputClass = "mt-1 min-h-12 w-full rounded-xl border border-border bg-background px-3 text-base";
const today = () => { const date = new Date(); return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`; };
const dateLabel = (date: string) => new Intl.DateTimeFormat("id-ID", { dateStyle: "long", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`));

export function MpasiTracker() {
  const [ready, setReady] = useState(false);
  const [entries, setEntries] = useState<FoodEntry[]>([]);
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const [form, setForm] = useState({ childName: "", foodName: "", firstTried: today(), response: "Biasa" as FoodResponse, reaction: "Tidak ada reaksi" as Reaction, reactionNote: "" });
  const orderedEntries = useMemo(() => [...entries].sort((a, b) => b.firstTried.localeCompare(a.firstTried)), [entries]);

  useEffect(() => {
    const saved = readMpasiData();
    setEntries(saved.entries);
    setCheckedItems(saved.checkedItems);
    setReady(true);
  }, []);

  function persist(nextEntries: FoodEntry[], nextChecked: string[]) {
    setEntries(nextEntries);
    setCheckedItems(nextChecked);
    writeMpasiData({ entries: nextEntries, checkedItems: nextChecked });
  }

  function resetForm() {
    setEditingId(null);
    setForm({ childName: "", foodName: "", firstTried: today(), response: "Biasa", reaction: "Tidak ada reaksi", reactionNote: "" });
  }

  function saveEntry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const item: FoodEntry = { ...form, childName: form.childName.trim(), foodName: form.foodName.trim(), reactionNote: form.reactionNote.trim(), id: editingId || crypto.randomUUID() };
    const next = editingId ? entries.map((entry) => entry.id === editingId ? item : entry) : [item, ...entries];
    persist(next, checkedItems);
    if (!editingId) recordMpasiEntryAdded();
    setNotice(editingId ? "Catatan diperbarui." : "Catatan ditambahkan.");
    resetForm();
  }

  function editEntry(entry: FoodEntry) {
    setEditingId(entry.id);
    setForm({ childName: entry.childName, foodName: entry.foodName, firstTried: entry.firstTried, response: entry.response, reaction: entry.reaction, reactionNote: entry.reactionNote });
    document.getElementById("mpasi-form-title")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function shareEntries() {
    const text = `Catatan makanan MPASI\n\n${formatFoodEntries(orderedEntries)}`;
    try {
      if (navigator.share) await navigator.share({ title: "Catatan makanan MPASI", text });
      else if (navigator.clipboard) { await navigator.clipboard.writeText(text); setNotice("Catatan berhasil disalin."); }
      else throw new Error("share unavailable");
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") return;
      setNotice("Catatan belum bisa dibagikan. Coba lagi dari browser ini.");
    }
  }

  async function copyEntries() {
    try {
      await navigator.clipboard.writeText(`Catatan makanan MPASI\n\n${formatFoodEntries(orderedEntries)}`);
      setNotice("Catatan berhasil disalin.");
    } catch {
      setNotice("Catatan belum bisa disalin. Coba lagi dari browser ini.");
    }
  }

  function toggleItem(id: string) {
    const next = checkedItems.includes(id) ? checkedItems.filter((item) => item !== id) : [...checkedItems, id];
    persist(entries, next);
  }

  function removeEntry(id: string) {
    if (window.confirm("Hapus catatan makanan ini?")) persist(entries.filter((entry) => entry.id !== id), checkedItems);
  }

  function removeAll() {
    if (!window.confirm("Hapus semua catatan makanan dan checklist MPASI dari perangkat ini?")) return;
    clearMpasiData();
    setEntries([]);
    setCheckedItems([]);
    resetForm();
    setNotice("Semua data MPASI di perangkat ini sudah dihapus.");
  }

  return <div className="space-y-6">
    <section className="rounded-2xl border border-border bg-card p-4">
      <h2 id="mpasi-form-title" className="font-bold">{editingId ? "Ubah catatan makanan" : "Tambah makanan yang dicoba"}</h2>
      <form onSubmit={saveEntry} className="mt-4 space-y-4">
        <label className="block text-sm font-semibold">Nama panggilan anak (opsional)<input value={form.childName} maxLength={40} onChange={(event) => setForm({ ...form, childName: event.target.value })} className={inputClass} autoComplete="off" /></label>
        <label className="block text-sm font-semibold">Nama makanan<input required value={form.foodName} maxLength={100} onChange={(event) => setForm({ ...form, foodName: event.target.value })} className={inputClass} autoComplete="off" /></label>
        <label className="block text-sm font-semibold">Tanggal pertama dicoba<input required type="date" max={today()} value={form.firstTried} onChange={(event) => setForm({ ...form, firstTried: event.target.value })} className={inputClass} /></label>
        <label className="block text-sm font-semibold">Respons anak<select value={form.response} onChange={(event) => setForm({ ...form, response: event.target.value as FoodResponse })} className={inputClass}>{responses.map((value) => <option key={value}>{value}</option>)}</select></label>
        <label className="block text-sm font-semibold">Reaksi yang dicatat<select value={form.reaction} onChange={(event) => setForm({ ...form, reaction: event.target.value as Reaction })} className={inputClass}>{reactions.map((value) => <option key={value}>{value}</option>)}</select></label>
        <label className="block text-sm font-semibold">Catatan reaksi (opsional)<input value={form.reactionNote} maxLength={240} onChange={(event) => setForm({ ...form, reactionNote: event.target.value })} className={inputClass} autoComplete="off" /></label>
        <div className="flex gap-2"><button type="submit" disabled={!ready} className="min-h-12 flex-1 rounded-full bg-accent px-4 py-3 font-semibold text-white disabled:opacity-50">{editingId ? "Simpan perubahan" : "Simpan catatan"}</button>{editingId && <button type="button" onClick={resetForm} className="min-h-12 rounded-full border border-border px-4 font-semibold">Batal</button>}</div>
      </form>
      <p className="mt-3 text-xs leading-relaxed text-muted">Nama dan catatan makanan hanya tersimpan di penyimpanan browser perangkat ini.</p>
    </section>

    <section aria-labelledby="food-list-title" className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2"><h2 id="food-list-title" className="text-lg font-bold">Makanan yang sudah dicoba</h2><div className="flex gap-2"><button type="button" disabled={!entries.length} onClick={copyEntries} className="min-h-11 rounded-full border border-border px-3 text-sm font-semibold disabled:opacity-50">Salin</button><button type="button" disabled={!entries.length} onClick={shareEntries} className="min-h-11 rounded-full border border-border px-3 text-sm font-semibold disabled:opacity-50">Bagikan</button></div></div>
      <p className="rounded-xl border border-border bg-card p-3 text-sm font-semibold">Siap ditunjukkan ke bidan/dokter</p>
      {!orderedEntries.length ? <p className="rounded-2xl border border-dashed border-border p-5 text-center text-sm text-muted">Belum ada catatan. Tambahkan makanan yang sudah dicoba.</p> : orderedEntries.map((entry) => <article key={entry.id} className="space-y-2 rounded-2xl border border-border bg-card p-4">
        <div className="flex items-start justify-between gap-3"><div className="min-w-0"><h3 className="break-words font-bold">{entry.foodName}</h3><p className="text-sm text-muted">{entry.childName || "Anak"} · {dateLabel(entry.firstTried)}</p></div><span className="shrink-0 rounded-full bg-accent-soft px-2 py-1 text-xs font-semibold text-accent">{entry.response}</span></div>
        <p className="text-sm">Reaksi dicatat: {entry.reaction}{entry.reactionNote ? ` — ${entry.reactionNote}` : ""}</p>
        {entry.reaction !== "Tidak ada reaksi" && <p className="rounded-xl bg-accent-soft p-3 text-sm leading-relaxed">Catat dan tunjukkan ke tenaga kesehatan saat kunjungan berikutnya. Jika anak tampak sangat lemas atau sulit bernapas, segera hubungi 119 atau faskes terdekat.</p>}
        <div className="flex gap-2 pt-1"><button type="button" onClick={() => editEntry(entry)} className="min-h-11 rounded-full border border-border px-4 text-sm font-semibold">Ubah</button><button type="button" onClick={() => removeEntry(entry.id)} className="min-h-11 rounded-full border border-border px-4 text-sm font-semibold">Hapus</button></div>
      </article>)}
    </section>

    <section className="space-y-3 rounded-2xl border border-border bg-card p-4">
      <div><h2 className="text-lg font-bold">Checklist persiapan MPASI</h2><p className="mt-1 text-sm text-muted">Centang yang sudah tersedia atau dilakukan.</p></div>
      {PREPARATION_ITEMS.map((item) => <label key={item.id} className="flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border border-border p-3 text-sm leading-relaxed"><input type="checkbox" className="size-5 shrink-0 accent-accent" checked={checkedItems.includes(item.id)} onChange={() => toggleItem(item.id)} /><span>{item.label}</span></label>)}
    </section>

    <aside className="rounded-2xl border border-border bg-card p-4 text-sm leading-relaxed"><p>Panduan porsi, tekstur, dan frekuensi MPASI sesuai usia ada di Buku KIA Anda. Tanyakan ke bidan, dokter, atau kader posyandu jika ragu.</p></aside>
    {FEATURE_MPASI_AFFILIATE && <a href="/perlengkapan-mpasi" className="block min-h-12 rounded-2xl border border-border bg-card p-4 font-semibold">Lihat perlengkapan MPASI →</a>}
    <button type="button" onClick={removeAll} className="min-h-12 w-full rounded-full border border-border px-4 py-3 font-semibold">Hapus semua data</button>
    <p role="status" aria-live="polite" className="min-h-5 text-sm text-muted">{notice}</p>
  </div>;
}
