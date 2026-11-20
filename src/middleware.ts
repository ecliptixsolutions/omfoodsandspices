import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-om-path", request.nextUrl.pathname);
  const response = NextResponse.next({ request: { headers: requestHeaders } });
  const path = request.nextUrl.pathname;
  if (path.startsWith("/admin") || (path.startsWith("/api/") && !path.startsWith("/api/media/")) || request.nextUrl.searchParams.get("preview") === "1") {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
