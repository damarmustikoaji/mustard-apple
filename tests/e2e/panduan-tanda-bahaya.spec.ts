import { expect, test } from "@playwright/test";

test("alur tanpa materi medis menyediakan akses cepat dan status belum tersedia", async ({ page }) => {
  await page.goto("/panduan-tanda-bahaya");
  await expect(page.getByRole("heading", { name: "Butuh mencari pertolongan segera?" })).toBeVisible();
  await expect(page.getByText(/bukan diagnosis, bukan aplikasi resmi Kemenkes/).first()).toBeVisible();

  const requests: string[] = [];
  page.on("request", (request) => requests.push(request.url()));
  for (const context of ["Kehamilan", "Masa nifas", "Bayi atau anak"]) {
    const contextButton = page.getByRole("button", { name: new RegExp(context) });
    await expect(contextButton).toHaveAttribute("aria-pressed", "false");
    await contextButton.focus();
    await page.keyboard.press("Enter");
    await expect(contextButton).toHaveAttribute("aria-pressed", "true");
    await expect(contextButton).toHaveCSS("min-height", "56px");
    await expect(page.getByRole("heading", { name: `Panduan ${context.toLowerCase()} belum tersedia` })).toBeVisible();
    await expect(page.getByText(/tidak menampilkan pertanyaan skrining atau arahan klinis/)).toBeVisible();
  }

  expect(requests.filter((url) => new URL(url).pathname.startsWith("/api/"))).toEqual([]);
  expect(await page.evaluate(() => Object.keys(localStorage))).toEqual([]);
  expect(await page.evaluate(() => Object.keys(sessionStorage))).toEqual([]);
});
