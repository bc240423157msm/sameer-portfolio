import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";
import { getSiteContent, saveSiteContent } from "@/lib/data";
import {
  getByPath,
  isValidContentPath,
  setByPath,
} from "@/lib/content-path";
import { appendContentHistory } from "@/lib/content-history";
import type { SiteContent } from "@/types/content";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ path: string }> }
) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { path: encodedPath } = await params;
  const contentPath = decodeURIComponent(encodedPath);

  if (!isValidContentPath(contentPath)) {
    return NextResponse.json({ error: "Invalid content path" }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { value } = body as { value?: unknown };

    if (value === undefined) {
      return NextResponse.json({ error: "value required" }, { status: 400 });
    }

    const content = await getSiteContent();
    const previousValue = getByPath(content, contentPath);

    const updated = structuredClone(content) as unknown as Record<
      string,
      unknown
    >;
    setByPath(updated, contentPath, value);
    await saveSiteContent(updated as unknown as SiteContent);

    await appendContentHistory({
      path: contentPath,
      value,
      previousValue,
      username: session.username,
    });

    revalidatePath("/", "layout");

    return NextResponse.json({ success: true, path: contentPath });
  } catch {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ path: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { path: encodedPath } = await params;
  const contentPath = decodeURIComponent(encodedPath);
  const content = await getSiteContent();
  const value = getByPath(content, contentPath);

  return NextResponse.json({ path: contentPath, value });
}
