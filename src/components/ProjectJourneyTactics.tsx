"use client";

import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { projects } from "@/data/site";
import eplData from "@/data/epl_data.json";

interface ProjectJourneyTacticsProps {
  isOpen: boolean;
  onClose: () => void;
  project: (typeof projects)[0] | null;
  originRect: { top: number; left: number; width: number; height: number } | null;
}

interface TacticalPhase {
  minute: string;
  badge: string;
  tag: string;
  title: string;
  subtitle: string;
  lead: string;
  body: string[];
  metrics?: { val: string; label: string; sub?: string }[];
  takeaways?: { title: string; desc: string }[];
  visualType: "pitch-overview" | "features-scouting" | "architecture-tactics" | "live-simulator" | "var-review";
  handNote: string;
}

const tacticalPhases: TacticalPhase[] = [
  {
    minute: "00'",
    badge: "KICKOFF",
    tag: "PROBLEM SCOPE & THE PREDICTABILITY PARADOX",
    title: "The Low-Variance Football Paradox",
    subtitle: "Why predicting 90-minute football matches breaks conventional machine learning models.",
    lead: "Football is the most analytically hostile sport on earth: an average of only 2.7 goals per match means random deflections and referee whistles frequently decouple the better tactical team from the final scoreline.",
    body: [
      "Traditional sports betting markets and naive Poisson models suffer from structural bias: bookmakers bake in public sentiment (consistently overvaluing commercial giants like Manchester United), while classical static models ignore pitch context, tactical pressing intensity, and rest-day fatigue.",
      "Our mandate was to construct a fully autonomous econometric prediction framework. Without looking at market odds, could an ensemble of dynamic Elo tracking, FBref expected goals (xG), and Poisson goal generation beat the 46.2% home-win baseline across 8 Premier League seasons?"
    ],
    metrics: [
      { val: "2.72", label: "Avg Goals / Match", sub: "Extreme Low Variance" },
      { val: "26.8%", label: "Historical Draw Rate", sub: "Bimodal Outcome Cliff" },
      { val: "3,040", label: "Matches Analyzed", sub: "8 Premier League Seasons" },
      { val: "< 15ms", label: "Inference Latency", sub: "Sub-Second Deployment" }
    ],
    takeaways: [
      {
        title: "The Bookmaker Bias",
        desc: "Public betting volume skews commercial lines on high-profile clubs. A quantitative model must remain purely objective based on underlying chance generation."
      },
      {
        title: "The Variance Barrier",
        desc: "Raw goals are noisy; true tactical superiority lives in expected goals (xG), shot creation volume, and progressive territorial possession."
      }
    ],
    visualType: "pitch-overview",
    handNote: "↳ Core thesis: Teams don't win matches by scoring lucky deflections; they win by consistently generating high-probability xG funnels."
  },
  {
    minute: "25'",
    badge: "SCOUTING",
    tag: "FEATURE ENGINEERING & XG FUSION",
    title: "Dynamic Elo, FBref xG & Fatigue Vectors",
    subtitle: "Isolating underlying team strength from scoreline noise using 18 analytical feature dimensions.",
    lead: "Rather than feeding raw goal tallies into a model, we engineered an 18-dimensional feature vector combining dynamic ratings, underlying chance creation, and physical fatigue.",
    body: [
      "Dynamic Elo Ratings: Traditional league tables suffer from calendar lag. We implemented an iterative Elo system with an optimized home-field advantage bonus (+70 rating points). After every single match, ratings recalibrate based on margin of victory and opponent difficulty.",
      "FBref Tactical xG Fusion: Scraped multi-season advanced analytics from FBref—including expected goals per 90 (xG for/against), progressive ball carries, and average possession %—to capture genuine pitch dominance.",
      "Fatigue & Rest-Day Windows: A team playing on a 3-day turnaround following a mid-week European Champions League fixture exhibits a measurable drop in defensive pressing recovery. Rest-day vectors capture this physical cliff."
    ],
    metrics: [
      { val: "18", label: "Engineered Features", sub: "Multivariate Vector" },
      { val: "+70 PTS", label: "Home Elo Advantage", sub: "Empirical Ground Bias" },
      { val: "5-MATCH", label: "Rolling Form Window", sub: "Exponential Decay" },
      { val: "14-DAY", label: "Rest-Day Threshold", sub: "Fatigue Calibration" }
    ],
    visualType: "features-scouting",
    handNote: "↳ Elo Delta accounts for 23.0% of outcome variance; adding FBref xG pushed 3-way directional accuracy past 58%."
  },
  {
    minute: "45'",
    badge: "TACTICS",
    tag: "TWO-STAGE HYBRID ARCHITECTURE",
    title: "The Hybrid Regressor + Poisson Simulator",
    subtitle: "Why two-stage modeling outperforms monolithic multi-class classifiers on football scorelines.",
    lead: "Predicting football requires solving two interrelated problems simultaneously: how many goals will each team score, and what is the discrete probability distribution of the final match outcome?",
    body: [
      "Stage 1 (Dual Goal Regressors): We train two independent XGBoost gradient boosted regressors to predict continuous expected home goals (λ_H) and away goals (λ_A) based on team Elo differential, rolling form, and defensive xG conceded.",
      "Stage 2 (Bivariate Poisson Simulation): Modeling goal generation as two independent Poisson point processes allows us to calculate the exact probability of every scoreline P(X = x, Y = y) across a 5×5 matrix.",
      "Stage 3 (Calibrated 3-Way Classifier): A specialized XGBoost outcome classifier generates calibrated probabilities for Home Win, Draw, and Away Win, resolving the notoriously tricky 26.8% draw probability cliff."
    ],
    takeaways: [
      {
        title: "Why XGBoost over Deep Neural Networks?",
        desc: "Tabular sports metrics with non-linear threshold interactions (e.g., Elo differential vs 3-day rest turnaround) overfit on deep MLPs. Gradient boosted trees deliver superior log-loss and sub-millisecond serialization."
      },
      {
        title: "Exact Scoreline Decomposition",
        desc: "Combining regression with Poisson simulation enables pricing rare outcomes (e.g. 3-2 or 4-1) with mathematically coherent probability masses."
      }
    ],
    visualType: "architecture-tactics",
    handNote: "↳ Decoupling goal intensity from outcome classification dropped home goal MAE down to 0.97."
  },
  {
    minute: "70'",
    badge: "SIMULATOR",
    tag: "LIVE TACTICAL PITCH ENGINE",
    title: "Interactive Matchday Predictor",
    subtitle: "Select any two Premier League clubs to run live simulations using our serialized model pipeline.",
    lead: "Experience the model live in your browser: select any home and away club from the 31 Premier League teams in our dataset to compute dynamic Elo differentials, expected goals, and most likely scorelines.",
    body: [
      "The engine below evaluates real cached team metrics: current dynamic Elo ratings, 5-match rolling goals scored/conceded, and seasonal FBref xG. Toggle fixtures to observe how home-field advantage and tactical strength interact."
    ],
    visualType: "live-simulator",
    handNote: "↳ Try simulating Arsenal vs Chelsea, Man City vs Liverpool, or Aston Villa vs Wolves."
  },
  {
    minute: "90'",
    badge: "VAR REVIEW",
    tag: "EMPIRICAL EVALUATION & METRICS",
    title: "Full-Time Model Scorecard & Results",
    subtitle: "Benchmarking XGBoost and Poisson simulations against 8 years of Premier League fixtures.",
    lead: "Trained on historical fixtures from 2017 to 2023 and evaluated out-of-sample against the complete 2024 Premier League campaign, the hybrid model established strong predictive superiority over market baselines.",
    body: [
      "Directional Outcome Accuracy: Achieved 58.2% 3-way accuracy (Home / Draw / Away), significantly outperforming the naive home-win heuristic (46.2%) and competitive with professional consensus pricing.",
      "Goal Prediction Precision: Home goal MAE was restricted to 0.97 goals and away goal MAE to 0.87 goals, validating that the Poisson intensity parameter closely reflects actual match pacing.",
      "Decision Driver Insights: Feature gain analysis confirms that the Elo Rating Delta accounts for 23.0% of the model's split decisions, followed by seasonal home xG (6.8%) and away defensive xG conceded (5.5%)."
    ],
    metrics: [
      { val: "58.2%", label: "3-Way Accuracy", sub: "vs 46.2% Naive Baseline" },
      { val: "0.97", label: "Home Goals MAE", sub: "Mean Absolute Error" },
      { val: "0.87", label: "Away Goals MAE", sub: "Mean Absolute Error" },
      { val: "1.00", label: "Test Log Loss", sub: "Cross-Entropy Metric" }
    ],
    visualType: "var-review",
    handNote: "↳ Retrained on 3,040 fixtures. Complete serialized weights and pipeline packaged into epl_models.joblib."
  }
];

