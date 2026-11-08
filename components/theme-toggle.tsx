"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

const STORAGE_KEY = "theme";

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === "system") {
    root.removeAttribute("data-theme");
  } else {
    root.setAttribute("data-theme", theme);
  }
}

function SunIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className="size-[18px]">
      <path d="M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6M8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0M8 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13m8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5M3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8m10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.414a.5.5 0 1 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0m-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0m9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707M4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707L4.464 3.757a.5.5 0 0 1 0 .708" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className="size-[18px]">
      <path d="M6 .278a.77.77 0 0 1 .08.858 7.2 7.2 0 0 0-.878 3.46c0 4.021 3.278 7.299 7.3 7.299a7.2 7.2 0 0 0 3.458-.878.77.77 0 0 1 1.093.838A8.9 8.9 0 0 1 8.088 16c-4.966 0-9-4.034-9-9 0-3.516 2.013-6.557 4.954-8.042.272-.136.584-.07.787.14A.77.77 0 0 1 6 .278" />
    </svg>
  );
}

function DisplayIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className="size-[18px]">
      <path d="M1.5 0A1.5 1.5 0 0 0 0 1.5v7A1.5 1.5 0 0 0 1.5 10H6v1.146c0 .325-.078.5-.247.675-.228.233-.624.433-1.04.433H4v1h8v-1h-.713c-.416 0-.812-.2-1.04-.433-.169-.175-.247-.35-.247-.675V10h4.5A1.5 1.5 0 0 0 16 8.5v-7A1.5 1.5 0 0 0 14.5 0zM1.5 1h13a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-6a.5.5 0 0 1 .5-.5" />
    </svg>
  );
}

const THEME_META: Record<Theme, { icon: () => React.JSX.Element; label: string }> = {
  system: { icon: DisplayIcon, label: "Sistem" },
  light: { icon: SunIcon, label: "Terang" },
  dark: { icon: MoonIcon, label: "Gelap" },
};

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("system");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as Theme | null;
    setTheme(stored ?? "system");
    setMounted(true);
  }, []);

  function cycle() {
    const order: Theme[] = ["system", "light", "dark"];
    const next = order[(order.indexOf(theme) + 1) % order.length];
    setTheme(next);
    applyTheme(next);
    try {
      if (next === "system") {
        window.localStorage.removeItem(STORAGE_KEY);
      } else {
        window.localStorage.setItem(STORAGE_KEY, next);
      }
    } catch {
      // localStorage tidak tersedia; preferensi hanya berlaku untuk sesi ini.
    }
  }

  const current = THEME_META[mounted ? theme : "system"];
  const Icon = current.icon;

  return (
    <button
      type="button"
      onClick={cycle}
      aria-label={`Tema: ${current.label}. Klik untuk ganti.`}
      title={`Tema: ${current.label}`}
      suppressHydrationWarning
      className="grid size-9 place-items-center rounded-lg border border-border bg-card text-foreground transition-colors hover:border-accent hover:text-accent"
    >
      <Icon />
    </button>
  );
}
