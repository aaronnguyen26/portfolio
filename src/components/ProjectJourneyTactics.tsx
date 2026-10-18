"use client";

import React, { useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { projects } from "@/data/site";

interface ProjectJourneyTacticsProps {
  isOpen: boolean;
  onClose: () => void;
  project: (typeof projects)[0] | null;
  originRect: { top: number; left: number; width: number; height: number } | null;
}

interface TacticalPhase {
  id: number;
  num: string;
  codename: string;
  title: string;
  subtitle: string;
  motivationHeader: string;
  motivationBody: string;
  metrics: {
    val: string;
    label: string;
    sub: string;
  }[];
  tradeOff: {
    heading: string;
    detail: string;
  };
  scoutNote: string;
}

const tacticalPhases: TacticalPhase[] = [
  {
    id: 1,
    num: "01",
    codename: "THE PARADOX",
    title: "The 2.7-Goal Predictability Paradox",
    subtitle: "Low goal frequency generates extreme stochastic noise where inferior teams win on deflections.",
    motivationHeader: "CHIEF SCOUT DIRECTIVE · PERSONAL MOTIVATION",
    motivationBody:
      "Watching weekend Premier League matches on cold afternoons, I realized the core problem: football averages only 2.7 goals per 90 minutes. This creates massive variance where lucky deflections decide matches, while commercial bookmakers exploit public hype around legacy clubs like Manchester United to skew betting lines.",
    metrics: [
      { val: "2.72", label: "AVG GOALS", sub: "Scarcity Index" },
      { val: "26.8%", label: "DRAW CLIFF", sub: "Historical Rate" },
      { val: "3,040", label: "FIXTURES", sub: "8 Seasons Data" },
    ],
    tradeOff: {
      heading: "Zero-Odds Mandate vs Market Shortcuts",
      detail:
        "Forbidding commercial betting odds as model inputs, forcing predictions to rely strictly on dynamic Elo and underlying shot generation.",
    },
    scoutNote:
      "↳ Scout Note: Football matches aren't won by luck; they are won by teams consistently generating high-probability xG funnels.",
  },
  {
    id: 2,
    num: "02",
    codename: "DYNAMIC ELO",
    title: "Feature Scouting & Continuous Elo",
    subtitle: "Overcoming league table lag with continuous match-by-match squad skill tracking.",
    motivationHeader: "DATA SCOUT DISPATCH · FEATURE INGESTION",
    motivationBody:
      "Official league standings lag real squad capability by 4 to 6 weeks. We compute dynamic Elo ratings updated after every single 90-minute fixture with a +70 home field advantage offset, and ingest FBref shot-creation actions to quantify underlying quality.",
    metrics: [
      { val: "18", label: "VECTORS", sub: "Tactical Feature Set" },
      { val: "+70", label: "HOME ELO", sub: "Advantage Boost" },
      { val: "5 M", label: "DECAY", sub: "Rolling Form Window" },
    ],
    tradeOff: {
      heading: "Continuous Elo Updates vs League Table Inertia",
      detail:
        "Capturing managerial bounce effects and squad momentum instantly while applying fatigue penalties for teams with 3-day European turnarounds.",
    },
    scoutNote:
      "↳ Scout Note: +70 Elo points accurately models the hostile refereeing pressure and crowd intensity at Anfield and St James' Park.",
  },
  {
    id: 3,
    num: "03",
    codename: "THE DUAL ENGINE",
    title: "Decoupled XGBoost + Poisson Core",
    subtitle: "Why end-to-end classification fails on soccer and how a two-stage hybrid solves it.",
    motivationHeader: "CHIEF ARCHITECT DISPATCH · ALGORITHMIC CORE",
    motivationBody:
      "Standard neural networks overfit tabular sports data. We engineered a dual-engine: independent XGBoost regressors predict continuous home and away goal intensities (λ_H, λ_A), feeding a 5x5 bivariate Poisson probability matrix ensembled with a 3-way calibrated classifier.",
    metrics: [
      { val: "2-Stage", label: "HYBRID", sub: "Decoupled Pipeline" },
      { val: "5x5", label: "POISSON", sub: "Scoreline Grid" },
      { val: "0.87", label: "AWAY MAE", sub: "Goal Delta Benchmark" },
    ],
    tradeOff: {
      heading: "Gradient-Boosted Trees vs Deep Neural Nets",
      detail:
        "Decision trees preserve sharp Elo decision boundaries without memorizing noise, while Poisson modeling coherently prices stalemates.",
    },
    scoutNote:
      "↳ Scout Note: Decoupling goal intensity from 3-way outcome classification prevents underestimating high-scoring stalemates.",
  },
  {
    id: 4,
    num: "04",
    codename: "SIMULATOR",
    title: "Sub-15ms Matchday Simulator",
    subtitle: "Simulating any Premier League fixture with live tactical scenario testing.",
    motivationHeader: "SIDELINE MANAGER DISPATCH · SIMULATION ENGINE",
    motivationBody:
      "The simulation engine bundles pre-trained weights in an in-memory joblib pipeline. Selecting any two Premier League clubs computes win/draw/away probabilities, projected scorelines, and tactical managerial summaries in under 15 milliseconds.",
    metrics: [
      { val: "31", label: "EPL CLUBS", sub: "Supported Teams" },
      { val: "< 15ms", label: "LATENCY", sub: "In-Memory Inference" },
      { val: "Top 3", label: "RANKS", sub: "Probable Scorelines" },
    ],
    tradeOff: {
      heading: "In-Memory Serialization vs Static Lookup",
      detail:
        "Bundling lightweight pipelines enables instantaneous client evaluations and dynamic managerial tactical verdicts.",
    },
    scoutNote:
      "↳ Scout Note: Sub-15ms inference speed allows analysts to stress-test hypothetical squad rotations and rest days before kickoff.",
  },
  {
    id: 5,
    num: "05",
    codename: "EMPIRICAL AUDIT",
    title: "Holdout Scorecard & Empirical Validation",
    subtitle: "Rigorous out-of-sample evaluation across 8 seasons against baseline heuristics.",
    motivationHeader: "VAR RETROSPECTIVE · EMPIRICAL SCORECARD",
    motivationBody:
      "Rigorous evaluation on the out-of-sample 2024 holdout test set demonstrated a 58.2% 3-way directional accuracy, outperforming the naive home-win baseline (46.2%) by +12.0%. Home and away goal MAE remained below 1.0, proving that underlying xG chance quality strips out stochastic noise.",
    metrics: [
      { val: "58.2%", label: "ACCURACY", sub: "3-Way Test Set" },
      { val: "+12.0%", label: "GAIN", sub: "Over Naive Baseline" },
      { val: "1.00", label: "LOG LOSS", sub: "Calibrated Softmax" },
    ],
    tradeOff: {
      heading: "Beating Naive Baselines in High-Variance Sports",
      detail:
        "Rolling time-series split cross-validation ensures future fixtures never leak into historical training data while capturing draw risk.",
    },
    scoutNote:
      "↳ Scout Note: Rest-day fatigue and progressive xG carries are vastly more predictive of match outcomes than raw past scorelines.",
  },
];

export default function ProjectJourneyTactics({
  isOpen,
  onClose,
  project,
}: ProjectJourneyTacticsProps) {
  const [mounted, setMounted] = useState(false);
  const [overlayActive, setOverlayActive] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      const t = setTimeout(() => setOverlayActive(true), 30);
      document.body.style.overflow = "hidden";
      return () => clearTimeout(t);
    } else {
      setOverlayActive(false);
      document.body.style.overflow = "";
    }
  }, [isOpen]);

  // Keyboard controls: 1-5, ArrowLeft, ArrowRight, ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") {
        e.preventDefault();
        handleClose();
      } else if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIdx((prev) => (prev + 1) % tacticalPhases.length);
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIdx((prev) => (prev - 1 + tacticalPhases.length) % tacticalPhases.length);
      } else if (e.key >= "1" && e.key <= "5") {
        const target = parseInt(e.key, 10) - 1;
        if (target >= 0 && target < tacticalPhases.length) {
          setActiveIdx(target);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleClose = useCallback(() => {
    setOverlayActive(false);
    setTimeout(() => {
      onClose();
      setActiveIdx(0);
    }, 280);
  }, [onClose]);

  if (!mounted || !isOpen || !project) return null;

  const current = tacticalPhases[activeIdx];
  const satellites = tacticalPhases.filter((_, idx) => idx !== activeIdx);

  return createPortal(
    <div
      className={`tactical-arena-overlay ${overlayActive ? "active" : ""}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Tactical Passing Arena"
    >
      {/* Top Header Bar */}
      <header className="tactical-arena-header">
        <div className="tah-left">
          <span className="tah-eyebrow">PROJECT JOURNEY · PREMIER LEAGUE</span>
          <h2 className="tah-title">
            EPL 2025: <em>Match Outcome Predictor</em>
          </h2>
          <span className="tah-phase-badge">
            PHASE {current.num} / 05 &middot; {current.codename}
          </span>
        </div>
        <div className="tah-right">
          <button
            type="button"
            onClick={handleClose}
            className="tah-btn-close"
            title="Exit to Workbench [ESC]"
            aria-label="Exit to Workbench"
          >
            <span>Close</span>
            <kbd className="tah-esc">ESC</kbd>
          </button>
        </div>
      </header>

      {/* Main 2-Column Stage */}
      <div className="tactical-arena-stage">
        {/* =====================================================================
            LEFT COLUMN: THE PROJECT DOSSIER CARD
            Matches the portfolio's warm ivory paper card & polaroid aesthetic
            ===================================================================== */}
        <aside className="tactical-sidebar-card">
          <div className="tactical-tape" />

          {/* Photo Thumbnail */}
          <div className="tactical-card-shot">
            <Image
              src="/epl_match_hero.jpg"
              alt="EPL Match Hero"
              fill
              sizes="320px"
              priority
              className="tactical-shot-img"
            />
            <div className="tactical-shot-badge">
              <span className="tsb-dot" />
              <span>Premier League · UK</span>
            </div>
          </div>

          <div className="tsc-meta">
            <span className="tsc-num">
              No. {project.n} &middot; {project.category}
            </span>
            <span className="tsc-year">{project.year}</span>
          </div>

          <h3 className="tsc-title">{project.title}</h3>
          <p className="tsc-blurb">{project.blurb}</p>

          <dl className="tsc-specs">
            <dt>MY ROLE</dt>
            <dd>{project.role}</dd>
            <dt>OUTCOME</dt>
            <dd>{project.outcome}</dd>
          </dl>

          <div className="tsc-tags">
            {project.tags.map((t) => (
              <span key={t} className="tsc-tag">
                {t}
              </span>
            ))}
          </div>

          <p className="tsc-handnote">↳ {project.note}</p>

          {/* Phase Selector Tabs */}
          <div className="tsc-phase-nav-block">
            <span className="tsc-pnb-title">TACTICAL PHASES</span>
            <div className="tsc-phase-list">
              {tacticalPhases.map((p, idx) => {
                const isActive = activeIdx === idx;
                return (
                  <button
                    key={p.num}
                    type="button"
                    onClick={() => setActiveIdx(idx)}
                    className={`tsc-phase-btn ${isActive ? "selected" : ""}`}
                  >
                    <span className="tpb-num">{p.num}</span>
                    <span className="tpb-name">{p.codename}</span>
                    {isActive && <span className="tpb-active-indicator">&bull;</span>}
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* =====================================================================
            RIGHT COLUMN: WARM LEATHER DESK MAT HOLDING THE CIRCULAR FORMATION
            Zero rectangles on the right side.
            Central warm vellum circular loupe with 4 orbiting circular satellite tokens.
            ===================================================================== */}
        <main className="tactical-orbit-arena">
          {/* Subtle Warm Chalk Pitch Canvas */}
          <svg className="tactical-chalk-canvas" viewBox="0 0 760 540" fill="none">
            {/* Outer orbital passing ring */}
            <circle
              cx="380"
              cy="270"
              r="230"
              stroke="rgba(255, 204, 0, 0.22)"
              strokeWidth="1.5"
              strokeDasharray="6 8"
            />
            {/* Center spot */}
            <circle cx="380" cy="270" r="4" fill="#c59b27" />
            <circle cx="380" cy="270" r="28" stroke="rgba(255, 204, 0, 0.2)" strokeWidth="1" />
            {/* Curved Passing Trajectory vectors connecting satellites to center */}
            <path
              d="M 120 120 Q 230 180 380 270"
              stroke="rgba(255, 204, 0, 0.25)"
              strokeWidth="1.5"
              strokeDasharray="4 6"
            />
            <path
              d="M 640 120 Q 530 180 380 270"
              stroke="rgba(255, 204, 0, 0.25)"
              strokeWidth="1.5"
              strokeDasharray="4 6"
            />
            <path
              d="M 140 420 Q 240 360 380 270"
              stroke="rgba(255, 204, 0, 0.25)"
              strokeWidth="1.5"
              strokeDasharray="4 6"
            />
            <path
              d="M 620 420 Q 520 360 380 270"
              stroke="rgba(255, 204, 0, 0.25)"
              strokeWidth="1.5"
              strokeDasharray="4 6"
            />
          </svg>

          {/* 4 Orbiting Circular Satellite Tokens */}
          <div className="tactical-satellites-layer">
            {satellites.map((sat, sIdx) => {
              const origIdx = tacticalPhases.findIndex((p) => p.num === sat.num);
              const posClasses = ["pos-tl", "pos-tr", "pos-bl", "pos-br"];
              return (
                <button
                  key={sat.num}
                  type="button"
                  onClick={() => setActiveIdx(origIdx)}
                  className={`satellite-token-btn ${posClasses[sIdx]}`}
                  title={`Switch to Phase ${sat.num}: ${sat.title}`}
                >
                  <div className="stb-inner-disc">
                    <span className="stb-num">{sat.num}</span>
                    <span className="stb-label">{sat.codename}</span>
                  </div>
                  <span className="stb-pulse-ring" />
                </button>
              );
            })}
          </div>

          {/* ===================================================================
              CENTER PIECE: THE CIRCULAR TACTICAL INSPECTION DISC
              A pure geometric circle made of warm ivory vellum (#fffdfa).
              Double aged brass rim with cardinal accents. ZERO RECTANGLES.
              =================================================================== */}
          <div className="tactical-disc-center">
            <div className="tdc-machined-ring">
              <div className="tdc-vellum-face">
                {/* 1. Disc Header Badge */}
                <div className="tdc-header-block">
                  <span className="tdc-phase-pill">
                    PHASE {current.num} &middot; {current.codename}
                  </span>
                  <h3 className="tdc-title">{current.title}</h3>
                  <p className="tdc-subtitle">{current.subtitle}</p>
                </div>

                {/* 2. Pinned Personal Motivation Memorandum */}
                <div className="tdc-memo-ribbon">
                  <div className="tmr-header">
                    <span className="tmr-tag">{current.motivationHeader}</span>
                    <span className="tmr-author">AUTHOR DIRECTIVE</span>
                  </div>
                  <p className="tmr-text">{current.motivationBody}</p>
                </div>

                {/* 3. Circular Micro-Metrics Trio in Warm Vellum */}
                <div className="tdc-metrics-trio">
                  {current.metrics.map((m, mIdx) => (
                    <div key={mIdx} className="tdc-metric-disc">
                      <span className="tmd-val">{m.val}</span>
                      <span className="tmd-label">{m.label}</span>
                      <span className="tmd-sub">{m.sub}</span>
                    </div>
                  ))}
                </div>

                {/* 4. Architectural Trade-Off Leader */}
                <div className="tdc-tradeoff-line">
                  <span className="ttl-arrow">●──────&gt;</span>
                  <span className="ttl-text">
                    <strong>{current.tradeOff.heading}:</strong> {current.tradeOff.detail}
                  </span>
                </div>

                {/* 5. Handwritten Fountain Pen Sideline Memo (Blue-black ink #243b6b) */}
                <div className="tdc-handnote-row">
                  <p className="tdc-handnote">{current.scoutNote}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Quick-Step Tactical Bar */}
          <div className="tactical-bottom-nav">
            <button
              type="button"
              onClick={() => setActiveIdx((prev) => (prev - 1 + tacticalPhases.length) % tacticalPhases.length)}
              className="tbn-step-btn prev"
              title="Previous Phase [←]"
            >
              &larr; Prev Phase
            </button>

            <span className="tbn-indicator">
              PHASE {current.num} OF 05 &middot; KEY [1-5]
            </span>

            <button
              type="button"
              onClick={() => setActiveIdx((prev) => (prev + 1) % tacticalPhases.length)}
              className="tbn-step-btn next"
              title="Next Phase [→]"
            >
              Next Phase &rarr;
            </button>
          </div>
        </main>
      </div>
    </div>,
    document.body
  );
}
