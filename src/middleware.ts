import { NextRequest, NextResponse } from "next/server";
import { isIPBlocked } from "@/lib/security/ipBlocklist";

export function middleware(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0] ||
    request.headers.get("x-real-ip") ||
    request.ip ||
    "unknown";

  // Check IP blocklist
  const blocked = isIPBlocked(ip);
  if (blocked) {
    return NextResponse.json(
      { error: "Access denied", reason: blocked.reason },
      { status: 403 },
    );
  }

  // Add security headers that can be dynamically set
  const response = NextResponse.next();
  // These are also defined in next.config.ts but adding here for early protection if needed

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
