import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import nodemailer from "nodemailer";
import { Resend } from "resend";

const DESTINATION_EMAIL = process.env.CONTACT_EMAIL || "aaronngu@usc.edu";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message, honeypot } = body;

    // 1. Honeypot check (anti-bot trap)
    if (honeypot && typeof honeypot === "string" && honeypot.trim() !== "") {
      return NextResponse.json({ ok: true, message: "Dispatched successfully." });
    }

    // 2. Input validation
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { ok: false, error: "Please provide your name." },
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
    const cleanSubject =
      typeof subject === "string" && subject.trim().length > 0
        ? subject.trim().slice(0, 150)
        : `Field Journal Note from ${cleanName}`;
    const cleanMessage = message.trim().slice(0, 5000);

    const messageId = `note_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const timestamp = new Date().toISOString();

    console.log(
      `[Contact Form Dispatch] Note ID: ${messageId}\n` +
      `Target: ${DESTINATION_EMAIL}\n` +
      `From: "${cleanName}" <${cleanEmail}>\n` +
      `Subject: ${cleanSubject}\n` +
      `Message:\n${cleanMessage}\n-----------------------------------`
    );

    let emailSent = false;
    let providerUsed = "none";

    // 3. Attempt direct send via Gmail SMTP (Official Gmail with App Password)
    const gmailUser = process.env.GMAIL_USER || process.env.SMTP_USER;
    const gmailPass = process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASS;

    if (gmailUser && gmailPass) {
      try {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: gmailUser.trim(),
            pass: gmailPass.replace(/\s+/g, ""),
          },
        });

        await transporter.sendMail({
          from: `"${cleanName} (via Portfolio)" <${gmailUser.trim()}>`,
          to: DESTINATION_EMAIL,
          replyTo: `"${cleanName}" <${cleanEmail}>`,
          subject: cleanSubject,
          text: `From: ${cleanName} <${cleanEmail}>\nSubject: ${cleanSubject}\n\nMessage:\n${cleanMessage}`,
          html: `
            <div style="font-family: Georgia, serif; line-height: 1.6; color: #26211b; max-width: 600px; padding: 22px; border: 1px solid #e2d9c8; border-radius: 8px; background: #fffdfa;">
              <h2 style="color: #8a1c1c; border-bottom: 2px solid #8a1c1c; padding-bottom: 8px; margin-top: 0; font-size: 1.35rem;">
                ${cleanSubject}
              </h2>
              <p style="margin: 8px 0; font-size: 0.95rem;">
                <strong>From:</strong> ${cleanName} (&lt;<a href="mailto:${cleanEmail}">${cleanEmail}</a>&gt;)
              </p>
              <p style="margin: 8px 0; font-size: 0.95rem;">
                <strong>Delivered to:</strong> ${DESTINATION_EMAIL}
              </p>
              <hr style="border: 0; border-top: 1px dashed #d0c4b0; margin: 16px 0;" />
              <div style="white-space: pre-wrap; background: #fbf7ee; padding: 16px; border-radius: 6px; font-size: 1rem; border: 1px solid #eee5d4;">
${cleanMessage}
              </div>
              <hr style="border: 0; border-top: 1px dashed #d0c4b0; margin: 16px 0;" />
              <p style="font-size: 0.78rem; color: #7a6e60; margin: 0; font-family: monospace;">
                Sent directly via Gmail SMTP from Field Journal · Reply directly to this email to respond to ${cleanName}.
              </p>
            </div>
          `,
        });

        emailSent = true;
        providerUsed = "gmail-smtp";
        console.log(`[Gmail SMTP Success]: Delivered directly to ${DESTINATION_EMAIL}`);
      } catch (gmailErr) {
        console.error("[Gmail SMTP Error]:", gmailErr);
      }
    }

    // 4. Fallback to Resend if RESEND_API_KEY is configured
    if (!emailSent && process.env.RESEND_API_KEY) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        const resendRes = await resend.emails.send({
          from: process.env.RESEND_FROM || "Field Journal <onboarding@resend.dev>",
          to: [DESTINATION_EMAIL],
          replyTo: cleanEmail,
          subject: cleanSubject,
          text: `From: ${cleanName} <${cleanEmail}>\nSubject: ${cleanSubject}\n\nMessage:\n${cleanMessage}`,
          html: `
            <div style="font-family: Georgia, serif; line-height: 1.6; color: #26211b; max-width: 600px; padding: 20px;">
              <h2 style="color: #8a1c1c; border-bottom: 2px solid #8a1c1c; padding-bottom: 8px;">${cleanSubject}</h2>
              <p><strong>From:</strong> ${cleanName} (&lt;<a href="mailto:${cleanEmail}">${cleanEmail}</a>&gt;)</p>
              <div style="white-space: pre-wrap; background: #fbf7ee; padding: 16px; border-radius: 6px;">${cleanMessage}</div>
            </div>
          `,
        });

        if (!resendRes.error) {
          emailSent = true;
          providerUsed = "resend";
          console.log(`[Resend Success]: Delivered to ${DESTINATION_EMAIL}`);
        } else {
          console.error("[Resend Error]:", resendRes.error);
        }
      } catch (resendErr) {
        console.error("[Resend Exception]:", resendErr);
      }
    }

    // 5. Always persist note to local archive so no message is ever lost
    try {
      const inboxFile = path.join(process.cwd(), "src", "data", "inbox.json");
      let currentInbox: Array<{
        id: string;
        timestamp: string;
        name: string;
        email: string;
        subject: string;
        message: string;
        target: string;
        sent: boolean;
        provider: string;
      }> = [];

      try {
        const fileContent = await fs.readFile(inboxFile, "utf-8");
        currentInbox = JSON.parse(fileContent);
      } catch {
        currentInbox = [];
      }

      currentInbox.unshift({
        id: messageId,
        timestamp,
        name: cleanName,
        email: cleanEmail,
        subject: cleanSubject,
        message: cleanMessage,
        target: DESTINATION_EMAIL,
        sent: emailSent,
        provider: providerUsed,
      });

      await fs.writeFile(inboxFile, JSON.stringify(currentInbox.slice(0, 200), null, 2), "utf-8");
    } catch (saveErr) {
      console.warn("[Inbox Local Save Warning]:", saveErr);
    }

    const needsConfig = !emailSent && !gmailUser;

    return NextResponse.json({
      ok: true,
      sent: emailSent,
      needsConfig,
      id: messageId,
      timestamp,
      target: DESTINATION_EMAIL,
      provider: providerUsed,
      message: emailSent
        ? "Your note was sent directly to Aaron's inbox."
        : "Your note was saved to Aaron's journal inbox.",
    });
  } catch (err) {
    console.error("[Contact API Error]:", err);
    return NextResponse.json(
      { ok: false, error: "An unexpected error occurred while sending your note." },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: "ready",
    destination: DESTINATION_EMAIL,
    configured: Boolean((process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) || process.env.RESEND_API_KEY),
  });
}
