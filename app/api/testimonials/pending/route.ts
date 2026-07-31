import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  getPendingTestimonials,
  removePendingTestimonial,
  getSiteContent,
  saveSiteContent,
} from "@/lib/data";

async function requireAdmin() {
  const session = await getSession();
  return session?.role === "admin";
}

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  const pending = await getPendingTestimonials();
  return NextResponse.json(pending);
}

/** Approves a pending review: copies it into the live testimonials list
 * (shown on the site) and removes it from the pending queue. */
export async function POST(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { id } = (await request.json()) as { id?: string };
  if (!id) {
    return NextResponse.json({ error: "ID required" }, { status: 400 });
  }

  const pending = await getPendingTestimonials();
  const item = pending.find((t) => t.id === id);
  if (!item) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const content = await getSiteContent();
  content.testimonials = [
    ...content.testimonials,
    {
      id: item.id,
      quote: item.quote,
      author: item.author,
      role: item.role,
      rating: item.rating,
      image: item.image,
    },
  ];
  await saveSiteContent(content);
  await removePendingTestimonial(id);

  return NextResponse.json({ success: true });
}

/** Rejects a pending review — just removes it, nothing goes live. */
export async function DELETE(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "ID required" }, { status: 400 });
  }

  await removePendingTestimonial(id);
  return NextResponse.json({ success: true });
}
