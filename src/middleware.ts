import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";

const SESSION_COOKIE = "kama-session";

// Paths that are publicly accessible even under /admin
const PUBLIC_ADMIN_PATHS = ["/admin/login"];

async function adminProtection(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /admin/* routes
  if (!pathname.startsWith("/admin")) {
    return null;
  }

  // Allow login page through
  if (PUBLIC_ADMIN_PATHS.some((path) => pathname.startsWith(path))) {
    return null;
  }

  // Check for session cookie
  const sessionId = request.cookies.get(SESSION_COOKIE)?.value;

  if (!sessionId) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return null;
}

export default async function middleware(request: NextRequest) {
  // Handle i18n routing
  const handleI18n = createMiddleware(routing);

  // Check admin protection
  const adminRedirect = await adminProtection(request);
  if (adminRedirect) {
    return adminRedirect;
  }

  // Let next-intl handle the locale routing
  return handleI18n(request);
}

export const config = {
  matcher: [
    // Match all pathnames except for
    // - api routes
    // - _next (Next.js internals)
    // - static files
    "/((?!api|_next|.*\\..*).*)",
  ],
};