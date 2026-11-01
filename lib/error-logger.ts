"use client";

let installed = false;
let sentThisPage = 0;
const MAX_PER_PAGE = 5;

export function reportError(error: unknown) {
  if (sentThisPage >= MAX_PER_PAGE) return;
  sentThisPage += 1;
  const err = error instanceof Error ? error : new Error(String(error));
  // Only technical details: never include form values (child data stays in the browser).
  const payload = JSON.stringify({
    message: err.message.slice(0, 500),
    stack: err.stack?.slice(0, 4000) ?? null,
    path: window.location.pathname,
  });
  const queued = navigator.sendBeacon?.("/api/errors", new Blob([payload], { type: "application/json" }));
  if (!queued) fetch("/api/errors", { method: "POST", body: payload, keepalive: true }).catch(() => {});
}

export function installErrorLogger() {
  if (installed || typeof window === "undefined") return;
  installed = true;
  window.addEventListener("error", (e) => reportError(e.error ?? e.message));
  window.addEventListener("unhandledrejection", (e) => reportError(e.reason));
}
