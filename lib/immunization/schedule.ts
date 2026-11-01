import type { ImmunizationGroup, Vaccine } from "./types";

const vaccine = (id: string, name: string, fullName: string, benefit: string, route: Vaccine["route"]): Vaccine =>
  ({ id, name, fullName, benefit, route });

export const immunizationSchedule: ImmunizationGroup[] = [
  { month: 0, label: "Baru lahir", vaccines: [vaccine("hb0", "HB-0", "Hepatitis B dosis 0", "Mencegah penularan hepatitis B dari ibu ke bayi.", "Suntik")] },
  { month: 1, label: "Usia 1 bulan", vaccines: [
    vaccine("bcg", "BCG", "Bacillus Calmette–Guérin", "Mencegah tuberkulosis berat pada anak.", "Suntik"),
    vaccine("polio1", "Polio 1 (bOPV 1)", "Vaksin polio tetes dosis 1", "Mencegah kelumpuhan akibat virus polio.", "Tetes mulut"),
  ] },
  { month: 2, label: "Usia 2 bulan", vaccines: [
    vaccine("dpt1", "DPT-HB-Hib 1", "Difteri, pertusis, tetanus, hepatitis B, dan Hib dosis 1", "Melindungi dari lima penyakit termasuk batuk rejan dan meningitis Hib.", "Suntik"),
    vaccine("polio2", "Polio 2 (bOPV 2)", "Vaksin polio tetes dosis 2", "Mencegah kelumpuhan akibat virus polio.", "Tetes mulut"),
    vaccine("pcv1", "PCV 1", "Vaksin pneumokokus dosis 1", "Mencegah infeksi pneumokokus seperti pneumonia.", "Suntik"),
    vaccine("rv1", "Rotavirus 1 (RV 1)", "Vaksin rotavirus dosis 1", "Mencegah diare berat akibat rotavirus.", "Tetes mulut"),
  ] },
  { month: 3, label: "Usia 3 bulan", vaccines: [
    vaccine("dpt2", "DPT-HB-Hib 2", "DPT-HB-Hib dosis 2", "Melanjutkan perlindungan dari difteri, pertusis, tetanus, hepatitis B, dan Hib.", "Suntik"),
    vaccine("polio3", "Polio 3 (bOPV 3)", "Vaksin polio tetes dosis 3", "Mencegah kelumpuhan akibat virus polio.", "Tetes mulut"),
    vaccine("pcv2", "PCV 2", "Vaksin pneumokokus dosis 2", "Melanjutkan perlindungan dari infeksi pneumokokus.", "Suntik"),
    vaccine("rv2", "Rotavirus 2 (RV 2)", "Vaksin rotavirus dosis 2", "Melanjutkan perlindungan dari diare berat akibat rotavirus.", "Tetes mulut"),
  ] },
  { month: 4, label: "Usia 4 bulan", vaccines: [
    vaccine("dpt3", "DPT-HB-Hib 3", "DPT-HB-Hib dosis 3", "Melengkapi seri dasar perlindungan DPT-HB-Hib.", "Suntik"),
    vaccine("polio4", "Polio 4 (bOPV 4)", "Vaksin polio tetes dosis 4", "Melengkapi perlindungan polio melalui tetes.", "Tetes mulut"),
    vaccine("ipv1", "IPV 1", "Vaksin polio suntik dosis 1", "Melengkapi kekebalan terhadap polio melalui suntikan.", "Suntik"),
    vaccine("rv3", "Rotavirus 3 (RV 3)", "Vaksin rotavirus dosis 3", "Melengkapi perlindungan dari diare berat akibat rotavirus.", "Tetes mulut"),
  ] },
  { month: 9, label: "Usia 9 bulan", vaccines: [
    vaccine("mr1", "Campak-Rubella 1 (MR 1)", "Vaksin campak dan rubella dosis 1", "Mencegah campak dan rubella.", "Suntik"),
    vaccine("ipv2", "IPV 2", "Vaksin polio suntik dosis 2", "Melengkapi kekebalan terhadap polio melalui suntikan.", "Suntik"),
  ] },
  { month: 12, label: "Usia 12 bulan", vaccines: [vaccine("pcv3", "PCV 3", "Vaksin pneumokokus dosis 3", "Menguatkan perlindungan dari infeksi pneumokokus.", "Suntik")] },
  { month: 18, label: "Usia 18 bulan", vaccines: [
    vaccine("dpt4", "DPT-HB-Hib 4 (Booster)", "Booster DPT-HB-Hib", "Menguatkan kembali perlindungan DPT-HB-Hib.", "Suntik"),
    vaccine("mr2", "Campak-Rubella 2 (Booster)", "Vaksin campak dan rubella dosis 2", "Menguatkan perlindungan terhadap campak dan rubella.", "Suntik"),
  ] },
];

export type ScheduleStatus = "past" | "due" | "upcoming";

export function getGroupStatus(month: number, ageInCompletedMonths: number): ScheduleStatus {
  if (month < ageInCompletedMonths) return "past";
  if (month === ageInCompletedMonths) return "due";
  return "upcoming";
}

export function getScheduleGroups(ageInCompletedMonths: number) {
  return immunizationSchedule.map((group) => ({ ...group, status: getGroupStatus(group.month, ageInCompletedMonths) }));
}

/** Adds calendar months while clamping dates such as the 31st to the target month's last day. */
export function addMonthsToIsoDate(date: string, months: number): string {
  const [year, month, day] = date.split("-").map(Number);
  const target = new Date(Date.UTC(year, month - 1 + months, 1));
  const lastDay = new Date(Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0)).getUTCDate();
  target.setUTCDate(Math.min(day, lastDay));
  return `${target.getUTCFullYear()}-${String(target.getUTCMonth() + 1).padStart(2, "0")}-${String(target.getUTCDate()).padStart(2, "0")}`;
}

export function ageOnDate(birthDate: string, today: string) {
  let months = 0;
  while (months < 1200 && addMonthsToIsoDate(birthDate, months + 1) <= today) months += 1;
  const anniversary = addMonthsToIsoDate(birthDate, months);
  const days = Math.floor((Date.parse(`${today}T00:00:00Z`) - Date.parse(`${anniversary}T00:00:00Z`)) / 86400000);
  return { months, days };
}
