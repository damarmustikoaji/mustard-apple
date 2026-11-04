export type SafePageView = {
  page_location: string;
  page_title: "Teman Buku Pink";
  page_referrer: string;
};

/** Build the complete, route-independent page_view payload sent to GA4. */
export function createSafePageView(origin: string): SafePageView {
  const canonicalOrigin = new URL(origin).origin;
  return {
    page_location: `${canonicalOrigin}/`,
    page_title: "Teman Buku Pink",
    page_referrer: `${canonicalOrigin}/`,
  };
}
