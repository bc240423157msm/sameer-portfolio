import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { savePendingTestimonial } from "@/lib/data";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const limit = await rateLimit(`review-submit:${ip}`, 3, 60 * 60 * 1000);
    if (!limit.success) {
      return NextResponse.json(
        { error: "Too many submissions. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { author, role, quote, rating, image, website } = body as {
      author?: string;
      role?: string;
      quote?: string;
      rating?: number;
      image?: string;
      website?: string; // honeypot field — real users never fill this in
    };

    // Honeypot: bots fill every field, humans never see this one.
    if (website?.trim()) {
      return NextResponse.json({ success: true });
    }

    if (!author?.trim() || !quote?.trim()) {
      return NextResponse.json(
        { error: "Name and review are required" },
        { status: 400 }
      );
    }

    if (quote.trim().length > 800) {
      return NextResponse.json(
        { error: "Review is too long (max 800 characters)" },
        { status: 400 }
      );
    }

    const safeRating = Math.min(5, Math.max(1, Math.round(Number(rating) || 5)));

    const submission = await savePendingTestimonial({
      author: author.trim().slice(0, 100),
      role: (role ?? "").trim().slice(0, 100),
      quote: quote.trim(),
      rating: safeRating,
      image: image?.trim() || undefined,
    });

    revalidatePath("/portal/admin");

    return NextResponse.json({ success: true, id: submission.id });
  } catch {
    return NextResponse.json(
      { error: "Failed to submit your review. Please try again." },
      { status: 500 }
    );
  }
}
