import { randomBytes, scryptSync, timingSafeEqual } from "crypto";
import type { UserRole } from "@/types/content";
import { kvGet, kvSet } from "@/lib/kv";

const STORE_KEY = "auth-store";

export type TwoFactorMethod = "none" | "email" | "totp" | "both";

export interface TwoFactorSettings {
  /** Which method(s) are required at login. Set by the admin. */
  method: TwoFactorMethod;
  /** Base32 TOTP secret — only present once the user has completed authenticator setup. */
  totpSecret?: string;
  totpVerified?: boolean;
}

export interface ExtraUser {
  username: string;
  role: UserRole;
  passwordHash: string;
  salt: string;
  createdAt: string;
  avatarUrl?: string;
  /** Used to deliver email-based 2FA codes. */
  email?: string;
  twoFactor?: TwoFactorSettings;
}

interface CredentialOverride {
  username: string;
  passwordHash: string;
  salt: string;
  avatarUrl?: string;
  email?: string;
  twoFactor?: TwoFactorSettings;
}

interface AuthStore {
  /** Overrides the default env-based admin/seo credentials once changed from the dashboard. */
  overrides: Partial<Record<UserRole, CredentialOverride>>;
  /** Additional accounts created from the dashboard (beyond the one built-in admin + one built-in seo user). */
  extraUsers: ExtraUser[];
}

const emptyStore: AuthStore = { overrides: {}, extraUsers: [] };
const defaultTwoFactor: TwoFactorSettings = { method: "none" };

async function readStore(): Promise<AuthStore> {
  const store = await kvGet<AuthStore>(STORE_KEY, emptyStore);
  return { ...emptyStore, ...store };
}

async function writeStore(store: AuthStore): Promise<void> {
  await kvSet(STORE_KEY, store);
}

export function hashPassword(password: string, salt?: string) {
  const usedSalt = salt ?? randomBytes(16).toString("hex");
  const hash = scryptSync(password, usedSalt, 64).toString("hex");
  return { hash, salt: usedSalt };
}

function verifyPassword(password: string, hash: string, salt: string): boolean {
  const attempt = scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, "hex");
  if (attempt.length !== expected.length) return false;
  return timingSafeEqual(attempt, expected);
}

function normalize(username: string): string {
  return username.trim().toLowerCase().replace(/\s+/g, " ");
}

/**
 * Checks credentials against, in order: extra users created from the dashboard,
 * then the built-in admin/seo accounts (using dashboard overrides if set, else
 * the ADMIN_ and SEO_ values from .env.local).
 *
 * Only checks username + password. Two-factor (if required for this user) is a
 * separate step handled by lib/twofactor.ts after this succeeds.
 */
export async function isExtraUser(username: string): Promise<boolean> {
  const store = await readStore();
  return store.extraUsers.some((u) => normalize(u.username) === normalize(username));
}

export async function verifyCredentialsAsync(
  username: string,
  password: string
): Promise<{ username: string; role: UserRole } | null> {
  if (!password) return null;
  const store = await readStore();

  for (const user of store.extraUsers) {
    if (
      normalize(username) === normalize(user.username) &&
      verifyPassword(password, user.passwordHash, user.salt)
    ) {
      return { username: user.username, role: user.role };
    }
  }

  const builtins: { role: UserRole; envUser: string; envPass: string }[] = [
    {
      role: "admin",
      envUser: process.env.ADMIN_USERNAME ?? "Sameer Malik",
      envPass: process.env.ADMIN_PASSWORD ?? "",
    },
    {
      role: "seo",
      envUser: process.env.SEO_USERNAME ?? "Support",
      envPass: process.env.SEO_PASSWORD ?? "",
    },
  ];

  for (const b of builtins) {
    const override = store.overrides[b.role];
    if (override) {
      if (
        normalize(username) === normalize(override.username) &&
        verifyPassword(password, override.passwordHash, override.salt)
      ) {
        return { username: override.username, role: b.role };
      }
    } else if (normalize(username) === normalize(b.envUser) && password === b.envPass) {
      return { username: b.envUser, role: b.role };
    }
  }

  return null;
}

