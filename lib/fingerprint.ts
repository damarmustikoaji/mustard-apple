import { createHash } from "node:crypto";

/** Group errors by message + first stack frame, ignoring line/column noise from minified bundles. */
export function fingerprint(message: string, stack?: string | null): string {
  const frame = stack?.split("\n").find((l) => l.trim().startsWith("at ")) ?? "";
  const normalized = `${message}|${frame.replace(/:\d+:\d+/g, "").trim()}`;
  return createHash("sha256").update(normalized).digest("hex").slice(0, 16);
}
