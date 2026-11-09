import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get("postarc_session_token")?.value
  const role = request.cookies.get("postarc_session_role")?.value

  const isAuthRoute = pathname === "/"
  const isMailRoute = pathname.startsWith("/mail")
  const isAdminRoute = pathname.startsWith("/admin")
  const isDashboardRoute = pathname.startsWith("/dashboard")
  const isOnboardingRoute = pathname.startsWith("/onboarding")

  // Allow static files, api routes, and onboarding wizard
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/favicon.ico") ||
    isOnboardingRoute
  ) {
    return NextResponse.next()
  }

  // 1. Unauthenticated users trying to access protected routes -> redirect to login
  if (!token && (isMailRoute || isAdminRoute || isDashboardRoute)) {
    const loginUrl = new URL("/", request.url)
    loginUrl.searchParams.set("returnUrl", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // 2. Authenticated user visiting login page -> redirect to /mail or /admin
  if (token && isAuthRoute) {
    const target = role === "admin" ? "/admin" : "/mail"
    return NextResponse.redirect(new URL(target, request.url))
  }

  // 3. Authenticated non-admin trying to access /admin -> redirect to /mail
  if (token && isAdminRoute && role !== "admin") {
    return NextResponse.redirect(new URL("/mail", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
}
