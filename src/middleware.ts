import { NextResponse, type NextRequest } from "next/server";
import { version } from "@/lib/env";

export async function middleware(request: NextRequest) {
  request.headers.set("x-json4u-version", version);
  const response = NextResponse.next({ request });
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/billing
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api/billing|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};