import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Get the pathname of the request (e.g. /, /dashboard, etc.)
  const path = request.nextUrl.pathname;

  // Define paths that are considered public (no authentication required)
  const isPublicPath =
    path === "/" ||
    path === "/login" ||
    path === "/signup" ||
    path.startsWith("/api/");

  // Get the token from cookies
  const token = request.cookies.get("token")?.value || "";

  // Redirect logic
  if (!isPublicPath && !token) {
    // If the path requires authentication and no token exists, redirect to login
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isPublicPath && token) {
    // Optional: If already logged in and trying to access login/signup,
    // redirect to dashboard
    if (path === "/login" || path === "/signup") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

// Configure which paths this middleware will run on
export const config = {
  matcher: ["/", "/login", "/signup", "/dashboard/:path*"],
};
