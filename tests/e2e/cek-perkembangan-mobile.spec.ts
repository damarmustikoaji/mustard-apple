import { expect, test } from "@playwright/test";

test("ringkasan sticky tetap terlihat dan ikut berubah saat checklist di-scroll pada layar sempit", async ({ page }) => {
  for (const width of [320, 375, 430]) {
    await page.setViewportSize({ width, height: 780 });
    await page.addInitScript(() => localStorage.clear());
    await page.goto("/cek-perkembangan");
    await page.getByLabel("Tanggal lahir anak").fill("2022-01-01");

    const summary = page.getByTestId("sticky-development-summary");
    await expect(summary).toContainText("0 dari 8 milestone");
    await expect(summary).toContainText("0%");
    await expect(summary).toContainText("Perlu diperhatikan lebih lanjut");

    const firstMilestone = page.getByRole("checkbox").first();
    await firstMilestone.check();
    await expect(summary).toContainText("1 dari 8 milestone");
    await expect(summary).toContainText("13%");

    const lastMilestone = page.getByRole("checkbox").last();
    await lastMilestone.scrollIntoViewIfNeeded();
    await expect(lastMilestone).toBeInViewport();
    await expect(summary).toBeInViewport();
    await expect(summary).toContainText("1 dari 8 milestone");
    const summaryBox = await summary.boundingBox();
    const lastMilestoneBox = await lastMilestone.boundingBox();
    expect(summaryBox).not.toBeNull();
    expect(lastMilestoneBox).not.toBeNull();
    expect(summaryBox!.y).toBeGreaterThanOrEqual(0);
    expect(summaryBox!.y + summaryBox!.height).toBeLessThanOrEqual(lastMilestoneBox!.y);

    await lastMilestone.check();
    await expect(summary).toContainText("2 dari 8 milestone");
    await expect(summary).toContainText("25%");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy();
  }
});
