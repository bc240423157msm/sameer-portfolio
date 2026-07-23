import { promises as fs } from "fs";
import path from "path";
import { randomBytes, scryptSync, timingSafeEqual } from "crypto";
import type { UserRole } from "@/types/content";

const DATA_DIR = path.join(process.cwd(), "data");
const STORE_PATH = path.join(DATA_DIR, "auth-store.json");

export interface ExtraUser {
  username: string;
  role: UserRole;
  passwordHash: string;
  salt: string;
  createdAt: string;
}

interface CredentialOverride {
  username: string;
  passwordHash: string;
  salt: string;
}

interface AuthStore {
  /** Overrides the default env-based admin/seo credentials once changed from the dashboard. */
  overrides: Partial<Record<UserRole, CredentialOverride>>;
  /** Additional accounts created from the dashboard (beyond the one built-in admin + one built-in seo user). */
  extraUsers: ExtraUser[];
}

const emptyStore: AuthStore = { overrides: {}, extraUsers: [] };

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

async function readStore(): Promise<AuthStore> {
  try {
    const raw = await fs.readFile(STORE_PATH, "utf-8");
    return { ...emptyStore, ...JSON.parse(raw) } as AuthStore;
  } catch {
    return { ...emptyStore };
  }
}

async function writeStore(store: AuthStore): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(STORE_PATH, JSON.stringify(store, null, 2), "utf-8");
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

/** Updates the username/password for a built-in role (admin or seo). */
export async function updateBuiltinCredentials(
  role: UserRole,
  newUsername: string,
  newPassword: string
) {
  const store = await readStore();
  const { hash, salt } = hashPassword(newPassword);
  store.overrides[role] = { username: newUsername, passwordHash: hash, salt };
  await writeStore(store);
}

export async function listExtraUsers(): Promise<Omit<ExtraUser, "passwordHash" | "salt">[]> {
  const store = await readStore();
  return store.extraUsers.map(({ username, role, createdAt }) => ({
    username,
    role,
    createdAt,
  }));
}

export async function createExtraUser(
  username: string,
  password: string,
  role: UserRole
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