/** Looks up full user record (role, avatar, 2FA settings) by username, across
 * both extra users and built-in overrides. Used post-password-check to decide
 * whether a 2FA step is required and to hand back profile info. */
export async function getUserRecord(username: string): Promise<{
  username: string;
  role: UserRole;
  avatarUrl?: string;
  email?: string;
  twoFactor: TwoFactorSettings;
  isBuiltin: boolean;
} | null> {
  const store = await readStore();
  const extra = store.extraUsers.find(
    (u) => normalize(u.username) === normalize(username)
  );
  if (extra) {
    return {
      username: extra.username,
      role: extra.role,
      avatarUrl: extra.avatarUrl,
      email: extra.email,
      twoFactor: extra.twoFactor ?? defaultTwoFactor,
      isBuiltin: false,
    };
  }

  for (const role of ["admin", "seo"] as UserRole[]) {
    const override = store.overrides[role];
    if (override && normalize(override.username) === normalize(username)) {
      return {
        username: override.username,
        role,
        avatarUrl: override.avatarUrl,
        email: override.email ?? process.env.CONTACT_EMAIL,
        twoFactor: override.twoFactor ?? defaultTwoFactor,
        isBuiltin: true,
      };
    }
    const envUser =
      role === "admin"
        ? process.env.ADMIN_USERNAME ?? "Sameer Malik"
        : process.env.SEO_USERNAME ?? "Support";
    if (!override && normalize(envUser) === normalize(username)) {
      return {
        username: envUser,
        role,
        email: process.env.CONTACT_EMAIL,
        twoFactor: defaultTwoFactor,
        isBuiltin: true,
      };
    }
  }

  return null;
}

/** Updates the username/password for a built-in role (admin or seo). */
export async function updateBuiltinCredentials(
  role: UserRole,
  newUsername: string,
  newPassword: string
) {
  const store = await readStore();
  const { hash, salt } = hashPassword(newPassword);
  const existing = store.overrides[role];
  store.overrides[role] = {
    username: newUsername,
    passwordHash: hash,
    salt,
    avatarUrl: existing?.avatarUrl,
    twoFactor: existing?.twoFactor,
  };
  await writeStore(store);
}

/** Sets the email address used for a built-in account's 2FA delivery. */
export async function setBuiltinEmail(role: UserRole, email: string) {
  const store = await readStore();
  const envUser =
    role === "admin"
      ? process.env.ADMIN_USERNAME ?? "Sameer Malik"
      : process.env.SEO_USERNAME ?? "Support";
  const existing = store.overrides[role];
  if (existing) {
    existing.email = email;
  } else {
    const envPass =
      role === "admin"
        ? process.env.ADMIN_PASSWORD ?? ""
        : process.env.SEO_PASSWORD ?? "";
    const { hash, salt } = hashPassword(envPass);
    store.overrides[role] = { username: envUser, passwordHash: hash, salt, email };
  }
  await writeStore(store);
}

/** Updates just the avatar for a built-in role, keeping credentials as-is. */
export async function updateBuiltinAvatar(role: UserRole, avatarUrl: string) {
  const store = await readStore();
  const envUser =
    role === "admin"
      ? process.env.ADMIN_USERNAME ?? "Sameer Malik"
      : process.env.SEO_USERNAME ?? "Support";
  const existing = store.overrides[role];
  if (existing) {
    existing.avatarUrl = avatarUrl;
  } else {
    // No credential override yet — we still need a record to hold the avatar,
    // so seed one from the current env-based password isn't possible (we don't
    // have the plaintext). Instead, store avatar against a lightweight
    // placeholder that verifyCredentialsAsync ignores (it only checks overrides
    // when one exists AND matches). To keep behavior correct, we only allow
    // avatar-only updates once a credential override already exists, OR we
    // create one that re-uses the current env password so login still works.
    const envPass =
      role === "admin"
        ? process.env.ADMIN_PASSWORD ?? ""
        : process.env.SEO_PASSWORD ?? "";
    const { hash, salt } = hashPassword(envPass);
    store.overrides[role] = { username: envUser, passwordHash: hash, salt, avatarUrl };
  }
  await writeStore(store);
}

