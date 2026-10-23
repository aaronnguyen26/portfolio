"use client";

import React, { useState, useEffect } from "react";
import Book from "@/components/Book";
import MobileWritingLayout from "@/components/MobileWritingLayout";
import { essays } from "@/data/site";

export default function Writing() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  const [activeEssay, setActiveEssay] = useState<(typeof essays)[0] | null>(null);

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 768px)");
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    setIsMobile(mql.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  const [featured, ...rest] = essays;

  return (
    <Book>
      {/* Mobile-Only Writing Layout */}
      {(isMobile === true || isMobile === null) && (
        <div className="mobile-only-writing">
          <MobileWritingLayout />
        </div>
      )}

      {/* Desktop-Only Classic Open Book Spread */}
      {(isMobile === false || isMobile === null) && (
        <div className="desktop-only-writing">
          <span className="eyebrow mono rise">04 / Writing · Notes &amp; reflections</span>
          <h1 className="display rise d1">
            Thoughts, <em>in ink</em>.
          </h1>

          <article style={{ margin: "30px 0 10px", maxWidth: 680 }}>
            <span className="mono" style={{ color: "var(--cardinal)" }}>
              Featured · {featured.date} · {featured.mins} min read
            </span>
            <h2 className="title" style={{ fontSize: "clamp(2rem, 5vw, 3.4rem)", marginTop: 10 }}>
              <em>{featured.title}</em>
            </h2>
            <p className="body dropcap">
              {featured.excerpt}
            </p>
            <button
              type="button"
              onClick={() => setActiveEssay(featured)}
              className="btn mono"
              style={{ cursor: "pointer" }}
              aria-label={`Read full essay: ${featured.title}`}
            >
              Read entry &rarr;
            </button>
          </article>

          <h2 className="title" style={{ marginTop: 46 }}>More <em>entries</em></h2>
          <div role="list">
            {rest.map((e, i) => (
              <button
                key={e.title}
                type="button"
                onClick={() => setActiveEssay(e)}
                className="entry"
                style={{
                  display: "flex",
                  width: "100%",
                  textAlign: "left",
                  background: "transparent",
                  border: "none",
                  borderBottom: "1px dashed var(--rule)",
                  padding: "16px 0",
                  cursor: "pointer",
                  font: "inherit",
                }}
                role="listitem"
                aria-label={`Read essay: ${e.title}`}
              >
                <div className="big-n">{String(i + 2).padStart(2, "0")}</div>
                <div>
                  <span className="mono" style={{ color: "var(--cardinal)" }}>
                    {e.date} · {e.mins} min
                  </span>
                  <h3 style={{ margin: "4px 0 6px" }}>{e.title}</h3>
                  <p className="body" style={{ margin: 0 }}>{e.excerpt}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Reading Modal for Desktop */}
          {activeEssay && (
            <div
              className="essay-reading-backdrop"
              onClick={() => setActiveEssay(null)}
              style={{
                position: "fixed",
                inset: 0,
                backgroundColor: "rgba(30, 20, 12, 0.65)",
                backdropFilter: "blur(4px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1000,
                padding: "24px",
              }}
            >
              <div
                className="essay-reading-modal"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="essay-modal-title"
                style={{
                  backgroundColor: "var(--paper)",
                  border: "1px solid var(--border)",
                  borderRadius: 4,
                  boxShadow: "0 24px 64px rgba(0,0,0,0.35)",
                  maxWidth: 680,
                  width: "100%",
                  maxHeight: "85vh",
                  overflowY: "auto",
                  padding: "40px",
                  position: "relative",
                  fontFamily: "var(--font-serif)",
                }}
              >
                <button
                  type="button"
                  onClick={() => setActiveEssay(null)}
                  style={{
                    position: "absolute",
                    top: 20,
                    right: 20,
                    background: "none",
                    border: "1px solid var(--border)",
                    borderRadius: "50%",
                    width: 32,
                    height: 32,
                    cursor: "pointer",
                    fontSize: "1.1rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--ink)",
                  }}
                  aria-label="Close reading view"
                >
                  &times;
                </button>

                <div className="mono" style={{ color: "var(--cardinal)", fontSize: "0.82rem", marginBottom: 8 }}>
                  {activeEssay.date} &bull; {activeEssay.mins} MIN READ
                </div>

                <h2
                  id="essay-modal-title"
                  style={{
                    fontSize: "2.2rem",
                    lineHeight: 1.2,
                    marginBottom: 20,
                    fontFamily: "var(--font-display, serif)",
                  }}
                >
                  {activeEssay.title}
                </h2>

                <div
                  style={{
                    fontSize: "1.05rem",
                    lineHeight: 1.7,
                    color: "var(--ink)",
                  }}
                >
                  {Array.isArray(activeEssay.body)
                    ? activeEssay.body.map((paragraph, idx) => (
                        <p key={idx} style={{ marginBottom: "1rem" }}>
                          {paragraph}
                        </p>
                      ))
                    : typeof activeEssay.body === "string"
                    ? activeEssay.body
                    : activeEssay.excerpt}
                </div>

                <div style={{ marginTop: 32, paddingTop: 20, borderTop: "1px dashed var(--rule)", textAlign: "right" }}>
                  <span className="mono" style={{ fontSize: "0.78rem", color: "var(--pencil)" }}>
                    &mdash; Aaron Nguyen, Field Notes &bull; USC &apos;28
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </Book>
  );
}
