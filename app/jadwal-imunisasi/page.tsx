import { ImmunizationTimeline } from "@/components/immunization-timeline";

export const metadata = { title: "Jadwal Imunisasi | Teman Buku Pink" };

export default function JadwalImunisasiPage() {
  return (
    <div className="space-y-6 pt-4">
      <header>
        <h1 className="text-2xl font-extrabold">Jadwal Imunisasi</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">Lihat jadwal imunisasi rutin anak berdasarkan tanggal lahir dan tandai vaksin yang sudah diterima.</p>
      </header>
      <ImmunizationTimeline />
    </div>
  );
}
