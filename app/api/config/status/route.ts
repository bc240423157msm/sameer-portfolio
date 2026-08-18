import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { isDbConfigured } from "@/lib/kv";
import { getSiteContent } from "@/lib/data";

export async function GET() {
  const session = await getSession();
  if (!session || (session.role !== "admin" && session.role !== "seo")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const content = await getSiteContent();

  return NextResponse.json({
    dbConfigured: isDbConfigured,
    blobConfigured: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
    resendConfigured: Boolean(process.env.RESEND_API_KEY),
    resendFromConfigured: Boolean(process.env.RESEND_FROM_EMAIL),
    contactEmailConfigured: Boolean(
      content.settings.contactEmail || process.env.CONTACT_EMAIL
    ),
    gaConfigured: Boolean(content.settings.gaMeasurementId),
    groqConfigured: Boolean(process.env.GROQ_API_KEY),
    gscConfigured: Boolean(content.settings.seo.googleSiteVerification),
  });
}
