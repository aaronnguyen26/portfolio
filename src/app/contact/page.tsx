"use client";

import React, { useState, useEffect } from "react";
import Book from "@/components/Book";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";
import MobileContactLayout from "@/components/MobileContactLayout";
import { site } from "@/data/site";

export default function Contact() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 768px)");
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    setIsMobile(mql.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return (
    <Book>
      {/* Mobile-Only Contact Layout */}
      {(isMobile === true || isMobile === null) && (
        <div className="mobile-only-contact">
          <MobileContactLayout />
        </div>
      )}

      {/* Desktop-Only Classic Two-Page Spread */}
      {(isMobile === false || isMobile === null) && (
        <div className="desktop-only-contact">
          <span className="eyebrow mono rise">05 / Contact · Say hello</span>
          <h1 className="display rise d1">
            Let&rsquo;s <em>talk</em>.
          </h1>
          <p className="lede rise d2">
            Recruiter, classmate, or just curious? <span className="hl">Send a note</span>, I read everything.
          </p>

          <div className="split" style={{ alignItems: "start", marginTop: 26 }}>
            <ContactForm />

            <aside style={{ display: "grid", gap: 20, justifyItems: "start", width: "100%", maxWidth: 300 }}>
              <div className="ticket mono rot-l">
                <span>Inquiries</span>
                <span>Direct dispatch</span>
              </div>
              <div className="note hand rot-r">
                usually reply within a day or two!
              </div>

              {/* Prominent Direct Email Card */}
              <div
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.55)",
                  border: "1px solid var(--border)",
                  borderRadius: 4,
                  padding: "14px 16px",
                  width: "100%",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                }}
              >
                <span className="mono" style={{ fontSize: "0.72rem", color: "var(--pencil)", letterSpacing: "0.08em", display: "block" }}>
                  DIRECT INBOX
                </span>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 6, gap: 8 }}>
                  <a
                    href="mailto:aaronngu@usc.edu"
                    className="mono"
                    style={{ fontSize: "0.88rem", fontWeight: 600, color: "var(--cardinal)" }}
                  >
                    aaronngu@usc.edu
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText("aaronngu@usc.edu");
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="btn mono"
                    style={{ padding: "3px 8px", fontSize: "0.72rem", cursor: "pointer" }}
                    aria-label="Copy email address"
                  >
                    {copied ? "Copied! ✓" : "Copy"}
                  </button>
                </div>
              </div>

              <ul className="mono" style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 10, width: "100%" }}>
                {site.links.map((l) => (
                  <li key={l.label}>
                    <a href={l.href} target="_blank" rel="noopener noreferrer" className="circle">
                      {l.label} ↗
                    </a>
                  </li>
                ))}
              </ul>
            </aside>
          </div>
          <Footer />
        </div>
      )}
    </Book>
  );
}
