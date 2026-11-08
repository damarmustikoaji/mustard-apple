import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { DangerGuide } from "@/components/danger-guide";
import { FEATURE_TANDA_BAHAYA } from "@/lib/features";

export const metadata: Metadata = { title: "Panduan tanda bahaya | Teman Buku Pink" };

export default function DangerGuidePage() {
  if (!FEATURE_TANDA_BAHAYA) redirect("/");
  return <DangerGuide />;
}
