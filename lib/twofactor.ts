import * as OTPAuth from "otpauth";
import QRCode from "qrcode";
import { Resend } from "resend";
import { kvDelete, kvGetWithTtl, kvSetWithTtl } from "@/lib/kv";
import { siteConfig } from "@/lib/site-config";

const OTP_TTL_SECONDS = 5 * 60; // 5 minutes
const PENDING_LOGIN_TTL_SECONDS = 10 * 60; // 10 minutes to complete 2FA after password step

// ---- TOTP (authenticator app: Google Authenticator, Authy, etc.) ----

export function generateTotpSecret(username: string) {
  const secret = new OTPAuth.Secret({ size: 20 });
  const totp = new OTPAuth.TOTP({
    issuer: siteConfig.name,
    label: username,
    algorithm: "SHA1",
    digits: 6,
    period: 30,
    secret,
  });
  return { secret: secret.base32, otpauthUrl: totp.toString() };
}

export async function totpQrCodeDataUrl(otpauthUrl: string): Promise<string> {
  return QRCode.toDataURL(otpauthUrl);
}

export function verifyTotpCode(secretBase32: string, code: string): boolean {
  const totp = new OTPAuth.TOTP({
    issuer: siteConfig.name,
    label: "user",
    algorithm: "SHA1",
    digits: 6,
    period: 30,
    secret: OTPAuth.Secret.fromBase32(secretBase32),
  });
  // window: 1 allows the code from just before/after now, to tolerate clock drift
  const delta = totp.validate({ token: code.trim(), window: 1 });
  return delta !== null;
}

// ---- Email OTP ----

function otpKey(username: string) {
  return `2fa-email-otp:${username.trim().toLowerCase()}`;
}

export async function sendEmailOtp(username: string, toEmail: string): Promise<boolean> {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  await kvSetWithTtl(otpKey(username), code, OTP_TTL_SECONDS);

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // No email provider configured — log so local dev can still test the flow.
    console.log(`[2fa] Email OTP for ${username} (no RESEND_API_KEY set): ${code}`);
    return true;
  }

  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL ?? "Portfolio <onboarding@resend.dev>",
      to: toEmail,
      subject: `Your ${siteConfig.name} login code`,
      html: `<p>Your login verification code is:</p><h2 style="letter-spacing:4px">${code}</h2><p>This code expires in 5 minutes. If you didn't request this, you can ignore this email.</p>`,
    });
    return true;
  } catch (err) {
    console.error("[2fa] Failed to send email OTP", err);
    return false;
  }
}

export async function verifyEmailOtp(username: string, code: string): Promise<boolean> {
  const stored = await kvGetWithTtl<string>(otpKey(username));
  if (!stored) return false;
  return stored === code.trim();
}

// ---- Pending-login token (bridges the password step and the 2FA step) ----

function pendingKey(token: string) {
  return `2fa-pending:${token}`;
}

export async function createPendingLogin(username: string, role: string): Promise<string> {
  const token = crypto.randomUUID();
  await kvSetWithTtl(pendingKey(token), { username, role }, PENDING_LOGIN_TTL_SECONDS);
  return token;
}

export async function getPendingLogin(
  token: string
): Promise<{ username: string; role: string; tempTotpSecret?: string } | null> {
  return kvGetWithTtl<{ username: string; role: string; tempTotpSecret?: string }>(
    pendingKey(token)
  );
}

/** Attaches a freshly generated (not-yet-confirmed) TOTP secret to a pending
 * login, so the code entered on the next request can be checked against it. */
export async function attachTempTotpSecret(token: string, secret: string) {
  const existing = await getPendingLogin(token);
  if (!existing) return;
  await kvSetWithTtl(
    pendingKey(token),
    { ...existing, tempTotpSecret: secret },
    PENDING_LOGIN_TTL_SECONDS
  );
}

export async function deletePendingLogin(token: string) {
  await kvDelete(pendingKey(token));
}

export async function consumePendingLogin(
  token: string
): Promise<{ username: string; role: string } | null> {
  return kvGetWithTtl<{ username: string; role: string }>(pendingKey(token));
}
