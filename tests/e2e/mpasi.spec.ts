import { expect, test } from "@playwright/test";

test("catatan makanan dan checklist MPASI tersimpan setelah reload", async ({ page }) => {
  await page.goto("/mpasi");
  await page.getByLabel("Nama panggilan anak (opsional)").fill("Nana");
  await page.getByLabel("Nama makanan").fill("Alpukat");
  await page.getByLabel("Reaksi yang dicatat").selectOption("Ruam");
  await page.getByLabel("Catatan reaksi (opsional)").fill("Terlihat ruam kecil");
  await page.getByRole("button", { name: "Simpan catatan" }).click();
  await page.getByLabel("Kursi makan").check();
  await page.reload();

  await expect(page.getByRole("heading", { name: "Alpukat" })).toBeVisible();
  await expect(page.getByText("Terlihat ruam kecil")).toBeVisible();
  await expect(page.getByLabel("Kursi makan")).toBeChecked();
  await expect(page.getByText(/Catat dan tunjukkan ke tenaga kesehatan/)).toBeVisible();
});
