"use client";

import React, { useState } from "react";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");
  const [mailtoFallback, setMailtoFallback] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !message.trim()) {
      setFeedback("Please fill out your name, email, and message.");
      setStatus("error");
      return;
    }

    setStatus("sending");
    setFeedback("");

    const noteSubject = subject.trim() || `Field Journal Note from ${name.trim()}`;
    const generatedMailto = `mailto:aaronngu@usc.edu?subject=${encodeURIComponent(
      noteSubject
    )}&body=${encodeURIComponent(
      `${message.trim()}\n\n—\nSender: ${name.trim()}\nEmail: ${email.trim()}`
    )}`;
    setMailtoFallback(generatedMailto);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          subject: noteSubject,
          message: message.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Could not send note directly.");
      }

      if (data.sent) {
        setFeedback("✓ Note sent directly to Aaron's inbox! Thanks for writing.");
      } else if (data.needsConfig) {
        setFeedback("✓ Note received & saved to journal inbox!");
      } else {
        setFeedback("✓ Note sent! Thanks for writing, I read everything.");
      }

      setStatus("success");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (err: unknown) {
      setStatus("error");
      const msg = err instanceof Error ? err.message : "Could not send note directly.";
      setFeedback(msg);
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <label>
        <span className="mono">Your name</span>
        <input
          name="name"
          type="text"
          placeholder="Ada Lovelace"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={status === "sending"}
        />
      </label>

      <label>
        <span className="mono">Your email</span>
        <input
          name="email"
          type="email"
          placeholder="ada@example.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === "sending"}
        />
      </label>

      <label>
        <span className="mono">Subject</span>
        <input
          name="subject"
          type="text"
          placeholder="Summer 2027 Internship / Project question"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          disabled={status === "sending"}
        />
      </label>

      <label>
        <span className="mono">Message</span>
        <textarea
          name="message"
          rows={5}
          placeholder="Dear Aaron…"
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={status === "sending"}
        />
      </label>

      {status === "success" && (
        <div style={{ margin: "4px 0 0", display: "grid", gap: 4 }}>
          <p className="mono" style={{ color: "var(--cardinal)", margin: 0 }}>
            {feedback || "✓ Note sent! Thanks for writing, I read everything."}
          </p>
        </div>
      )}

      {status === "error" && (
        <div style={{ margin: "2px 0 0", display: "grid", gap: 4 }}>
          <p className="mono" style={{ color: "var(--cardinal)", margin: 0 }}>
            {feedback || "Could not send note directly."}
          </p>
          {mailtoFallback && (
            <p className="mono" style={{ margin: 0, fontSize: "0.72rem" }}>
              <a
                href={mailtoFallback}
                style={{ textDecoration: "underline", color: "var(--ink)", fontWeight: 600 }}
              >
                Send via default email app instead ↗
              </a>
            </p>
          )}
        </div>
      )}

      <button
        type="submit"
        className="btn solid mono"
        style={{ justifySelf: "start", cursor: status === "sending" ? "wait" : "pointer" }}
        disabled={status === "sending"}
      >
        {status === "sending" ? "Sending note…" : "Send note →"}
      </button>
    </form>
  );
}
