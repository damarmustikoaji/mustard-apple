---
title: Berat badan pakai koma hasilnya beda dengan pakai titik
labels: type:bug, triage
---
### Apa yang terjadi?
Saya isi berat badan anak saya pakai koma (seperti di Buku KIA), hasilnya bilang **berat badan kurang**. Waktu suami saya coba pakai titik, hasilnya **normal**. Jadi mana yang benar? Saya sempat panik.

### Langkah untuk mengulang
1. Buka /cek-pertumbuhan
2. Pilih Perempuan, tanggal lahir 2025-01-10, tanggal pengukuran 2026-01-10
3. Isi berat badan `7,5`
4. Klik "Cek sekarang" → hasil: *Berat badan kurang*
5. Ulangi dengan berat `7.5` → hasil: *Berat badan normal*

### Seharusnya bagaimana?
`7,5` dan `7.5` dianggap sama. Di Indonesia orang biasa menulis desimal pakai koma, dan keyboard angka di HP Android juga sering menampilkan koma.

### Perangkat dan browser
Android 13, Chrome
