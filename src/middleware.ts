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

  const url = request.nextUrl.clone();
  const { pathname, searchParams } = url;

  // If we're not on the /cars route and there are search params
  if (pathname !== "/cars" && searchParams.toString()) {
    url.pathname = "/cars";
    return NextResponse.redirect(url);
  }

  // If we're leaving the /cars route, clear the search params
  if (
    pathname !== "/cars" &&
    request.headers.get("referer")?.includes("/cars")
  ) {
    searchParams.forEach((_, key) => searchParams.delete(key));
    return NextResponse.rewrite(url);
  }

  // For non-protected routes, just pass through
  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*", "/dashboard/:path*"],
};
