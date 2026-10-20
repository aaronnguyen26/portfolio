"use client";

import React, { useState } from "react";
import Book from "@/components/Book";
import Spread from "@/components/Spread";
import TurnLink from "@/components/TurnLink";
import ProjectJourneyFan from "@/components/ProjectJourneyFan";
import { site, projects } from "@/data/site";

export default function Home() {
  const [isJourneyOpen, setIsJourneyOpen] = useState(false);
  const [cardOriginRect, setCardOriginRect] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
  } | null>(null);

  const wildfireProject = projects.find((p) => p.n === "03") || null;

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
            CHAPTER 02 &bull; PROJECT INDEX [DECIDING]
          </span>
        </div>

        <div className="row" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 18 }}>
          <div style={{ background: "var(--paper-2)", border: "1px solid rgba(31, 26, 20, 0.12)", borderRadius: 6, padding: "18px 20px" }}>
            <span className="mono" style={{ color: "var(--cardinal)", fontWeight: 600, fontSize: "0.72rem", display: "block" }}>
              EXPLORATION 01
            </span>
            <div style={{ fontSize: "0.98rem", fontWeight: 600, color: "var(--ink)", marginTop: 2 }}>
              [ Project Alpha - Quantitative macro simulator ]
            </div>
            <p className="mono" style={{ marginTop: 8, color: "var(--ink-soft)", fontSize: "0.69rem", lineHeight: 1.4 }}>
              Placeholder project &bull; Exploring incentive models and market agent dynamics.
            </p>
          </div>

          <div style={{ background: "var(--paper-2)", border: "1px solid rgba(31, 26, 20, 0.12)", borderRadius: 6, padding: "18px 20px" }}>
            <span className="mono" style={{ color: "var(--cardinal)", fontWeight: 600, fontSize: "0.72rem", display: "block" }}>
              EXPLORATION 02
            </span>
            <div style={{ fontSize: "0.98rem", fontWeight: 600, color: "var(--ink)", marginTop: 2 }}>
              [ Project Beta - Network analysis of market contagion ]
            </div>
            <p className="mono" style={{ marginTop: 8, color: "var(--ink-soft)", fontSize: "0.69rem", lineHeight: 1.4 }}>
              Placeholder project &bull; Graph theory applied to financial network cascades.
            </p>
          </div>

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
                  Custom 3-Stage CNN
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
