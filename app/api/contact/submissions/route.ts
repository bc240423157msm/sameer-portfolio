import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  getContactSubmissions,
  markSubmissionRead,
} from "@/lib/data";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const submissions = await getContactSubmissions();
  return NextResponse.json(submissions);
}

export async function PATCH(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { id } = (await request.json()) as { id?: string };
  if (!id) {
    return NextResponse.json({ error: "ID required" }, { status: 400 });
  }

  await markSubmissionRead(id);
  return NextResponse.json({ success: true });
}
