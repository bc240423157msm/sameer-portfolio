import { NextResponse } from "next/server";
import { COOKIE_NAME, createSession, verifyCredentials } from "@/lib/auth";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { getUserRecord } from "@/lib/users";
import { createPendingLogin, sendEmailOtp } from "@/lib/twofactor";

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const limit = await rateLimit(`login:${ip}`, 10, 15 * 60 * 1000);
    if (!limit.success) {
      return NextResponse.json(
        { error: "Too many login attempts. Please try again in a few minutes." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { username, password } = body as {
      username?: string;
      password?: string;
    };

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password required" },
        { status: 400 }
      );
    }

    const user = await verifyCredentials(username, password);
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const record = await getUserRecord(user.username);
    const method = record?.twoFactor.method ?? "none";

    // No 2FA required for this account — log in immediately, same as before.
    if (method === "none") {
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
    }

    // 2FA required — don't issue a session yet. Hand back a short-lived
    // pending token the client uses to complete the second step.
    const pendingToken = await createPendingLogin(user.username, user.role);
    const totpReady = Boolean(record?.twoFactor.totpVerified && record?.twoFactor.totpSecret);

    const availableMethods: ("email" | "totp")[] = [];
    if (method === "email" || method === "both") availableMethods.push("email");
    if (method === "totp" || method === "both") availableMethods.push("totp");

    // If email is an available method, send the code right away so it's
    // waiting in the inbox by the time the user reaches the code screen.
    if (availableMethods.includes("email") && record?.email) {
      await sendEmailOtp(user.username, record.email);
    }

    return NextResponse.json({
      requires2FA: true,
      pendingToken,
      availableMethods,
      totpSetupRequired: availableMethods.includes("totp") && !totpReady,
      hasEmailOnFile: Boolean(record?.email),
    });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
