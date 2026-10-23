"use client";

import React, { useState } from "react";
import TurnLink from "@/components/TurnLink";
import { site, nav, projects } from "@/data/site";

interface MobileHomeLayoutProps {
  onOpenJourney?: (originRect: {
    top: number;
    left: number;
    width: number;
    height: number;
  }) => void;
}

export default function MobileHomeLayout({ onOpenJourney }: MobileHomeLayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleCardClick = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    if (onOpenJourney) {
      const rect = e.currentTarget.getBoundingClientRect();
      onOpenJourney({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      });
    }
  };

  const wildfire = projects.find((p) => p.slug === "firecnn");
  const epl = projects.find((p) => p.slug === "epl-predictor");

  return (
    <div className="mobile-minimal-hero-container">
      {/* 1. Decluttered Minimal Hero */}
      <section className="mobile-minimal-hero" aria-label="Introduction">
        {/* Top Bar: Clean Brand mark with Explicit Menu Affordance */}
        <div className="mobile-minimal-topbar" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
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

          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="mono"
            style={{
              fontSize: "0.72rem",
              padding: "4px 10px",
              borderRadius: 4,
              border: "1px solid var(--cardinal)",
              color: "var(--cardinal)",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Resume ↗
          </a>

          {/* Floating Popover Navigation Menu */}
          {isMenuOpen && (
            <>
              <div
                className="mobile-home-menu-backdrop"
                onClick={() => setIsMenuOpen(false)}
              />
              <nav className="mobile-home-nav-drawer" aria-label="Mobile Navigation" role="dialog" aria-modal="true">
                <ul>
                  {nav.map((item) => {
                    const isActive = item.href === "/";
                    return (
                      <li key={item.href}>
                        <TurnLink
                          href={item.href}
                          className={`mobile-home-nav-link ${isActive ? "active" : ""}`}
                          aria-current={isActive ? "page" : undefined}
                          onClick={() => setIsMenuOpen(false)}
                          style={{ minHeight: 44, display: "flex", alignItems: "center" }}
                        >
                          <span className="mobile-home-nav-n">{item.n}</span>
                          <span>{item.label}</span>
                        </TurnLink>
                      </li>
                    );
                  })}
                  <li>
                    <a
                      href="/resume.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mobile-home-nav-link"
                      onClick={() => setIsMenuOpen(false)}
                      style={{ minHeight: 44, display: "flex", alignItems: "center", color: "var(--cardinal)", fontWeight: 600 }}
                    >
                      <span className="mobile-home-nav-n">06</span>
                      <span>Resume (PDF) ↗</span>
                    </a>
                  </li>
                </ul>
              </nav>
            </>
          )}
        </div>

        {/* Optical Center: Centered typography */}
        <div className="mobile-minimal-hero-center">
          <h1 className="mobile-minimal-headline">
            Exploring where <span className="hl-gold">economic incentives</span> meet machine intelligence.
          </h1>
          <p className="mobile-minimal-sublede">
            Studying resource allocation by day, training neural networks by night, and capturing the stories behind complex systems.
          </p>

          {/* Direct Hero Action Buttons */}
          <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 20 }}>
            <TurnLink href="/projects" className="mobile-home-btn-solid" style={{ textDecoration: "none", padding: "10px 18px", fontSize: "0.82rem" }}>
              View projects &rarr;
            </TurnLink>
            <TurnLink href="/about" className="mobile-home-btn-ghost" style={{ textDecoration: "none", padding: "10px 16px", fontSize: "0.82rem" }}>
              About story
            </TurnLink>
          </div>
        </div>

        {/* Bottom: Animated Ink Drop Scroll Cue */}
        <a
          href="#recent-work"
          className="mobile-minimal-scroll-cue"
          aria-label="Scroll down into Recent Explorations"
        >
          <span className="mobile-minimal-scroll-label">Scroll to explore</span>
          <div className="mobile-minimal-ink-thread" aria-hidden="true">
            <div className="mobile-minimal-ink-droplet" />
          </div>
        </a>
      </section>

      {/* 2. Featured Projects Feed on Mobile Home */}
      <section id="recent-work" style={{ padding: "32px 14px", borderTop: "1px dashed rgba(31, 26, 20, 0.18)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 16 }}>
          <h2 style={{ fontSize: "1.45rem", margin: 0 }}>Recent Explorations</h2>
          <span className="mono" style={{ fontSize: "0.70rem", color: "var(--cardinal)", fontWeight: 600 }}>
            CHAPTER 01
          </span>
        </div>

        <div style={{ display: "grid", gap: 16 }}>
          {/* Card 1: FireCNN Wildfire Detection */}
          {wildfire && (
            <div
              role="button"
              tabIndex={0}
              onClick={handleCardClick}
              className="exploration-card-interactive"
              style={{
                background: "var(--paper-2)",
                border: "1px solid rgba(138, 28, 28, 0.32)",
                borderRadius: 6,
                padding: "16px 16px",
                textAlign: "left",
                cursor: "pointer",
                boxShadow: "0 2px 8px -2px rgba(44, 24, 16, 0.08)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span className="mono" style={{ color: "var(--cardinal)", fontWeight: 600, fontSize: "0.72rem" }}>
                  EXPLORATION 03 &bull; COMPUTER VISION
                </span>
                <span style={{ color: "var(--cardinal)", fontSize: "0.85rem", fontWeight: 700 }}>&rarr;</span>
              </div>
              <h3 style={{ fontSize: "1.05rem", fontWeight: 700, margin: "6px 0 4px" }}>
                {wildfire.title}
              </h3>
              <p className="mono" style={{ fontSize: "0.74rem", color: "var(--ink-soft)", lineHeight: 1.45, margin: "0 0 10px" }}>
                {wildfire.blurb}
              </p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 6 }}>
                <span className="mono" style={{ fontSize: "0.68rem", padding: "2px 6px", background: "rgba(138, 28, 28, 0.08)", color: "var(--cardinal)", borderRadius: 3, fontWeight: 600 }}>
                  Sub-15ms Edge &bull; PyTorch
                </span>
                <span className="mono" style={{ fontSize: "0.72rem", color: "var(--cardinal)", fontWeight: 600 }}>
                  Explore Journey &rarr;
                </span>
              </div>
            </div>
          )}

          {/* Card 2: EPL Predictor */}
          {epl && (
            <TurnLink
              href="/projects?open=epl-predictor"
              className="exploration-card-interactive"
              style={{
                textDecoration: "none",
                color: "inherit",
                display: "block",
                background: "var(--paper-2)",
                border: "1px solid rgba(31, 26, 20, 0.14)",
                borderRadius: 6,
                padding: "16px 16px",
                textAlign: "left",
                boxShadow: "0 2px 8px -2px rgba(44, 24, 16, 0.08)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span className="mono" style={{ color: "var(--cardinal)", fontWeight: 600, fontSize: "0.72rem" }}>
                  EXPLORATION 02 &bull; SPORTS ECONOMETRICS
                </span>
                <span style={{ color: "var(--cardinal)", fontSize: "0.85rem", fontWeight: 700 }}>&rarr;</span>
              </div>
              <h3 style={{ fontSize: "1.05rem", fontWeight: 700, margin: "6px 0 4px" }}>
                {epl.title}
              </h3>
              <p className="mono" style={{ fontSize: "0.74rem", color: "var(--ink-soft)", lineHeight: 1.45, margin: "0 0 10px" }}>
                {epl.blurb}
              </p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 6 }}>
                <span className="mono" style={{ fontSize: "0.68rem", padding: "2px 6px", background: "rgba(31, 26, 20, 0.06)", color: "var(--ink)", borderRadius: 3 }}>
                  58.2% Accuracy &bull; XGBoost
                </span>
                <span className="mono" style={{ fontSize: "0.72rem", color: "var(--cardinal)", fontWeight: 600 }}>
                  View Scouting Folio &rarr;
                </span>
              </div>
            </TurnLink>
          )}
        </div>

        {/* 3. Concise Backstory Preview Card */}
        <div
          style={{
            marginTop: 24,
            background: "rgba(255, 253, 248, 0.9)",
            border: "1.5px solid var(--rule)",
            borderRadius: 6,
            padding: "18px 16px",
            boxShadow: "0 4px 12px -4px rgba(44, 24, 16, 0.08)",
          }}
        >
          <div className="mono" style={{ fontSize: "0.70rem", color: "var(--cardinal)", fontWeight: 700, marginBottom: 4 }}>
            02 / ABOUT · THE BACKSTORY
          </div>
          <h3 style={{ margin: "0 0 8px", fontSize: "1.15rem" }}>From Saigon Chess to Econometrics</h3>
          <p style={{ fontSize: "0.88rem", lineHeight: 1.55, color: "var(--ink-soft)", margin: "0 0 14px" }}>
            Born in Saigon, competing in youth chess tournaments, and fascinated by game theory. Now at USC studying Economics &amp; Data Science, turning quantitative models into software prototypes.
          </p>
          <div style={{ display: "flex", gap: 10 }}>
            <TurnLink href="/about" className="mobile-home-btn-ghost" style={{ textDecoration: "none", fontSize: "0.78rem", padding: "7px 12px" }}>
              Read full story &rarr;
            </TurnLink>
            <TurnLink href="/contact" className="mobile-home-btn-ghost" style={{ textDecoration: "none", fontSize: "0.78rem", padding: "7px 12px" }}>
              Get in touch
            </TurnLink>
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: 24, paddingBottom: 16 }}>
          <p className="mono" style={{ fontSize: "0.68rem", color: "var(--ink-soft)" }}>
            Aaron Nguyen &bull; Field Journal &bull; 2026
          </p>
        </div>
      </section>
    </div>
  );
}
