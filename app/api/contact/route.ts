import { NextResponse } from "next/server";
import { Resend } from "resend";
import { revalidatePath } from "next/cache";
import { getSiteContent, saveContactSubmission } from "@/lib/data";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { siteConfig } from "@/lib/site-config";

/** Basic HTML-escaping so submitted text can't break the email markup. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function ownerNotificationHtml(params: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  const { name, email, subject, message } = params;
  return `
    <h2>New contact form submission</h2>
    <p><strong>Name:</strong> ${escapeHtml(name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
    <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
    <p><strong>Message:</strong></p>
    <p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>
  `;
}

/** Professional "thank you" auto-reply sent to whoever submitted the form. */
function visitorAutoReplyHtml(params: { name: string; subject: string }) {
  const { name, subject } = params;
  const firstName = escapeHtml(name.trim().split(" ")[0] || name.trim());
  return `
  <div style="background-color:#f4f5f7;padding:32px 16px;font-family:Segoe UI,Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
      <tr>
        <td style="background:#111827;padding:24px 32px;">
          <span style="color:#ffffff;font-size:18px;font-weight:600;letter-spacing:0.2px;">${escapeHtml(siteConfig.name)}</span>
        </td>
      </tr>
      <tr>
        <td style="padding:32px;">
          <p style="margin:0 0 16px;font-size:16px;color:#111827;">Hi ${firstName},</p>
          <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#374151;">
            Thanks for reaching out! I've received your message about
            <strong>&ldquo;${escapeHtml(subject)}&rdquo;</strong> and wanted to confirm it landed safely in my inbox.
          </p>
          <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#374151;">
            I personally read every message and will get back to you within
            <strong>24 hours</strong>. In the meantime, feel free to reply directly
            to this email if you'd like to add anything.
          </p>
          <div style="margin:24px 0;padding:16px 20px;background:#f9fafb;border-left:3px solid #111827;border-radius:6px;">
            <p style="margin:0;font-size:14px;color:#6b7280;">
              This is an automated confirmation — a real reply is on its way soon.
            </p>
          </div>
          <p style="margin:24px 0 0;font-size:15px;line-height:1.6;color:#374151;">
            Best regards,<br />
            <strong>${escapeHtml(siteConfig.name)}</strong>
          </p>
        </td>
      </tr>
      <tr>
        <td style="padding:20px 32px;background:#f9fafb;border-top:1px solid #e5e7eb;">
          <p style="margin:0;font-size:12px;color:#9ca3af;">
            ${escapeHtml(siteConfig.url.replace(/^https?:\/\//, ""))}
          </p>
        </td>
      </tr>
    </table>
  </div>
  `;
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const limit = await rateLimit(`contact:${ip}`, 5, 10 * 60 * 1000);
    if (!limit.success) {
      return NextResponse.json(
        { error: "Too many submissions. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { name, email, subject, message } = body as {
      name?: string;
      email?: string;
      subject?: string;
      message?: string;
    };

    if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    const content = await getSiteContent();
    const toEmail =
      content.settings.contactEmail ||
      process.env.CONTACT_EMAIL ||
      content.contact.email;

    const submission = await saveContactSubmission({
      name: name.trim(),
      email: email.trim(),
      subject: subject.trim(),
      message: message.trim(),
    });

    const resendKey = process.env.RESEND_API_KEY;
    const fromAddress =
      process.env.RESEND_FROM_EMAIL ?? "Portfolio <onboarding@resend.dev>";
    let ownerEmailSent = false;
    let visitorEmailSent = false;

    if (resendKey) {
      const resend = new Resend(resendKey);

      // 1) Notify the site owner.
      const ownerResult = await resend.emails.send({
        from: fromAddress,
        to: toEmail,
        replyTo: email.trim(),
        subject: `[Contact] ${subject.trim()}`,
        html: ownerNotificationHtml({
          name: name.trim(),
          email: email.trim(),
          subject: subject.trim(),
          message: message.trim(),
        }),
      });
      if (ownerResult.error) {
        console.error("[contact] Failed to send owner notification email", ownerResult.error);
      } else {
        ownerEmailSent = true;
      }

      // 2) Send a professional auto-reply / welcome email to the person who submitted the form.
      const visitorResult = await resend.emails.send({
        from: fromAddress,
        to: email.trim(),
        replyTo: toEmail,
        subject: `Thanks for reaching out, ${name.trim().split(" ")[0]}!`,
        html: visitorAutoReplyHtml({ name: name.trim(), subject: subject.trim() }),
      });
      if (visitorResult.error) {
        console.error("[contact] Failed to send visitor auto-reply email", visitorResult.error);
      } else {
        visitorEmailSent = true;
      }
    } else {
      console.warn("[contact] RESEND_API_KEY not set — skipping emails, submission saved only.");
    }

    revalidatePath("/portal/admin");

    return NextResponse.json({
      success: true,
      id: submission.id,
      ownerEmailSent,
      visitorEmailSent,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to send message. Please try again." },
      { status: 500 }
    );
  }
}