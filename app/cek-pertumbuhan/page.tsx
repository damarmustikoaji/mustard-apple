import type { Metadata } from "next";
import { GrowthForm } from "@/components/growth-form";

export const metadata: Metadata = { title: "Cek Pertumbuhan · Teman Buku Pink" };

export default function CekPertumbuhanPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold">Cek Pertumbuhan</h1>
        <p className="mt-1 text-sm text-muted">
          Untuk anak usia 0–5 tahun. Dihitung di perangkatmu memakai standar pertumbuhan WHO, yang juga dipakai
          Permenkes No. 2 Tahun 2020.
        </p>
      </div>
      <GrowthForm />
    </div>
  );
}
