import Link from "next/link";

const features = [
  { title: "Kalkulator HPL", desc: "Hitung perkiraan tanggal lahir dan usia kehamilan dari HPHT.", href: "/kalkulator-hpl" },
  { title: "Cek Pertumbuhan", desc: "Berat dan tinggi anak sesuai usianya, berdasarkan standar WHO.", href: "/cek-pertumbuhan" },
  { title: "Cek Perkembangan", desc: "Kemampuan yang biasanya sudah dicapai anak di setiap usia.", href: "/cek-perkembangan" },
  { title: "Jadwal Imunisasi", desc: "Imunisasi apa saja dan kapan, dihitung dari tanggal lahir.", href: "/jadwal-imunisasi" },
  { title: "Panduan tanda bahaya", desc: "Langkah mencari bantuan untuk kehamilan, nifas, dan bayi atau anak.", href: "/panduan-tanda-bahaya" },
];

export default function Home() {
  return (
    <div className="space-y-8">
      <section className="pt-6">
        <h1 className="text-3xl leading-tight font-extrabold text-balance">
          Teman membaca <span className="text-accent">buku pink</span>, di genggaman.
        </h1>
        <p className="mt-3 text-muted">
          Cek apakah pertumbuhan si kecil sesuai usianya. Tanpa daftar, dan data anak tidak pernah dikirim ke server.
        </p>
        <Link
          href="/cek-pertumbuhan"
          className="mt-6 inline-block rounded-full bg-accent px-6 py-3 font-semibold text-white shadow-sm"
        >
          Cek Pertumbuhan →
        </Link>
      </section>

      <section aria-label="Fitur" className="grid gap-3">
        {features.map((f) =>
          f.href ? (
            <Link key={f.title} href={f.href} className="rounded-2xl border border-border bg-card p-4 hover:border-accent">
              <h2 className="font-semibold">{f.title}</h2>
              <p className="text-sm text-muted">{f.desc}</p>
            </Link>
          ) : null,
        )}
      </section>
    </div>
  );
}
