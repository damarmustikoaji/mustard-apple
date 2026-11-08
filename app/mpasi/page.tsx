import { MpasiFinder } from "@/components/mpasi-finder";

export const metadata = { title: "Resep MPASI | Teman Buku Pink" };

export default function MpasiPage() {
  return (
    <div className="space-y-5 pt-4">
      <header>
        <h1 className="text-2xl font-extrabold">Resep MPASI</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">Ide resep makanan pendamping ASI sesuai tahap usia anak, lengkap dengan bahan dan tekstur yang disarankan.</p>
      </header>
      <MpasiFinder />
    </div>
  );
}
