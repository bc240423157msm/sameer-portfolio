import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";
import { getCustomPages, saveCustomPages } from "@/lib/data";
import { slugify } from "@/utils/slugify";
import type { CustomPage } from "@/types/content";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const pages = await getCustomPages();
  return NextResponse.json(pages);
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { title, metaDescription, published, showInNav } = body as {
      title?: string;
      metaDescription?: string;
      published?: boolean;
      showInNav?: boolean;
    };

    if (!title?.trim()) {
      return NextResponse.json({ error: "Title required" }, { status: 400 });
    }

    const pages = await getCustomPages();
    const now = new Date().toISOString();
    const baseSlug = slugify(title);
    let slug = baseSlug;
    let counter = 1;
    while (pages.some((p) => p.slug === slug)) {
      slug = `${baseSlug}-${counter++}`;
    }

    const page: CustomPage = {
      id: crypto.randomUUID(),
      slug,
      title: title.trim(),
      metaDescription: metaDescription?.trim() ?? "",
      blocks: [
        {
          id: crypto.randomUUID(),
          type: "paragraph",
          text: "Add your page content from the admin dashboard.",
        },
      ],
      published: published ?? false,
      showInNav: showInNav ?? false,
      createdAt: now,
      updatedAt: now,
    };

    pages.push(page);
    await saveCustomPages(pages);
    revalidatePath("/", "layout");
    return NextResponse.json(page, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create page" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const body = (await request.json()) as CustomPage;
    if (!body.id) {
      return NextResponse.json({ error: "Page id required" }, { status: 400 });
    }

    const pages = await getCustomPages();
    const index = pages.findIndex((p) => p.id === body.id);
    if (index === -1) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    // Normalize the admin-edited slug and, if it collides with another
    // page's URL, auto-append a suffix rather than silently overwriting it.
    const baseSlug = slugify(body.slug) || slugify(body.title) || "page";
    let slug = baseSlug;
    let counter = 1;
    while (pages.some((p) => p.id !== body.id && p.slug === slug)) {
      slug = `${baseSlug}-${counter++}`;
    }

    pages[index] = { ...body, slug, updatedAt: new Date().toISOString() };
    await saveCustomPages(pages);
    revalidatePath("/", "layout");
    return NextResponse.json(pages[index]);
  } catch {
    return NextResponse.json({ error: "Failed to update page" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "id required" }, { status: 400 });
  }

  const pages = await getCustomPages();
  await saveCustomPages(pages.filter((p) => p.id !== id));
  revalidatePath("/", "layout");
  return NextResponse.json({ success: true });
}
