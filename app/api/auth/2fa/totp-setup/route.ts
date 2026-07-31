import { NextResponse } from "next/server";
import { attachTempTotpSecret, generateTotpSecret, getPendingLogin, totpQrCodeDataUrl } from "@/lib/twofactor";

export async function POST(request: Request) {
  try {
    const { pendingToken } = (await request.json()) as { pendingToken?: string };
    if (!pendingToken) {
      return NextResponse.json({ error: "Missing token" }, { status: 400 });
    }

    const pending = await getPendingLogin(pendingToken);
    if (!pending) {
      return NextResponse.json({ error: "Login session expired. Please log in again." }, { status: 401 });
    }

    const { secret, otpauthUrl } = generateTotpSecret(pending.username);
    await attachTempTotpSecret(pendingToken, secret);
    const qrDataUrl = await totpQrCodeDataUrl(otpauthUrl);

    return NextResponse.json({ qrDataUrl, secret });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
