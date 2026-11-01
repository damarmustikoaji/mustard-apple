export type Vaccine = {
  id: string;
  name: string;
  fullName: string;
  benefit: string;
  route: "Tetes mulut" | "Suntik";
};

export type ImmunizationGroup = { month: number; label: string; vaccines: Vaccine[] };

