import { ageGroups } from "./milestones";
import type { AgeGroup, DevelopmentResult } from "./types";

export function ageOnDate(birthDate: string, today: string) {
  const birth = new Date(`${birthDate}T00:00:00Z`);
  const current = new Date(`${today}T00:00:00Z`);
  if (!Number.isFinite(birth.getTime()) || birth > current) return null;
  let months = (current.getUTCFullYear() - birth.getUTCFullYear()) * 12 + current.getUTCMonth() - birth.getUTCMonth();
  if (current.getUTCDate() < birth.getUTCDate()) months--;
  const anchorMonth = new Date(Date.UTC(birth.getUTCFullYear(), birth.getUTCMonth() + months, 1));
  const lastDay = new Date(Date.UTC(anchorMonth.getUTCFullYear(), anchorMonth.getUTCMonth() + 1, 0)).getUTCDate();
  anchorMonth.setUTCDate(Math.min(birth.getUTCDate(), lastDay));
  const anchor = anchorMonth;
  const days = Math.floor((current.getTime() - anchor.getTime()) / 86400000);
  return { months, days, years: Math.floor(months / 12), remainingMonths: months % 12 };
}

export function getAgeGroup(months: number): AgeGroup | null {
  return ageGroups.find((group) => months >= group.minMonths && months <= group.maxMonths) ?? null;
}

export function getDevelopmentResult(checked: Record<string, boolean>, total: number): DevelopmentResult {
  const achieved = Object.values(checked).filter(Boolean).length;
  const percentage = total ? Math.round((achieved / total) * 100) : 0;
  const category = percentage >= 75 ? "Sesuai usia" : percentage >= 40 ? "Ada beberapa yang perlu diperhatikan" : "Perlu diperhatikan lebih lanjut";
  const advice = percentage >= 75 ? "Lanjutkan stimulasi dan ajak anak bermain seperti biasa." : percentage >= 40 ? "Bisa latih lebih sering area yang belum tercapai dengan kegiatan menyenangkan." : "Sebaiknya diskusikan dengan bidan atau dokter, terutama jika Bunda memiliki kekhawatiran.";
  return { achieved, total, percentage, category, advice };
}
