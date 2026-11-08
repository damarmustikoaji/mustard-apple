import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Mencatat setiap request (halaman + API) ke Vercel Runtime Logs.
// Hanya method dan path -- tanpa query string, body, atau data pribadi lain.
export function middleware(request: NextRequest) {
  console.log(`[request] ${request.method} ${request.nextUrl.pathname}`);
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon.svg|icon-maskable.svg|sw.js|manifest.webmanifest).*)"],
};
