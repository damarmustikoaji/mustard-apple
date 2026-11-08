"use client";

import { useState } from "react";
import { dangerGuideContexts, getApprovedDangerGuide, type DangerGuideContext } from "@/lib/danger-guide";

const groups: { id: DangerGuideContext; title: string; description: string }[] = [
  { id: dangerGuideContexts[0], title: "Kehamilan", description: "Saya sedang hamil" },
  { id: dangerGuideContexts[1], title: "Masa nifas", description: "Saya dalam masa setelah melahirkan" },
  { id: dangerGuideContexts[2], title: "Bayi atau anak", description: "Saya mencari bantuan untuk bayi atau anak" },
];

const disclaimer = "Panduan ini bukan diagnosis, bukan aplikasi resmi Kemenkes, dan tidak menggantikan pemeriksaan tenaga kesehatan.";

export function DangerGuide() {
  const [selected, setSelected] = useState<string | null>(null);
  const selectedGroup = groups.find((group) => group.id === selected);
  const approvedGuide = selectedGroup ? getApprovedDangerGuide(selectedGroup.id) : undefined;

  return (
    <div className="space-y-6 pt-4">
      <header>
        <h1 className="text-2xl font-extrabold">Panduan tanda bahaya</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Pilih konteks untuk melihat ketersediaan panduan. Kamu tidak perlu mengisi skrining untuk mencari bantuan.
        </p>
      </header>

      <section aria-labelledby="bantuan-segera" className="rounded-2xl border-2 border-accent bg-accent-soft p-4">
        <h2 id="bantuan-segera" className="text-lg font-bold">Butuh mencari pertolongan segera?</h2>
        <p className="mt-2 text-sm leading-relaxed">
          Panduan tindakan darurat belum tersedia. Hubungi tenaga kesehatan atau fasilitas kesehatan terdekat untuk mendapatkan bantuan.
        </p>
        <a href="#konten-belum-tersedia" className="mt-4 inline-flex min-h-11 items-center rounded-xl bg-accent px-4 font-semibold text-white">
          Lihat pilihan bantuan
        </a>
      </section>

      <p className="rounded-xl border border-border bg-card p-4 text-sm leading-relaxed" role="note">{disclaimer}</p>

      <section aria-labelledby="pilih-konteks">
        <h2 id="pilih-konteks" className="text-lg font-bold">Pilih konteks</h2>
        <div className="mt-3 grid gap-3">
          {groups.map((group) => (
            <button
              key={group.id}
              type="button"
              aria-pressed={selected === group.id}
              onClick={() => setSelected(group.id)}
              className="min-h-14 rounded-2xl border border-border bg-card p-4 text-left hover:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <span className="block font-semibold">{group.title}</span>
              <span className="mt-1 block text-sm text-muted">{group.description}</span>
            </button>
          ))}
        </div>
      </section>

      <section id="konten-belum-tersedia" aria-live="polite" aria-atomic="true" className="scroll-mt-4 rounded-2xl border border-border bg-card p-4">
        {approvedGuide ? (
          <>
            <h2 className="font-bold">Panduan {selectedGroup?.title.toLowerCase()}</h2>
            <p className="mt-2 whitespace-pre-line text-sm leading-relaxed">{approvedGuide.finalText}</p>
            <div className="mt-4 border-t border-border pt-3 text-xs leading-relaxed text-muted">
              <h3 className="font-semibold">Sumber dan persetujuan</h3>
              <ul className="mt-1 list-inside list-disc">
                {approvedGuide.references.map((reference, index) => (
                  <li key={`${reference.title}-${index}`}>{reference.title}, {reference.edition}, {reference.date}, bagian {reference.section}.</li>
                ))}
              </ul>
              <p className="mt-2">Ditinjau {approvedGuide.clinicalReviewerApproval.role} ({approvedGuide.clinicalReviewerApproval.reviewer}), {approvedGuide.clinicalReviewerApproval.date}.</p>
              <p>Disetujui pemilik workspace ({approvedGuide.workspaceOwnerApproval.reviewer}), {approvedGuide.workspaceOwnerApproval.date}.</p>
            </div>
          </>
        ) : (
          <>
            <h2 className="font-bold">{selectedGroup ? `Panduan ${selectedGroup.title.toLowerCase()} belum tersedia` : "Panduan belum tersedia"}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Materi untuk konteks ini belum tersedia dan disetujui. Kami tidak menampilkan pertanyaan skrining atau arahan klinis.
              Untuk mendapatkan bantuan, hubungi tenaga kesehatan atau fasilitas kesehatan terdekat.
            </p>
          </>
        )}
        <p className="mt-3 border-t border-border pt-3 text-xs leading-relaxed text-muted">{disclaimer}</p>
      </section>
    </div>
  );
}
