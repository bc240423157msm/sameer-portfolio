import { kvGet, kvSet } from "@/lib/kv";

const HISTORY_KEY = "content-history";
const MAX_VERSIONS = 30;

export interface ContentVersion {
  id: string;
  path: string;
  value: unknown;
  previousValue: unknown;
  timestamp: string;
  username: string;
}

export async function appendContentHistory(
  entry: Omit<ContentVersion, "id" | "timestamp">
): Promise<void> {
  const history = await kvGet<ContentVersion[]>(HISTORY_KEY, []);
  const version: ContentVersion = {
    ...entry,
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
  };
  history.unshift(version);
  if (history.length > MAX_VERSIONS) history.length = MAX_VERSIONS;
  await kvSet(HISTORY_KEY, history);
}

export async function getContentHistory(): Promise<ContentVersion[]> {
  return kvGet<ContentVersion[]>(HISTORY_KEY, []);
}

export async function restoreContentVersion(
  versionId: string
): Promise<ContentVersion | null> {
  const history = await getContentHistory();
  const version = history.find((v) => v.id === versionId);
  return version ?? null;
}
