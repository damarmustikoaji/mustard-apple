import { describe, expect, it } from "vitest";
import { approvedDangerGuideSchema, dangerGuideContexts, getApprovedDangerGuide } from "./danger-guide";

describe("danger guide publication contract", () => {
  it("keeps every context unavailable until approved material is supplied", () => {
    for (const context of dangerGuideContexts) {
      expect(getApprovedDangerGuide(context)).toBeUndefined();
    }
  });

  it("accepts a test-only non-clinical sample with source and both approvals", () => {
    const sample = {
      context: "kehamilan",
      finalText: "Contoh teks non-klinis khusus pengujian.",
      references: [{ title: "Dokumen contoh", edition: "Edisi uji", date: "2026-01", section: "Bagian contoh" }],
      clinicalReviewerApproval: { approved: true, reviewer: "Reviewer uji", role: "Tenaga kesehatan (contoh)", date: "2026-01-01", note: "Persetujuan contoh untuk pengujian." },
      workspaceOwnerApproval: { approved: true, reviewer: "Pemilik uji", role: "Pemilik workspace (contoh)", date: "2026-01-02", note: "Persetujuan contoh untuk pengujian." },
    };

    expect(approvedDangerGuideSchema.safeParse(sample).success).toBe(true);
    expect(approvedDangerGuideSchema.safeParse({ ...sample, workspaceOwnerApproval: undefined }).success).toBe(false);
    expect(approvedDangerGuideSchema.safeParse({ ...sample, references: [] }).success).toBe(false);
  });
});
