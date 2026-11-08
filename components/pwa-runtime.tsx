"use client";

import { useEffect, useState } from "react";

export function PwaRuntime() {
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    const update = () => setOffline(!navigator.onLine);
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    if ("serviceWorker" in navigator) {
      void navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => {});
    }
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);

  return offline ? (
    <p role="status" className="mb-2 rounded-lg bg-accent-soft px-3 py-2 text-sm font-medium text-foreground">
      Kamu sedang offline. Fitur yang sudah dibuka tetap dapat digunakan.
    </p>
  ) : null;
}
