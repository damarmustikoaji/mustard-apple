import { describe, expect, it } from "vitest";
import { createSafePageView } from "@/lib/analytics";

describe("createSafePageView", () => {
  it("returns the same generic page metadata for any site URL", () => {
    const first = createSafePageView("https://mustard-apple.vercel.app/cek-pertumbuhan?nama=Anak#hasil");
    const second = createSafePageView("https://mustard-apple.vercel.app/jadwal-imunisasi");

    expect(first).toEqual({
      page_location: "https://mustard-apple.vercel.app/",
      page_title: "Teman Buku Pink",
      page_referrer: "https://mustard-apple.vercel.app/",
    });
    expect(second).toEqual(first);
    expect(JSON.stringify(first)).not.toMatch(/cek-pertumbuhan|jadwal-imunisasi|nama=Anak|hasil/);
  });
});
