import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { deleteBlogDraft, getBlogDrafts, saveBlogDraft, type BlogDraft } from "@/lib/blog-drafts";

export async function GET(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (id) {
    const drafts = await getBlogDrafts();
    const draft = drafts.find((d) => d.id === id || d.postId === id);
    return NextResponse.json({ draft: draft ?? null });
  }

  const drafts = await getBlogDrafts();
  return NextResponse.json({ drafts });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as Partial<BlogDraft> & { id: string };

    if (!body.id) {
      return NextResponse.json({ error: "Draft id required" }, { status: 400 });
    }

    const draft: BlogDraft = {
      id: body.id,
      title: body.title ?? "",
      slug: body.slug ?? "",
      excerpt: body.excerpt ?? "",
      content: body.content ?? "",
      category: body.category ?? "General",
      published: body.published ?? false,
      coverImage: body.coverImage ?? "",
      coverImageAlt: body.coverImageAlt ?? "",
      focusKeyword: body.focusKeyword ?? "",
      postId: body.postId,
      savedAt: new Date().toISOString(),
    };

    await saveBlogDraft(draft);
    return NextResponse.json({ success: true, savedAt: draft.savedAt });
  } catch {
    return NextResponse.json({ error: "Failed to save draft" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Draft id required" }, { status: 400 });
  }

  await deleteBlogDraft(id);
  return NextResponse.json({ success: true });
}
