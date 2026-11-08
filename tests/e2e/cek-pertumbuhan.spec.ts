import { expect, test } from "@playwright/test";

test("beranda menampilkan disclaimer dan tautan ke Cek Pertumbuhan", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("bukan aplikasi resmi Kemenkes")).toBeVisible();
  await page.getByRole("link", { name: "Cek Pertumbuhan →" }).click();
  await expect(page.getByRole("heading", { name: "Cek Pertumbuhan" })).toBeVisible();
});

test("menghitung status anak dengan berat dan panjang normal", async ({ page }) => {
  await page.goto("/cek-pertumbuhan");
  await page.getByText("Laki-laki").click();
  await page.getByLabel("Tanggal lahir").fill("2025-01-10");
  await page.getByLabel("Tanggal pengukuran").fill("2026-01-10");
  await page.getByLabel("Berat badan (kg)").fill("9.6");
  await page.getByLabel(/Panjang\/tinggi/).fill("75.7");
  await page.getByRole("button", { name: "Cek sekarang" }).click();

  const hasil = page.getByRole("region", { name: "Hasil" });
  await expect(hasil.getByRole("heading", { name: "Hasil untuk usia 1 tahun 0 bulan" })).toBeVisible();
  await expect(hasil.getByText("Berat badan normal")).toBeVisible();
  await expect(hasil.getByText("Normal", { exact: true })).toBeVisible();
});

test("tombol salin hasil menyalin teks ringkas tanpa tanggal lahir", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/cek-pertumbuhan");
  await page.getByText("Perempuan").click();
  await page.getByLabel("Tanggal lahir").fill("2025-01-10");
  await page.getByLabel("Tanggal pengukuran").fill("2026-01-10");
  await page.getByLabel("Berat badan (kg)").fill("7,5");
  await page.getByLabel(/Panjang\/tinggi/).fill("72");
  await page.getByRole("button", { name: "Cek sekarang" }).click();

  const hasil = page.getByRole("region", { name: "Hasil" });
  await hasil.getByRole("button", { name: "Salin hasil" }).click();
  await expect(hasil.getByRole("button", { name: "Tersalin!" })).toBeVisible();

  const copied = await page.evaluate(() => navigator.clipboard.readText());
  expect(copied).toContain("Hasil cek pertumbuhan (Teman Buku Pink)");
  expect(copied).toContain("Usia: 1 tahun 0 bulan, perempuan");
  expect(copied).toContain("BB/U: 7,5 kg,");
  expect(copied).toContain("Ini bukan diagnosis. Konsultasikan ke tenaga kesehatan.");
  expect(copied).not.toContain("2025-01-10");
});

test("menolak tanggal lahir setelah tanggal pengukuran", async ({ page }) => {
  await page.goto("/cek-pertumbuhan");
  await page.getByLabel("Tanggal lahir").fill("2026-02-01");
  await page.getByLabel("Tanggal pengukuran").fill("2026-01-01");
  await page.getByLabel("Berat badan (kg)").fill("8");
  await page.getByRole("button", { name: "Cek sekarang" }).click();
  // Next.js also renders its own (empty) route announcer with role="alert".
  await expect(page.getByRole("alert").filter({ hasText: "Tanggal lahir tidak boleh" })).toBeVisible();
});

test("menyimpan pengukuran secara opt-in dan menampilkannya kembali setelah reload", async ({ page }) => {
  await page.goto("/cek-pertumbuhan");
  await page.getByLabel("Tanggal lahir").fill("2025-01-10");
  await page.getByLabel("Tanggal pengukuran").fill("2026-01-10");
  await page.getByLabel("Berat badan (kg)").fill("8.5");
  await page.getByRole("button", { name: "Cek sekarang" }).click();
  page.once("dialog", (dialog) => dialog.accept("Rani"));
  await page.getByRole("button", { name: "Simpan ke riwayat di HP ini" }).click();
  await expect(page.getByRole("heading", { name: "Rani" })).toBeVisible();
  await page.reload();
  await expect(page.getByRole("heading", { name: "Rani" })).toBeVisible();
  await expect(page.getByText("2026-01-10 · 8,5 kg")).toBeVisible();
});

test("health check", async ({ request }) => {
  const res = await request.get("/api/health");
  expect(res.ok()).toBeTruthy();
  expect(await res.json()).toMatchObject({ status: "ok" });
});
