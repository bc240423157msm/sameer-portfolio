import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getUserRecord } from "@/lib/users";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  const record = await getUserRecord(session.username);
  return NextResponse.json({
    authenticated: true,
    user: session,
    avatarUrl: record?.avatarUrl,
    email: record?.email,
    twoFactor: record
      ? { method: record.twoFactor.method, totpVerified: record.twoFactor.totpVerified ?? false }
      : { method: "none", totpVerified: false },
  });
}
