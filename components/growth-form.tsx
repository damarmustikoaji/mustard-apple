"use client";

import { useState } from "react";
import { ageInMonths, parseIsoDate, todayIso } from "@/lib/growth/age";
import { assessGrowth, type IndicatorResult, type Measurement, type Sex } from "@/lib/growth";
import type { Tone } from "@/lib/growth/classify";
import { ageLabel, formatResultText } from "@/lib/format-result";
import { copyText } from "@/lib/clipboard";
import { GrowthChart } from "@/components/growth-chart";

const toneClass: Record<Tone, string> = {
  good: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
  info: "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300",
  warning: "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300",
  danger: "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300",
};

const fmt = (n: number) => n.toLocaleString("id-ID", { maximumFractionDigits: 2 });

function parseNumber(value: string): number {
  return parseFloat(value.trim().replace(",", "."));
}

export function GrowthForm() {
  const [sex, setSex] = useState<Sex>("female");
  const [birthDate, setBirthDate] = useState("");
  const [measureDate, setMeasureDate] = useState(todayIso());
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [measurement, setMeasurement] = useState<Measurement>("lying");
  const [error, setError] = useState<string | null>(null);
  const [errorField, setErrorField] = useState<"dates" | "weight" | "height" | null>(null);
  const [result, setResult] = useState<{ ageMonths: number; items: IndicatorResult[] } | null>(null);
  const [copied, setCopied] = useState(false);

  function fail(field: "dates" | "weight" | "height", message: string) {
    setErrorField(field);
    setError(message);
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setErrorField(null);
    setResult(null);

    if (!parseIsoDate(birthDate) || !parseIsoDate(measureDate)) return fail("dates", "Isi tanggal lahir dan tanggal pengukuran.");
    if (birthDate > measureDate) return fail("dates", "Tanggal lahir tidak boleh setelah tanggal pengukuran.");

    const weightKg = parseNumber(weight);
    if (Number.isNaN(weightKg) || weightKg <= 0 || weightKg > 40) return fail("weight", "Isi berat badan dalam kg, misalnya 8.5.");

    let heightCm: number | undefined;
    if (height.trim()) {
      heightCm = parseNumber(height);
      if (Number.isNaN(heightCm) || heightCm < 40 || heightCm > 130)
        return fail("height", "Isi panjang/tinggi badan dalam cm, misalnya 72.");
    }

    const months = ageInMonths(birthDate, measureDate);
    if (months < 0 || months > 60) return fail("dates", "Standar WHO pada aplikasi ini hanya mencakup usia 0–5 tahun (60 bulan).");

    setCopied(false);
    setResult({ ageMonths: months, items: assessGrowth({ sex, ageMonths: months, weightKg, heightCm, measurement }) });
  }

  async function onCopy() {
    if (!result) return;
    await copyText(formatResultText({ ageMonths: result.ageMonths, sex, items: result.items }));
    setCopied(true);
  }

  const input = "mt-1 w-full rounded-xl border border-border bg-card px-3 py-2.5 outline-none focus:border-accent";

  return (
    <div className="space-y-6">
      <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-border bg-card p-4" noValidate>
        <fieldset>
          <legend className="text-sm font-medium">Jenis kelamin</legend>
          <div className="mt-1 grid grid-cols-2 gap-2">
            {(["female", "male"] as const).map((s) => (
              <label
                key={s}
                className={`cursor-pointer rounded-xl border px-3 py-2.5 text-center text-sm ${sex === s ? "border-accent bg-accent-soft font-semibold text-accent" : "border-border"}`}
              >
                <input type="radio" name="sex" value={s} checked={sex === s} onChange={() => setSex(s)} className="sr-only" />
                {s === "female" ? "Perempuan" : "Laki-laki"}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="grid grid-cols-2 gap-3">
          <label className="text-sm font-medium">
            Tanggal lahir
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className={input}
              aria-invalid={errorField === "dates"}
              aria-describedby={errorField === "dates" ? "form-error" : undefined}
            />
          </label>
          <label className="text-sm font-medium">
            Tanggal pengukuran
            <input
              type="date"
              value={measureDate}
              onChange={(e) => setMeasureDate(e.target.value)}
              className={input}
              aria-invalid={errorField === "dates"}
              aria-describedby={errorField === "dates" ? "form-error" : undefined}
            />
          </label>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <label className="text-sm font-medium">
            Berat badan (kg)
            <input
              type="text"
              inputMode="decimal"
              placeholder="8.5"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className={input}
              aria-invalid={errorField === "weight"}
              aria-describedby={errorField === "weight" ? "form-error" : undefined}
            />
          </label>
          <label className="text-sm font-medium">
            Panjang/tinggi (cm) <span className="font-normal text-muted">opsional</span>
            <input
              type="text"
              inputMode="decimal"
              placeholder="72"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className={input}
              aria-invalid={errorField === "height"}
              aria-describedby={errorField === "height" ? "form-error" : undefined}
            />
          </label>
        </div>

        <label className="block text-sm font-medium">
          Cara mengukur
          <select value={measurement} onChange={(e) => setMeasurement(e.target.value as Measurement)} className={input}>
            <option value="lying">Berbaring (panjang badan)</option>
            <option value="standing">Berdiri (tinggi badan)</option>
          </select>
        </label>

        {error && (
          <p
            id="form-error"
            role="alert"
            className="rounded-xl bg-rose-100 px-3 py-2 text-sm text-rose-800 dark:bg-rose-950 dark:text-rose-300"
          >
            {error}
          </p>
        )}

        <button type="submit" className="w-full rounded-full bg-accent py-3 font-semibold text-white">
          Cek sekarang
        </button>
      </form>

      {result && (
        <section aria-label="Hasil" className="space-y-3">
          <h2 className="font-bold">Hasil untuk usia {ageLabel(result.ageMonths)}</h2>
          {result.items.map((r) => (
            <article key={r.key} className="rounded-2xl border border-border bg-card p-4">
              <h3 className="text-sm text-muted">{r.name}</h3>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <span className="text-xl font-bold">
                  {fmt(r.value)} {r.unit}
                </span>
                <span className={`rounded-full px-2.5 py-0.5 text-sm font-semibold ${toneClass[r.status.tone]}`}>
                  {r.status.label}
                </span>
              </div>
              <p className="mt-2 text-sm text-muted">
                Z-score {fmt(r.z)}. Kisaran normal untuk usia ini: {fmt(r.normalRange.min)}–{fmt(r.normalRange.max)} {r.unit}.
              </p>
            </article>
          ))}
          <GrowthChart sex={sex} ageMonths={result.ageMonths} items={result.items} />
          {result.items.some((r) => r.status.tone !== "good") && (
            <p className="rounded-xl bg-accent-soft p-3 text-sm">
              Ada hasil di luar kisaran normal. Ini bukan diagnosis. Konsultasikan dengan bidan, dokter, atau petugas
              posyandu, dan bawa Buku KIA saat berkunjung.
            </p>
          )}
          <button
            type="button"
            onClick={onCopy}
            className="w-full rounded-full border border-border py-2.5 text-sm font-semibold"
          >
            {copied ? "Tersalin!" : "Salin hasil"}
          </button>
        </section>
      )}
    </div>
  );
}
