import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { put, del } from "@vercel/blob";
import { getSession } from "@/lib/auth";
import { addMediaItem } from "@/lib/data";

// Images are stored in Vercel Blob (persistent, survives redeploys) when
// BLOB_READ_WRITE_TOKEN is configured. Locally, or if it isn't set up yet,
// files fall back to /public/uploads so development keeps working.
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const isBlobConfigured = Boolean(process.env.BLOB_READ_WRITE_TOKEN);

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
]);
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

function extFromType(type: string) {
  return (
    {
      "image/jpeg": ".jpg",
      "image/png": ".png",
      "image/webp": ".webp",
      "image/gif": ".gif",
      "image/svg+xml": ".svg",
    }[type] ?? ""
  );
}

// Both admin and seo roles may upload images — seo needs this for blog cover
// images and in-post images. Homepage/site content stays admin-only (see
// app/api/content routes), so this doesn't widen what seo can actually change.
async function requireUploader() {
  const session = await getSession();
  if (!session || (session.role !== "admin" && session.role !== "seo")) return false;
  return true;
}

/** Upload a new image. Used for both "upload" and "replace" — replace just
 * means the admin form swaps the stored URL for the new one; the old file
 * (if it was itself a managed upload) is removed via DELETE from the client. */
export async function POST(request: Request) {
  if (!(await requireUploader())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }
  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json(
      { error: "Unsupported file type. Use JPG, PNG, WEBP, GIF, or SVG." },
      { status: 400 }
    );
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: "File is too large (max 5MB)." },
      { status: 400 }
    );
  }

  const ext = extFromType(file.type);
  const filename = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}${ext}`;

  if (isBlobConfigured) {
    const blob = await put(`uploads/${filename}`, file, {
      access: "public",
      addRandomSuffix: false,
    });
    await addMediaItem(blob.url);
    return NextResponse.json({ url: blob.url, blobConfigured: true });
  }

  // Local dev fallback
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  const filePath = path.join(UPLOAD_DIR, filename);
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(filePath, buffer);
  const url = `/uploads/${filename}`;
  await addMediaItem(url);
  return NextResponse.json({ url, blobConfigured: false });
}

/** Delete a previously uploaded image. Only files managed by the uploader
 * (Blob URLs on our store, or local /uploads/ paths) can be removed this way —
 * anything else (external URLs, /logo.webp, etc.) is left alone. */
export async function DELETE(request: Request) {
  if (!(await requireUploader())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const urlPath = searchParams.get("path") ?? "";

  if (isBlobConfigured) {
    if (!urlPath.includes("blob.vercel-storage.com")) {
      return NextResponse.json({ success: true });
    }
    try {
      await del(urlPath);
    } catch {
      // already gone
    }
    return NextResponse.json({ success: true });
  }

  if (!urlPath.startsWith("/uploads/") || urlPath.includes("..")) {
    return NextResponse.json(
      { error: "Only uploaded files can be deleted this way." },
      { status: 400 }
    );
  }

  const filename = urlPath.replace("/uploads/", "");
  const filePath = path.join(UPLOAD_DIR, filename);

  try {
    await fs.unlink(filePath);
  } catch {
    // Already gone — treat as success either way.
  }

  return NextResponse.json({ success: true });
}
