import { NextResponse } from "next/server";
import {
  getTestimonialLikeCount,
  hasVoted,
  toggleTestimonialLike,
} from "@/lib/testimonial-likes";
import { getClientIp, hashVoterKey, rateLimit } from "@/lib/rate-limit";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const testimonialId = searchParams.get("testimonialId");

  if (!testimonialId) {
    return NextResponse.json({ error: "testimonialId required" }, { status: 400 });
  }

  const ip = getClientIp(request);
  const voterHash = await hashVoterKey(ip, testimonialId);
  const [count, liked] = await Promise.all([
    getTestimonialLikeCount(testimonialId),
    hasVoted(voterHash, testimonialId),
  ]);

  return NextResponse.json({ count, liked });
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const limit = await rateLimit(`testimonial-like:${ip}`, 20, 60 * 60 * 1000);
    if (!limit.success) {
      return NextResponse.json(
        { error: "Too many likes. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { testimonialId } = body as { testimonialId?: string };

    if (!testimonialId?.trim()) {
      return NextResponse.json(
        { error: "testimonialId required" },
        { status: 400 }
      );
    }

    const voterHash = await hashVoterKey(ip, testimonialId);
    const result = await toggleTestimonialLike(testimonialId, voterHash);

    return NextResponse.json({
      success: true,
      count: result.count,
      liked: result.liked,
    });
  } catch {
    return NextResponse.json({ error: "Failed to like" }, { status: 500 });
  }
}
