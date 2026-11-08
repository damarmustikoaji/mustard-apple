import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import Link from "next/link";
import { ErrorLoggerInit } from "@/components/error-logger-init";
import { ProductAnalytics } from "@/components/product-analytics";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({ variable: "--font-jakarta", subsets: ["latin"] });
const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const productAnalyticsEnabled =
  process.env.NODE_ENV === "production" &&
  process.env.VERCEL_ENV === "production" &&
  process.env.NEXT_PUBLIC_GA_ENABLED === "true" &&
  Boolean(gaMeasurementId);

export const metadata: Metadata = {
  title: "Teman Buku Pink",
  description: "Panduan pendamping Buku KIA: cek pertumbuhan anak sesuai standar WHO, tanpa daftar dan tanpa menyimpan data.",
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#d6336c" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body className={`${jakarta.variable} font-sans antialiased`}>
        <ErrorLoggerInit />
        <ProductAnalytics enabled={productAnalyticsEnabled} measurementId={gaMeasurementId} />
        <div className="mx-auto flex min-h-dvh max-w-xl flex-col px-4">
          <header className="flex items-center justify-between py-4">
            <Link href="/" className="flex items-center gap-2 font-bold">
              <span aria-hidden className="grid size-8 place-items-center rounded-lg bg-accent text-white">
                ♡
              </span>
              Teman Buku Pink
            </Link>
          </header>
          <main className="flex-1 pb-10">{children}</main>
          <footer className="border-t border-border py-6 text-sm leading-relaxed text-muted">
            Teman Buku Pink adalah panduan pendamping Buku KIA, <strong>bukan aplikasi resmi Kemenkes</strong>. Informasi
            di sini bersifat umum dan tidak menggantikan pemeriksaan tenaga kesehatan. Bawa selalu Buku KIA saat ke
            posyandu atau fasilitas kesehatan. Khawatir dengan kondisi ibu atau anak? Lihat halaman tanda bahaya di Buku
            KIA Anda, atau segera hubungi 119 / puskesmas terdekat.
          </footer>
        </div>
      </body>
    </html>
  );
}
