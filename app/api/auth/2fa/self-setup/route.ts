import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { saveTotpSecret } from "@/lib/users";
import {
  generateTotpSecret,
  totpQrCodeDataUrl,
  verifyTotpCode,
} from "@/lib/twofactor";
import { kvSetWithTtl, kvGetWithTtl } from "@/lib/kv";

function tempKey(username: string) {
  return `2fa-self-setup:${username.trim().toLowerCase()}`;
}

/** Step 1: generate a new secret + QR for the logged-in user to scan. */
export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const { secret, otpauthUrl } = generateTotpSecret(session.username);
  await kvSetWithTtl(tempKey(session.username), secret, 10 * 60);
  const qrDataUrl = await totpQrCodeDataUrl(otpauthUrl);

  return NextResponse.json({ qrDataUrl, secret });
}

/** Step 2: confirm the first code from the app, then activate it. */
export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const { code } = (await request.json()) as { code?: string };
  if (!code) return NextResponse.json({ error: "Code is required" }, { status: 400 });

  const secret = await kvGetWithTtl<string>(tempKey(session.username));
  if (!secret) {
    return NextResponse.json({ error: "Setup expired — generate a new QR code." }, { status: 400 });
  }

  if (!verifyTotpCode(secret, code)) {
    return NextResponse.json({ error: "Incorrect code. Check the app and try again." }, { status: 401 });
  }

  await saveTotpSecret(session.username, secret);
  return NextResponse.json({ success: true });
}
