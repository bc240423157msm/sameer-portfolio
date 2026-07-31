import { NextResponse } from "next/server";
import { COOKIE_NAME, createSession } from "@/lib/auth";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { saveTotpSecret, getUserRecord } from "@/lib/users";
import {
  deletePendingLogin,
  getPendingLogin,
  verifyEmailOtp,
  verifyTotpCode,
} from "@/lib/twofactor";

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const limit = await rateLimit(`2fa:${ip}`, 10, 15 * 60 * 1000);
    if (!limit.success) {
      return NextResponse.json(
        { error: "Too many attempts. Please try again in a few minutes." },
        { status: 429 }
      );
    }

    const { pendingToken, code, method } = (await request.json()) as {
      pendingToken?: string;
      code?: string;
      method?: "email" | "totp" | "totp-setup";
    };

    if (!pendingToken || !code || !method) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const pending = await getPendingLogin(pendingToken);
    if (!pending) {
      return NextResponse.json(
        { error: "Login session expired. Please log in again." },
        { status: 401 }
      );
    }

    let ok = false;

    if (method === "email") {
      ok = await verifyEmailOtp(pending.username, code);
    } else if (method === "totp-setup") {
      if (!pending.tempTotpSecret) {
        return NextResponse.json({ error: "Setup session expired. Please try again." }, { status: 400 });
      }
      ok = verifyTotpCode(pending.tempTotpSecret, code);
      if (ok) {
        // First successful code confirms the authenticator app is correctly
        // configured — now we persist the secret for all future logins.
        await saveTotpSecret(pending.username, pending.tempTotpSecret);
      }
    } else if (method === "totp") {
      const record = await getUserRecord(pending.username);
      const secret = record?.twoFactor.totpSecret;
      if (!secret) {
        return NextResponse.json({ error: "Authenticator app isn't set up for this account." }, { status: 400 });
      }
      ok = verifyTotpCode(secret, code);
    }

    if (!ok) {
      return NextResponse.json({ error: "Invalid or expired code." }, { status: 401 });
    }

    await deletePendingLogin(pendingToken);

    const token = await createSession({
      username: pending.username,
      role: pending.role as "admin" | "seo",
    });
    const response = NextResponse.json({
      success: true,
      role: pending.role,
      redirect: pending.role === "admin" ? "/portal/admin" : "/portal/seo",
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
