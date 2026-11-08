"use client";
import { useEffect, useState } from "react";
import { clearGrowthHistory, readGrowthHistory, writeGrowthHistory, type SavedChild } from "@/lib/growth/history";
import { GrowthChart } from "@/components/growth-chart";
import { ageInMonths } from "@/lib/growth/age";
import { assessGrowth } from "@/lib/growth";

const fmt = (n: number) => n.toLocaleString("id-ID", { maximumFractionDigits: 2 });

export function GrowthHistory() {
  const [children, setChildren] = useState<SavedChild[]>([]);
  const [ready, setReady] = useState(false);
  useEffect(() => { setChildren(readGrowthHistory()); setReady(true); }, []);
  useEffect(() => {
    const refresh = () => setChildren(readGrowthHistory());
    window.addEventListener("growth-history-updated", refresh);
    return () => window.removeEventListener("growth-history-updated", refresh);
  }, []);
  function save(next: SavedChild[]) { setChildren(next); writeGrowthHistory(next); }
  function removeAll() { clearGrowthHistory(); setChildren([]); }
  if (!ready) return null;
  return <section className="space-y-4 rounded-2xl border border-border bg-card p-4" aria-label="Riwayat pertumbuhan">
    <div><h2 className="text-lg font-bold">Riwayat pertumbuhan di HP ini</h2><p className="mt-1 text-sm text-muted">Data hanya tersimpan di HP ini. Menghapus data browser akan menghapus riwayat.</p></div>
    {children.map(child => <article key={child.id} className="space-y-3 rounded-xl border border-border p-3">
      <h3 className="font-semibold">{child.nickname || "Anak"}</h3>
      {child.measurements.length > 0 && (() => { const points = child.measurements.map(m => ({ m, age: ageInMonths(child.birthDate, m.date) })).filter(x => x.age >= 0 && x.age <= 60); const last = points.at(-1); if (!last) return null; const result = assessGrowth({ sex: child.sex, ageMonths: last.age, weightKg: last.m.weightKg, heightCm: last.m.heightCm, measurement: last.m.measurement }); return <GrowthChart sex={child.sex} ageMonths={last.age} items={result} measurements={points.map(({m,age})=>({ageMonths:age, weightKg:m.weightKg, heightCm:m.heightCm}))} />; })()}
      <ul className="space-y-2">{child.measurements.map(m => <li key={m.id} className="flex flex-wrap items-center justify-between gap-2 text-sm"><span>{m.date} · {fmt(m.weightKg)} kg{m.heightCm ? ` · ${fmt(m.heightCm)} cm` : ""}</span><button className="min-h-11 rounded-lg border border-border px-3" onClick={() => { const weight = window.prompt("Berat badan (kg)", String(m.weightKg)); if (weight === null) return; const height = window.prompt("Panjang/tinggi (cm), kosongkan jika tidak ada", m.heightCm ? String(m.heightCm) : ""); if (height === null) return; save(children.map(c => c.id !== child.id ? c : {...c, measurements:c.measurements.map(x=>x.id === m.id ? {...x, weightKg:Number(weight), heightCm:height ? Number(height) : undefined} : x)})); }}>Edit</button><button className="min-h-11 rounded-lg px-3 text-accent" onClick={() => save(children.map(c=>c.id===child.id?{...c,measurements:c.measurements.filter(x=>x.id!==m.id)}:c))}>Hapus</button></li>)}</ul>
      <button className="min-h-11 rounded-lg border border-border px-3 text-sm" onClick={() => save(children.filter(c=>c.id!==child.id))}>Hapus data anak</button>
    </article>)}
    <button className="min-h-11 rounded-full border border-border px-4 text-sm" onClick={() => { const nickname = window.prompt("Nama panggilan anak (opsional)") ?? ""; const birthDate = window.prompt("Tanggal lahir (YYYY-MM-DD)"); if (!birthDate) return; const sex = window.confirm("Pilih OK untuk perempuan, Batal untuk laki-laki") ? "female" : "male"; save([...children, {id:crypto.randomUUID(), nickname, birthDate, sex, measurements:[]}]); }}>Tambah anak</button>
    {children.length > 0 && <button className="min-h-11 rounded-full px-4 text-sm text-accent" onClick={() => { if (window.confirm("Hapus semua riwayat dari perangkat ini?")) removeAll(); }}>Hapus semua data</button>}
  </section>;
}
