import { NextResponse } from "next/server";
import { getUserRecord } from "@/lib/users";
import { getPendingLogin, sendEmailOtp } from "@/lib/twofactor";

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

    const record = await getUserRecord(pending.username);
    if (!record?.email) {
      return NextResponse.json(
        { error: "No email is on file for this account. Ask an admin to add one." },
        { status: 400 }
      );
    }

    const sent = await sendEmailOtp(pending.username, record.email);
    if (!sent) {
      return NextResponse.json({ error: "Failed to send code. Try again." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
