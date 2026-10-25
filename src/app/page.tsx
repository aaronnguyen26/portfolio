"use client";

import React, { useState, useEffect } from "react";
import Book from "@/components/Book";
import Spread from "@/components/Spread";
import TurnLink from "@/components/TurnLink";
import ProjectJourneyFan from "@/components/ProjectJourneyFan";
import MobileHomeLayout from "@/components/MobileHomeLayout";
import { site, projects } from "@/data/site";

export default function Home() {
  const [isJourneyOpen, setIsJourneyOpen] = useState(false);
  const [cardOriginRect, setCardOriginRect] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
  } | null>(null);
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 768px)");
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    setIsMobile(mql.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  const wildfireProject = projects.find((p) => p.slug === "firecnn") || null;

  const handleCardClick = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    setCardOriginRect({
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
    });
    setIsJourneyOpen(true);
  };

  const handleCardKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const rect = e.currentTarget.getBoundingClientRect();
      setCardOriginRect({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      });
      setIsJourneyOpen(true);
    }
  };

  return (
    <Book>
      {/* Mobile-Only Home View: Story Reel & Feed */}
      {(isMobile === true || isMobile === null) && (
        <div className="mobile-home-view">
          <MobileHomeLayout
            onOpenJourney={(originRect) => {
              setCardOriginRect(originRect);
              setIsJourneyOpen(true);
            }}
          />
        </div>
      )}

      {/* Desktop-Only Home View: 2-Page Editorial Book Spread */}
      {(isMobile === false || isMobile === null) && (
        <div className="desktop-home-view">
          <section className="hero">
            <h1 className="display rise">{site.name}</h1>
            <p className="lede rise d1">
              student &amp; <span className="hl">curious builder</span>, capturing the{" "}
              <span className="hl">stories &amp; systems</span> behind what I create.
            </p>

            <div className="rise d2">
              <Spread />
            </div>

            <div className="rise d3" style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", marginTop: 46 }}>
              <TurnLink href="/projects" className="btn solid mono">View projects &rarr;</TurnLink>
              <TurnLink href="/about" className="btn mono">Read my story</TurnLink>
            </div>
          </section>

          <section className="explore" style={{ marginTop: 52 }}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 16 }}>
              <h2>Recent Explorations</h2>
              <span className="mono" style={{ fontSize: "0.75rem", color: "var(--ink-soft)" }}>
                CHAPTER 01 &bull; FIELD LOG &amp; SELECTED EXPLORATIONS
              </span>
            </div>

            <div className="row" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 18 }}>
              {/* Exploration 01: Real-Time Audio Canvas */}
              <TurnLink
                href="/projects"
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  display: "flex",
                  flexDirection: "column",
                  background: "var(--paper-2)",
                  border: "1px solid rgba(31, 26, 20, 0.14)",
                  borderRadius: 6,
                  padding: "18px 20px",
                  boxShadow: "0 2px 6px -2px rgba(44, 24, 16, 0.08)",
                  transition: "transform 0.16s ease, box-shadow 0.16s ease, border-color 0.16s ease",
                  cursor: "pointer",
                  textAlign: "left",
                }}
                className="exploration-card-interactive"
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span className="mono" style={{ color: "var(--cardinal)", fontWeight: 600, fontSize: "0.72rem", display: "block" }}>
                    EXPLORATION 01
                  </span>
                  <span style={{ color: "var(--cardinal)", fontSize: "0.85rem", fontWeight: 700 }}>&rarr;</span>
                </div>
                <div style={{ fontSize: "1.02rem", fontWeight: 700, color: "var(--ink)", marginTop: 2 }}>
                  Real-Time Audio Canvas
                </div>
                <p className="mono" style={{ marginTop: 8, color: "var(--ink-soft)", fontSize: "0.71rem", lineHeight: 1.45, flexGrow: 1 }}>
                  In-browser collaborative audio playground with low-latency DSP synthesis, multi-track rooms, and WebSockets synchronization.
                </p>
                <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    <span className="mono" style={{ fontSize: "0.62rem", padding: "2px 7px", background: "rgba(31, 26, 20, 0.06)", color: "var(--ink)", borderRadius: 3 }}>
                      TypeScript
                    </span>
                    <span className="mono" style={{ fontSize: "0.62rem", padding: "2px 7px", background: "rgba(31, 26, 20, 0.06)", color: "var(--ink)", borderRadius: 3 }}>
                      WebAudio API
                    </span>
                    <span className="mono" style={{ fontSize: "0.62rem", padding: "2px 7px", background: "rgba(31, 26, 20, 0.06)", color: "var(--ink)", borderRadius: 3 }}>
                      &lt;15ms Sync
                    </span>
                  </div>
                  <span className="mono" style={{ fontSize: "0.70rem", color: "var(--cardinal)", fontWeight: 600, whiteSpace: "nowrap" }}>
                    View Project &rarr;
                  </span>
                </div>
              </TurnLink>

              {/* Exploration 02: EPL Outcome Predictor */}
              <TurnLink
                href="/projects?open=epl-predictor"
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  display: "flex",
                  flexDirection: "column",
                  background: "var(--paper-2)",
                  border: "1px solid rgba(31, 26, 20, 0.14)",
                  borderRadius: 6,
                  padding: "18px 20px",
                  boxShadow: "0 2px 6px -2px rgba(44, 24, 16, 0.08)",
                  transition: "transform 0.16s ease, box-shadow 0.16s ease, border-color 0.16s ease",
                  cursor: "pointer",
                  textAlign: "left",
                }}
                className="exploration-card-interactive"
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span className="mono" style={{ color: "var(--cardinal)", fontWeight: 600, fontSize: "0.72rem", display: "block" }}>
                    EXPLORATION 02
                  </span>
                  <span style={{ color: "var(--cardinal)", fontSize: "0.85rem", fontWeight: 700 }}>&rarr;</span>
                </div>
                <div style={{ fontSize: "1.02rem", fontWeight: 700, color: "var(--ink)", marginTop: 2 }}>
                  EPL 2025: Match Outcome Predictor
                </div>
                <p className="mono" style={{ marginTop: 8, color: "var(--ink-soft)", fontSize: "0.71rem", lineHeight: 1.45, flexGrow: 1 }}>
                  Hybrid XGBoost and bivariate Poisson simulation framework forecasting Premier League scorelines from dynamic Elo ratings and FBref expected goals.
                </p>
                <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    <span className="mono" style={{ fontSize: "0.62rem", padding: "2px 7px", background: "rgba(31, 26, 20, 0.06)", color: "var(--ink)", borderRadius: 3 }}>
                      XGBoost
                    </span>
                    <span className="mono" style={{ fontSize: "0.62rem", padding: "2px 7px", background: "rgba(31, 26, 20, 0.06)", color: "var(--ink)", borderRadius: 3 }}>
                      Poisson Sim
                    </span>
                    <span className="mono" style={{ fontSize: "0.62rem", padding: "2px 7px", background: "rgba(31, 26, 20, 0.06)", color: "var(--ink)", borderRadius: 3 }}>
                      58.2% Accuracy
                    </span>
                  </div>
                  <span className="mono" style={{ fontSize: "0.70rem", color: "var(--cardinal)", fontWeight: 600, whiteSpace: "nowrap" }}>
                    View Scouting Folio &rarr;
                  </span>
                </div>
              </TurnLink>

              {/* Exploration 03: FireCNN Wildfire Image Detection */}
              <div
                role="button"
                tabIndex={0}
                onClick={handleCardClick}
                onKeyDown={handleCardKeyDown}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  display: "flex",
                  flexDirection: "column",
                  background: "var(--paper-2)",
                  border: "1px solid rgba(138, 28, 28, 0.32)",
                  borderRadius: 6,
                  padding: "18px 20px",
                  boxShadow: "0 2px 6px -2px rgba(138, 28, 28, 0.12)",
                  transition: "transform 0.16s ease, box-shadow 0.16s ease, border-color 0.16s ease",
                  cursor: "pointer",
                  textAlign: "left",
                }}
                className="exploration-card-interactive"
                aria-label="FireCNN: Wildfire Image Detection — Explore Project Journey"
                aria-haspopup="dialog"
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span className="mono" style={{ color: "var(--cardinal)", fontWeight: 600, fontSize: "0.72rem", display: "block" }}>
                    EXPLORATION 03
                  </span>
                  <span style={{ color: "var(--cardinal)", fontSize: "0.85rem", fontWeight: 700 }}>&rarr;</span>
                </div>
                <div style={{ fontSize: "1.02rem", fontWeight: 700, color: "var(--ink)", marginTop: 2 }}>
                  FireCNN: Wildfire Image Detection
                </div>
                <p className="mono" style={{ marginTop: 8, color: "var(--ink-soft)", fontSize: "0.71rem", lineHeight: 1.45, flexGrow: 1 }}>
                  Lightweight 3-stage CNN classifying early-stage wildfire ignitions in under 15ms. 33.9 MB edge deployment for aerial drone relays.
                </p>
                <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    <span className="mono" style={{ fontSize: "0.62rem", padding: "2px 7px", background: "rgba(138, 28, 28, 0.08)", color: "var(--cardinal)", borderRadius: 3, fontWeight: 600 }}>
                      Computer Vision
                    </span>
                    <span className="mono" style={{ fontSize: "0.62rem", padding: "2px 7px", background: "rgba(31, 26, 20, 0.06)", color: "var(--ink)", borderRadius: 3 }}>
                      PyTorch MPS
                    </span>
                    <span className="mono" style={{ fontSize: "0.62rem", padding: "2px 7px", background: "rgba(31, 26, 20, 0.06)", color: "var(--ink)", borderRadius: 3 }}>
                      Sub-15ms Edge
                    </span>
                  </div>
                  <span className="mono" style={{ fontSize: "0.70rem", color: "var(--cardinal)", fontWeight: 600, whiteSpace: "nowrap" }}>
                    Explore Journey &rarr;
                  </span>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* Project Journey Fan Overlay (Wildfire Project 03) */}
      <ProjectJourneyFan
        isOpen={isJourneyOpen}
        onClose={() => {
          setIsJourneyOpen(false);
          setCardOriginRect(null);
        }}
        project={wildfireProject}
        originRect={cardOriginRect}
      />
    </Book>
  );
}
