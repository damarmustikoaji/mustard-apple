"use client";

import { useEffect, useMemo, useState } from "react";
import { ageOnDate, getAgeGroup, getDevelopmentResult } from "@/lib/development/utils";
import type { Domain } from "@/lib/development/types";

const domainNames: Domain[] = ["Gerak Motorik Kasar", "Gerak Motorik Halus", "Bahasa & Bicara", "Sosial & Kemandirian"];
const todayIso = () => { const now = new Date(); return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`; };

export function DevelopmentChecklist() {
  const [birthDate, setBirthDate] = useState("");
  const [today, setToday] = useState("");
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  useEffect(() => setToday(todayIso()), []);
  const storageKey = birthDate ? `tbp:development:${birthDate}` : "";
  useEffect(() => {
    if (!storageKey) { setChecked({}); return; }
    try { setChecked(JSON.parse(localStorage.getItem(storageKey) || "{}")); } catch { setChecked({}); }
  }, [storageKey]);
  const age = birthDate && today && birthDate <= today ? ageOnDate(birthDate, today) : null;
  const group = age ? getAgeGroup(age.months) : null;
  const result = useMemo(() => group ? getDevelopmentResult(checked, group.milestones.length) : null, [checked, group]);
  const toggle = (id: string) => setChecked((previous) => {
    const next = { ...previous, [id]: !previous[id] };
    if (storageKey) localStorage.setItem(storageKey, JSON.stringify(next));
    return next;
  });
  const reset = () => {
    if (window.confirm("Atur ulang semua tanda checklist untuk tanggal lahir ini?")) {
      localStorage.removeItem(storageKey);
      setChecked({});
    }
  };

  return <div className="space-y-5">
    <section className="rounded-2xl border border-border bg-card p-4">
      <label htmlFor="development-birth-date" className="block font-semibold">Tanggal lahir anak</label>
      <input id="development-birth-date" type="date" max={today || undefined} value={birthDate} onChange={(event) => setBirthDate(event.target.value)} className="mt-2 min-h-12 w-full rounded-xl border border-border bg-background px-3 text-base" />
      <p className="mt-2 text-xs leading-relaxed text-muted">Tanggal lahir dan checklist tersimpan di perangkat ini saja, tidak dikirim ke server.</p>
      {age && <p aria-live="polite" className="mt-3 rounded-xl bg-accent-soft p-3 font-semibold text-accent">Usia anak: {age.years > 0 ? `${age.years} tahun${age.remainingMonths ? ` ${age.remainingMonths} bulan` : ""}` : `${age.months} bulan`}{age.days ? ` ${age.days} hari` : ""}</p>}
      {birthDate && today && birthDate > today && <p className="mt-2 text-sm text-red-700">Pilih tanggal lahir hari ini atau sebelumnya.</p>}
    </section>
    {!age ? <div className="rounded-2xl border border-dashed border-border p-5 text-center text-sm text-muted">Pilih tanggal lahir untuk melihat milestone perkembangan.</div> : !group ? <div className="rounded-2xl border border-dashed border-border p-5 text-center text-sm text-muted">Daftar milestone tersedia untuk usia hingga 5 tahun 11 bulan.</div> : <>
      <section className="rounded-2xl border border-accent bg-accent-soft p-4">
        <p className="text-sm font-semibold">Milestone kelompok usia {group.label}</p>
        <p className="mt-1 text-2xl font-extrabold text-accent">{result?.achieved} dari {result?.total} ({result?.percentage}%)</p>
        <p className="mt-1 font-bold">{result?.category}</p>
        <p className="mt-2 text-sm leading-relaxed">{result?.advice}</p>
      </section>
      <div className="space-y-4">
        <section data-testid="sticky-development-summary" aria-label="Ringkasan singkat" aria-live="polite" className="sticky top-0 z-10 -mx-1 rounded-xl border border-border bg-card/95 px-3 py-2 shadow-md backdrop-blur-sm">
          <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-sm">
            <p className="font-bold">{result?.achieved} dari {result?.total} milestone</p>
            <p className="font-bold text-accent">{result?.percentage}%</p>
            <p className="basis-full font-semibold leading-snug">{result?.category}</p>
          </div>
        </section>
        {domainNames.map((domain) => <section key={domain} className="space-y-2">
          <h2 className="font-bold">{domain}</h2>
          <div className="grid gap-2">{group.milestones.filter((item) => item.domain === domain).map((item) => <label key={item.id} className="flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border border-border bg-card p-3 text-sm leading-relaxed">
            <input type="checkbox" className="size-5 shrink-0 accent-accent" checked={!!checked[item.id]} onChange={() => toggle(item.id)} />
            <span>{item.text}</span><span className="sr-only">Sudah bisa</span>
          </label>)}</div>
        </section>)}
      </div>
      <button type="button" onClick={reset} className="min-h-12 w-full rounded-full border border-border bg-card px-5 py-3 font-semibold">Atur ulang checklist</button>
    </>}
    <aside className="rounded-2xl border border-border bg-card p-4 text-sm leading-relaxed"><strong>Catatan penting:</strong> Hasil ini adalah informasi umum untuk membantu orang tua memantau perkembangan, BUKAN skrining diagnosis atau pengganti pemeriksaan tenaga kesehatan. Setiap anak berkembang dengan kecepatannya sendiri. Bicarakan dengan tenaga kesehatan bila ada kekhawatiran.</aside>
  </div>;
}
