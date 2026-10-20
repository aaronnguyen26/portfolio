"use client";

import React, { useState, useEffect } from "react";
import { site } from "@/data/site";

export default function ContactAside() {
  const [copied, setCopied] = useState(false);
  const [laTime, setLaTime] = useState<string | null>(null);

  // Compute live Los Angeles (PT) time on mount & update every 30 seconds
  useEffect(() => {
    const updateTime = () => {
      try {
        const formatter = new Intl.DateTimeFormat("en-US", {
          timeZone: "America/Los_Angeles",
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        });
        setLaTime(formatter.format(new Date()));
      } catch {
        setLaTime("Pacific Time (PT)");
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    } catch {
      // Fallback
    }
  };

  return (
    <aside style={{ display: "grid", gap: 24, justifyItems: "stretch", width: "100%" }}>
      {/* 1. Direct Email Ticket with 1-Click Clipboard Copy */}
      <div
        className="ticket mono rot-l"
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 10,
          padding: "10px 16px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ color: "#8a1c1c", fontWeight: 700 }}>EMAIL</span>
          <a
            href={`mailto:${site.email}`}
            style={{ fontWeight: 600, borderBottom: "1px dashed #8a1c1c" }}
            title="Open in email client"
          >
            {site.email}
          </a>
        </div>
        <button
          type="button"
          onClick={handleCopyEmail}
          className={`ticket-copy-btn ${copied ? "copied" : ""}`}
          aria-label="Copy email address to clipboard"
        >
          {copied ? "Copied! ✓" : "Copy"}
        </button>
      </div>

      {/* 2. Live Field Telemetry: Los Angeles Local Time & Status */}
      <div className="telemetry-card">
        <div className="telemetry-row">
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span className="telemetry-beacon" aria-hidden="true" />
            <span className="mono" style={{ fontSize: "0.68rem", fontWeight: 700, color: "var(--ink)" }}>
              USC · LOS ANGELES, CA
            </span>
          </div>
          <span className="mono" style={{ fontSize: "0.74rem", fontWeight: 700, color: "#8a1c1c" }}>
            {laTime ? `${laTime} PT` : "Pacific Time"}
          </span>
        </div>
        <p className="mono" style={{ margin: "8px 0 0", fontSize: "0.65rem", color: "var(--ink-soft)" }}>
          Active student &amp; builder · Economics &amp; Data Science Class of 2028
        </p>
      </div>

      {/* 3. Tactile Handwritten Response Sticky Note */}
      <div
        className="note hand rot-r"
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "100%",
          background: "#fff1a0",
          boxShadow: "0 8px 16px -8px rgba(0,0,0,.35)",
          padding: "18px 20px 20px",
          fontSize: "1.35rem",
          lineHeight: 1.35,
        }}
      >
        <div className="tape" style={{ top: -10, left: "28%" }} />
        usually reply within 24–48 hours! Feel free to drop a note anytime.
      </div>

      {/* 4. Curriculum Vitae Quick Folio Card */}
      <div
        style={{
          background: "#fffdf8",
          border: "1.5px solid rgba(38,33,27,0.18)",
          borderRadius: 6,
          padding: "14px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <div>
          <span className="mono" style={{ fontSize: "0.65rem", color: "#8a1c1c", fontWeight: 700, display: "block" }}>
            OFFICIAL DOSSIER
          </span>
          <span style={{ fontFamily: "var(--font-serif)", fontSize: "1.05rem", fontWeight: 600 }}>
            Curriculum Vitae
          </span>
        </div>
        <a
          href="/resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="btn mono"
          style={{ padding: "6px 14px", fontSize: "0.72rem", minHeight: 34 }}
          aria-label="View Resume PDF (opens in a new tab)"
        >
          View PDF ↗
        </a>
      </div>

      {/* 5. Verified Connect Channels */}
      <div style={{ marginTop: 4 }}>
        <span
          className="mono"
          style={{
            fontSize: "0.66rem",
            color: "var(--ink-soft)",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            display: "block",
            marginBottom: 8,
          }}
        >
          Direct Channels
        </span>
        <ul className="mono" style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 10 }}>
          {site.links
            .filter((l) => l.label !== "Resume")
            .map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="circle"
                  aria-label={`${l.label} profile (opens in a new tab)`}
                >
                  {l.label} ↗
                </a>
              </li>
            ))}
        </ul>
      </div>
    </aside>
  );
}
