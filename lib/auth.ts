import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import type { UserRole } from "@/types/content";
import { verifyCredentialsAsync } from "@/lib/users";

const COOKIE_NAME = "portal_session";

export interface SessionUser {
  username: string;
  role: UserRole;
}

function getSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error("AUTH_SECRET must be set (min 16 characters)");
  }
  return new TextEncoder().encode(secret);
}

/** Checks username/password against dashboard-created users first, then the
 * built-in admin/seo accounts (dashboard-changed credentials, or .env.local
 * defaults if never changed). */
export async function verifyCredentials(
  username: string,
  password: string
): Promise<SessionUser | null> {
  return verifyCredentialsAsync(username, password);
}

export async function createSession(user: SessionUser): Promise<string> {
  return new SignJWT({ username: user.username, role: user.role })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());
}

export async function verifySession(
  token: string
): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (
      typeof payload.username === "string" &&
      (payload.role === "admin" || payload.role === "seo")
    ) {
      return { username: payload.username, role: payload.role };
    }
    return null;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySession(token);
}

// ==========================================
// 2FA Verification Helpers (Build Error Fix)
// ==========================================

export async function createPending2FAToken(user: SessionUser): Promise<string> {
  return new SignJWT({ username: user.username, role: user.role, type: "2fa_pending" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("10m") // 10 mins window to enter 2FA code
    .sign(getSecret());
}

export async function verifyPending2FAToken(
  token: string
): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (
      payload.type === "2fa_pending" &&
      typeof payload.username === "string" &&
      (payload.role === "admin" || payload.role === "seo")
    ) {
      return { username: payload.username, role: payload.role };
    }
    return null;
  } catch {
    return null;
  }
}

export { COOKIE_NAME };