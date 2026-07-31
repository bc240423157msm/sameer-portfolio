import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { isDbConfigured } from "@/lib/kv";

export async function GET() {
  const session = await getSession();
  if (!session || (session.role !== "admin" && session.role !== "seo")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  return NextResponse.json({
    dbConfigured: isDbConfigured,
    blobConfigured: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
  });
}
