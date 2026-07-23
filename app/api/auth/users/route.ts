import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { createExtraUser, deleteExtraUser, listExtraUsers } from "@/lib/users";
import type { UserRole } from "@/types/content";

async function requireAdmin() {
  const session = await getSession();
  if (!session || session.role !== "admin") return null;
  return session;
}

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const users = await listExtraUsers();
  return NextResponse.json({ users });
}

export async function POST(request: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const body = await request.json();
    const { username, password, role } = body as {
      username?: string;
      password?: string;
      role?: UserRole;
    };

    if (!username?.trim() || !password || (role !== "admin" && role !== "seo")) {
      return NextResponse.json(
        { error: "Username, password, and a valid role are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    await createExtraUser(username.trim(), password, role);
    const users = await listExtraUsers();
    return NextResponse.json({ success: true, users });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username");
  if (!username) {
    return NextResponse.json({ error: "Username is required" }, { status: 400 });
  }

  await deleteExtraUser(username);
  const users = await listExtraUsers();
  return NextResponse.json({ success: true, users });
}
