import { AnalyticsConsentSettings } from "@/components/analytics-consent-settings";

export default function PrivacyPage() {
  return (
    <article className="space-y-4">
      <h1 className="text-2xl font-bold">Informasi privasi analytics</h1>
      <p>
        Jika analytics diaktifkan dan Anda memberi persetujuan, Teman Buku Pink menggunakan Google Analytics 4 (GA4)
        untuk menghitung kunjungan situs secara agregat.
      </p>
      <h2 className="text-lg font-semibold">Data yang dikirim</h2>
      <p>
        Pageview manual mengirim URL generik pada origin situs, judul “Teman Buku Pink”, dan referrer generik pada
        origin yang sama. Path halaman, query, fragment, judul aktual, isian formulir, data anak/orang tua, serta
        jawaban atau aktivitas kesehatan tidak dikirim sebagai parameter pageview. Aplikasi tidak membuat event
        produk atau ID sendiri. GA4 juga dapat mengumpulkan metadata teknis seperti bahasa dan resolusi layar, serta
        membuat pengenal browser/sesi dan event otomatis seperti kunjungan pertama, sesi, atau engagement. Ini mengikuti
        perilaku bawaan GA4 dan bukan ID yang dibuat aplikasi.
      </p>
      <h2 className="text-lg font-semibold">Penyedia dan batasan</h2>
      <p>
        Penyedia analytics adalah Google. GA4 dapat memproses pengenal dan menggunakan cookie sesuai konfigurasi
        properti dan kebijakan Google; situs ini tidak mengklaim data anonim atau bebas cookie. Laporan yang dimaksud
        berfokus pada hitungan kunjungan situs agregat, bukan penggunaan per fitur. Pengumpulan analytics hanya tersedia di
        production, setelah fitur diaktifkan oleh pengelola dan setelah persetujuan Anda.
      </p>
      <p>
        Jangan memasukkan informasi kesehatan atau data pribadi pada halaman mana pun. Informasi ini perlu ditinjau
        dan dilengkapi oleh pengelola sebelum analytics diaktifkan untuk pengunjung production.
      </p>
      <AnalyticsConsentSettings />
    </article>
  );
}
