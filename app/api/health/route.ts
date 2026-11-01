export const dynamic = "force-dynamic";

export function GET() {
  return Response.json({
    status: "ok",
    release: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? "local",
  });
}
