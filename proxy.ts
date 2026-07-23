import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "portal_session";

async function getUserFromRequest(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;

  const secret = process.env.AUTH_SECRET;
  if (!secret) return null;

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(secret)
    );
    if (
      typeof payload.username === "string" &&
      (payload.role === "admin" || payload.role === "seo")
    ) {
      return { username: payload.username, role: payload.role as "admin" | "seo" };
    }
  } catch {
    return null;
  }
  return null;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const user = await getUserFromRequest(request);

  if (pathname.startsWith("/portal/admin")) {
    if (!user || user.role !== "admin") {
      const loginUrl = new URL("/portal", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (pathname.startsWith("/portal/seo")) {
    if (!user || (user.role !== "seo" && user.role !== "admin")) {
      const loginUrl = new URL("/portal", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (pathname === "/portal" && user) {
    const dest =
      user.role === "admin" ? "/portal/admin" : "/portal/seo";
    return NextResponse.redirect(new URL(dest, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/portal", "/portal/admin/:path*", "/portal/seo/:path*"],
};
