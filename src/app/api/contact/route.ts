import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, topic, message, honeypot } = body;

    // 1. Honeypot check (anti-bot trap)
    if (honeypot && typeof honeypot === "string" && honeypot.trim() !== "") {
      // Silently accept so bot thinks it succeeded
      return NextResponse.json({ ok: true, message: "Dispatched successfully." });
    }

    // 2. Input validation
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { ok: false, error: "Please provide your name so Aaron knows who is writing." },
        { status: 400 }
      );
    }

    if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return NextResponse.json(
        { ok: false, error: "Please provide a valid return email address." },
        { status: 400 }
      );
    }

    if (!message || typeof message !== "string" || message.trim().length < 5) {
      return NextResponse.json(
        { ok: false, error: "Please write at least a short message (5+ characters)." },
        { status: 400 }
      );
    }

    const cleanName = name.trim().slice(0, 100);
    const cleanEmail = email.trim().slice(0, 255);
    const cleanTopic = typeof topic === "string" ? topic.trim().slice(0, 100) : "General Inquiry";
    const cleanMessage = message.trim().slice(0, 5000);

    const messageId = `note_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const timestamp = new Date().toISOString();

    // Log the contact dispatch for server observation
    console.log(
      `[Contact Form Dispatch] ID: ${messageId} | At: ${timestamp}\nFrom: "${cleanName}" <${cleanEmail}>\nTopic: [${cleanTopic}]\nMessage:\n${cleanMessage}\n-----------------------------------`
    );

    return NextResponse.json({
      ok: true,
      id: messageId,
      timestamp,
      message: "Your note was received and placed in Aaron's journal.",
    });
  } catch (err) {
    console.error("[Contact API Error]:", err);
    return NextResponse.json(
      { ok: false, error: "An unexpected error occurred while delivering your note." },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ status: "ready", service: "Field Journal Contact Dispatch" });
}
