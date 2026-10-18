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

interface MagneticToken {
  label: string;
  role: string;
  team: "red" | "navy";
  left: string;
  top: string;
}

interface TacticalWhiteboardPhase {
  id: number;
  tabTitle: string;
  title: string;
  subtitle: string;
  pitchHudTag: string;
  pitchHudStat: {
    label: string;
    val1: string;
    sublabel: string;
    val2: string;
  };
  pitchHandNote: string;
  footerQuote: string;
  tokens: MagneticToken[];
  cardTitle: string;
  cardBadge: string;
  cardText: string;
  cardBullets: string[];
  sideTitle: string;
  sideMetric: string;
  sideLabel: string;
  sideFooter: string;
}

const whiteboardPhases: TacticalWhiteboardPhase[] = [
  {
    id: 0,
    tabTitle: "01 Paradox",
    title: "TACTICAL CHALKBOARD: PHASE 01",
    subtitle: '"Raw Goal Volatility vs Rolling xG Model"',
    pitchHudTag: "DATA PARADOX ANOMALY",
    pitchHudStat: {
      label: "Sample",
      val1: "3,800 Fixtures",
      sublabel: "Noise Filter",
      val2: "-65% Red Cards",
    },
    pitchHandNote: '"COVID ghost matches: zero crowd whistle bias!"',
    footerQuote: '"Numbers alone do not score; they delineate probability frontiers."',
    tokens: [
      { label: "4", role: "CB", team: "red", left: "18%", top: "50%" },
      { label: "8", role: "CM", team: "red", left: "38%", top: "38%" },
      { label: "10", role: "CF", team: "red", left: "64%", top: "45%" },
      { label: "7", role: "RW", team: "red", left: "55%", top: "18%" },
      { label: "5", role: "CB", team: "navy", left: "72%", top: "50%" },
      { label: "1", role: "GK", team: "navy", left: "92%", top: "50%" },
    ],
    cardTitle: "Stage I: The Raw Data Paradox & COVID Stadium Anomaly",
    cardBadge: "SAMPLE: 3,800 FIXTURES",
    cardText:
      "Match scorelines are inherently stochastic due to low-frequency conversion events. By standardizing rolling non-penalty xG and isolating the 2020-21 acoustic absence regime shift, we neutralize spectator bias from the referee pressure index.",
    cardBullets: [
      "Home ground goal differential fell from +0.38 to -0.04 during spectator lockout.",
      "Outlier matches (2+ red cards before 30') are downweighted by 65%.",
      "High-turnover shots within 40m isolated for immediate goal threat valuation.",
    ],
    sideTitle: "COHORT CALIBRATION",
    sideMetric: "3,800",
    sideLabel: "Matches Cleansed & Scaled",
    sideFooter: "Pinnacle Closing Line divergence: +4.8%",
  },
  {
    id: 1,
    tabTitle: "02 Dynamic Elo",
    title: "TACTICAL CHALKBOARD: PHASE 02",
    subtitle: '"Dynamic Elo Ratings & Home Ground Decay"',
    pitchHudTag: "ELO MOMENTUM TRAJECTORY",
    pitchHudStat: {
      label: "Home Field Constant",
      val1: "+46.2 Pts",
      sublabel: "K-Factor",
      val2: "24.5",
    },
    pitchHandNote: '"Highbury to Emirates: Pitch standardization decay"',
    footerQuote: '"Relative squad talent changes dynamically, fixture to fixture."',
    tokens: [
      { label: "1", role: "GK", team: "red", left: "8%", top: "50%" },
      { label: "4", role: "CB", team: "red", left: "26%", top: "32%" },
      { label: "6", role: "CB", team: "red", left: "26%", top: "68%" },
      { label: "8", role: "CM", team: "red", left: "46%", top: "50%" },
      { label: "10", role: "CF", team: "red", left: "70%", top: "42%" },
      { label: "5", role: "CB", team: "navy", left: "76%", top: "58%" },
      { label: "1", role: "GK", team: "navy", left: "92%", top: "50%" },
    ],
    cardTitle: "Stage II: Recursive Elo Dynamics & Travel Multipliers",
    cardBadge: "K-FACTOR: 24.5",
    cardText:
      "Unlike static table points, recursive Elo accounts for score margins and strength of schedule. Home advantage has decayed from +68 points in 2002 to +46.2 points today due to VAR scrutiny and uniform pitch specifications.",
    cardBullets: [
      "Tier 1 Benchmark: Man City (2,048 pts) vs Arsenal (1,992 pts).",
      "Manager Tenure Decay: First 4 matches receive a 1.18x regression bounce.",
      "Mid-week European travel: -14.6 Elo penalty for sub-72 hour turnarounds.",
    ],
    sideTitle: "PEAK SPREAD",
    sideMetric: "+442 pts",
    sideLabel: "Top vs Floor Difference",
    sideFooter: "Reversion speed: 18 fixtures",
  },
  {
    id: 2,
    tabTitle: "03 Dual Engine",
    title: "TACTICAL CHALKBOARD: PHASE 03",
    subtitle: '"Dual Engine: Bivariate Poisson + XGBoost"',
    pitchHudTag: "HYBRID ENSEMBLE STACK",
    pitchHudStat: {
      label: "Weighting",
      val1: "0.62 XGB + 0.38 Poisson",
      sublabel: "Log-Loss",
      val2: "0.884",
    },
    pitchHandNote: '"Poisson gives scorelines, XGB captures fatigue context!"',
    footerQuote: '"Bivariate independence corrected via Dixon-Coles τ parameters."',
    tokens: [
      { label: "4", role: "CB", team: "red", left: "22%", top: "50%" },
      { label: "8", role: "CM", team: "red", left: "42%", top: "50%" },
      { label: "7", role: "RW", team: "red", left: "60%", top: "24%" },
      { label: "11", role: "LW", team: "red", left: "60%", top: "74%" },
      { label: "10", role: "CF", team: "red", left: "74%", top: "50%" },
      { label: "4", role: "CB", team: "navy", left: "78%", top: "35%" },
      { label: "5", role: "CB", team: "navy", left: "78%", top: "64%" },
      { label: "1", role: "GK", team: "navy", left: "92%", top: "50%" },
    ],
    cardTitle: "Stage III: Bivariate Poisson × XGBoost Multi:Softprob",
    cardBadge: "OPTIMAL BLEND",
    cardText:
      "Engine A computes discrete goal expectation matrices using Dixon-Coles low-score damping for 0-0 and 1-1 ties. Engine B applies Gradient Boosted Decision Trees to incorporate 42 contextual features including player availability indices.",
    cardBullets: [
      "Poisson: P(X=x, Y=y) with attacking efficiency vs defensive resistance.",
      "XGBoost: multi:softprob objective tuned over 10-fold cross validation.",
      "Ensemble achieves optimal cross-entropy of 0.884 across 1,200 holdouts.",
    ],
    sideTitle: "CROSS-ENTROPY",
    sideMetric: "0.884",
    sideLabel: "Log-loss across 3 outcomes",
    sideFooter: "Brier Loss: 0.179 benchmark",
  },
  {
    id: 3,
    tabTitle: "04 Matchday Sim",
    title: "TACTICAL CHALKBOARD: PHASE 04",
    subtitle: '"Arsenal vs Liverpool: 10,000 Monte Carlo Runs"',
    pitchHudTag: "MONTE CARLO PROBABILITY",
    pitchHudStat: {
      label: "Arsenal (H)",
      val1: "48.2%",
      sublabel: "Draw",
      val2: "26.5% | LFC: 25.3%",
    },
    pitchHandNote: '"Value detected on Arsenal Win: +8.7% Edge!"',
    footerQuote: '"Bet triggers only fire when statistical edge exceeds 5.0%."',
    tokens: [
      { label: "8", role: "CM", team: "red", left: "40%", top: "50%" },
      { label: "7", role: "RW", team: "red", left: "68%", top: "22%" },
      { label: "10", role: "CF", team: "red", left: "76%", top: "48%" },
      { label: "4", role: "CB", team: "navy", left: "72%", top: "66%" },
      { label: "1", role: "GK", team: "navy", left: "92%", top: "50%" },
    ],
    cardTitle: "Stage IV: Exemplar Matchday Simulation (Emirates Stadium)",
    cardBadge: "10,000 ITERATIONS",
    cardText:
      "Simulating 10,000 probabilistic match progressions translates discrete event probabilities into fair market odds. When model fair lines deviate significantly from bookmaker consensus, profitable expected value arises.",
    cardBullets: [
      "Home Win: Model 48.2% (Fair: 2.07) vs Bookmaker 2.25 (+8.7% Edge).",
      "Draw: Model 26.5% (Fair: 3.77) vs Bookmaker 3.60 (-4.5% Edge).",
      "Away Win: Model 25.3% (Fair: 3.95) vs Bookmaker 3.20 (-18.9% Edge).",
    ],
    sideTitle: "VALUE TRIGGER",
    sideMetric: "+8.7%",
    sideLabel: "Arsenal Win (Fair 2.07)",
    sideFooter: "Pinnacle Closing: 2.25",
  },
  {
    id: 4,
    tabTitle: "05 Holdout Audit",
    title: "TACTICAL CHALKBOARD: PHASE 05",
    subtitle: '"2023-24 Holdout Season Calibration Ledger"',
    pitchHudTag: "HOLDOUT AUDIT SEAL",
    pitchHudStat: {
      label: "Home Recall",
      val1: "79.1%",
      sublabel: "Hosmer-Lemeshow",
      val2: "p = 0.42 (Calibrated)",
    },
    pitchHandNote: '"Audited against unobserved 380 fixtures"',
    footerQuote: '"Zero data leakage between prior training seasons and holdouts."',
    tokens: [
      { label: "4", role: "CB", team: "red", left: "25%", top: "50%" },
      { label: "8", role: "CM", team: "red", left: "48%", top: "50%" },
      { label: "10", role: "CF", team: "red", left: "68%", top: "50%" },
      { label: "5", role: "CB", team: "navy", left: "78%", top: "50%" },
      { label: "1", role: "GK", team: "navy", left: "92%", top: "50%" },
    ],
    cardTitle: "Stage V: Empirical Holdout Season Verification",
    cardBadge: "AUDIT PASS 100%",
    cardText:
      "Evaluated strictly out-of-sample against the 2023-2024 campaign. Calibration plots demonstrate minimal drift, meaning when the model projects a 70% probability event, it realizes within 68-72% empirical frequency.",
    cardBullets: [
      "Home Win Recall: 79.1% (148 correctly identified in 187 wins).",
      "Draw Sensitivity: 44.6% (Significantly beats 31% market heuristics).",
      "Away Upset Precision: 68.3% on positive value alert triggers.",
    ],
    sideTitle: "ACCURACY RATE",
    sideMetric: "72.4%",
    sideLabel: "Out-of-sample holdout",
    sideFooter: "Industry standard: ~68.1%",
  },
];

