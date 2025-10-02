import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_COOKIE_KEY, PROTECTED_ROUTES } from "@/core/config/auth";

const isProtectedRoute = (pathname: string) =>
  PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

export function middleware(request: NextRequest) {
  const { nextUrl, cookies } = request;
  const pathname = nextUrl.pathname;

  if (!isProtectedRoute(pathname)) {
    return NextResponse.next();
  }

  const isAuthenticated = cookies.has(AUTH_COOKIE_KEY);

  if (isAuthenticated) {
    return NextResponse.next();
  }

  const redirectUrl = new URL("/onboarding", request.url);
  redirectUrl.searchParams.set("redirect", pathname);

  return NextResponse.redirect(redirectUrl);
}

export const config = {
  matcher: PROTECTED_ROUTES.map((route) => `${route}/:path*`),
};
