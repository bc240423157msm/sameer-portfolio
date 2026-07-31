import { NextResponse } from "next/server";
import {
  COOKIE_NAME,
  createSession,
  verifyPending2FAToken,
} from "@/lib/auth";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { getUserTotpSecret } from "@/lib/users";
import { verifyTotpCode } from "@/lib/totp";

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    // Fixed: Added await keyword before rateLimit
    const limit = await rateLimit(`2fa:${ip}`, 10, 15 * 60 * 1000);
    if (!limit.success) {
      return NextResponse.json(
        { error: "Too many attempts. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { pendingToken, code } = body as {
      pendingToken?: string;
      code?: string;
    };

    if (!pendingToken || !code) {
      return NextResponse.json(
        { error: "Verification code required" },
        { status: 400 }
      );
    }

    const user = await verifyPending2FAToken(pendingToken);
    if (!user) {
      return NextResponse.json(
        { error: "Session expired. Please log in again." },
        { status: 401 }
      );
    }

    const secret = await getUserTotpSecret(user.username);
    if (!secret || !verifyTotpCode(secret, code)) {
      return NextResponse.json({ error: "Invalid verification code" }, { status: 401 });
    }

    const token = await createSession(user);
    const response = NextResponse.json({
      success: true,
      role: user.role,
      redirect: user.role === "admin" ? "/portal/admin" : "/portal/seo",
    });

    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}