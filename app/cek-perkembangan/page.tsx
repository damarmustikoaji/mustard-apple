import { DevelopmentChecklist } from "@/components/development-checklist";

export const metadata = { title: "Cek Perkembangan | Teman Buku Pink" };

export default function CekPerkembanganPage() {
  return <div className="space-y-5 pt-4">
    <header>
      <h1 className="text-2xl font-extrabold">Cek Perkembangan</h1>
      <p className="mt-2 text-sm leading-relaxed text-muted">Amati kemampuan si kecil dengan checklist sederhana sesuai kelompok usianya.</p>
    </header>
    <DevelopmentChecklist />
  </div>;
}
