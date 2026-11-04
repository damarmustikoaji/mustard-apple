import type { Metadata } from "next";
import { DangerGuide } from "@/components/danger-guide";

export const metadata: Metadata = { title: "Panduan tanda bahaya | Teman Buku Pink" };

export default function DangerGuidePage() {
  return <DangerGuide />;
}
