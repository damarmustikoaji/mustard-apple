"use client";

import { useEffect } from "react";
import { reportError } from "@/lib/error-logger";

export default function ErrorPage({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => reportError(error), [error]);

  return (
    <div className="rounded-2xl border border-border bg-card p-6 text-center">
      <h1 className="text-lg font-bold">Maaf, ada yang tidak beres</h1>
      <p className="mt-2 text-sm text-muted">Kesalahan ini sudah tercatat otomatis. Silakan coba lagi.</p>
      <button onClick={reset} className="mt-4 rounded-full bg-accent px-5 py-2 text-sm font-semibold text-white">
        Coba lagi
      </button>
    </div>
  );
}
