import type { Metadata } from "next";
import { HplCalculator } from "@/components/hpl-calculator";

export const metadata: Metadata = {
  title: "Kalkulator HPL: Hitung Hari Perkiraan Lahir | Teman Buku Pink",
  description: "Hitung HPL, usia kehamilan, dan trimester berdasarkan hari pertama haid terakhir (HPHT). Kalkulasi dilakukan di browser.",
};

export default function KalkulatorHplPage() {
  return (
    <div className="space-y-5 pt-4">
      <header>
        <h1 className="text-2xl font-extrabold">Kalkulator HPL</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Hitung hari perkiraan lahir dan usia kehamilan berdasarkan hari pertama haid terakhir.
        </p>
      </header>
      <HplCalculator />
    </div>
  );
}
