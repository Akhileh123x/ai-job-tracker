// proxy.js
import { NextResponse } from "next/server";

export async function proxy(request) {
  // 1. Grab the BetterAuth session token directly from the cookie jar
  const sessionCookie = request.cookies.get("better-auth.session_token");
  const { pathname } = request.nextUrl;

  // 2. If trying to reach protected routes without being logged in -> send to login
  if (!sessionCookie && (pathname.startsWith("/dashboard") || pathname.startsWith("/applications"))) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 3. If already logged in and trying to access auth pages or the root path -> send to dashboard
  if (sessionCookie && (pathname === "/login" || pathname === "/register" || pathname === "/")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

// Ensure the matcher catches all relevant paths
export const config = {
  matcher: ["/", "/dashboard/:path*", "/applications/:path*", "/login", "/register"],
};