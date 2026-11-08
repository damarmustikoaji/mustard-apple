"use client";

import { useState } from "react";
import { todayIso } from "@/lib/growth/age";
import { calculatePregnancy, dateDaysAgo, formatIndonesianDate } from "@/lib/pregnancy/hpl";

const inputClass = "mt-1 w-full min-h-12 rounded-xl border border-border bg-card px-3 py-2.5 outline-none focus:border-accent";

export function HplCalculator() {
  const today = todayIso();
  const [hpht, setHpht] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState<ReturnType<typeof calculatePregnancy>>(null);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const calculation = calculatePregnancy(hpht, today);
    setResult(calculation);
    if (!hpht) setError("Masukkan hari pertama haid terakhir.");
    else if (hpht > today) setError("HPHT tidak boleh berada di masa depan.");
    else if (!calculation) setError("Tanggal HPHT tidak valid atau sudah lebih dari 42 minggu lalu.");
    else setError("");
  }

  return (
    <div className="space-y-5">
      <form onSubmit={onSubmit} noValidate className="space-y-4 rounded-2xl border border-border bg-card p-4">
        <label className="block text-sm font-medium" htmlFor="hpht">
          Hari pertama haid terakhir (HPHT)
          <input
            id="hpht"
            type="date"
            value={hpht}
            min={dateDaysAgo(today, 294)}
            max={today}
            onChange={(event) => setHpht(event.target.value)}
            className={inputClass}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? "hpht-error" : "hpht-help"}
            required
          />
        </label>
        <p id="hpht-help" className="text-xs text-muted">Pilih tanggal kalender dari hari pertama haid terakhir, maksimal 42 minggu lalu.</p>
        {error && <p id="hpht-error" role="alert" className="rounded-xl bg-rose-100 px-3 py-2 text-sm text-rose-800 dark:bg-rose-950 dark:text-rose-300">{error}</p>}
        <button type="submit" className="min-h-12 w-full rounded-full bg-accent px-5 py-3 font-semibold text-white">
          Hitung HPL
        </button>
      </form>

      {result && !error && (
        <section aria-live="polite" aria-label="Hasil kalkulator HPL" className="space-y-3">
          <article className="rounded-2xl border border-accent/30 bg-accent-soft p-4">
            <h2 className="text-sm font-semibold text-muted">Hari perkiraan lahir (HPL)</h2>
            <p className="mt-1 text-2xl font-extrabold text-accent">{formatIndonesianDate(result.hpl)}</p>
          </article>
          <div className="grid grid-cols-2 gap-3">
            <article className="rounded-2xl border border-border bg-card p-4">
              <h2 className="text-xs font-medium text-muted">Usia kehamilan</h2>
              <p className="mt-1 font-bold">{result.weeks} minggu {result.days} hari</p>
            </article>
            <article className="rounded-2xl border border-border bg-card p-4">
              <h2 className="text-xs font-medium text-muted">Trimester</h2>
              <p className="mt-1 font-bold">Ke-{result.trimester}</p>
            </article>
          </div>
          <p className="rounded-xl border border-border bg-card p-3 text-sm leading-relaxed text-muted">
            Perkiraan berdasarkan rumus umum. HPL dari pemeriksaan USG/bidan lebih akurat.
          </p>
        </section>
      )}
    </div>
  );
}
