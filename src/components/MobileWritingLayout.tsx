"use client";

import React, { useState } from "react";
import TurnLink from "@/components/TurnLink";
import { useResume } from "@/components/ResumeModal";
import { useLLM } from "@/components/LLMModal";
import { nav, essays, site } from "@/data/site";

export default function MobileWritingLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { openResume } = useResume();
  const { openLLM } = useLLM();
  const [activeFilter, setActiveFilter] = useState("all");
  const [expandedEssayId, setExpandedEssayId] = useState<string | null>(null);

  const [featured, ...rest] = essays;

  const filteredRest = rest.filter((e) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "reflections") {
      return e.title.toLowerCase().includes("notebook") || e.title.toLowerCase().includes("home") || e.title.toLowerCase().includes("school");
    }
    if (activeFilter === "craft") {
      return e.title.toLowerCase().includes("paper") || e.title.toLowerCase().includes("hackathon");
    }
    return true;
  });

  return (
    <div className="mobile-writing-container">
      {/* Top Bar with Persistent Brand Mark and Resume Button */}
      <div className="mobile-writing-header">
        <button
          type="button"
          className="mobile-minimal-brand"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-label="Aaron Nguyen — Toggle navigation menu"
          aria-expanded={isMenuOpen}
          style={{ display: "inline-flex", alignItems: "center", gap: 6, minHeight: 44, padding: "8px 4px" }}
        >
          <span>{site.name}</span>
          <span style={{ fontSize: "0.75rem", opacity: 0.65 }}>▾</span>
        </button>

        <button
          type="button"
          onClick={() => openResume("picker")}
          className="mono"
          aria-label="View or download Aaron Nguyen Resume"
          style={{
            fontSize: "0.72rem",
            padding: "4px 10px",
            borderRadius: 4,
            border: "1px solid var(--cardinal)",
            background: "transparent",
            color: "var(--cardinal)",
            fontWeight: 600,
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            minHeight: 36,
          }}
        >
          Resume ↗
        </button>

        {/* Floating Popover Navigation Drawer */}
        {isMenuOpen && (
          <>
            <div
              className="mobile-home-menu-backdrop"
              onClick={() => setIsMenuOpen(false)}
            />
            <nav className="mobile-home-nav-drawer" aria-label="Mobile Navigation">
              <ul>
                {nav.map((item) => {
                  const isActive = item.href === "/writing";
                  return (
                    <li key={item.href}>
                      <TurnLink
                        href={item.href}
                        className={`mobile-home-nav-link ${isActive ? "active" : ""}`}
                        aria-current={isActive ? "page" : undefined}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <span className="mobile-home-nav-n">{item.n}</span>
                        <span>{item.label}</span>
                      </TurnLink>
                    </li>
                  );
                })}
                <li>
                  <button
                    type="button"
                    className="mobile-home-nav-link"
                    onClick={() => {
                      setIsMenuOpen(false);
                      openResume("picker");
                    }}
                    style={{
                      width: "100%",
                      minHeight: 44,
                      display: "flex",
                      alignItems: "center",
                      color: "var(--cardinal)",
                      fontWeight: 600,
                      background: "none",
                      border: "none",
                      padding: 0,
                      textAlign: "left",
                      cursor: "pointer",
                    }}
                  >
                    <span className="mobile-home-nav-n">06</span>
                    <span>Resume (Options) ↗</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="mobile-home-nav-link"
                    onClick={() => {
                      setIsMenuOpen(false);
                      openLLM();
                    }}
                    style={{
                      width: "100%",
                      minHeight: 44,
                      display: "flex",
                      alignItems: "center",
                      color: "var(--ink)",
                      fontWeight: 600,
                      background: "none",
                      border: "none",
                      padding: 0,
                      textAlign: "left",
                      cursor: "pointer",
                    }}
                  >
                    <span className="mobile-home-nav-n">07</span>
                    <span>llm.txt</span>
                  </button>
                </li>
              </ul>
            </nav>
          </>
        )}
      </div>

      {/* Hero Section */}
      <div className="mobile-writing-hero">
        <h1 className="mobile-writing-title">
          Thoughts, <span className="hl">in ink</span>.
        </h1>
        <p className="mobile-writing-lede">
          notes, essays, and questions scribbled down between problem sets and late-night builds.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="mobile-writing-filter-bar">
        <button
          type="button"
          className={`mobile-writing-filter-pill ${activeFilter === "all" ? "active" : ""}`}
          onClick={() => setActiveFilter("all")}
          aria-pressed={activeFilter === "all"}
        >
          All ({essays.length})
        </button>
        <button
          type="button"
          className={`mobile-writing-filter-pill ${activeFilter === "reflections" ? "active" : ""}`}
          onClick={() => setActiveFilter("reflections")}
          aria-pressed={activeFilter === "reflections"}
        >
          Reflections
        </button>
        <button
          type="button"
          className={`mobile-writing-filter-pill ${activeFilter === "craft" ? "active" : ""}`}
          onClick={() => setActiveFilter("craft")}
          aria-pressed={activeFilter === "craft"}
        >
          Notebooks &amp; Craft
        </button>
      </div>

      {/* Primary Featured Essay Card */}
      <article className="mobile-writing-featured-card">
        <div className="mobile-writing-washi-tape" aria-hidden="true" />
        
        <div className="mobile-writing-featured-meta">
          <span className="mobile-writing-cat-pill">FEATURED ESSAY</span>
          <span className="mobile-writing-date mono">{featured.date} • {featured.mins} MIN READ</span>
        </div>

        <h2 className="mobile-writing-featured-title">
          {featured.title}
        </h2>

        <p className="mobile-writing-featured-body dropcap">
          {featured.excerpt}
        </p>

        {expandedEssayId === featured.id && (
          <div className="mobile-writing-expanded-body">
            {Array.isArray(featured.body) ? (
              featured.body.map((p, i) => (
                <p key={i} style={{ marginBottom: 10, lineHeight: 1.55 }}>
                  {p}
                </p>
              ))
            ) : (
              <p style={{ lineHeight: 1.55 }}>{featured.body}</p>
            )}
          </div>
        )}

        <div className="mobile-writing-featured-footer">
          <div className="mobile-writing-tag-list mono">
            <span className="mobile-writing-tag">College</span>
            <span className="mobile-writing-tag">USC</span>
            <span className="mobile-writing-tag">Reflections</span>
          </div>

          <button
            type="button"
            className="mobile-writing-read-btn"
            onClick={() => setExpandedEssayId(expandedEssayId === featured.id ? null : featured.id)}
            aria-expanded={expandedEssayId === featured.id}
          >
            <span>{expandedEssayId === featured.id ? "Collapse entry" : "Read full entry"}</span>
            <span className="arrow" aria-hidden="true">
              {expandedEssayId === featured.id ? "↑" : "→"}
            </span>
          </button>
        </div>
      </article>

      {/* Cursive Field Note Reflection */}
      <div className="mobile-writing-handwritten-note">
        <p className="mobile-writing-handwritten-text">
          &ldquo;Writing is how I figure out what I actually believe versus what I only heard someone else say.&rdquo;
        </p>
      </div>

      {/* Archive Section Header */}
      <div className="mobile-writing-section-header">
        <h3 className="mobile-writing-section-title">More field entries</h3>
        <span className="mobile-writing-section-meta mono">ARCHIVE 02–04</span>
      </div>

      {/* Compact Essay Archive List */}
      <div className="mobile-writing-archive-list">
        {filteredRest.map((entry, idx) => {
          const entryNum = String(idx + 2).padStart(2, "0");
          const isExpanded = expandedEssayId === entry.id;

          return (
            <div key={entry.id || entry.title} className="mobile-writing-compact-card">
              <div className="mobile-writing-compact-top">
                <span className="mobile-writing-compact-n mono">{entryNum}</span>
                <span className="mobile-writing-compact-date mono">
                  {entry.date} • {entry.mins} MIN
                </span>
              </div>

              <h4 className="mobile-writing-compact-title">{entry.title}</h4>
              <p className="mobile-writing-compact-excerpt">{entry.excerpt}</p>

              {isExpanded && (
                <div className="mobile-writing-expanded-body" style={{ marginTop: 10 }}>
                  {Array.isArray(entry.body) ? (
                    entry.body.map((p, i) => (
                      <p key={i} style={{ marginBottom: 8, lineHeight: 1.5 }}>
                        {p}
                      </p>
                    ))
                  ) : (
                    <p style={{ lineHeight: 1.5 }}>{entry.body || entry.excerpt}</p>
                  )}
                </div>
              )}

              <div className="mobile-writing-compact-footer">
                <button
                  type="button"
                  className="mobile-writing-compact-toggle"
                  onClick={() => setExpandedEssayId(isExpanded ? null : entry.id)}
                  aria-expanded={isExpanded}
                >
                  <span>{isExpanded ? "Close" : "Read entry"}</span>
                  <span aria-hidden="true">{isExpanded ? "↑" : "→"}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Guiding Notebook Axioms */}
      <div className="mobile-writing-axioms-card">
        <div className="mobile-writing-axioms-header mono">
          JOURNAL MOTTO • THREE WRITING RULES
        </div>
        <div className="mobile-writing-axiom-row">
          <span className="mobile-writing-axiom-bullet">•</span>
          <div>
            <strong>Kill the jargon:</strong> If you can’t explain an economic model in simple plain English, you probably don’t understand it.
          </div>
        </div>
        <div className="mobile-writing-axiom-row">
          <span className="mobile-writing-axiom-bullet">•</span>
          <div>
            <strong>Document the failures:</strong> Post-mortems of failed model architectures teach ten times more than polished case studies.
          </div>
        </div>
        <div className="mobile-writing-axiom-row">
          <span className="mobile-writing-axiom-bullet">•</span>
          <div>
            <strong>Keep it grounded:</strong> Tie abstract equations back to real-world incentives and empirical human behavior.
          </div>
        </div>
      </div>

      {/* Bottom Action Navigation */}
      <div className="mobile-writing-actions">
        <TurnLink href="/projects" className="mobile-home-btn-primary">
          View projects →
        </TurnLink>
        <TurnLink href="/contact" className="mobile-home-btn-secondary">
          Get in touch
        </TurnLink>
      </div>

      {/* Clean Footer Spacing */}
      <footer className="mobile-home-footer" style={{ marginTop: 24, textAlign: "center", fontSize: "0.8rem", color: "var(--pencil)" }}>
        <p className="mono" style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 10 }}>
          <span>Aaron Nguyen &bull; Field Journal</span>
          <span>&bull;</span>
          <button
            type="button"
            onClick={() => openLLM()}
            style={{
              background: "none",
              border: "none",
              padding: 0,
              color: "var(--cardinal)",
              font: "inherit",
              cursor: "pointer",
              textDecoration: "underline",
              fontWeight: 600,
            }}
          >
            llm.txt
          </button>
        </p>
      </footer>
    </div>
  );
}
