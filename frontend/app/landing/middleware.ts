import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;

  // Define paths that are considered public
  const isPublicPath =
    path === "/" || path === "/landing" || path.startsWith("/api/");

  // Get token from cookies
  const token = request.cookies.get("token")?.value || "";

  // If trying to access dashboard without token, redirect to landing
  if (path.startsWith("/dashboard") && !token) {
    return NextResponse.redirect(new URL("/landing", request.url));
  }

  // If already logged in and trying to access login, redirect to dashboard
  if (path === "/login" && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Redirect root to landing page
  if (path === "/") {
    return NextResponse.redirect(new URL("/landing", request.url));
  }

  return NextResponse.next();
}

// Configure which paths this middleware will run on
export const config = {
  matcher: [
    // Match all routes
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
