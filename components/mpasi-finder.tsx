"use client";

import { useEffect, useState } from "react";
import { ageOnDate, getRecipesForStage, getStageForMonths } from "@/lib/mpasi/utils";
import { AffiliateProducts } from "@/components/affiliate-products";

const todayIso = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
};

export function MpasiFinder() {
  const [birthDate, setBirthDate] = useState("");
  const [today, setToday] = useState("");
  useEffect(() => setToday(todayIso()), []);

  const age = birthDate && today && birthDate <= today ? ageOnDate(birthDate, today) : null;
  const stage = age ? getStageForMonths(age.months) : null;
  const recipes = stage ? getRecipesForStage(stage.id) : [];

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-border bg-card p-4">
        <label htmlFor="mpasi-birth-date" className="block font-semibold">
          Tanggal lahir anak
        </label>
        <input
          id="mpasi-birth-date"
          type="date"
          max={today || undefined}
          value={birthDate}
          onChange={(event) => setBirthDate(event.target.value)}
          className="mt-2 min-h-12 w-full rounded-xl border border-border bg-background px-3 text-base"
        />
        <p className="mt-2 text-xs leading-relaxed text-muted">Tanggal lahir hanya dipakai di perangkat ini untuk menyaring resep, tidak dikirim ke server.</p>
        {age && (
          <p aria-live="polite" className="mt-3 rounded-xl bg-accent-soft p-3 font-semibold text-accent">
            Usia anak: {age.years > 0 ? `${age.years} tahun${age.remainingMonths ? ` ${age.remainingMonths} bulan` : ""}` : `${age.months} bulan`}
            {age.days ? ` ${age.days} hari` : ""}
          </p>
        )}
        {birthDate && today && birthDate > today && <p className="mt-2 text-sm text-red-700">Pilih tanggal lahir hari ini atau sebelumnya.</p>}
      </section>

      {!age ? (
        <div className="rounded-2xl border border-dashed border-border p-5 text-center text-sm text-muted">Pilih tanggal lahir untuk melihat resep sesuai usia.</div>
      ) : !stage ? (
        <div className="rounded-2xl border border-dashed border-border p-5 text-center text-sm text-muted">MPASI umumnya mulai diperkenalkan setelah usia 6 bulan, bersamaan dengan ASI/sufor yang tetap dilanjutkan.</div>
      ) : (
        <>
          <section className="rounded-2xl border border-accent bg-accent-soft p-4">
            <p className="text-sm font-semibold">Tahap {stage.label}</p>
            <p className="mt-1 text-sm leading-relaxed">{stage.textureNote}</p>
          </section>

          <div className="space-y-3">
            {recipes.map((recipe) => (
              <details key={recipe.id} className="rounded-2xl border border-border bg-card p-4">
                <summary className="cursor-pointer list-none font-semibold">
                  <span className="mr-2">{recipe.name}</span>
                  <span className="text-xs font-normal text-muted">{recipe.texture} · {recipe.prepMinutes} menit</span>
                </summary>
                <div className="mt-3 space-y-3 text-sm leading-relaxed">
                  {recipe.allergens.length > 0 && (
                    <p className="rounded-lg bg-accent-soft px-3 py-2 text-xs font-semibold text-accent">Mengandung alergen umum: {recipe.allergens.join(", ")}</p>
                  )}
                  <div>
                    <p className="font-semibold">Bahan</p>
                    <ul className="mt-1 list-disc space-y-1 pl-5">
                      {recipe.ingredients.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold">Langkah</p>
                    <ol className="mt-1 list-decimal space-y-1 pl-5">
                      {recipe.steps.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ol>
                  </div>
                  {recipe.tip && <p className="text-xs text-muted">Tips: {recipe.tip}</p>}
                </div>
              </details>
            ))}
          </div>

          <AffiliateProducts />
        </>
      )}

      <aside className="rounded-2xl border border-border bg-card p-4 text-sm leading-relaxed">
        <strong>Catatan penting:</strong> Perkenalkan satu bahan baru pada satu waktu untuk memantau reaksi alergi, dampingi anak selama makan untuk mencegah tersedak, dan hindari madu sebelum usia 1 tahun. Resep ini bersifat umum dan tidak menggantikan saran ahli gizi atau dokter anak, terutama bila ada riwayat alergi atau kondisi medis tertentu.
      </aside>
    </div>
  );
}
