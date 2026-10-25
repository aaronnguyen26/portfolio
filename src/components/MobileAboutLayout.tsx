"use client";

import React, { useState } from "react";
import TurnLink from "@/components/TurnLink";
import { useResume } from "@/components/ResumeModal";
import { useLLM } from "@/components/LLMModal";
import { nav, timeline, toolkits, site } from "@/data/site";

interface MobileAboutLayoutProps {
  hideHeader?: boolean;
}

export default function MobileAboutLayout({ hideHeader = false }: MobileAboutLayoutProps = {}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { openResume } = useResume();
  const { openLLM } = useLLM();

  return (
    <div className="mobile-about-container">
      {/* Clean Top Bar with Persistent Brand Mark and Resume Button */}
      {!hideHeader && (
        <div className="mobile-about-header">
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

          {/* Floating popover menu */}
          {isMenuOpen && (
            <>
              <div
                className="mobile-home-menu-backdrop"
                onClick={() => setIsMenuOpen(false)}
              />
              <nav className="mobile-home-nav-drawer" aria-label="Mobile Navigation">
                <ul>
                  {nav.map((item) => {
                    const isActive = item.href === "/about";
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
      )}

      {/* Hero Section: No 'The story so far' eyebrow */}
      <div className="mobile-about-hero">
        <h1 className="mobile-about-title">
          A little <span className="hl">backstory</span>.
        </h1>
        <p className="mobile-about-lede">
          a student, a notebook, and exploring the questions behind the data.
        </p>
      </div>

      {/* Primary Story Card: Polaroid + Narrative (NO Yellow Sticky Note) */}
      <div className="mobile-about-card">
        <div className="mobile-about-polaroid-grid">
          <div className="mobile-about-polaroid-frame">
            <div className="mobile-about-washi-tape" aria-hidden="true" />
            <img
              src="/photo_thats_me.jpg"
              alt="Aaron Nguyen"
              className="mobile-about-polaroid-img"
            />
            <div className="mobile-about-polaroid-caption hand">that&rsquo;s me</div>
          </div>

          <div className="mobile-about-story-body dropcap">
            I am currently at USC studying Economics &amp; Data Science. I spend my time
            building predictive statistics pipelines, modeling economic systems, and turning
            complex quantitative questions into clean, interactive tools.
          </div>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="mobile-about-section-header">
        <h2 className="mobile-about-section-title">Timeline of chapters</h2>
        <span className="mobile-about-section-meta mono">2014 &mdash; 2026+</span>
      </div>

      <div className="mobile-about-timeline" role="list">
        {timeline.map((item) => (
          <div key={item.year + item.title} className="mobile-about-timeline-item" role="listitem">
            <div className="mobile-about-timeline-bullet" aria-hidden="true" />
            <div className="mobile-about-timeline-year-row">
              <span className="mobile-about-timeline-year mono">{item.year}</span>
              <span className="mobile-about-timeline-place mono">{item.place}</span>
            </div>
            <div className="mobile-about-timeline-heading">{item.title}</div>
            <p className="mobile-about-timeline-desc">{item.text}</p>
          </div>
        ))}
      </div>

      {/* Tools in My Pencil Case */}
      <div className="mobile-about-section-header" style={{ marginTop: 28 }}>
        <h2 className="mobile-about-section-title">Tools in my pencil case</h2>
        <span className="mobile-about-section-meta mono">STACK 01&ndash;03</span>
      </div>

      <div className="mobile-about-toolkit-grid">
        {toolkits.map((kit) => (
          <div key={kit.n} className="mobile-about-toolkit-card">
            <div className="mobile-about-toolkit-head">
              <span className="mobile-about-toolkit-name">{kit.category}</span>
              <span className="mobile-about-toolkit-num mono">{kit.n}</span>
            </div>
            <div className="mobile-about-toolkit-tags mono">
              {kit.tools.map((tool) => (
                <span key={tool} className="mobile-about-toolkit-pill">
                  {tool}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Field Notes: Beyond the Desk */}
      <div className="mobile-about-section-header" style={{ marginTop: 28 }}>
        <h2 className="mobile-about-section-title">Field notes: beyond desk</h2>
        <span className="mobile-about-section-meta mono">LIFE 01&ndash;03</span>
      </div>

      <div className="mobile-about-fieldnotes-stack">
        <div className="mobile-about-fieldnote-card">
          <div className="mobile-about-fieldnote-disc mono">DISCIPLINE 01</div>
          <div className="mobile-about-fieldnote-title">Tactics &amp; The Pitch</div>
          <p className="mobile-about-fieldnote-body">
            Fascinated by positional pressing, tactical setups, and spatial coordination under pressure.
            Personal collection of 11+ match jerseys.
          </p>
          <div className="mobile-about-fieldnote-footer mono">&bull; Messi, Modrić &amp; Ødegaard</div>
        </div>

        <div className="mobile-about-fieldnote-card">
          <div className="mobile-about-fieldnote-disc mono">DISCIPLINE 02</div>
          <div className="mobile-about-fieldnote-title">Wind &amp; Water</div>
          <p className="mobile-about-fieldnote-body">
            Kitesurfing whenever the wind picks up along California beaches. The best way to reset focus away from backlit monitors.
          </p>
          <div className="mobile-about-fieldnote-footer mono">&bull; High wind, clear horizon</div>
        </div>

        <div className="mobile-about-fieldnote-card">
          <div className="mobile-about-fieldnote-disc mono">DISCIPLINE 03</div>
          <div className="mobile-about-fieldnote-title">Live Acoustic Sessions</div>
          <p className="mobile-about-fieldnote-body">
            Unwinding at cozy live acoustic music sets in Saigon and LA coffeehouses with a physical notebook in hand.
          </p>
          <div className="mobile-about-fieldnote-footer mono">&bull; Coffee, warm chords &amp; ink</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mobile-about-actions" style={{ marginTop: 24 }}>
        <TurnLink href="/projects" className="mobile-home-btn-solid">
          View projects &rarr;
        </TurnLink>
        <TurnLink href="/contact" className="mobile-home-btn-ghost">
          Get in touch
        </TurnLink>
      </div>

      <footer className="mobile-home-footer" style={{ marginTop: 28, textAlign: "center", fontSize: "0.8rem", color: "var(--pencil)" }}>
        <p className="mono" style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 10 }}>
          <span>Aaron Nguyen &bull; USC &apos;28</span>
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
