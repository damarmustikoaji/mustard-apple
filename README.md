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
