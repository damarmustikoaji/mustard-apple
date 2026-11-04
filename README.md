# ♡ Teman Buku Pink

Panduan pendamping Buku KIA (buku pink): cek pertumbuhan anak usia 0–5 tahun sesuai standar WHO, tanpa daftar dan tanpa menyimpan data anak.

> Bukan aplikasi resmi Kemenkes. Informasi bersifat umum dan tidak menggantikan pemeriksaan tenaga kesehatan.

Aplikasi ini dikerjakan oleh tim AI agent dari [cranberry](https://github.com/damarmustikoaji/cranberry). Semua tiket ada di **Issues** repo ini.

## Fitur

| Fitur | Status |
|---|---|
| Cek Pertumbuhan: BB/U, PB/U, TB/U | ✅ |
| Kurva, BB/PB & BB/TB, imunisasi, perkembangan, panduan | lihat Issues |

## Development

```bash
npm install
npm run dev          # http://localhost:3000
npm run lint
npm run typecheck
npm test             # unit test + test acuan WHO
npm run build && npm run test:e2e
```

## Analytics produk (GA4)

Pengiriman analytics mati secara default. Salin `.env.example` untuk konfigurasi lokal; analytics tetap tidak berjalan
di development/test/preview. Pada environment Production Vercel, pengelola harus mengisi
`NEXT_PUBLIC_GA_MEASUREMENT_ID` dan secara terpisah mengatur `NEXT_PUBLIC_GA_ENABLED=true` setelah
pemberitahuan/kebijakan privasi ditinjau dan diperbarui untuk GA4.
Persetujuan pengunjung diminta sebelum script Google dimuat dan dapat diubah melalui halaman `/privasi`.

Sebelum mengaktifkan flag production, nonaktifkan **Enhanced measurement** pada web stream GA4, termasuk page views
berbasis perubahan riwayat browser serta event scroll dan form, lalu verifikasi payload yang diterima. Kode mematikan
pageview otomatis GA dengan `send_page_view: false` serta mengirim URL dan referrer generik pada origin situs dan judul
“Teman Buku Pink” yang sama untuk setiap route. Path, query, fragment, judul aktual, input, dan data kesehatan tidak
menjadi parameter pageview. Tidak ada event fitur atau ID buatan aplikasi. GA4 dapat tetap mengumpulkan metadata teknis
(termasuk bahasa dan resolusi layar), pengenal browser/sesi bawaan, serta event otomatis GA4 (misalnya kunjungan
pertama, sesi, dan engagement). GA4 juga dapat menggunakan cookie; implementasi ini tidak menyatakan analytics anonim
atau bebas cookie. Persetujuan dapat ditolak atau diubah melalui `/privasi`.

Laporan hanya mendukung hitungan kunjungan agregat situs, bukan tren penggunaan fitur. Bila prasyarat kebijakan atau
pengaturan properti belum dipenuhi, biarkan `NEXT_PUBLIC_GA_ENABLED` tidak disetel atau `false`.

## Struktur

| Folder | Isi |
|---|---|
| `app/` | halaman dan API (`/api/health`, `/api/errors`) |
| `components/` | komponen UI |
| `lib/growth/` | logika murni: usia, z-score (metode LMS), kategori status |
| `lib/error-logger.ts` | kirim error browser ke `/api/errors` → tabel `error_events` |
| `data/who/` 🔒 | tabel LMS WHO Child Growth Standards |
| `content/medis/` 🔒 | isi panduan kesehatan |
| `tests/reference/` 🔒 | test acuan nilai WHO |
| `tests/e2e/` | Playwright (mobile + desktop) |
| `db/migrations/` | SQL tabel `error_events` untuk Neon |

🔒 = hanya boleh diubah manusia (lihat `.github/CODEOWNERS`).

## Menyambungkan ke agent

1. **Neon**: buat project gratis, jalankan `db/migrations/001_error_events.sql` di SQL Editor.
2. **Vercel**: import repo ini, isi env `DATABASE_URL`.
3. **Secrets repo** (Settings → Secrets and variables → Actions):
   - `BOT_TOKEN`: fine-grained PAT untuk repo ini (Issues, Pull requests, Contents: Read & Write)
   - `GEMINI_API_KEY`: dari Google AI Studio
   - `GROQ_API_KEY` (opsional), `DATABASE_URL`
4. **Variable repo**: `CRANBERRY_ENABLED` = `true`
5. Actions → **setup-repo** → `labels`, lalu `seed-issues` untuk membuat tiket uji coba.

## Sumber data

WHO Child Growth Standards (2006), tabel LMS bulanan 0–60 bulan, diadopsi Permenkes RI No. 2 Tahun 2020 tentang Standar Antropometri Anak.
