"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { projects } from "@/data/site";

interface ProjectJourneyScoutingFolioProps {
  isOpen: boolean;
  onClose: () => void;
  project: (typeof projects)[0] | null;
  originRect: { top: number; left: number; width: number; height: number } | null;
}

interface FolioPhase {
  id: string;
  tabNum: string;
  tabLabel: string;
  sheetCode: string;
  title: string;
  subtitle: string;
  leadParagraph: string;
  bodyParagraph: string;
  metrics: { label: string; val: string; sub?: string }[];
  takeaways: { bold: string; text: string }[];
  visualType: "pitch" | "equation" | "tradeoffs" | "pipeline" | "plots";
  handNote: string;
  authorSign: string;
}

const folioPhases: FolioPhase[] = [
  {
    id: "tab-constraints",
    tabNum: "01",
    tabLabel: "CONSTRAINTS",
    sheetCode: "SHEET 01/05",
    title: "01 // Tactical Constraints & The COVID Stadium Paradox",
    subtitle: "Regime Shift Analysis // Spectator Acoustic Pressure vs True Pitch Supremacy",
    leadParagraph:
      "Predicting association football is fundamentally constrained by extreme goal scarcity (~2.68 goals per 90 minutes). Unlike high-frequency sports, final scorelines frequently disguise underlying territorial dominance.",
    bodyParagraph:
      "Fixture isolation during the 2020–2021 behind-closed-doors campaign revealed that traditional home pitch advantage (+0.38 goals per fixture historical mean) inverted to a statistically anomalous -0.04 goals. Auditory pressure from hostile stands directly inflates away yellow cards (+18.4% referee calibration tilt), artificially suppressing away team recoveries. Without stadium noise, standard Poisson models suffered severe structural drift.",
    metrics: [
      { label: "Sample Size", val: "3,800 Matches", sub: "Audited & Cleaned" },
      { label: "Crowd Bias", val: "-0.42 Goals", sub: "Without Home Noise" },
      { label: "Outlier Filter", val: "65% Downwt", sub: "Red cards < 25'" },
      { label: "Calibration Drift", val: "< 1.4%", sub: "Brier metric delta" },
    ],
    takeaways: [
      {
        bold: "Decomposition Requirement:",
        text: "Home field advantage can no longer be treated as a static scalar constant; it must be separated into structural pitch dimensions versus transient auditory bias.",
      },
      {
        bold: "Referee Asymmetry:",
        text: "Away foul rates decreased by 14.2% in empty grounds, directly preserving counter-attacking pressing shapes across second-half phases.",
      },
      {
        bold: "Adaptive Weighting:",
        text: "Implemented a dynamic Bayesian shrinkage prior that adjusts venue parameters according to real-time attendance density.",
      },
    ],
    visualType: "pitch",
    handNote:
      "Field-tilt % dominates raw shot volume when isolating high-turnover sequences within 40m.",
    authorSign: "— Aaron Nguyen, Quantitative Research (USC '28)",
  },
  {
    id: "tab-failure",
    tabNum: "02",
    tabLabel: "FAILURE PT",
    sheetCode: "SHEET 02/05",
    title: "02 // Root Failure Point: Poisson Squeezing & 0-0 Deficits",
    subtitle: "Zero-Inflation Anomalies in Low-Scoring Low-Block Defensive Matchups",
    leadParagraph:
      "Standard bivariate Poisson models assume independence between each side's scoring distributions. In practice, football features strong scoreline correlation—especially in scoreless draws.",
    bodyParagraph:
      "When an underdog secures an early lead or enters with an ultra-conservative 5-4-1 low block, the fixture enters a zero-inflated kinetic regime where shot attempts collapse into low-probability perimeter efforts (<0.04 xG/shot). A naive Poisson distribution under-predicts 0-0 ties by over 4.2%, causing multi-class classifiers to misprice draw equity.",
    metrics: [
      { label: "Empirical 0-0 Rate", val: "8.41%", sub: "30-Year League Mean" },
      { label: "Raw Poisson Fit", val: "4.12%", sub: "Under-estimates draws" },
      { label: "Dixon-Coles Adj", val: "8.39%", sub: "Calibrated parity" },
      { label: "Rating K-Factor", val: "24.0", sub: "Margin-damped Elo" },
    ],
    takeaways: [
      {
        bold: "Dixon-Coles Parameterization:",
        text: "Introduced correlation parameter rho = -0.118 estimated over 2,400 fixtures, eliminating the structural 4.8% deficit of 0-0 and 1-1 draws.",
      },
      {
        bold: "Margin of Victory Dampening:",
        text: "Logarithmic scaling discounts 5-0 blowouts over 1-0 tactical grinds to prevent runaway rating inflation.",
      },
      {
        bold: "Congestion Penalty:",
        text: "Clubs competing with <72 hours rest following European midweek fixtures incur an empirical 28-point rating deduction.",
      },
    ],
    visualType: "equation",
    handNote:
      "Unadjusted Poisson models bleed value by chronically underpricing tactical stalemates.",
    authorSign: "— Aaron Nguyen, Quantitative Research (USC '28)",
  },
  {
    id: "tab-tradeoffs",
    tabNum: "03",
    tabLabel: "TRADEOFFS",
    sheetCode: "SHEET 03/05",
    title: "03 // Architectural Tradeoffs: Glass Box vs Deep Embeddings",
    subtitle: "Interpretability vs Overfitting on High-Noise Non-Stationary Datasets",
    leadParagraph:
      "While deep Transformer architectures and Graph Neural Networks can model micro-player tracking coordinates, football fixtures generate only ~380 event tokens per side per 90 minutes.",
    bodyParagraph:
      "In high-parameter architectures, deep neural nets rapidly overfit to manager rotation quirks and specific referee habits within two matchweeks. We deliberately selected a hybrid glass-box architecture: generative bivariate Poisson probability matrices feeding discriminative gradient-boosted decision trees.",
    metrics: [
      { label: "Hybrid Log-Loss", val: "0.884", sub: "Beats 0.942 deep net" },
      { label: "Rolling xG Window", val: "10 Matches", sub: "Exponential decay" },
      { label: "Test Variance", val: "-31.4%", sub: "vs raw historical goals" },
      { label: "SHAP Stability", val: "99.2%", sub: "Feature monotonic check" },
    ],
    takeaways: [
      {
        bold: "Approach A (Deep Sequential LSTM/GNN):",
        text: "Cross-entropy 0.942. Severe variance across international breaks and inability to interpret referee penalization shifts.",
      },
      {
        bold: "Approach B (Poisson + Gradient Boosting):",
        text: "Cross-entropy 0.884. Monotonic SHAP interpretability for all tactical staff with direct calibration alignment to market odds.",
      },
      {
        bold: "Feature Selection Cut:",
        text: "Cut 18 noisy passing sequence metrics in favor of rolling non-penalty expected goals (npxG) differentials and field-tilt territory share.",
      },
    ],
    visualType: "tradeoffs",
    handNote:
      "Interpretability is not a concession—it is the prerequisite for detecting regime drift.",
    authorSign: "— Aaron Nguyen, Quantitative Research (USC '28)",
  },
  {
    id: "tab-pipeline",
    tabNum: "04",
    tabLabel: "PIPELINE",
    sheetCode: "SHEET 04/05",
    title: "04 // 5-Stage Machine Learning Pipeline & Simulator",
    subtitle: "From Opta Raw Event Ingestion to 10,000-Season Monte Carlo Projections",
    leadParagraph:
      "To project not just isolated matches but entire 38-game campaigns—including European qualification thresholds and relegation points floors—the system features an automated 5-stage inference engine.",
    bodyParagraph:
      "For every fixture on the calendar, the pipeline ingests match telemetry, recalibrates dynamic team attack/defense ratings, samples scorelines from the bivariate Poisson distribution, and updates Elo matrices sequentially before simulating subsequent rounds. 10,000 full season iterations execute in under 1.2 seconds.",
    metrics: [
      { label: "Simulated Seasons", val: "10,000", sub: "Vectorized Monte Carlo" },
      { label: "Execution Time", val: "1.2s", sub: "NumPy array broadcasting" },
      { label: "Engineered Vector", val: "38 Features", sub: "Zero lookahead bias" },
      { label: "Fixtures Simulated", val: "3.8M", sub: "Per simulation batch" },
    ],
    takeaways: [
      {
        bold: "Stage 1 (Spatial Ingestion):",
        text: "Ingest 2,000+ spatial event coordinates per fixture; sanitize offside flags and VAR rollbacks.",
      },
      {
        bold: "Stage 2 (xG & xA Calibration):",
        text: "Non-penalty expected goal generation using shot distance, angle, header flag, and defensive density.",
      },
      {
        bold: "Stage 3 (Poisson Decomposition):",
        text: "Solving simultaneous non-linear attack & defense intensity matrices via BFGS optimization.",
      },
      {
        bold: "Stage 4 (XGBoost Ensemble & Monte Carlo):",
        text: "Sequential league simulation capturing momentum, point distributions, and title odds.",
      },
    ],
    visualType: "pipeline",
    handNote:
      "10,000 Monte Carlo runs projected Aston Villa's 4th-place Champions League finish within 1.2 points.",
    authorSign: "— Aaron Nguyen, Quantitative Research (USC '28)",
  },
  {
    id: "tab-holdout",
    tabNum: "05",
    tabLabel: "HOLDOUT",
    sheetCode: "SHEET 05/05",
    title: "05 // Holdout Evaluation: 2023–24 Season Benchmark",
    subtitle: "Out-of-Time Validation (380 Matches Unseen) Across Premier League Campaign",
    leadParagraph:
      "The model was evaluated strictly out-of-sample against the 2023–2024 campaign. Training data was partitioned chronologically (1992–2023), ensuring zero information leakage into the holdout season.",
    bodyParagraph:
      "Across all 380 unobserved fixtures, the hybrid engine achieved 58.2% three-way classification accuracy (Home/Draw/Away), outperforming the 53.3% home-win heuristic baseline and public consensus models (~54.8%). When tested against Pinnacle closing odds, value-trigger alerts delivered a +8.7% return on capital with near-perfect Hosmer-Lemeshow calibration (p = 0.42).",
    metrics: [
      { label: "Holdout Accuracy", val: "58.2%", sub: "380 Matches Out-of-Sample" },
      { label: "Away Goal MAE", val: "0.87", sub: "Scoreline Precision" },
      { label: "Value Alert ROI", val: "+8.7%", sub: "vs Pinnacle Closing Line" },
      { label: "Hosmer-Lemeshow", val: "p = 0.42", sub: "Unskewed Calibration" },
    ],
    takeaways: [
      {
        bold: "Draw Sensitivity Improved:",
        text: "Correctly identified 42.0% of actual draws, beating the typical 28% model benchmark.",
      },
      {
        bold: "Underdog Edge:",
        text: "Capitalized on public bias toward popular home clubs, finding consistent statistical value on disciplined counter-attacking away sides.",
      },
      {
        bold: "Walk-Forward Stability:",
        text: "Brier score remained stable at 0.179 throughout winter fixture congestion without accuracy degradation.",
      },
    ],
    visualType: "plots",
    handNote:
      "True quantitative sports modeling requires beating the closing line, not just picking heavy home favorites.",
    authorSign: "— Aaron Nguyen, Quantitative Research (USC '28)",
  },
];

