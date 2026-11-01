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

test("menolak tanggal lahir setelah tanggal pengukuran", async ({ page }) => {
  await page.goto("/cek-pertumbuhan");
  await page.getByLabel("Tanggal lahir").fill("2026-02-01");
  await page.getByLabel("Tanggal pengukuran").fill("2026-01-01");
  await page.getByLabel("Berat badan (kg)").fill("8");
  await page.getByRole("button", { name: "Cek sekarang" }).click();
  // Next.js also renders its own (empty) route announcer with role="alert".
  await expect(page.getByRole("alert").filter({ hasText: "Tanggal lahir tidak boleh" })).toBeVisible();
});

test("health check", async ({ request }) => {
  const res = await request.get("/api/health");
  expect(res.ok()).toBeTruthy();
  expect(await res.json()).toMatchObject({ status: "ok" });
});