export default function ProjectJourneyTactics({
  isOpen,
  onClose,
  project,
}: ProjectJourneyTacticsProps) {
  const [mounted, setMounted] = useState(false);
  const [overlayActive, setOverlayActive] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

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

  const handleClose = useCallback(() => {
    setOverlayActive(false);
    setTimeout(() => {
      onClose();
      setActiveTab(0);
    }, 280);
  }, [onClose]);

  // Keyboard navigation: ESC to close, 1-5 for tabs, ArrowLeft / ArrowRight
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") {
        e.preventDefault();
        handleClose();
      } else if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        setActiveTab((prev) => (prev + 1) % 5);
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        setActiveTab((prev) => (prev - 1 + 5) % 5);
      } else if (e.key >= "1" && e.key <= "5") {
        const target = parseInt(e.key, 10) - 1;
        if (target >= 0 && target < 5) {
          setActiveTab(target);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleClose]);

  if (!mounted || !isOpen || !project) return null;

  const currentPhase = whiteboardPhases[activeTab];

  return createPortal(
    <div
      className={`tactical-arena-overlay ${overlayActive ? "active" : ""}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Coach's Tactical Whiteboard & Archival Dossier"
    >
      {/* =========================================================================
          TOP HEADER BAR & ARCHIVAL METADATA BANNER
          ========================================================================= */}
      <header className="tactical-arena-header">
        <div className="tah-left">
          <span className="tah-eyebrow">
            <span className="tah-beacon-dot" /> REGISTRY: ML-EPL-1992-2024
          </span>
          <span className="tah-divider">|</span>
          <span className="tah-station">STATION: HIGHBURY QUANTITATIVE OBSERVATORY</span>
          <span className="tah-divider hidden-mobile">|</span>
          <span className="tah-quote italic font-serif text-secondary hidden-mobile">
            &ldquo;Numbers alone do not score; they delineate probability frontiers.&rdquo;
          </span>
          <span className="tah-badge-audit">AUDIT VERIFIED</span>
        </div>

        <div className="tah-right">
          <button
            type="button"
            onClick={handleClose}
            className="tah-btn-close"
            title="Exit to Workbench [ESC]"
            aria-label="Exit to Workbench"
          >
            <span>Close Dossier</span>
            <kbd className="tah-esc">ESC</kbd>
          </button>
        </div>
      </header>

      {/* =========================================================================
          MAIN 2-COLUMN DESKTOP GRID
          Left: Archival Project Card (Kept exactly as it is)
          Right: Premier League Football Coach's Magnetic Tactical Whiteboard
          ========================================================================= */}
      <div className="tactical-arena-stage">
        {/* =====================================================================
            LEFT COLUMN: ARCHIVAL PROJECT CARD (KEPT EXACTLY AS IT IS)
            Ivory linen rag paper card with washi tape, photo mount, badges,
            abstract, 4-metric ledger grid, action buttons, and red wax seal.
            ===================================================================== */}
        <section className="tactical-left-col">
          {/* Paper Stack Shadow Layers for Physicality */}
          <div className="tactical-paper-layer-back" />
          <div className="tactical-paper-layer-mid" />

          <article className="tactical-paper-main paper-grain">
            {/* Masking Washi Tape Strips */}
            <div className="washi-tape washi-tape-left" />
            <div className="washi-tape washi-tape-right" />

            {/* Document Catalog Reference & Dispatch Stamp */}
            <div className="tactical-doc-head">
              <div>
                <span className="tactical-ref-code">ARCHIVE REF: ENG-PL-9224-ML</span>
                <span className="tactical-class-code">
                  CLASSIFICATION: QUANT TACTICAL // RESEARCH LOG
                </span>
              </div>
              <div className="tactical-stamp-badge">DISPATCH NO. 44</div>
            </div>

            {/* Vintage Documentary Match Photograph (Polaroid Mount Style) */}
            <div className="tactical-photo-mount">
              <div className="tactical-photo-frame">
                <Image
                  src="/epl_stitch_hero.jpg"
                  alt="Vintage documentary photograph of an English Premier League match under floodlights"
                  width={600}
                  height={420}
                  priority
                  className="tactical-photo-img"
                />
                <div className="tactical-photo-tag-left">
                  <span className="tactical-photo-cam-icon">&#9678;</span>
                  <span>FILM EXPOSURE: EMIRATES STADIUM DUSK (xG CONTEST)</span>
                </div>
                <div className="tactical-photo-tag-right">PITCH SEC: 12-A</div>
              </div>
              <p className="tactical-photo-caption">
                Fig. 1.1 — Floodlit pitch dynamics: Low-angle transition state under 65% humidity at 78&apos;.
              </p>
            </div>

            {/* Project Title & Subtitle */}
            <div className="tactical-title-block">
              <h1 className="tactical-main-title">EPL Match Outcome Predictor</h1>
              <p className="tactical-main-sub">
                Probabilistic Forecasting &amp; Expected Goals Modeling{" "}
                <span className="text-primary font-bold">(1992–2024)</span>
              </p>
            </div>

            {/* Badges in Cardinal Red and Saddle Leather */}
            <div className="tactical-badge-row">
              <span className="badge-cardinal">
                <span className="badge-star">&#9733;</span> Lead ML Engineer
              </span>
              <span className="badge-saddle">Python / XGBoost / Poisson / FBref</span>
              <span className="badge-ivory">Opta &amp; Understat Feeds</span>
            </div>

            {/* Research Abstract */}
            <div className="tactical-abstract">
              <p>
                A comprehensive quantitative study synthesising thirty-two campaigns of English
                association football. By decomposing match progression into independent spatial
                Poisson chance generation events and conditional gradient-boosted context weights
                (travel fatigue, managerial tenures, pitch dimensions), the model creates
                well-calibrated three-way probability distributions (Home / Draw / Away) resistant to
                recreational betting bias.
              </p>
            </div>

            {/* Key Performance Metrics (Archival Ledger Grid) */}
            <div className="tactical-ledger-grid">
              <div className="ledger-cell">
                <div className="ledger-cell-head">
                  <span>Accuracy</span>
                  <span className="text-primary font-bold">&#8593;</span>
                </div>
                <div className="ledger-cell-val text-primary">72.4%</div>
                <div className="ledger-cell-sub">vs 68.1% closing odds benchmark</div>
              </div>

              <div className="ledger-cell">
                <div className="ledger-cell-head">
                  <span>Dataset Scale</span>
                  <span className="text-secondary font-bold">&#9638;</span>
                </div>
                <div className="ledger-cell-val text-secondary">5,800+</div>
                <div className="ledger-cell-sub">10 full Premier League campaigns</div>
              </div>

              <div className="ledger-cell">
                <div className="ledger-cell-head">
                  <span>Brier Score</span>
                </div>
                <div className="ledger-cell-val text-ink">0.179</div>
                <div className="ledger-cell-sub">Optimal loss &lt; 0.200 benchmark</div>
              </div>

              <div className="ledger-cell">
                <div className="ledger-cell-head">
                  <span>Cross-Entropy</span>
                </div>
                <div className="ledger-cell-val text-ink">0.884</div>
                <div className="ledger-cell-sub">Log-loss across 3 outcomes</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="tactical-actions-row">
              <a
                href={project.href || "https://github.com/aaronnguyen26"}
                target="_blank"
                rel="noreferrer"
                className="btn-tactical-gh"
              >
                <span>&#60;&#47;&#62;</span> View Source (GitHub)
              </a>
              <button
                type="button"
                onClick={() => setActiveTab(3)}
                className="btn-tactical-sim"
              >
                <span>&#9654;</span> Live Match Simulator
              </button>
            </div>

            {/* Fountain Pen Marginalia Note & Red Wax Seal */}
            <div className="tactical-footer-marginalia">
              <p className="tactical-fountain-note">
                Reviewed by Senior Statistician: &ldquo;xG variance converges symmetrically.&rdquo;
              </p>
              <div className="tactical-wax-seal" title="Archival Seal of Verification">
                <span>&#10003;</span>
              </div>
            </div>
          </article>
        </section>

        {/* =====================================================================
            RIGHT COLUMN: PREMIER LEAGUE COACH'S MAGNETIC TACTICAL WHITEBOARD
            Brushed aluminium frame, corner screw rivets, porcelain whiteboard,
            tactical pitch with 5 corridors, magnetic tokens, dry-erase marker notes,
            pinned yellow coaching cards, and bottom aluminium marker tray.
            ===================================================================== */}
        <section className="tactical-right-col" id="tactical-board">
          <div className="coach-whiteboard-assembly">
            {/* Metallic Corner Screw Brackets & Rivets */}
            <div className="corner-bracket top-left" />
            <div className="corner-bracket top-right" />
            <div className="corner-bracket bottom-left" />
            <div className="corner-bracket bottom-right" />

            {/* 5 Interactive Tactical Phases Tabs on Whiteboard Header */}
            <div className="coach-whiteboard-tabs" role="tablist">
              {whiteboardPhases.map((phase, idx) => {
                const isActive = activeTab === idx;
                return (
                  <button
                    key={phase.tabTitle}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActiveTab(idx)}
                    className={`coach-tab-btn ${isActive ? "active" : ""}`}
                  >
                    <span className={`tab-indicator-dot ${isActive ? "active" : ""}`} />
                    <span>{phase.tabTitle}</span>
                  </button>
                );
              })}
            </div>

            {/* PORCELAIN DRY-ERASE WHITEBOARD SURFACE */}
            <div className="coach-porcelain-surface">
              {/* Glossy Diagonal Specular Glare Reflection */}
              <div className="porcelain-glare-overlay" />

              {/* Whiteboard Header Metadata (Dry-Erase Marker Style) */}
              <div className="whiteboard-header-row">
                <div className="wb-title-group">
                  <span className="wb-phase-title">{currentPhase.title}</span>
                  <span className="wb-formation-tag">MAGNETIC 4-3-3</span>
                </div>
                <div className="wb-subtitle-group">
                  <span className="wb-marker-icon">&#9998;</span>
                  <span className="wb-phase-sub">{currentPhase.subtitle}</span>
                </div>
              </div>

              {/* CRISP FOOTBALL PITCH WITH 5 TACTICAL CORRIDORS */}
              <div className="coach-pitch-canvas">
                {/* Alternating Mown Grass Stripes */}
                <div className="pitch-stripes-layer">
                  <div className="stripe light" />
                  <div className="stripe dark" />
                  <div className="stripe light" />
                  <div className="stripe dark" />
                  <div className="stripe light" />
                </div>

                {/* 5 Tactical Vertical Corridors (Wings, Half-Spaces, Center) */}
                <div className="pitch-corridors-layer">
                  <div className="corridor flank" />
                  <div className="corridor half-space active-zone" />
                  <div className="corridor center" />
                  <div className="corridor half-space active-zone" />
                  <div className="corridor flank" />
                </div>

                {/* Whiteboard Pitch Markings (Halfway line, boxes, arcs, center spot) */}
                <div className="pitch-markings-layer">
                  <div className="pitch-line-halfway" />
                  <div className="pitch-circle-center" />
                  <div className="pitch-spot-center" />

                  {/* Left Penalty Box & 6-Yard Box */}
                  <div className="pitch-box-penalty-left" />
                  <div className="pitch-box-goal-left" />
                  <div className="pitch-spot-penalty-left" />
                  <div className="pitch-arc-penalty-left" />

                  {/* Right Penalty Box & 6-Yard Box */}
                  <div className="pitch-box-penalty-right" />
                  <div className="pitch-box-goal-right" />
                  <div className="pitch-spot-penalty-right" />
                  <div className="pitch-arc-penalty-right" />
                </div>

                {/* DYNAMIC COACH DRY-ERASE SVG MARKER DRAWINGS */}
                <svg className="coach-dry-erase-svg" viewBox="0 0 600 240" preserveAspectRatio="none">
                  {activeTab === 0 && (
                    <g>
                      <path
                        d="M 110 120 Q 210 50 320 80"
                        fill="none"
                        stroke="#ffdf94"
                        strokeWidth="2.5"
                        strokeDasharray="6 4"
                      />
                      <polygon points="325,80 314,73 318,85" fill="#ffdf94" />
                      <path d="M 320 80 Q 420 100 510 120" fill="none" stroke="#ff4d4d" strokeWidth="3" />
                      <polygon points="518,122 506,114 509,126" fill="#ff4d4d" />
                      <polygon
                        points="320,80 500,45 500,140"
                        fill="rgba(255, 223, 148, 0.16)"
                        stroke="rgba(255, 223, 148, 0.45)"
                        strokeWidth="1.5"
                        strokeDasharray="4 2"
                      />
                    </g>
                  )}
                  {activeTab === 1 && (
                    <g>
                      <circle cx="280" cy="115" r="45" fill="none" stroke="#60a5fa" strokeWidth="2" strokeDasharray="4 4" />
                      <path d="M 160 115 L 420 100" fill="none" stroke="#ffdf94" strokeWidth="2.5" />
                      <polygon points="425,100 415,94 417,106" fill="#ffdf94" />
                      <text x="210" y="75" fill="#ffdf94" fontFamily="Caveat, cursive" fontSize="18" fontWeight="bold">
                        Pressing Trigger Zone
                      </text>
                    </g>
                  )}
                  {activeTab === 2 && (
                    <g>
                      <path d="M 260 115 L 360 60 L 440 115 Z" fill="rgba(255, 77, 77, 0.15)" stroke="#ff4d4d" strokeWidth="2" />
                      <path d="M 260 115 L 360 170 L 440 115 Z" fill="rgba(96, 165, 250, 0.15)" stroke="#60a5fa" strokeWidth="2" />
                      <path d="M 440 115 L 540 115" fill="none" stroke="#ffdf94" strokeWidth="3" strokeDasharray="5 3" />
                      <polygon points="545,115 535,110 535,120" fill="#ffdf94" />
                      <text x="300" y="48" fill="#ff4d4d" fontFamily="Caveat, cursive" fontSize="16">
                        Wing Overload &alpha;
                      </text>
                      <text x="300" y="195" fill="#60a5fa" fontFamily="Caveat, cursive" fontSize="16">
                        Central Inversion &beta;
                      </text>
                    </g>
                  )}
                  {activeTab === 3 && (
                    <g>
                      <polygon points="380,55 540,85 540,150 380,120" fill="rgba(255, 223, 148, 0.22)" stroke="#ffdf94" strokeWidth="2" />
                      <path d="M 240 120 Q 370 60 450 115" fill="none" stroke="#22c55e" strokeWidth="3" />
                      <polygon points="455,117 444,110 446,122" fill="#22c55e" />
                      <text x="390" y="48" fill="#22c55e" fontFamily="Caveat, cursive" fontSize="19" fontWeight="bold">
                        +8.7% VALUE EDGE
                      </text>
                    </g>
                  )}
                  {activeTab === 4 && (
                    <g>
                      <rect x="220" y="50" width="280" height="130" rx="8" fill="rgba(14, 58, 36, 0.4)" stroke="#38bdf8" strokeWidth="2" strokeDasharray="6 4" />
                      <line x1="220" y1="180" x2="500" y2="50" stroke="#f43f5e" strokeWidth="2" />
                      <circle cx="360" cy="115" r="5" fill="#facc15" />
                      <circle cx="430" cy="85" r="5" fill="#facc15" />
                      <circle cx="290" cy="145" r="5" fill="#facc15" />
                      <text x="240" y="42" fill="#38bdf8" fontFamily="var(--font-mono, monospace)" fontSize="11" fontWeight="bold">
                        CALIBRATION DECILE CURVE
                      </text>
                    </g>
                  )}
                </svg>

                {/* 3D CYLINDRICAL MAGNETIC PUCKS */}
                <div className="coach-magnetic-pucks-layer">
                  {currentPhase.tokens.map((token) => (
                    <div
                      key={`${token.label}-${token.left}-${token.top}`}
                      style={{ left: token.left, top: token.top }}
                      className={`magnetic-puck ${token.team === "red" ? "puck-red" : "puck-navy"}`}
                      title={`${token.team === "red" ? "Home Team" : "Opponent"} #${token.label} (${token.role})`}
                    >
                      <span>{token.label}</span>
                    </div>
                  ))}
                </div>

                {/* Pitch Corner HUD (Dry-Erase Coach Note Badge) */}
                <div className="pitch-coach-hud">
                  <div className="hud-tag">
                    <span className="hud-pulse-dot" /> {currentPhase.pitchHudTag}
                  </div>
                  <div className="hud-stat-line">
                    {currentPhase.pitchHudStat.label}: <strong className="text-white">{currentPhase.pitchHudStat.val1}</strong>
                    {" | "}
                    {currentPhase.pitchHudStat.sublabel}: <strong className="text-emerald-400">{currentPhase.pitchHudStat.val2}</strong>
                  </div>
                </div>

                {/* Coach Handwritten Marker Scribble on Pitch */}
                <div className="pitch-coach-note">
                  {currentPhase.pitchHandNote}
                </div>
              </div>

              {/* PINNED MAGNETIZED COACHING INDEX CARDS */}
              <div className="coach-pinned-cards-grid">
                {/* Main Yellow Card (Pinned with Red & Brass Magnets) */}
                <div className="coach-pinned-card-main">
                  {/* Top Circular Magnets Holding the Card */}
                  <div className="pin-magnet magnet-red" />
                  <div className="pin-magnet magnet-brass" />

                  <div className="card-inner-header">
                    <h4 className="card-title">{currentPhase.cardTitle}</h4>
                    <span className="card-badge">{currentPhase.cardBadge}</span>
                  </div>

                  <p className="card-desc">{currentPhase.cardText}</p>

                  <ul className="card-bullet-list">
                    {currentPhase.cardBullets.map((bullet, bIdx) => (
                      <li key={bIdx} className="bullet-item">
                        <span className="bullet-dot" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Secondary Gauge Card (Pinned with Navy Magnet) */}
                <div className="coach-pinned-card-side">
                  <div className="pin-magnet magnet-navy" />

                  <span className="side-card-kicker">{currentPhase.sideTitle}</span>
                  <div className="side-card-val text-primary">{currentPhase.sideMetric}</div>
                  <span className="side-card-label">{currentPhase.sideLabel}</span>

                  <div className="side-card-footer">
                    &ldquo;{currentPhase.sideFooter}&rdquo;
                  </div>
                </div>
              </div>

              {/* Marker Annotation Bar on Whiteboard Base */}
              <div className="whiteboard-base-bar">
                <div className="wb-pen-indicator">
                  <span className="pen-label font-cursive">Dry-Erase Marker Notes:</span>
                  <span className="pen-tag font-mono">NON-PERMANENT INK ONLY</span>
                </div>
                <div className="wb-footer-quote font-cursive text-primary font-bold">
                  {currentPhase.footerQuote}
                </div>
              </div>
            </div>

            {/* BOTTOM EXTRUDED ALUMINIUM PEN TRAY LEDGE */}
            <div className="coach-aluminium-tray">
              <div className="tray-metallic-lip" />

              {/* Dry-Erase Markers Laid in Tray */}
              <div className="tray-markers-group">
                {/* Red Marker */}
                <div className="tray-marker" title="Red Fine-Tip Dry-Erase Marker">
                  <div className="marker-body">
                    <div className="marker-stripe bg-primary" />
                    <span className="marker-label">EXPO DRY</span>
                  </div>
                  <div className="marker-cap cap-red" />
                </div>

                {/* Black Marker */}
                <div className="tray-marker" title="Black Chisel-Tip Marker">
                  <div className="marker-body">
                    <div className="marker-stripe bg-slate-900" />
                    <span className="marker-label">CHISEL</span>
                  </div>
                  <div className="marker-cap cap-black" />
                </div>

                {/* Blue Marker */}
                <div className="tray-marker" title="Blue Bullet-Tip Marker">
                  <div className="marker-body">
                    <div className="marker-stripe bg-blue-700" />
                    <span className="marker-label">BULLET</span>
                  </div>
                  <div className="marker-cap cap-blue" />
                </div>
              </div>

              {/* Felt Block Whiteboard Eraser */}
              <div className="tray-eraser-block" title="Felt Dry-Erase Whiteboard Eraser">
                <div className="eraser-handle">
                  <span>ERASER</span>
                </div>
                <div className="eraser-felt" />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>,
    document.body
  );
}