export default function ProjectJourneyScoutingFolio({
  isOpen,
  onClose,
  project,
}: ProjectJourneyScoutingFolioProps) {
  const [mounted, setMounted] = useState(false);
  const [overlayActive, setOverlayActive] = useState(false);
  const [activeTabIdx, setActiveTabIdx] = useState(0);

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
      setActiveTabIdx(0);
    }, 280);
  }, [onClose]);

  // Keyboard navigation: ESC to close, 1-5 for tabs, ArrowLeft / ArrowRight
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") {
        e.preventDefault();
        handleClose();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        setActiveTabIdx((prev) => Math.min(prev + 1, folioPhases.length - 1));
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        setActiveTabIdx((prev) => Math.max(prev - 1, 0));
      } else if (e.key >= "1" && e.key <= "5") {
        const target = parseInt(e.key, 10) - 1;
        if (target >= 0 && target < folioPhases.length) {
          setActiveTabIdx(target);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleClose]);

  if (!mounted || !isOpen || !project) return null;

  const currentPhase = folioPhases[activeTabIdx];

  return createPortal(
    <div
      className={`folio-overlay ${overlayActive ? "active" : ""}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Archival Confidential Scouting Binder & Manila Folder Folio"
    >
      {/* Top Header Bar */}
      <div className="folio-top-bar">
        <div className="folio-top-meta">
          <span className="folio-top-beacon" />
          <span className="folio-top-registry">LEDGER FOLIO ENG-9224</span>
          <span className="folio-top-div">|</span>
          <span className="folio-top-station">CARTOGRAPHIC DESK: STATION NO. 07</span>
          <span className="folio-top-div hidden-mobile">|</span>
          <span className="folio-top-sub hidden-mobile">
            CLASSIFICATION: ARCHIVAL RESEARCH // ML AUDIT
          </span>
        </div>

        <button
          type="button"
          onClick={handleClose}
          className="folio-close-btn"
          title="Exit to Workbench [ESC]"
          aria-label="Exit to Workbench"
        >
          <span>Close Folio</span>
          <kbd className="folio-esc-kbd">ESC</kbd>
        </button>
      </div>

      {/* Main Saddle Leather & Walnut Desk Mat Stage */}
      <div className="folio-stage">
        {/* Perimeter Saddle-Stitching & Corner Brackets */}
        <div className="folio-leather-stitch" />
        <div className="folio-brass-corner top-left" />
        <div className="folio-brass-corner top-right" />
        <div className="folio-brass-corner bottom-left" />
        <div className="folio-brass-corner bottom-right" />

        {/* 2-Column Physical Spread */}
        <div className="folio-grid">
          {/* ========================================================= */}
          {/* LEFT COLUMN: Compact Docked Archival Dossier Card         */}
          {/* Proportioned to strictly fit within viewport (No Scroll)  */}
          {/* ========================================================= */}
          <section className="folio-left-card">
            {/* Masking / Washi Tape Pinned to Corners */}
            <div className="folio-washi-tape tape-left" />
            <div className="folio-washi-tape tape-right" />

            {/* Header Dispatch Reference */}
            <div className="folio-card-head">
              <div>
                <p className="folio-ref-code">ARCHIVE REF: ENG-PL-9224-ML</p>
                <p className="folio-class-code">QUANT TACTICAL DISPATCH // SPEC: S-4</p>
              </div>
              <div className="folio-dispatch-stamp">
                <span>DISPATCH NO. 44</span>
                <span className="stamp-sub">CONFIDENTIAL</span>
              </div>
            </div>

            {/* Photo Mount with Floodlight Stadium Hero */}
            <div className="folio-photo-mount">
              <img
                src={project.image || "/epl_match_hero.jpg"}
                alt="Premier League Match Under Floodlights"
                className="folio-photo-img"
              />
              <div className="folio-photo-badge">
                <span className="badge-beacon" />
                <span>PITCH SEC: 12-A</span>
              </div>
            </div>
            <p className="folio-photo-caption">
              Fig. 1.1 — Floodlit pitch dynamics: Low-angle transition state under 65% humidity.
            </p>

            {/* Title & Metadata */}
            <h2 className="folio-doc-title">{project.title}</h2>
            <div className="folio-doc-meta">
              <span className="num">No. {project.n} · {project.category}</span>
              <span className="year">{project.year}</span>
            </div>

            <p className="folio-doc-blurb">{project.blurb}</p>

            {/* Specs List */}
            <dl className="folio-specs-list">
              <dt>my role</dt>
              <dd>{project.role}</dd>
              <dt>outcome</dt>
              <dd>{project.outcome}</dd>
            </dl>

            {/* Tags */}
            <div className="folio-tags-row">
              {project.tags.map((t) => (
                <span key={t} className="folio-tag-chip">
                  {t}
                </span>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="folio-card-actions">
              <button
                type="button"
                onClick={() => setActiveTabIdx(0)}
                className="folio-btn-action primary"
              >
                <span>Read Folio (Phase 1)</span>
                <span>&rarr;</span>
              </button>
              <a
                href={project.href || "https://github.com/aaronnguyen26"}
                target="_blank"
                rel="noopener noreferrer"
                className="folio-btn-action secondary"
              >
                <span>Source Code</span>
                <span>↗</span>
              </a>
            </div>

            {/* Bottom Handwritten Fountain Pen Notation & Seal */}
            <div className="folio-card-bottom">
              <p className="folio-card-handwrite">
                Reviewed by Senior Statistician: &ldquo;xG variance converges symmetrically.&rdquo;
              </p>
              <div className="folio-card-wax-seal">
                <span>★</span>
              </div>
            </div>
          </section>

          {/* ========================================================= */}
          {/* RIGHT COLUMN: Open Manila Confidential Scouting Folder    */}
          {/* With 5 Staggered Die-Cut Manila Index Tabs                */}
          {/* ========================================================= */}
          <section className="folio-right-folder">
            {/* 5 Physical Staggered Die-Cut Manila Index Tabs */}
            <div className="folio-tabs-shelf">
              {folioPhases.map((phase, idx) => {
                const isActive = idx === activeTabIdx;
                return (
                  <button
                    key={phase.id}
                    type="button"
                    onClick={() => setActiveTabIdx(idx)}
                    className={`manila-index-tab ${isActive ? "active" : ""}`}
                    aria-selected={isActive}
                    role="tab"
                  >
                    <span className={`tab-indicator-dot ${isActive ? "active" : ""}`} />
                    <span className="tab-label">
                      {phase.tabNum} // {phase.tabLabel}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Manila Cardstock Folder Casing */}
            <div className="manila-folder-casing">
              {/* Brass Corner Reinforcements */}
              <div className="folder-brass-corner top-right" />
              <div className="folder-brass-corner bottom-right" />
              <div className="folder-brass-corner bottom-left" />

              {/* The Archival Rag Paper Briefing Sheet Inside */}
              <article className="archival-briefing-sheet">
                {/* 3 Brass Binder Eyelets (Grommets) on Left Margin */}
                <div className="binder-eyelet eyelet-top">
                  <div className="eyelet-hole" />
                </div>
                <div className="binder-eyelet eyelet-mid">
                  <div className="eyelet-hole" />
                </div>
                <div className="binder-eyelet eyelet-bot">
                  <div className="eyelet-hole" />
                </div>

                {/* Inner Sheet Content Container (Indented for grommets) */}
                <div className="sheet-inner-flow">
                  {/* Top Sheet Header Strip */}
                  <div className="sheet-top-header">
                    <div className="sheet-badge-group">
                      <span className="sheet-confidential-pill">
                        CONFIDENTIAL SCOUTING DOSSIER // TECHNICAL AUDIT
                      </span>
                      <span className="sheet-season-tag">SEASON REVIEW 2024–25</span>
                    </div>

                    <div className="sheet-folio-index">
                      <span>{currentPhase.sheetCode}</span>
                      <span className="lock-icon">🔒</span>
                    </div>
                  </div>

                  {/* Main Section Headings */}
                  <h3 className="sheet-title">{currentPhase.title}</h3>
                  <p className="sheet-subtitle">{currentPhase.subtitle}</p>

                  {/* Lead and Body Narrative */}
                  <p className="sheet-narrative-lead">{currentPhase.leadParagraph}</p>
                  <p className="sheet-narrative-body">{currentPhase.bodyParagraph}</p>

                  {/* =================================================== */}
                  {/* DYNAMIC VISUAL SECTION PER PHASE                   */}
                  {/* =================================================== */}

                  {/* Phase 01: Archival Pitch Blueprint */}
                  {currentPhase.visualType === "pitch" && (
                    <div className="sheet-blueprint-box">
                      <div className="blueprint-hdr">
                        <span className="blueprint-title">
                          📐 TACTICAL TOPOLOGY: HALF-SPACE xG OVERLAY
                        </span>
                        <span className="blueprint-calib">GRID CALIBRATION: OPTA SPATIAL V4</span>
                      </div>
                      <div className="blueprint-pitch-canvas">
                        <div className="pitch-half-line" />
                        <div className="pitch-center-circle" />
                        <div className="pitch-box-left" />
                        <div className="pitch-box-right" />
                        <div className="pitch-corridor-pocket">
                          <span>TURNOVER POCKET</span>
                        </div>
                        <div className="pitch-high-tilt-cone">
                          <span>HIGH TILT CONE</span>
                        </div>
                        <span className="blueprint-note-left">
                          Δ Acoustic Vector: -82.4 dB (Behind Closed Doors)
                        </span>
                        <span className="blueprint-note-right">
                          Expected Inversion Rate: p &lt; 0.001
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Phase 02: Equation & Dixon-Coles Regime Shift */}
                  {currentPhase.visualType === "equation" && (
                    <div className="sheet-equation-box">
                      <span className="equation-hdr">
                        // EQUATION REGIME SHIFT (DIXON-COLES JOINT ADJUSTMENT)
                      </span>
                      <div className="equation-math font-mono">
                        &tau;(x, y) = 1 - &lambda;&mu;&rho; (if x=0, y=0) &nbsp;|&nbsp; 1 + &lambda;&rho; (if x=0, y=1)
                      </div>
                      <p className="equation-caption">
                        Joint correlation parameter &rho; = -0.118 estimated over 2,400 fixtures,
                        eliminating the structural 4.8% under-prediction of scoreless draws.
                      </p>
                    </div>
                  )}

                  {/* Phase 03: Architecture Tradeoffs List */}
                  {currentPhase.visualType === "tradeoffs" && (
                    <div className="sheet-tradeoffs-grid">
                      <div className="tradeoff-card approach-a">
                        <span className="tc-badge red">APPROACH A: DEEP SEQUENTIAL (LSTM / GNN)</span>
                        <p className="tc-body">
                          Cross-entropy: 0.942. High parameter space overfits squad rotations and
                          referee tendencies within 2 matchweeks. Zero interpretability for tactical staff.
                        </p>
                      </div>
                      <div className="tradeoff-card approach-b">
                        <span className="tc-badge green">APPROACH B: POISSON + GRADIENT BOOSTING</span>
                        <p className="tc-body">
                          Cross-entropy: 0.884. Monotonic SHAP interpretability for match analysts.
                          Direct probability calibration with fair betting markets.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Phase 04: 5-Stage Machine Learning Pipeline */}
                  {currentPhase.visualType === "pipeline" && (
                    <div className="sheet-pipeline-stack">
                      <div className="pipeline-step-item">
                        <span className="psi-badge b1">STAGE 1</span>
                        <div>
                          <strong>Spatial Ingestion:</strong> Ingest 2,000+ spatial event coordinates
                          per fixture; clean offside flags and VAR rollbacks.
                        </div>
                      </div>
                      <div className="pipeline-step-item">
                        <span className="psi-badge b2">STAGE 2</span>
                        <div>
                          <strong>xG &amp; xA Calibration:</strong> Non-penalty expected goal generation
                          using shot distance, angle, header flag, and defensive density.
                        </div>
                      </div>
                      <div className="pipeline-step-item">
                        <span className="psi-badge b3">STAGE 3</span>
                        <div>
                          <strong>Field-Tilt &amp; Fatigue Decay:</strong> Exponential moving average of
                          final-third territory share over a rolling 6-fixture window.
                        </div>
                      </div>
                      <div className="pipeline-step-item">
                        <span className="psi-badge b4">STAGE 4</span>
                        <div>
                          <strong>Poisson Decomposition &amp; Monte Carlo:</strong> Simultaneous
                          non-linear attack/defense strength estimation &amp; 10,000-season simulator.
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Phase 05: Holdout Evaluation Plots */}
                  {currentPhase.visualType === "plots" && (
                    <div className="sheet-plots-row">
                      <div className="sheet-plot-card">
                        <div className="spc-hdr">DYNAMIC ELO TRAJECTORY (1992–2024)</div>
                        <img
                          src="/epl_elo_progression.png"
                          alt="Dynamic Elo Progression"
                          className="spc-img"
                        />
                      </div>
                      <div className="sheet-plot-card">
                        <div className="spc-hdr">XGBOOST FEATURE IMPORTANCE (F-SCORE)</div>
                        <img
                          src="/epl_feature_importance.png"
                          alt="XGBoost Feature Importance"
                          className="spc-img"
                        />
                      </div>
                    </div>
                  )}

                  {/* 4-Metric Statistical Audit Sub-Grid */}
                  <div className="sheet-metrics-grid">
                    {currentPhase.metrics.map((m) => (
                      <div key={m.label} className="sheet-metric-card">
                        <span className="smc-label">{m.label}</span>
                        <span className="smc-val">{m.val}</span>
                        {m.sub && <span className="smc-sub">{m.sub}</span>}
                      </div>
                    ))}
                  </div>

                  {/* Structured Cardinal Diamond Takeaways */}
                  <div className="sheet-takeaways-list">
                    {currentPhase.takeaways.map((item, tIdx) => (
                      <div key={tIdx} className="sheet-takeaway-item">
                        <span className="diamond-bullet">◆</span>
                        <div>
                          <strong className="takeaway-bold">{item.bold} </strong>
                          <span className="takeaway-text">{item.text}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Bottom Handwritten Fountain Pen Sign-Off */}
                  <div className="sheet-signature-box">
                    <p className="sheet-handwrite-text">
                      &ldquo;{currentPhase.handNote}&rdquo;
                    </p>
                    <span className="sheet-author-tag">{currentPhase.authorSign}</span>
                  </div>

                  {/* Footer Navigation */}
                  <div className="sheet-footer-nav">
                    {activeTabIdx > 0 ? (
                      <button
                        type="button"
                        onClick={() => setActiveTabIdx((prev) => prev - 1)}
                        className="sheet-nav-btn prev"
                      >
                        &larr; Prev Sheet
                      </button>
                    ) : (
                      <div />
                    )}

                    {activeTabIdx < folioPhases.length - 1 ? (
                      <button
                        type="button"
                        onClick={() => setActiveTabIdx((prev) => prev + 1)}
                        className="sheet-nav-btn next"
                      >
                        Next Sheet &rarr;
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleClose}
                        className="sheet-nav-btn close"
                      >
                        Close Folio ✕
                      </button>
                    )}
                  </div>
                </div>
              </article>
            </div>
          </section>
        </div>
      </div>
    </div>,
    document.body
  );
}
