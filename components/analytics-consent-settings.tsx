"use client";

export function AnalyticsConsentSettings() {
  const reset = () => {
    try {
      window.localStorage.removeItem("teman-buku-pink-analytics-consent-v1");
    } finally {
      window.dispatchEvent(new Event("analytics-consent-reset"));
    }
  };

  return (
    <button className="min-h-11 rounded-lg border border-border px-4 font-semibold" onClick={reset}>
      Ubah persetujuan analytics
    </button>
  );
}
