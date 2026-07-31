import { NextResponse } from "next/server";
import { getBlogPostBySlug, getCommentsForPost, saveComment } from "@/lib/data";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");

  if (!slug) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }

  const comments = await getCommentsForPost(slug);
  return NextResponse.json({ comments });
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const limit = await rateLimit(`comment:${ip}`, 8, 10 * 60 * 1000);
    if (!limit.success) {
      return NextResponse.json(
        { error: "Too many comments. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { postSlug, name, message } = body as {
      postSlug?: string;
      name?: string;
      message?: string;
    };

    if (!postSlug?.trim() || !name?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: "Name and comment are required" },
        { status: 400 }
      );
    }

    if (name.length > 80 || message.length > 2000) {
      return NextResponse.json(
        { error: "Name or comment is too long" },
        { status: 400 }
      );
    }

    const post = await getBlogPostBySlug(postSlug.trim());
    if (!post || !post.published) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const comment = await saveComment({
      postSlug: postSlug.trim(),
      name: name.trim(),
      message: message.trim(),
    });

    return NextResponse.json({ success: true, comment });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
