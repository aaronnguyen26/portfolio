"use client";

import React, { useState } from "react";
import { site } from "@/data/site";

type TopicOption = {
  id: string;
  label: string;
  icon: string;
  starter: string;
};

const TOPICS: TopicOption[] = [
  {
    id: "internship",
    label: "Internship / Role",
    icon: "💼",
    starter: "Hi Aaron, I came across your portfolio and wanted to reach out regarding an opportunity at…",
  },
  {
    id: "coffee",
    label: "Coffee Chat",
    icon: "☕",
    starter: "Hey Aaron, would love to connect for a quick 15-minute coffee chat to talk about…",
  },
  {
    id: "collab",
    label: "Data & ML Collab",
    icon: "📊",
    starter: "Hi Aaron, saw your EPL / Wildfire work and wanted to discuss a project collaboration on…",
  },
  {
    id: "hello",
    label: "Just Saying Hi",
    icon: "👋",
    starter: "Hi Aaron, just stopped by your field journal and wanted to say hello…",
  },
];

type SubmissionStatus = "idle" | "submitting" | "success" | "error";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<string>("internship");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<SubmissionStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<{ id: string; timestamp: string } | null>(null);
  const [copyNoteState, setCopyNoteState] = useState<"idle" | "copied">("idle");

  const handleTopicClick = (t: TopicOption) => {
    setSelectedTopic(t.id);
    // If the message is currently blank or starts with another topic's starter, suggest starter
    if (!message.trim() || TOPICS.some((item) => item.starter === message.trim())) {
      setMessage(t.starter);
    }
  };

  const handleCopyNoteFallback = async () => {
    try {
      const topicLabel = TOPICS.find((t) => t.id === selectedTopic)?.label || "Inquiry";
      const fullText = `From: ${name} (${email})\nSubject: [${topicLabel}] Note to Aaron\n\n${message}`;
      await navigator.clipboard.writeText(fullText);
      setCopyNoteState("copied");
      setTimeout(() => setCopyNoteState("idle"), 2500);
    } catch {
      // Fallback if clipboard fails
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!name.trim()) {
      setErrorMessage("Please enter your name so Aaron knows who is reaching out.");
      return;
    }

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErrorMessage("Please provide a valid email address so Aaron can write back.");
      return;
    }

    if (!message.trim() || message.trim().length < 5) {
      setErrorMessage("Please include a brief message (at least 5 characters).");
      return;
    }

    setStatus("submitting");

    try {
      const topicLabel = TOPICS.find((t) => t.id === selectedTopic)?.label || "General Inquiry";
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          topic: topicLabel,
          message: message.trim(),
          honeypot,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Unable to deliver note. Please try again or use direct email.");
      }

      setReceipt({
        id: data.id || `disp_${Date.now().toString(36)}`,
        timestamp: data.timestamp || new Date().toISOString(),
      });
      setStatus("success");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Network error. Please try again or copy email directly.";
      setErrorMessage(msg);
      setStatus("error");
    }
  };

  const handleReset = () => {
    setName("");
    setEmail("");
    setMessage("");
    setSelectedTopic("internship");
    setStatus("idle");
    setReceipt(null);
    setErrorMessage(null);
  };

  // SUCCESS RECEIPT STATE
  if (status === "success" && receipt) {
    const formattedDate = new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(receipt.timestamp));

    return (
      <div className="contact-envelope-stage">
        <div className="airmail-header-band">
          <div className="airmail-badge">
            <span className="airmail-badge-tag">Delivered</span>
            <span>Postal Receipt · Ref #{receipt.id.slice(-6)}</span>
          </div>
          <span className="mono" style={{ fontSize: "0.68rem", color: "var(--ink-soft)" }}>
            USC Postal Registry
          </span>
        </div>

        <div className="dispatch-receipt-card" role="alert" aria-live="polite">
          <div className="receipt-stamp-badge">✓</div>
          <h2 className="title" style={{ fontSize: "1.7rem", margin: "0 0 8px" }}>
            Note <em>Dispatched</em>.
          </h2>
          <p className="body" style={{ margin: "0 auto 16px", maxWidth: "44ch", fontSize: "1.02rem" }}>
            Thank you, <strong>{name}</strong>! Your note has been logged into Aaron&rsquo;s field desk. A reply will be sent to <strong>{email}</strong> soon.
          </p>

          <div
            className="mono"
            style={{
              display: "inline-grid",
              gap: 4,
              padding: "10px 18px",
              background: "#fffdf8",
              border: "1px dashed rgba(138,28,28,0.35)",
              borderRadius: 4,
              fontSize: "0.72rem",
              textAlign: "left",
              marginBottom: 20,
            }}
          >
            <div><strong>Dispatch ID:</strong> {receipt.id}</div>
            <div><strong>Timestamp:</strong> {formattedDate}</div>
            <div><strong>Destination:</strong> {site.email}</div>
          </div>

          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={handleReset}
              className="btn solid mono"
              style={{ fontSize: "0.76rem", padding: "8px 18px" }}
            >
              Write another note ✎
            </button>
            <button
              type="button"
              onClick={handleCopyNoteFallback}
              className="btn mono"
              style={{ fontSize: "0.76rem", padding: "8px 18px" }}
            >
              {copyNoteState === "copied" ? "Copied to clipboard! ✓" : "Copy note draft"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ACTIVE COMPOSER STATE
  const topicLabel = TOPICS.find((t) => t.id === selectedTopic)?.label || "Note";
  const mailtoFallback = `mailto:${site.email}?subject=${encodeURIComponent(
    `[${topicLabel}] From ${name || "Visitor"}`
  )}&body=${encodeURIComponent(message || "")}`;

  return (
    <div className="contact-envelope-stage">
      {/* Decorative Postmark Stamp */}
      <div className="contact-postmark-stamp" aria-hidden="true">
        <span>USC FIELD</span>
        <span>DISPATCH</span>
        <span style={{ fontSize: "0.48rem" }}>AIR MAIL</span>
      </div>

      {/* Header Band */}
      <div className="airmail-header-band">
        <div className="airmail-badge">
          <span className="airmail-badge-tag">Air Mail</span>
          <span>Chapter 04 · Dispatch Slip</span>
        </div>
        <span className="mono" style={{ fontSize: "0.68rem", color: "var(--ink-soft)" }}>
          Destination: {site.email}
        </span>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        {/* Anti-Bot Honeypot */}
        <input
          type="text"
          name="website"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          style={{ display: "none" }}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
        />

        {/* Topic Selector Chips */}
        <div style={{ marginBottom: 18 }}>
          <label className="contact-field-label">
            <span>What are you writing about?</span>
            <span className="mono" style={{ fontSize: "0.65rem", color: "var(--cardinal)" }}>
              Select a starter
            </span>
          </label>
          <div className="topic-chips-group" role="radiogroup" aria-label="Inquiry Topic">
            {TOPICS.map((topic) => {
              const active = selectedTopic === topic.id;
              return (
                <button
                  key={topic.id}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => handleTopicClick(topic)}
                  className={`topic-chip ${active ? "active" : ""}`}
                >
                  <span aria-hidden="true">{topic.icon}</span>
                  <span>{topic.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Sender Credentials Row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
            gap: 16,
            marginBottom: 16,
          }}
        >
          <div>
            <label htmlFor="contact-name" className="contact-field-label">
              <span>
                Your Name <span className="req">*</span>
              </span>
            </label>
            <input
              id="contact-name"
              name="name"
              type="text"
              autoComplete="name"
              required
              placeholder="Ada Lovelace"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="contact-field-input"
              disabled={status === "submitting"}
            />
          </div>

          <div>
            <label htmlFor="contact-email" className="contact-field-label">
              <span>
                Your Email <span className="req">*</span>
              </span>
            </label>
            <input
              id="contact-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="ada@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="contact-field-input"
              disabled={status === "submitting"}
            />
          </div>
        </div>

        {/* Ruled Message Textarea */}
        <div style={{ marginBottom: 20 }}>
          <label htmlFor="contact-message" className="contact-field-label">
            <span>
              Your Message <span className="req">*</span>
            </span>
            <span className="mono" style={{ fontSize: "0.68rem" }}>
              {message.length} chars
            </span>
          </label>
          <textarea
            id="contact-message"
            name="message"
            required
            rows={6}
            placeholder="Dear Aaron…"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="contact-stationery-textarea"
            disabled={status === "submitting"}
          />
        </div>

        {/* Error Notification Banner */}
        {errorMessage && (
          <div
            role="alert"
            style={{
              background: "#fee2e2",
              border: "1px solid #ef4444",
              borderRadius: 6,
              padding: "10px 14px",
              marginBottom: 16,
              fontSize: "0.88rem",
              color: "#991b1b",
              display: "grid",
              gap: 8,
            }}
          >
            <div>⚠️ {errorMessage}</div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", fontSize: "0.76rem" }}>
              <a
                href={mailtoFallback}
                className="btn mono"
                style={{ padding: "4px 10px", minHeight: 32, background: "#fff" }}
              >
                Send via default email app ↗
              </a>
              <button
                type="button"
                onClick={handleCopyNoteFallback}
                className="btn mono"
                style={{ padding: "4px 10px", minHeight: 32, background: "#fff" }}
              >
                {copyNoteState === "copied" ? "Copied! ✓" : "Copy note to clipboard"}
              </button>
            </div>
          </div>
        )}

        {/* Submit Bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 14 }}>
          <button
            type="submit"
            disabled={status === "submitting"}
            className="contact-dispatch-btn"
          >
            {status === "submitting" ? (
              <>
                <span
                  style={{
                    display: "inline-block",
                    width: 14,
                    height: 14,
                    border: "2px solid #ffffff",
                    borderTopColor: "transparent",
                    borderRadius: "50%",
                    animation: "spin 0.7s linear infinite",
                  }}
                  aria-hidden="true"
                />
                <span>Dispatching note…</span>
              </>
            ) : (
              <>
                <span>Send note</span>
                <span aria-hidden="true">→</span>
              </>
            )}
          </button>

          <span className="mono" style={{ fontSize: "0.7rem", color: "var(--ink-soft)" }}>
            Sent directly to Aaron&rsquo;s personal inbox
          </span>
        </div>
      </form>
    </div>
  );
}
