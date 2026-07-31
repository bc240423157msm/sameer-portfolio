import { NextResponse } from "next/server";
import { kvGet, kvSet } from "@/lib/kv";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

const SUBSCRIBERS_KEY = "newsletter-subscribers";

interface Subscriber {
  email: string;
  subscribedAt: string;
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const limit = await rateLimit(`newsletter:${ip}`, 5, 60 * 60 * 1000);
    if (!limit.success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { email } = body as { email?: string };

    if (!email?.trim()) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const normalized = email.trim().toLowerCase();
    const subscribers = await kvGet<Subscriber[]>(SUBSCRIBERS_KEY, []);

    if (subscribers.some((s) => s.email === normalized)) {
      return NextResponse.json(
        { error: "Already subscribed" },
        { status: 409 }
      );
    }

    subscribers.push({
      email: normalized,
      subscribedAt: new Date().toISOString(),
    });
    await kvSet(SUBSCRIBERS_KEY, subscribers);

    // Optional: forward to Resend audience if configured
    const resendKey = process.env.RESEND_API_KEY;
    const audienceId = process.env.RESEND_AUDIENCE_ID;
    if (resendKey && audienceId) {
      await fetch(`https://api.resend.com/audiences/${audienceId}/contacts`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: normalized }),
      }).catch(() => {});
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Subscription failed" }, { status: 500 });
  }
}
