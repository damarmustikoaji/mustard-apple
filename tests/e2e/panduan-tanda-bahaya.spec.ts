import { expect, test } from "@playwright/test";

test("beranda menampilkan tiga fitur dan rujukan Buku KIA pada layar ponsel", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto("/");

  const features = page.getByRole("region", { name: "Fitur" });
  await expect(features.getByRole("link")).toHaveCount(3);
  await expect(features.getByRole("link", { name: /Cek Pertumbuhan/ })).toBeVisible();
  await expect(features.getByRole("link", { name: /Cek Perkembangan/ })).toBeVisible();
  await expect(features.getByRole("link", { name: /Jadwal Imunisasi/ })).toBeVisible();
  await expect(features.getByText(/Panduan tanda bahaya/i)).toHaveCount(0);
  await expect(
    page.getByText(
      "Khawatir dengan kondisi ibu atau anak? Lihat halaman tanda bahaya di Buku KIA Anda, atau segera hubungi 119 / puskesmas terdekat.",
    ),
  ).toBeVisible();
});

test("route panduan tanda bahaya mengarah kembali ke beranda saat fitur nonaktif", async ({ page }) => {
  await page.goto("/panduan-tanda-bahaya");
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole("heading", { name: "Panduan tanda bahaya" })).toHaveCount(0);
});
