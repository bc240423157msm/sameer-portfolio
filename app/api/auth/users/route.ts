import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  createExtraUser,
  deleteExtraUser,
  getUserRecord,
  listExtraUsers,
  updateBuiltinTwoFactor,
  updateExtraUserProfile,
  updateExtraUserTwoFactor,
  type TwoFactorMethod,
} from "@/lib/users";
import type { UserRole } from "@/types/content";

async function requireAdmin() {
  const session = await getSession();
  if (!session || session.role !== "admin") return null;
  return session;
}

const BUILTIN_ROLES: UserRole[] = ["admin", "seo"];

/** Returns every account the admin can manage: the two built-in accounts
 * (admin/seo) plus any extra accounts created from the dashboard. */
export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const extra = await listExtraUsers();

  const builtinUsernames = [
    process.env.ADMIN_USERNAME ?? "Sameer Malik",
    process.env.SEO_USERNAME ?? "Support",
  ];
  const builtin = [];
  for (const uname of builtinUsernames) {
    const record = await getUserRecord(uname);
    if (record) {
      builtin.push({
        username: record.username,
        role: record.role,
        avatarUrl: record.avatarUrl,
        email: record.email,
        twoFactor: { method: record.twoFactor.method, totpVerified: record.twoFactor.totpVerified ?? false },
        isBuiltin: true,
      });
    }
  }

  return NextResponse.json({ users: [...builtin, ...extra.map((u) => ({ ...u, isBuiltin: false }))] });
}

export async function POST(request: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const body = await request.json();
    const { username, password, role, avatarUrl, email } = body as {
      username?: string;
      password?: string;
      role?: UserRole;
      avatarUrl?: string;
      email?: string;
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

    await createExtraUser(username.trim(), password, role, avatarUrl, email);
    const users = await listExtraUsers();
    return NextResponse.json({ success: true, users });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

/** Admin updates an existing account's avatar / email / required 2FA method.
 * Works for both built-in (admin/seo) and dashboard-created accounts. */
export async function PATCH(request: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const body = await request.json();
    const { username, avatarUrl, email, twoFactorMethod } = body as {
      username?: string;
      avatarUrl?: string;
      email?: string;
      twoFactorMethod?: TwoFactorMethod;
    };

    if (!username?.trim()) {
      return NextResponse.json({ error: "Username is required" }, { status: 400 });
    }

    const record = await getUserRecord(username);
    if (!record) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (record.isBuiltin && BUILTIN_ROLES.includes(record.role)) {
      const { updateBuiltinAvatar } = await import("@/lib/users");
      if (avatarUrl !== undefined) {
        await updateBuiltinAvatar(record.role, avatarUrl);
      }
      if (email !== undefined) {
        const { setBuiltinEmail } = await import("@/lib/users");
        await setBuiltinEmail(record.role, email);
      }
      if (twoFactorMethod !== undefined) {
        await updateBuiltinTwoFactor(record.role, {
          method: twoFactorMethod,
          totpSecret: record.twoFactor.totpSecret,
          totpVerified: record.twoFactor.totpVerified,
        });
      }
    } else {
      if (avatarUrl !== undefined || email !== undefined) {
        await updateExtraUserProfile(username, { avatarUrl, email });
      }
      if (twoFactorMethod !== undefined) {
        await updateExtraUserTwoFactor(username, {
          method: twoFactorMethod,
          totpSecret: record.twoFactor.totpSecret,
          totpVerified: record.twoFactor.totpVerified,
        });
      }
    }

    return NextResponse.json({ success: true });
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