/** Admin-only: set which 2FA method (if any) is required for a built-in account. */
export async function updateBuiltinTwoFactor(
  role: UserRole,
  twoFactor: TwoFactorSettings
) {
  const store = await readStore();
  const envUser =
    role === "admin"
      ? process.env.ADMIN_USERNAME ?? "Sameer Malik"
      : process.env.SEO_USERNAME ?? "Support";
  const existing = store.overrides[role];
  if (existing) {
    existing.twoFactor = twoFactor;
  } else {
    const envPass =
      role === "admin"
        ? process.env.ADMIN_PASSWORD ?? ""
        : process.env.SEO_PASSWORD ?? "";
    const { hash, salt } = hashPassword(envPass);
    store.overrides[role] = { username: envUser, passwordHash: hash, salt, twoFactor };
  }
  await writeStore(store);
}

export async function listExtraUsers(): Promise<
  Omit<ExtraUser, "passwordHash" | "salt">[]
> {
  const store = await readStore();
  return store.extraUsers.map(({ username, role, createdAt, avatarUrl, email, twoFactor }) => ({
    username,
    role,
    createdAt,
    avatarUrl,
    email,
    twoFactor: {
      method: twoFactor?.method ?? "none",
      totpVerified: twoFactor?.totpVerified ?? false,
    },
  }));
}

export async function createExtraUser(
  username: string,
  password: string,
  role: UserRole,
  avatarUrl?: string,
  email?: string
) {
  const store = await readStore();
  const { hash, salt } = hashPassword(password);
  store.extraUsers = store.extraUsers.filter(
    (u) => normalize(u.username) !== normalize(username)
  );
  store.extraUsers.push({
    username,
    role,
    passwordHash: hash,
    salt,
    avatarUrl,
    email,
    twoFactor: defaultTwoFactor,
    createdAt: new Date().toISOString(),
  });
  await writeStore(store);
}

export async function deleteExtraUser(username: string) {
  const store = await readStore();
  store.extraUsers = store.extraUsers.filter(
    (u) => normalize(u.username) !== normalize(username)
  );
  await writeStore(store);
}

/** Admin-only: set which 2FA method (if any) an extra (dashboard-created) user needs. */
export async function updateExtraUserTwoFactor(
  username: string,
  twoFactor: TwoFactorSettings
) {
  const store = await readStore();
  const user = store.extraUsers.find(
    (u) => normalize(u.username) === normalize(username)
  );
  if (user) {
    user.twoFactor = twoFactor;
    await writeStore(store);
  }
}

/** Admin-only: update a dashboard-created user's avatar/email (2FA method is
 * set via updateExtraUserTwoFactor above). */
export async function updateExtraUserProfile(
  username: string,
  updates: { avatarUrl?: string; email?: string }
) {
  const store = await readStore();
  const user = store.extraUsers.find(
    (u) => normalize(u.username) === normalize(username)
  );
  if (user) {
    if (updates.avatarUrl !== undefined) user.avatarUrl = updates.avatarUrl;
    if (updates.email !== undefined) user.email = updates.email;
    await writeStore(store);
  }
}

/** Called once a user finishes scanning the authenticator QR and enters a
 * valid code — persists the secret so future logins can verify against it. */
export async function saveTotpSecret(username: string, secret: string) {
  const store = await readStore();
  const extra = store.extraUsers.find(
    (u) => normalize(u.username) === normalize(username)
  );
  if (extra) {
    extra.twoFactor = { ...(extra.twoFactor ?? defaultTwoFactor), totpSecret: secret, totpVerified: true };
    await writeStore(store);
    return;
  }
  for (const role of ["admin", "seo"] as UserRole[]) {
    const override = store.overrides[role];
    if (override && normalize(override.username) === normalize(username)) {
      override.twoFactor = { ...(override.twoFactor ?? defaultTwoFactor), totpSecret: secret, totpVerified: true };
      await writeStore(store);
      return;
    }
  }
}
