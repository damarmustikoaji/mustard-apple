"use client";

import { useEffect, useMemo, useState } from "react";
import { addMonthsToIsoDate, ageOnDate, getScheduleGroups } from "@/lib/immunization/schedule";
import type { ImmunizationGroup, Vaccine } from "@/lib/immunization/types";

function localToday() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

function prettyDate(iso: string) {
  return new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })
    .format(new Date(`${iso}T00:00:00Z`));
}

function VaccineCard({ vaccine, checked, onChange }: { vaccine: Vaccine; checked: boolean; onChange: (id: string) => void }) {
  return (
    <article className="rounded-xl border border-border bg-card p-3">
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <h4 className="font-bold">{vaccine.name}</h4>
          <p className="text-xs text-muted">{vaccine.fullName}</p>
        </div>
        <span className="shrink-0 rounded-full bg-accent-soft px-2 py-1 text-xs font-medium text-accent">{vaccine.route}</span>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-muted">{vaccine.benefit}</p>
      <label className="mt-2 flex min-h-11 cursor-pointer items-center gap-2 text-sm font-medium">
        <input type="checkbox" className="size-5 accent-accent" checked={checked} onChange={() => onChange(vaccine.id)} />
        Sudah diberikan
      </label>
    </article>
  );
}

function GroupCard({ group, heading, estimate, checked, onToggle }: {
  group: ImmunizationGroup; heading: string; estimate?: string; checked: Record<string, boolean>; onToggle: (id: string) => void;
}) {
  return (
    <section className="space-y-3">
      <div>
        <h3 className="font-bold">{heading}</h3>
        {estimate && <p className="text-sm text-muted">Estimasi sekitar {estimate}</p>}
      </div>
      <div className="grid gap-2">
        {group.vaccines.map((vaccine) => <VaccineCard key={vaccine.id} vaccine={vaccine} checked={!!checked[vaccine.id]} onChange={onToggle} />)}
      </div>
    </section>
  );
}

export function ImmunizationTimeline() {
  const [birthDate, setBirthDate] = useState("");
  const [today, setToday] = useState("");
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState(false);

  useEffect(() => setToday(localToday()), []);
  const storageKey = birthDate ? `teman-buku-imunisasi:${birthDate}` : "";
  useEffect(() => {
    if (!storageKey) { setChecked({}); return; }
    try { setChecked(JSON.parse(localStorage.getItem(storageKey) || "{}")); } catch { setChecked({}); }
  }, [storageKey]);
  const age = useMemo(() => birthDate && today && birthDate <= today ? ageOnDate(birthDate, today) : null, [birthDate, today]);
  const groups = age ? getScheduleGroups(age.months) : [];
  const pastGroups = groups.filter((group) => group.status === "past");
  const dueGroup = groups.find((group) => group.status === "due");
  const nextGroup = groups.find((group) => group.status === "upcoming");
  const onToggle = (id: string) => setChecked((previous) => {
    const updated = { ...previous, [id]: !previous[id] };
    if (storageKey) localStorage.setItem(storageKey, JSON.stringify(updated));
    return updated;
  });

  async function copyDueSchedule() {
    const lines = dueGroup
      ? dueGroup.vaccines.map((vaccine) => `• ${vaccine.name} — ${vaccine.route}`)
      : ["• Tidak ada jadwal vaksin pada usia bulan ini."];
    const text = `🩺 Jadwal imunisasi si kecil\n${dueGroup ? `Usia ${dueGroup.month} bulan` : `Usia ${age?.months} bulan`}\n${lines.join("\n")}\n\nBawa Buku KIA saat ke Posyandu/Puskesmas.`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-border bg-card p-4">
        <label htmlFor="birth-date" className="block font-semibold">Tanggal lahir anak</label>
        <input id="birth-date" type="date" max={today || undefined} value={birthDate} onChange={(event) => setBirthDate(event.target.value)}
          className="mt-2 min-h-12 w-full rounded-xl border border-border bg-background px-3 text-base" />
        <p className="mt-2 text-xs leading-relaxed text-muted">Tanggal lahir hanya digunakan di perangkat ini dan tidak dikirim ke server.</p>
        {age && <p aria-live="polite" className="mt-3 rounded-xl bg-accent-soft p-3 font-semibold text-accent">Usia anak: {age.months} bulan{age.days > 0 ? ` ${age.days} hari` : ""}</p>}
        {birthDate && today && birthDate > today && <p className="mt-2 text-sm text-red-700">Pilih tanggal lahir hari ini atau sebelumnya.</p>}
      </section>

      {!age ? <div className="rounded-2xl border border-dashed border-border p-5 text-center text-sm text-muted">Pilih tanggal lahir untuk melihat jadwal imunisasi.</div> : (
        <>
          <button type="button" onClick={copyDueSchedule} className="min-h-12 w-full rounded-full bg-accent px-5 py-3 font-semibold text-white">
            {copied ? "Jadwal tersalin ✓" : "Salin Jadwal"}
          </button>
          {!dueGroup && <p className="-mt-4 text-center text-xs text-muted">Tidak ada vaksin terjadwal tepat di usia {age.months} bulan.</p>}
          {dueGroup && <div className="rounded-2xl border-2 border-accent bg-accent-soft p-4">
            <p className="mb-4 inline-flex rounded-full bg-accent px-3 py-1 text-xs font-bold text-white">JATUH TEMPO BULAN INI</p>
            <GroupCard group={dueGroup} heading={dueGroup.label} checked={checked} onToggle={onToggle} />
          </div>}
          {nextGroup && <GroupCard group={nextGroup} heading={`Jadwal berikutnya — ${nextGroup.label}`} estimate={prettyDate(addMonthsToIsoDate(birthDate, nextGroup.month))} checked={checked} onToggle={onToggle} />}
          {pastGroups.length > 0 && <section className="space-y-4">
            <h3 className="font-bold">Usia sebelumnya</h3>
            {pastGroups.map((group) => <GroupCard key={group.month} group={group} heading={group.label} checked={checked} onToggle={onToggle} />)}
          </section>}
          <aside className="rounded-2xl border border-border bg-card p-4 text-sm leading-relaxed text-muted">
            Bawa selalu Buku KIA saat berkunjung ke Posyandu atau Puskesmas. Jadwal dapat disesuaikan oleh dokter/bidan jika anak sakit atau lahir prematur.
          </aside>
        </>
      )}
      <p className="text-xs leading-relaxed text-muted">Jadwal ini merupakan panduan umum dan bukan pengganti konsultasi tenaga kesehatan. Konfirmasi jadwal anak dengan dokter atau bidan.</p>
    </div>
  );
}
