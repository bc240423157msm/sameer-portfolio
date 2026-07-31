import { kvGet, kvSet } from "@/lib/kv";

const DRAFTS_KEY = "blog-drafts";

export interface BlogDraft {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  published: boolean;
  coverImage: string;
  coverImageAlt: string;
  focusKeyword: string;
  postId?: string;
  savedAt: string;
}

export async function getBlogDrafts(): Promise<BlogDraft[]> {
  return kvGet<BlogDraft[]>(DRAFTS_KEY, []);
}

export async function saveBlogDraft(draft: BlogDraft): Promise<void> {
  const drafts = await getBlogDrafts();
  const index = drafts.findIndex((d) => d.id === draft.id);
  if (index >= 0) {
    drafts[index] = draft;
  } else {
    drafts.unshift(draft);
  }
  // Keep at most 20 drafts
  if (drafts.length > 20) drafts.length = 20;
  await kvSet(DRAFTS_KEY, drafts);
}

export async function deleteBlogDraft(id: string): Promise<void> {
  const drafts = await getBlogDrafts();
  await kvSet(
    DRAFTS_KEY,
    drafts.filter((d) => d.id !== id)
  );
}
