import { MpasiTracker } from "@/components/mpasi-tracker";

export const metadata = { title: "MPASI | Teman Buku Pink", description: "Catat makanan yang dikenalkan dan persiapan MPASI di perangkat Anda." };

export default function MpasiPage() {
  return <div className="space-y-5 pt-4">
    <header>
      <h1 className="text-2xl font-extrabold">Catatan MPASI</h1>
      <p className="mt-2 text-sm leading-relaxed text-muted">Catat makanan yang sudah dicoba dan reaksi anak. Semua catatan tersimpan di perangkat ini saja.</p>
    </header>
    <MpasiTracker />
  </div>;
}
