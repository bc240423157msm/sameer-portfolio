import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getMediaLibrary, removeMediaItem } from "@/lib/data";

// seo role can view/manage media too — needed for picking and cleaning up
// blog images. Homepage content itself is still locked to admin only.
export async function GET() {
  const session = await getSession();
  if (!session || (session.role !== "admin" && session.role !== "seo")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const media = await getMediaLibrary();
  return NextResponse.json({ media });
}

export async function DELETE(request: Request) {
  const session = await getSession();
  if (!session || (session.role !== "admin" && session.role !== "seo")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");
  if (!url) {
    return NextResponse.json({ error: "url required" }, { status: 400 });
  }

  await removeMediaItem(url);
  return NextResponse.json({ success: true });
}
