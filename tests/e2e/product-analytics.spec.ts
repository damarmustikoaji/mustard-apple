import { expect, test } from "@playwright/test";

test.skip(process.env.NEXT_PUBLIC_GA_ENABLED !== "true", "Requires a build with the analytics gate enabled.");

test("sends only generic page metadata after consent and across route navigation", async ({ page }) => {
  const tagRequests: string[] = [];
  await page.route("https://www.googletagmanager.com/gtag/js**", async (route) => {
    tagRequests.push(route.request().url());
    await route.fulfill({ status: 200, contentType: "application/javascript", body: "" });
  });

  await page.goto("/?nama=contoh-anak#hasil");
  await expect(page.getByRole("button", { name: "Izinkan analytics" })).toBeVisible();
  expect(tagRequests).toHaveLength(0);

  await page.getByRole("button", { name: "Izinkan analytics" }).click();
  await expect.poll(async () => page.evaluate(() => window.dataLayer?.filter((entry) => entry[0] === "event").length)).toBe(1);
  await page.getByRole("link", { name: /Cek Pertumbuhan/ }).first().click();
  await expect(page).toHaveURL(/\/cek-pertumbuhan$/);
  await expect.poll(async () => page.evaluate(() => window.dataLayer?.filter((entry) => entry[0] === "event").length)).toBe(2);

  const pageViews = await page.evaluate(() =>
    (window.dataLayer ?? [])
      .filter((entry) => entry[0] === "event" && entry[1] === "page_view")
      .map((entry) => entry[2]),
  );
  const tagConfig = await page.evaluate(() =>
    window.dataLayer?.find((entry) => entry[0] === "config")?.[2],
  );
  const origin = new URL(page.url()).origin;
  expect(tagConfig).toMatchObject({
    send_page_view: false,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    page_location: `${origin}/`,
    page_title: "Teman Buku Pink",
    page_referrer: `${origin}/`,
  });
  const eventNames = await page.evaluate(() =>
    (window.dataLayer ?? []).filter((entry) => entry[0] === "event").map((entry) => entry[1]),
  );
  expect(eventNames).toEqual(["page_view", "page_view"]);
  expect(pageViews).toEqual([
    {
      page_location: `${origin}/`,
      page_title: "Teman Buku Pink",
      page_referrer: `${origin}/`,
    },
    {
      page_location: `${origin}/`,
      page_title: "Teman Buku Pink",
      page_referrer: `${origin}/`,
    },
  ]);
  expect(JSON.stringify(pageViews)).not.toMatch(/cek-pertumbuhan|nama=contoh-anak|hasil/);
});

test("keeps navigation usable when the Google tag request fails", async ({ page }) => {
  await page.route("https://www.googletagmanager.com/gtag/js**", (route) => route.abort());
  await page.goto("/");
  await page.getByRole("button", { name: "Izinkan analytics" }).click();
  await page.getByRole("link", { name: /Cek Pertumbuhan/ }).first().click();
  await expect(page).toHaveURL(/\/cek-pertumbuhan$/);
  await expect(page.getByRole("heading", { name: "Cek Pertumbuhan" })).toBeVisible();
});
