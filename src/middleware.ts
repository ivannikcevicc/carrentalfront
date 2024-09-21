import { NextRequest, NextResponse } from "next/server";
import { getSession } from "./lib/auth";

export async function middleware(request: NextRequest) {
  const session = await getSession();

  // Check if the route requires authentication
  if (
    request.nextUrl.pathname.startsWith("/api/") ||
    request.nextUrl.pathname.startsWith("/dashboard")
  ) {
    if (!session) {
      // Redirect to login page if not authenticated
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Add the bearer token to the request headers
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("Authorization", `Bearer ${session.token}`);

    // Return the response with updated headers
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  // For non-protected routes, just pass through
  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*", "/dashboard/:path*"],
};
