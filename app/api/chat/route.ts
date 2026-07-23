import { NextResponse } from "next/server";
import { getSiteContent } from "@/lib/data";
import {
  buildSamSystemPrompt,
  GROQ_TEXT_MODEL,
  GROQ_VISION_MODEL,
} from "@/lib/sam-config";
import type { ChatApiMessage, ChatContentPart } from "@/types/chat";

interface ChatRequestBody {
  messages: { role: "user" | "assistant"; content: string }[];
  imageBase64?: string;
  imageMimeType?: string;
  attachmentNote?: string;
}

export async function POST(request: Request) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "Sam is temporarily unavailable. Please use the contact page or WhatsApp.",
      },
      { status: 503 }
    );
  }

  try {
    const body = (await request.json()) as ChatRequestBody;
    const { messages, imageBase64, imageMimeType, attachmentNote } = body;

    if (!messages?.length) {
      return NextResponse.json(
        { error: "No messages provided" },
        { status: 400 }
      );
    }

    const lastUserMessage = messages[messages.length - 1];
    if (!lastUserMessage || lastUserMessage.role !== "user") {
      return NextResponse.json({ error: "Invalid message" }, { status: 400 });
    }

    const content = await getSiteContent();
    const systemPrompt = buildSamSystemPrompt(content);

    const hasImage = Boolean(imageBase64 && imageMimeType);
    const model = hasImage ? GROQ_VISION_MODEL : GROQ_TEXT_MODEL;

    const apiMessages: ChatApiMessage[] = [
      { role: "system", content: systemPrompt },
    ];

    const historySlice = messages.slice(0, -1).slice(-10);
    for (const msg of historySlice) {
      apiMessages.push({ role: msg.role, content: msg.content });
    }

    let userContent: string | ChatContentPart[];
    const textPart =
      attachmentNote && !lastUserMessage.content.trim()
        ? attachmentNote
        : attachmentNote
          ? `${lastUserMessage.content}\n\n${attachmentNote}`
          : lastUserMessage.content;

    if (hasImage) {
      userContent = [
        { type: "text", text: textPart || "Please look at this image." },
        {
          type: "image_url",
          image_url: {
            url: `data:${imageMimeType};base64,${imageBase64}`,
          },
        },
      ];
    } else {
      userContent = textPart;
    }

    apiMessages.push({ role: "user", content: userContent });

    const groqResponse = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          messages: apiMessages,
          temperature: 0.7,
          max_tokens: 2048,
        }),
      }
    );

    if (!groqResponse.ok) {
      const err = await groqResponse.text();
      console.error("Groq API error:", err);
      return NextResponse.json(
        { error: "Sam couldn't respond right now. Please try again." },
        { status: 502 }
      );
    }

    const data = await groqResponse.json();
    const reply =
      data.choices?.[0]?.message?.content ??
      "I'm sorry, I couldn't process that. Could you try again?";

    return NextResponse.json({ reply: reply.trim() });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}