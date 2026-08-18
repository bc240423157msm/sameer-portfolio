import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  getBlogPosts,
  getPublishedBlogPosts,
  saveBlogPosts,
} from "@/lib/data";
import { slugify } from "@/utils/slugify";
import type { BlogPost } from "@/types/content";

function uniqueBlogSlug(
  posts: BlogPost[],
  requestedSlug: string,
  currentPostId?: string
) {
  const baseSlug = slugify(requestedSlug) || "blog-post";
  let slug = baseSlug;
  let counter = 1;

  while (posts.some((p) => p.id !== currentPostId && p.slug === slug)) {
    slug = `${baseSlug}-${counter++}`;
  }

  return slug;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const all = searchParams.get("all") === "true";
  const session = await getSession();

  if (all) {
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const posts = await getBlogPosts();
    return NextResponse.json(posts);
  }

  const posts = await getPublishedBlogPosts();
  return NextResponse.json(posts);
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      title,
      excerpt,
      content,
      category,
      published,
      coverImage,
      coverImageAlt,
      focusKeyword,
      slug: requestedSlug,
    } = body as {
      title?: string;
      excerpt?: string;
      content?: string;
      category?: string;
      published?: boolean;
      coverImage?: string;
      coverImageAlt?: string;
      focusKeyword?: string;
      slug?: string;
    };

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content required" },
        { status: 400 }
      );
    }

    const posts = await getBlogPosts();
    const now = new Date().toISOString();
    const slug = uniqueBlogSlug(posts, requestedSlug ?? title);

    const newPost: BlogPost = {
      id: crypto.randomUUID(),
      slug,
      title,
      excerpt: excerpt ?? content.slice(0, 160),
      content,
      category: category ?? "General",
      published: published ?? false,
      createdAt: now,
      updatedAt: now,
      coverImage: coverImage || undefined,
      coverImageAlt: coverImageAlt || title,
      focusKeyword: focusKeyword || undefined,
    };

    posts.push(newPost);
    await saveBlogPosts(posts);
    return NextResponse.json(newPost, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, ...updates } = body as Partial<BlogPost> & { id: string };

    if (!id) {
      return NextResponse.json({ error: "Post ID required" }, { status: 400 });
    }

    const posts = await getBlogPosts();
    const index = posts.findIndex((p) => p.id === id);
    if (index === -1) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const existing = posts[index]!;
    const nextSlug = updates.slug
      ? uniqueBlogSlug(posts, updates.slug, existing.id)
      : existing.slug;
    const updated: BlogPost = {
      id: existing.id,
      slug: nextSlug,
      title: updates.title ?? existing.title,
      excerpt: updates.excerpt ?? existing.excerpt,
      content: updates.content ?? existing.content,
      category: updates.category ?? existing.category,
      published: updates.published ?? existing.published,
      createdAt: existing.createdAt,
      updatedAt: new Date().toISOString(),
      coverImage:
        updates.coverImage !== undefined ? updates.coverImage : existing.coverImage,
      coverImageAlt:
        updates.coverImageAlt !== undefined
          ? updates.coverImageAlt
          : existing.coverImageAlt,
      focusKeyword:
        updates.focusKeyword !== undefined
          ? updates.focusKeyword
          : existing.focusKeyword,
    };
    posts[index] = updated;

    await saveBlogPosts(posts);
    return NextResponse.json(posts[index]);
  } catch {
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
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
    return NextResponse.json({ error: "Post ID required" }, { status: 400 });
  }

  const posts = await getBlogPosts();
  const filtered = posts.filter((p) => p.id !== id);
  if (filtered.length === posts.length) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  await saveBlogPosts(filtered);
  return NextResponse.json({ success: true });
}
