import { parseIsoDate } from "@/lib/growth/age";

const DAY_MS = 24 * 60 * 60 * 1000;
export const MAX_HAID_DAYS = 42 * 7;

function calendarDay(value: string): number | null {
  const date = parseIsoDate(value);
  return date ? Date.UTC(date.y, date.m - 1, date.d) / DAY_MS : null;
}

function isoFromDay(day: number): string {
  const date = new Date(day * DAY_MS);
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`;
}

export type PregnancyResult = {
  hpl: string;
  gestationalDays: number;
  weeks: number;
  days: number;
  trimester: 1 | 2 | 3;
};

export function calculatePregnancy(hpht: string, today: string): PregnancyResult | null {
  const hphtDay = calendarDay(hpht);
  const todayDay = calendarDay(today);
  if (hphtDay === null || todayDay === null) return null;

  const gestationalDays = todayDay - hphtDay;
  if (gestationalDays < 0 || gestationalDays > MAX_HAID_DAYS) return null;

  return {
    hpl: isoFromDay(hphtDay + 280),
    gestationalDays,
    weeks: Math.floor(gestationalDays / 7),
    days: gestationalDays % 7,
    trimester: gestationalDays < 14 * 7 ? 1 : gestationalDays < 28 * 7 ? 2 : 3,
  };
}

export function dateDaysAgo(today: string, days: number): string {
  const day = calendarDay(today);
  if (day === null) return "";
  return isoFromDay(day - days);
}

export function formatIndonesianDate(value: string): string {
  const date = parseIsoDate(value);
  if (!date) return "";
  return new Date(Date.UTC(date.y, date.m - 1, date.d)).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
