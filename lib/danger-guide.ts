import { z } from "zod";

export const dangerGuideContexts = ["kehamilan", "nifas", "anak"] as const;
export type DangerGuideContext = (typeof dangerGuideContexts)[number];

const approvalSchema = z.object({
  approved: z.literal(true),
  reviewer: z.string().trim().min(1),
  role: z.string().trim().min(1),
  date: z.string().date(),
  note: z.string().trim().min(1),
});

export const approvedDangerGuideSchema = z.object({
  context: z.enum(dangerGuideContexts),
  finalText: z.string().trim().min(1),
  references: z.array(z.object({
    title: z.string().trim().min(1),
    edition: z.string().trim().min(1),
    date: z.string().trim().min(1),
    section: z.string().trim().min(1),
  })).min(1),
  clinicalReviewerApproval: approvalSchema,
  workspaceOwnerApproval: approvalSchema,
});

export type ApprovedDangerGuide = z.infer<typeof approvedDangerGuideSchema>;

// Add only final materials with both approvals. Keep this empty until those
// materials are supplied and approved; references alone are not publishable.
const guideMaterials: unknown[] = [];

export function getApprovedDangerGuide(context: DangerGuideContext): ApprovedDangerGuide | undefined {
  const candidate = guideMaterials.find((material) =>
    typeof material === "object" && material !== null && "context" in material && material.context === context,
  );
  const parsed = approvedDangerGuideSchema.safeParse(candidate);
  return parsed.success ? parsed.data : undefined;
}