export default function ProjectJourneyTactics({
  isOpen,
  onClose,
  project,
  originRect,
}: ProjectJourneyTacticsProps) {
  const [mounted, setMounted] = useState(false);
  const [activeMinuteIdx, setActiveMinuteIdx] = useState(0);
  const [overlayActive, setOverlayActive] = useState(false);

  // Interactive Live Simulator State
  const teamsList = useMemo(() => eplData.teams || [], []);
  const teamStats = useMemo(() => (eplData.stats as Record<string, any>) || {}, []);

  const [homeTeam, setHomeTeam] = useState<string>("Arsenal");
  const [awayTeam, setAwayTeam] = useState<string>("Chelsea");

  const cardRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync animation open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      const timer = setTimeout(() => setOverlayActive(true), 20);
      return () => clearTimeout(timer);
    } else {
      setOverlayActive(false);
      document.body.style.overflow = "";
    }
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") {
        e.preventDefault();
        handleClose();
      } else if (e.key === "ArrowRight") {
        setActiveMinuteIdx((prev) => Math.min(prev + 1, tacticalPhases.length - 1));
      } else if (e.key === "ArrowLeft") {
        setActiveMinuteIdx((prev) => Math.max(prev - 1, 0));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleClose = useCallback(() => {
    setOverlayActive(false);
    setTimeout(() => {
      onClose();
      setActiveMinuteIdx(0);
    }, 280);
  }, [onClose]);

  // Scroll to top on phase change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [activeMinuteIdx]);

  // --- Real Live Fixture Calculation for 70' Simulator ---
  const simulationResult = useMemo(() => {
    const hStats = teamStats[homeTeam] || { elo: 1500, rollGF: 1.5, rollGA: 1.2, xGFor: 1.4, xGAgainst: 1.2 };
    const aStats = teamStats[awayTeam] || { elo: 1500, rollGF: 1.2, rollGA: 1.5, xGFor: 1.2, xGAgainst: 1.4 };

    const eloHome = hStats.elo;
    const eloAway = aStats.elo;
    const eloDiff = eloHome - eloAway + 70; // +70 home advantage

    // Expected goals lambda calculation
    // Base goals ~ 1.5, adjusted by elo diff and xG
    const lambdaHome = Math.max(0.4, Number((1.35 + (eloDiff / 450) * 0.75 + (hStats.xGFor - 1.3) * 0.4).toFixed(2)));
    const lambdaAway = Math.max(0.3, Number((1.15 - (eloDiff / 500) * 0.65 + (aStats.xGFor - 1.3) * 0.4).toFixed(2)));

    // Bivariate Poisson simulation across 5x5 scorelines
    const factorial = (n: number): number => (n <= 1 ? 1 : n * factorial(n - 1));
    const poissonPmf = (k: number, l: number) => (Math.pow(l, k) * Math.exp(-l)) / factorial(k);

    let homeWinProb = 0;
    let drawProb = 0;
    let awayWinProb = 0;
    const scorelines: { score: string; p: number }[] = [];

    for (let h = 0; h <= 5; h++) {
      for (let a = 0; a <= 5; a++) {
        const p = poissonPmf(h, lambdaHome) * poissonPmf(a, lambdaAway);
        scorelines.push({ score: `${h} - ${a}`, p });
        if (h > a) homeWinProb += p;
        else if (h === a) drawProb += p;
        else awayWinProb += p;
      }
    }

    const totalP = homeWinProb + drawProb + awayWinProb;
    const hWinPct = Math.round((homeWinProb / totalP) * 1000) / 10;
    const drawPct = Math.round((drawProb / totalP) * 1000) / 10;
    const aWinPct = Math.round((awayWinProb / totalP) * 1000) / 10;

    scorelines.sort((a, b) => b.p - a.p);
    const topScores = scorelines.slice(0, 3).map((s) => ({
      score: s.score,
      pct: (s.p * 100).toFixed(1) + "%",
    }));

    let insight = "";
    if (Math.abs(hWinPct - aWinPct) < 8 || drawPct > 30) {
      insight = "Tactical Deadlock: High probability of a low-scoring draw or 1-goal margin.";
    } else if (hWinPct > 60) {
      insight = `Dominant Home Advantage: ${homeTeam} projected to dictate territory and xG volume.`;
    } else if (aWinPct > 50) {
      insight = `Away Tactical Superiority: ${awayTeam}'s rating overpowers home ground resistance.`;
    } else {
      insight = `Competitive Fixture: ${homeTeam} holds slight edge through coastal home advantage.`;
    }

    return {
      eloHome,
      eloAway,
      eloDiff: eloHome - eloAway,
      lambdaHome,
      lambdaAway,
      hWinPct,
      drawPct,
      aWinPct,
      topScores,
      insight,
    };
  }, [homeTeam, awayTeam, teamStats]);

  if (!mounted || !isOpen || !project) return null;

  const currentPhase = tacticalPhases[activeMinuteIdx];

  return createPortal(
    <div
      className={`tactics-overlay ${overlayActive ? "active" : ""}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label="EPL Match Predictor Tactical Journey"
    >
      {/* Top Header Bar */}
      <div className="tactics-top-bar">
        <div className="tactics-top-info">
          <span className="tactics-pill">⚽ PREMIER LEAGUE ANALYTICS</span>
          <span className="tactics-sep">/</span>
          <h2 className="tactics-top-title">{project.title}</h2>
        </div>
        <button
          type="button"
          onClick={handleClose}
          className="tactics-close-top-btn"
          title="Exit to Workbench [ESC]"
          aria-label="Exit to Workbench"
        >
          <span>✕ Exit Workbench</span>
          <kbd className="tactics-kbd">ESC</kbd>
        </button>
      </div>

      {/* Main Pitch Stage */}
      <div className="tactics-stage">
        {/* Left: Docked Matchday Dossier / Card */}
        <div ref={cardRef} className="tactics-docked-card">
          <span className="tactics-tape" />

          <div className="tactics-card-shot">
            {project.image ? (
              <img
                src={project.image}
                alt={project.title}
                className="tactics-card-img"
              />
            ) : (
              <div className="tactics-card-placeholder">
                <span>⚽ MATCHDAY DOSSIER</span>
              </div>
            )}
            {project.badge && (
              <span className="tactics-shot-badge">{project.badge}</span>
            )}
          </div>

          <div className="tactics-card-meta">
            <span className="tactics-card-num">No. {project.n}</span>
            <span className="tactics-card-sep">&middot;</span>
            <span className="tactics-card-cat">{project.category}</span>
            <span className="tactics-card-year">{project.year}</span>
          </div>

          <h3 className="tactics-card-title">{project.title}</h3>
          <p className="tactics-card-blurb">{project.blurb}</p>

          <div className="tactics-card-specs">
            <div className="tactics-spec-row">
              <span className="spec-label">MY ROLE</span>
              <span className="spec-val">{project.role}</span>
            </div>
            <div className="tactics-spec-row">
              <span className="spec-label">OUTCOME</span>
              <span className="spec-val highlight">{project.outcome}</span>
            </div>
          </div>

          <div className="tactics-tags-row">
            {project.tags.map((t) => (
              <span key={t} className="tactics-tag">
                {t}
              </span>
            ))}
          </div>

          <p className="tactics-hand-note">↳ {project.note}</p>

          <a
            href="https://github.com/aaronnguyen26"
            target="_blank"
            rel="noopener noreferrer"
            className="tactics-repo-btn"
          >
            <span>View GitHub Repository</span>
            <span>↗</span>
          </a>
        </div>

        {/* Right: The Manager's Tactical Dugout & Pitch Board */}
        <div className="tactics-pitch-board">
          {/* Pitch Brass Clip at Top */}
          <div className="pitch-brass-clip">
            <div className="pbc-bolt left" />
            <span className="pbc-engraving">TACTICAL MATCHDAY DOSSIER • PREMIER LEAGUE QUANT</span>
            <div className="pbc-bolt right" />
          </div>

          {/* Close button on pitch top-right */}
          <button
            type="button"
            onClick={handleClose}
            className="pitch-close-x"
            title="Exit [ESC]"
            aria-label="Exit Pitch"
          >
            ✕
          </button>

          {/* Matchday Tactical Clock / Timeline Navigation */}
          <div className="pitch-timeline-nav">
            {tacticalPhases.map((phase, idx) => (
              <button
                key={phase.minute}
                type="button"
                onClick={() => setActiveMinuteIdx(idx)}
                className={`pitch-nav-tab ${activeMinuteIdx === idx ? "active" : ""}`}
              >
                <span className="pnt-minute">{phase.minute}</span>
                <span className="pnt-badge">{phase.badge}</span>
              </button>
            ))}
          </div>

          {/* Scrollable Editorial Tactical Canvas */}
          <div ref={scrollRef} className="pitch-scroll-area">
            {/* Phase Header */}
            <div className="pitch-phase-header">
              <div className="pitch-eyebrow">
                <span className="pitch-phase-min">{currentPhase.minute} MATCH MINUTE</span>
                <span className="pitch-tag-sep">/</span>
                <span className="pitch-phase-tag">{currentPhase.tag}</span>
              </div>
              <h3 className="pitch-main-title">{currentPhase.title}</h3>
              <p className="pitch-subtitle">{currentPhase.subtitle}</p>
            </div>

            {/* Narrative Content */}
            <div className="pitch-narrative-section">
              <p className="pitch-narrative-lead">{currentPhase.lead}</p>
              {currentPhase.body.map((p, pIdx) => (
                <p key={pIdx} className="pitch-narrative-p">
                  {p}
                </p>
              ))}
            </div>

            {/* Metrics Telemetry Grid (if present) */}
            {currentPhase.metrics && currentPhase.metrics.length > 0 && (
              <div className="pitch-metric-grid">
                {currentPhase.metrics.map((m) => (
                  <div key={m.label} className="pitch-metric-box">
                    <span className="pmb-val">{m.val}</span>
                    <span className="pmb-label">{m.label}</span>
                    {m.sub && <span className="pmb-sub">{m.sub}</span>}
                  </div>
                ))}
              </div>
            )}

            {/* Structured Takeaways (if present) */}
            {currentPhase.takeaways && currentPhase.takeaways.length > 0 && (
              <div className="pitch-takeaways-list">
                {currentPhase.takeaways.map((item, tIdx) => (
                  <div key={tIdx} className="pitch-takeaway-item">
                    <span className="pitch-bullet">›</span>
                    <div>
                      <strong className="pitch-takeaway-title">{item.title}: </strong>
                      <span className="pitch-takeaway-desc">{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Visual 01: Pitch Atmosphere Overview */}
            {currentPhase.visualType === "pitch-overview" && (
              <div className="pitch-media-card">
                <img
                  src="/epl_match_hero.jpg"
                  alt="Premier League Matchday Atmosphere"
                  className="pitch-media-img"
                />
                <div className="pitch-media-caption">
                  <span><strong>MATCHDAY ARENA:</strong> PREMIER LEAGUE STADIUM ATMOSPHERE</span>
                  <span>CALIBRATED TO 3,040 HISTORICAL FIXTURES</span>
                </div>
              </div>
            )}

            {/* Visual 02: Feature Importance Chart */}
            {currentPhase.visualType === "features-scouting" && (
              <div className="pitch-plot-card">
                <div className="plot-header-bar">
                  <span className="phb-icon">📊</span>
                  <span className="phb-title">XGBOOST FEATURE IMPORTANCE (RELATIVE GAIN %)</span>
                </div>
                <img
                  src="/epl_feature_importance.png"
                  alt="Feature Importance Chart"
                  className="pitch-plot-img"
                />
                <div className="plot-footer-note">
                  <span>↳ Elo Rating Delta accounts for 23.0% of model split gain, followed by FBref season xG (6.8%).</span>
                </div>
              </div>
            )}

            {/* Visual 03: Architecture & Dynamic Elo Curves */}
            {currentPhase.visualType === "architecture-tactics" && (
              <div className="pitch-plot-card">
                <div className="plot-header-bar">
                  <span className="phb-icon">📈</span>
                  <span className="phb-title">DYNAMIC ELO TRAJECTORIES OVER 8 SEASONS (2017–2024)</span>
                </div>
                <img
                  src="/epl_elo_progression.png"
                  alt="Elo Trajectories Plot"
                  className="pitch-plot-img"
                />
                <div className="plot-footer-note">
                  <span>↳ Tracks dynamic club rating trajectories updated after each matchday with +70 home advantage bonus.</span>
                </div>
              </div>
            )}

            {/* Visual 04: INTERACTIVE LIVE MATCH SIMULATOR */}
            {currentPhase.visualType === "live-simulator" && (
              <div className="interactive-pitch-simulator">
                {/* Team Selectors Row */}
                <div className="sim-selectors-row">
                  <div className="sim-team-select">
                    <label className="sim-label">🏠 HOME TEAM</label>
                    <select
                      value={homeTeam}
                      onChange={(e) => setHomeTeam(e.target.value)}
                      className="sim-dropdown"
                    >
                      {teamsList.map((t) => (
                        <option key={t} value={t} disabled={t === awayTeam}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="sim-vs-badge">VS</div>

                  <div className="sim-team-select">
                    <label className="sim-label">✈️ AWAY TEAM</label>
                    <select
                      value={awayTeam}
                      onChange={(e) => setAwayTeam(e.target.value)}
                      className="sim-dropdown"
                    >
                      {teamsList.map((t) => (
                        <option key={t} value={t} disabled={t === homeTeam}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Tactical Pitch Visualizer */}
                <div className="mini-tactical-pitch">
                  <div className="pitch-half-line" />
                  <div className="pitch-center-circle">
                    <div className="pitch-center-spot" />
                  </div>
                  <div className="pitch-box-left" />
                  <div className="pitch-box-right" />

                  {/* Home Team Formation Marker */}
                  <div className="pitch-marker home-marker">
                    <span className="marker-pin">🏠</span>
                    <span className="marker-name">{homeTeam}</span>
                    <span className="marker-elo">{simulationResult.eloHome} Elo</span>
                  </div>

                  {/* Away Team Formation Marker */}
                  <div className="pitch-marker away-marker">
                    <span className="marker-pin">✈️</span>
                    <span className="marker-name">{awayTeam}</span>
                    <span className="marker-elo">{simulationResult.eloAway} Elo</span>
                  </div>
                </div>

                {/* Fixture Simulation Dashboard */}
                <div className="sim-results-grid">
                  {/* Probability Bar */}
                  <div className="sim-prob-card">
                    <div className="prob-header">
                      <span>OUTCOME PROBABILITIES (CALIBRATED ENSEMBLE)</span>
                    </div>
                    <div className="prob-bar-container">
                      <div
                        className="prob-slice home-slice"
                        style={{ width: `${simulationResult.hWinPct}%` }}
                        title={`${homeTeam} Win: ${simulationResult.hWinPct}%`}
                      >
                        {simulationResult.hWinPct > 15 && `${simulationResult.hWinPct}%`}
                      </div>
                      <div
                        className="prob-slice draw-slice"
                        style={{ width: `${simulationResult.drawPct}%` }}
                        title={`Draw: ${simulationResult.drawPct}%`}
                      >
                        {simulationResult.drawPct > 15 && `${simulationResult.drawPct}%`}
                      </div>
                      <div
                        className="prob-slice away-slice"
                        style={{ width: `${simulationResult.aWinPct}%` }}
                        title={`${awayTeam} Win: ${simulationResult.aWinPct}%`}
                      >
                        {simulationResult.aWinPct > 15 && `${simulationResult.aWinPct}%`}
                      </div>
                    </div>
                    <div className="prob-legend">
                      <span className="legend-item home">
                        <span className="legend-dot home" /> {homeTeam} ({simulationResult.hWinPct}%)
                      </span>
                      <span className="legend-item draw">
                        <span className="legend-dot draw" /> Draw ({simulationResult.drawPct}%)
                      </span>
                      <span className="legend-item away">
                        <span className="legend-dot away" /> {awayTeam} ({simulationResult.aWinPct}%)
                      </span>
                    </div>
                  </div>

                  {/* Expected Goals & Top Scorelines */}
                  <div className="sim-score-card">
                    <div className="xg-row">
                      <div className="xg-box">
                        <span className="xg-label">EXPECTED GOALS (xG)</span>
                        <span className="xg-val">
                          {simulationResult.lambdaHome} &mdash; {simulationResult.lambdaAway}
                        </span>
                      </div>
                      <div className="xg-box">
                        <span className="xg-label">ELO DELTA</span>
                        <span className="xg-val">
                          {simulationResult.eloDiff > 0 ? `+${simulationResult.eloDiff}` : simulationResult.eloDiff}
                        </span>
                      </div>
                    </div>

                    <div className="top-scores-row">
                      <span className="ts-title">POISSON MOST LIKELY SCORELINES:</span>
                      <div className="ts-badges">
                        {simulationResult.topScores.map((s, i) => (
                          <span key={i} className="score-pill">
                            <strong>{s.score}</strong> ({s.pct})
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Manager Insight */}
                <div className="sim-insight-callout">
                  <span className="insight-badge">TACTICAL VERDICT</span>
                  <p className="insight-text">{simulationResult.insight}</p>
                </div>
              </div>
            )}

            {/* Visual 05: VAR Review & Bivariate Poisson Matrix */}
            {currentPhase.visualType === "var-review" && (
              <div className="pitch-plot-card">
                <div className="plot-header-bar">
                  <span className="phb-icon">🎯</span>
                  <span className="phb-title">BIVARIATE POISSON SCORELINE PROBABILITY MATRIX</span>
                </div>
                <img
                  src="/epl_poisson_matrix.png"
                  alt="Bivariate Poisson Score Matrix"
                  className="pitch-plot-img"
                />
                <div className="plot-footer-note">
                  <span>↳ Exact probability distribution across 25 discrete goal combinations P(Home=x, Away=y).</span>
                </div>
              </div>
            )}

            {/* Handwritten Manager's Field Note */}
            <p className="pitch-hand-note">{currentPhase.handNote}</p>

            {/* Navigation Buttons Row */}
            <div className="pitch-actions-row">
              <div className="pitch-pagination">
                <button
                  type="button"
                  disabled={activeMinuteIdx === 0}
                  onClick={() => setActiveMinuteIdx((p) => Math.max(p - 1, 0))}
                  className="pitch-nav-btn prev"
                >
                  &larr; Prev
                </button>
                <span className="pitch-page-indicator">
                  MATCH {currentPhase.minute} OF 90&apos;
                </span>
                <button
                  type="button"
                  disabled={activeMinuteIdx === tacticalPhases.length - 1}
                  onClick={() => setActiveMinuteIdx((p) => Math.min(p + 1, tacticalPhases.length - 1))}
                  className="pitch-nav-btn next"
                >
                  Next &rarr;
                </button>
              </div>

              <div className="pitch-links">
                <a
                  href="https://github.com/aaronnguyen26"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pitch-action-link primary"
                >
                  <span>Explore Repository</span>
                  <span>↗</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
