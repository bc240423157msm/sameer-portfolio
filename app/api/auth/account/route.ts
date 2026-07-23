import { NextResponse } from "next/server";
import { getSession, verifyCredentials } from "@/lib/auth";
import { isExtraUser, updateBuiltinCredentials } from "@/lib/users";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { currentPassword, newUsername, newPassword } = body as {
      currentPassword?: string;
      newUsername?: string;
      newPassword?: string;
    };

    if (!currentPassword || !newUsername?.trim() || !newPassword) {
      return NextResponse.json(
        { error: "Current password, new username, and new password are required" },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "New password must be at least 6 characters" },
        { status: 400 }
      );
    }

    if (await isExtraUser(session.username)) {
      return NextResponse.json(
        { error: "This account was created by an admin — ask an admin to update it from the Users list." },
        { status: 403 }
      );
    }

    // Only built-in accounts (admin / seo) can be edited here; accounts
    // created via "Add user" should be managed through the users list.
    const check = await verifyCredentials(session.username, currentPassword);
    if (!check || check.role !== session.role) {
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 401 });
    }

    await updateBuiltinCredentials(session.role, newUsername.trim(), newPassword);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
