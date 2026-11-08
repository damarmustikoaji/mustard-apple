"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { createSafePageView } from "@/lib/analytics";

const consentKey = "teman-buku-pink-analytics-consent-v1";

declare global {
  interface Window {
    dataLayer?: unknown[][];
    gtag?: (...args: unknown[]) => void;
  }
}

export function ProductAnalytics({
  enabled,
  measurementId,
}: {
  enabled: boolean;
  measurementId?: string;
}) {
  const pathname = usePathname();
  const [consent, setConsent] = useState<"unknown" | "granted" | "denied">("unknown");
  const [loaded, setLoaded] = useState(false);
  const lastPage = useRef<string | null>(null);

  useEffect(() => {
    if (!enabled) return;
    try {
      const saved = window.localStorage.getItem(consentKey);
      if (saved === "granted" || saved === "denied") setConsent(saved);
    } catch {
      // Analytics stays off when browser storage is unavailable.
    }
  }, [enabled]);

  useEffect(() => {
    const resetConsent = () => setConsent("unknown");
    window.addEventListener("analytics-consent-reset", resetConsent);
    return () => window.removeEventListener("analytics-consent-reset", resetConsent);
  }, []);

  useEffect(() => {
    if (!enabled || !measurementId) return;
    Reflect.set(window, `ga-disable-${measurementId}`, consent !== "granted");
  }, [consent, enabled, measurementId]);

  useEffect(() => {
    if (!enabled || consent !== "granted" || !measurementId) return;
    window.dataLayer = window.dataLayer ?? [];
    window.gtag = window.gtag ?? ((...args: unknown[]) => window.dataLayer?.push(args));
    window.gtag("js", new Date());
    window.gtag("config", measurementId, {
      send_page_view: false,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      ...createSafePageView(window.location.origin),
    });
    lastPage.current = null;
  }, [consent, enabled, measurementId]);

  const sendPageView = useCallback(() => {
    if (!pathname || !window.gtag || lastPage.current === pathname) return;
    lastPage.current = pathname;
    window.gtag("event", "page_view", createSafePageView(window.location.origin));
  }, [pathname]);

  useEffect(() => {
    if (enabled && consent === "granted" && loaded) sendPageView();
  }, [consent, enabled, loaded, sendPageView]);

  const saveConsent = (value: "granted" | "denied") => {
    try {
      window.localStorage.setItem(consentKey, value);
      if (measurementId) {
        Reflect.set(window, `ga-disable-${measurementId}`, value !== "granted");
      }
      setConsent(value);
    } catch {
      // Do not enable tracking if consent cannot be saved reliably.
    }
  };

  if (!enabled) return null;

  return (
    <>
      {consent === "granted" && measurementId ? (
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`}
          strategy="afterInteractive"
          onReady={() => setLoaded(true)}
        />
      ) : null}
      {consent === "unknown" ? (
        <aside
          aria-label="Persetujuan analitik"
          className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-xl rounded-xl border border-border bg-card p-4 shadow-lg shadow-black/10"
        >
          <p className="text-sm leading-relaxed text-foreground">
            Kami menggunakan Google Analytics untuk menghitung kunjungan situs secara agregat. Alamat halaman dan judul
            dikirim dalam bentuk generik; data yang Anda masukkan tidak dikirim. Google dapat menggunakan cookie dan
            memproses data sesuai kebijakannya.
          </p>
          <div className="mt-3 flex items-center justify-between gap-3 text-sm">
            <a className="underline" href="/privasi">Baca informasi privasi</a>
            <div className="flex gap-2">
              <button className="min-h-11 rounded-lg border border-border px-3 font-semibold" onClick={() => saveConsent("denied")}>
                Tolak
              </button>
              <button className="min-h-11 rounded-lg bg-accent px-4 font-semibold text-white" onClick={() => saveConsent("granted")}>
                Izinkan analytics
              </button>
            </div>
          </div>
        </aside>
      ) : null}
    </>
  );
}
