import { neon } from "@neondatabase/serverless";
import { z } from "zod";
import { fingerprint } from "@/lib/fingerprint";

const Body = z.object({
  message: z.string().min(1).max(500),
  stack: z.string().max(4000).nullable().optional(),
  path: z.string().max(300).optional(),
});

// Best-effort in-memory sliding window per IP. Resets on cold start / new instance,
// but that's fine here: the goal is capping accidental/abusive flooding, not hard security.
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 20;
const hits = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_PER_WINDOW;
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? req.headers.get("x-real-ip") ?? "unknown";
  if (isRateLimited(ip)) return new Response(null, { status: 429 });

  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return new Response(null, { status: 400 });

  const { message, stack, path } = parsed.data;
  const release = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? "local";
  const userAgent = req.headers.get("user-agent")?.slice(0, 300) ?? null;
  const fp = fingerprint(message, stack);

  if (!process.env.DATABASE_URL) {
    console.error("[client-error]", { fp, message, path, release });
    return new Response(null, { status: 204 });
  }

  const sql = neon(process.env.DATABASE_URL);
  await sql`
    insert into error_events (fingerprint, message, stack, path, release, user_agent)
    values (${fp}, ${message}, ${stack ?? null}, ${path ?? null}, ${release}, ${userAgent})`;
  return new Response(null, { status: 204 });
}
