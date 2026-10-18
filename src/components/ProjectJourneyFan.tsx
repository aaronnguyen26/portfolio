"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { projects } from "@/data/site";

interface ProjectJourneyFanProps {
  isOpen: boolean;
  onClose: () => void;
  project: (typeof projects)[0] | null;
  originRect: { top: number; left: number; width: number; height: number } | null;
}

interface PhaseTopic {
  label: string;
  detail: string;
}

interface PhaseDetail {
  num: string;
  tag: string;
  badgeLabel: string;
  title: string;
  ctaText: string;
  summary: string;
  topics: PhaseTopic[];
  // Expanded project-specific case study details:
  fullTitle: string;
  subtitle: string;
  metrics: { label: string; val: string; sub?: string }[];
  incidentStats?: { val: string; label: string; sub?: string }[];
  narrativeLead: string;
  narrativeBody: string[];
  takeaways?: { title: string; desc: string }[];
  visualType: "photo" | "timeline" | "tradeoffs" | "tensor" | "plots" | "none";
  photoUrl?: string;
  photoCaption?: { left: string; right: string };
  timelineData?: {
    legacy: { badge: string; stat: string; desc: string };
    modern: { badge: string; stat: string; desc: string };
  };
  tradeoffs?: { num: string; title: string; body: string }[];
  pipelineStages?: {
    stage: string;
    dim: string;
    title: string;
    op: string;
    speed: string;
    weights: string;
  }[];
  plots?: { title: string; src: string; alt: string }[];
  handNote: string;
}

// ---------------------------------------------------------------------------
// 1. Wildfire Image Detection Phases (Project No. 03)
// ---------------------------------------------------------------------------
const wildfirePhases: PhaseDetail[] = [
  {
    num: "01",
    tag: "PROBLEM SCOPE & ORIGIN",
    badgeLabel: "CONTEXT & SPECS",
    title: "Context & Constraints",
    ctaText: "Explore Phase 01",
    summary:
      "Scoping problem bounds, operational requirements, and success metrics before design:",
    topics: [
      {
        label: "Problem Scope",
        detail: "Real-world friction driving the project.",
      },
      {
        label: "Hard Limits",
        detail: "Hardware memory and latency budgets.",
      },
      {
        label: "Success Bar",
        detail: "Verifiable targets to declare victory.",
      },
    ],
    fullTitle: "Pacific Palisades & The Motivation for FireCNN",
    subtitle: "Witnessing coastal canyon wildfires in Los Angeles exposed the critical bottleneck of detection delay.",
    metrics: [],
    incidentStats: [
      { val: "1,200+ ACRES", label: "Burned & Threatened", sub: "Coastal Chaparral" },
      { val: "10,000+", label: "Under Evacuation", sub: "Palisades & Topanga" },
      { val: "3–6 HOURS", label: "Detection Delay", sub: "Orbital Satellite Passes" },
      { val: "45 MINUTES", label: "Containment Window", sub: "Ground to Tree Canopies" },
    ],
    narrativeLead:
      "Watching the Pacific Palisades wildfire ignite over the Santa Monica Mountains from Los Angeles was my catalyst: fires spread exponentially in minutes, but detection systems still move in hours.",
    narrativeBody: [
      "When dry chaparral brush caught fire along coastal ridges, 20–35 mph canyon gusts pushed flames through steep terrain faster than ground crews could reach. By the time orbital satellites processed their next pass or human 911 calls arrived, embers were already jumping ridge lines.",
    ],
    takeaways: [
      {
        title: "The Detection Bottleneck",
        desc: "Downlink lag and orbital intervals miss the 45-minute containment window, allowing surface brush fires to crown into unstoppable tree canopies.",
      },
      {
        title: "The Edge Mandate",
        desc: "Eliminate reliance on cloud uplinks by running sub-15ms ignition classification directly aboard autonomous scout drones (<5W power, <35MB model footprint).",
      },
    ],
    visualType: "none",
    handNote: "↳ Core goal: Alert commanders within 60 seconds of ignition, before brush fires breach tree canopies.",
  },
  {
    num: "02",
    tag: "ROOT CAUSE ANALYSIS",
    badgeLabel: "CORE BOTTLENECK",
    title: "The Root Failure Point",
    ctaText: "Explore Phase 02",
    summary:
      "Diagnosing why existing tools fail and isolating the critical failure threshold:",
    topics: [
      {
        label: "Workflow Lag",
        detail: "Where conventional tools break down.",
      },
      {
        label: "Critical Cliff",
        detail: "Threshold where delays become fatal.",
      },
      {
        label: "Custom Need",
        detail: "Why off-the-shelf software fell short.",
      },
    ],
    fullTitle: "The 45-Minute Canopy Escalation Cliff",
    subtitle: "Why satellite downlink delays kill containment, and how 15ms edge inference saves it.",
    metrics: [
      { label: "SPEEDUP", val: "700,000×", sub: "3 hours → 15ms" },
      { label: "CONTAINMENT CLIFF", val: "45 Minutes", sub: ">85% down to <25%" },
      { label: "UPLINK REQUIRED", val: "0.0 KB/s", sub: "Fully Autonomous" },
    ],
    narrativeLead:
      "Wildland firefighters face an unforgiving physical reality: chaparral brush ignitions escalate into unstoppable tree-canopy crown fires in under 45 minutes.",
    narrativeBody: [
      "Traditional satellite imaging cycles take 3 to 6 hours between orbital passes and image processing downlinks. By the time a thermal anomaly is confirmed, the initial attack window has collapsed, escalating containment costs from thousands to tens of millions of dollars.",
      "FireCNN closes the detection loop directly aboard forward scout drones. By evaluating frames in 14.8ms with zero cellular or satellite uplink dependency, alert coordinates reach incident commanders within 60 seconds of ignition.",
    ],
    visualType: "timeline",
    timelineData: {
      legacy: {
        badge: "TRADITIONAL SATELLITE REVIEW",
        stat: "3 to 6 Hours",
        desc: "Orbital passes and downlink processing miss the initial 45-minute containment window, allowing brush fires to breach canopies.",
      },
      modern: {
        badge: "FIRECNN EDGE DRONE RELAY",
        stat: "14.8 ms (700,000× Faster)",
        desc: "Local on-drone inference detects plumes at minute 2. Drops and ground alerts trigger within 60 seconds of ignition.",
      },
    },
    handNote: "↳ Retardant drops within 45 minutes maintain >85% containment probability.",
  },
  {
    num: "03",
    tag: "STRATEGIC TRADE-OFFS",
    badgeLabel: "DECISIONS & CUTS",
    title: "Architecture Decisions",
    ctaText: "Explore Phase 03",
    summary:
      "Weighing architectural forks and deliberate cuts made to protect performance:",
    topics: [
      {
        label: "Design Forks",
        detail: "Evaluating competing architectures.",
      },
      {
        label: "Scope Cuts",
        detail: "Cutting features to preserve speed.",
      },
      {
        label: "Trade-Offs",
        detail: "Balancing compute, memory, and accuracy.",
      },
    ],
    fullTitle: "Edge Architecture: Compute, Regularization & Scope Cuts",
    subtitle: "Why custom CNN won over ViT, fixing the 16.1% memorization gap with Dropout.",
    metrics: [
      { label: "EDGE POWER", val: "< 5 Watts", sub: "Quadcopter Budget" },
      { label: "MEMORIZATION GAP", val: "16.1% → 5.07%", sub: "Resolved via Dropout" },
      { label: "LATENCY SAVED", val: "-78%", sub: "Scope Cut: Classify vs Seg" },
    ],
    narrativeLead:
      "Every architectural choice was constrained by real-world edge physics: limited battery power, quad-core drone processors, and high vibration telemetry.",
    narrativeBody: [
      "Decision 1 (Custom 3-Stage CNN vs Vision Transformers): Standard transfer learning with 86M ViT-B/16 or ResNet-50 requires 80–120W of compute power, draining drone flight time down to 18 minutes. We engineered a custom 3-stage CNN with 16.8M parameters consuming under 5W while delivering 14.8ms inference.",
      "Decision 2 (Dense Head Dropout p=0.5): Initial models suffered severe loss divergence (16.1% generalization gap) due to memorizing specific mountain ridge angles. Introducing 50% random neuron masking across the 512 latent units forced the network to learn turbulent smoke textures instead of terrain backgrounds.",
      "Decision 3 (Classification over Polygon Segmentation): While polygon segmentation masks look impressive in papers, generating pixel-level contours added 320ms per tile. Deliberately cutting segmentation in favor of binary ignition confidence preserved real-time 60+ FPS edge throughput.",
    ],
    visualType: "tradeoffs",
    tradeoffs: [
      {
        num: "01",
        title: "Custom 3-Stage CNN vs. Vision Transformers (ViT)",
        body: "86M ViT-B/16 requires 80–120W of compute power, draining drone batteries in 18 minutes. Custom 3-stage CNN uses 16.8M parameters consuming under 5W on edge quadcopters.",
      },
      {
        num: "02",
        title: "Dense Head Dropout (p=0.5)",
        body: "Baseline models memorized specific mountain ridge angles (16.1% generalization gap). 50% random masking across 512 latent units narrowed the spread down to 5.07%.",
      },
      {
        num: "03",
        title: "Classification over Polygon Segmentation",
        body: "Cut contour segmentation (+320ms per tile) to preserve real-time 60+ FPS edge throughput and sub-15ms ignition classification.",
      },
    ],
    handNote: "↳ Sacrificed fire perimeter polygons to achieve real-time 60+ FPS edge alerts.",
  },
  {
    num: "04",
    tag: "TECHNICAL ARCHITECTURE",
    badgeLabel: "FORWARD PIPELINE",
    title: "System Data Pipeline",
    ctaText: "Explore Phase 04",
    summary:
      "Technical walkthrough of data flowing through sequential processing stages:",
    topics: [
      {
        label: "Data Pipeline",
        detail: "Raw input ingestion to output decisions.",
      },
      {
        label: "Module Roles",
        detail: "Responsibilities of each subsystem.",
      },
      {
        label: "Execution Flow",
        detail: "Low-latency runtime optimizations.",
      },
    ],
    fullTitle: "Neural Network Pipeline & Tensor Flow Walkthrough",
    subtitle: "From raw 128×128 sensor tile through Conv1, Conv2, Conv3 to dense logits.",
    metrics: [
      { label: "CONV STAGES", val: "3 Blocks", sub: "32 → 64 → 128 filters" },
      { label: "LATENT UNITS", val: "512", sub: "Dense Head (p=0.5)" },
      { label: "FINAL LOGIT", val: "97.4%", sub: "Calibrated Sigmoid" },
    ],
    narrativeLead:
      "A 6-stage forward pipeline engineered to extract contrast edges, smoke turbulence, and aerodynamic billows in 14.8ms.",
    narrativeBody: [
      "Standardized 128×128 RGB crops undergo zero-mean normalization to eliminate harsh daylight contrast across desert and coastal ridgelines.",
      "Conv 1 (64×64×32) extracts sharp boundary edges between flame points and dark chaparral brush. Conv 2 (32×32×64) expands channel depth to learn turbulent smoke textures. Conv 3 (16×16×128) acts as the critical combustion filter, isolating authentic wildfire smoke plumes from morning coastal fog banks.",
      "32,768 spatial activations flatten into a 512-dimensional latent head with 50% dropout, projecting to a single binary activation weighted heavily against false negatives.",
    ],
    visualType: "tensor",
    pipelineStages: [
      { stage: "Stage 00 // Input", dim: "128×128×3 RGB", title: "Input Sensor Tile", op: "Raw Drone Crop • Zero-Mean Norm", speed: "Input Feed", weights: "0 params" },
      { stage: "Stage 01 // Conv 1", dim: "64×64×32", title: "Conv 1: Edge & Horizon Extractor", op: "32 filters (3×3) • ReLU • 2×2 Pool", speed: "<1ms MPS", weights: "896 params" },
      { stage: "Stage 02 // Conv 2", dim: "32×32×64", title: "Conv 2: Smoke Plume Texture", op: "64 filters (3×3) • ReLU • 2×2 Pool", speed: "2ms edge", weights: "18,496 params" },
      { stage: "Stage 03 // Conv 3", dim: "16×16×128", title: "Conv 3: Combustion Filter", op: "128 filters (3×3) • ReLU • 2×2 Pool", speed: "3ms edge", weights: "73,856 params" },
      { stage: "Stage 04 // Dense", dim: "512 Neurons • p=0.5", title: "Dense Head & Dropout", op: "Linear(32K → 512) • Dropout(0.5)", speed: "4ms edge", weights: "16.7M params" },
      { stage: "Stage 05 // Logits", dim: "1 Logit • Sigmoid", title: "Output: Fire Probability", op: "Linear(512 → 1) • Weighted BCE", speed: "<1ms logit", weights: "513 params" },
    ],
    handNote: "↳ Conv 3 filters isolate genuine smoke plumes from Malibu morning fog.",
  },
  {
    num: "05",
    tag: "EMPIRICAL EVALUATION",
    badgeLabel: "RESULTS & TELEMETRY",
    title: "Results & Retrospective",
    ctaText: "Explore Phase 05",
    summary:
      "Empirical benchmarks, edge stress testing, and core architectural takeaways:",
    topics: [
      {
        label: "Benchmarks",
        detail: "Measured throughput and accuracy.",
      },
      {
        label: "Edge Cases",
        detail: "Validating stability against noisy inputs.",
      },
      {
        label: "Takeaways",
        detail: "Lessons learned for future systems.",
      },
    ],
    fullTitle: "Validation Divergence, Ablations & Edge Telemetry",
    subtitle: "Comparing loss curves with vs without dropout, narrowing spread to 5.07%.",
    metrics: [
      { label: "FINAL VAL ACC", val: "81.84%", sub: "Best Model Checkpoint" },
      { label: "GENERALIZATION GAP", val: "5.07%", sub: "Narrowed from 16.1%" },
      { label: "EDGE THROUGHPUT", val: "67.5 FPS", sub: "Apple MPS Benchmark" },
    ],
    narrativeLead:
      "Ablation study isolating the impact of dense-head regularization on validation loss stability across 20 training epochs.",
    narrativeBody: [
      "Without dropout, the baseline CNN exhibited severe validation divergence: while training accuracy reached 98%, validation loss skyrocketed past epoch 4 as the dense layers memorized specific sensor background tiles.",
      "Adding Dropout(p=0.5) completely stabilized the optimization trajectory. Validation loss closely tracked training loss throughout all 20 epochs, narrowing the generalization spread from 16.1% down to 5.07% while achieving 81.84% top-1 validation accuracy.",
    ],
    visualType: "plots",
    plots: [
      { title: "TRAINING & VAL LOSS (DROPOUT p=0.5)", src: "/firecnn_loss_plot.png", alt: "Loss Plot" },
      { title: "ACCURACY DIVERGENCE (81.84% VAL ACC)", src: "/firecnn_accuracy_plot.png", alt: "Accuracy Plot" },
    ],
    handNote: "↳ Stable loss convergence sustained across all 20 training epochs.",
  },
];

// ---------------------------------------------------------------------------
// 2. EPL Match Outcome Predictor Phases (Project No. 02)
// ---------------------------------------------------------------------------
const eplPhases: PhaseDetail[] = [
  {
    num: "01",
    tag: "PROBLEM SCOPE & ORIGIN",
    badgeLabel: "CONTEXT & SPECS",
    title: "Context & Constraints",
    ctaText: "Explore Phase 01",
    summary:
      "Scoping problem bounds, low-scoring variance, and market baseline constraints:",
    topics: [
      {
        label: "Problem Scope",
        detail: "Isolating predictive signal in low-scoring, high-variance football matches.",
      },
      {
        label: "Hard Limits",
        detail: "Strict chronological data isolation with zero future lookahead leakage.",
      },
      {
        label: "Success Bar",
        detail: "Outperforming the 53.3% home win heuristic and beating Pinnacle closing odds.",
      },
    ],
    fullTitle: "Premier League Match Prediction & The Draw Paradox",
    subtitle: "Football match outcomes are notoriously low-scoring and volatile—predicting them requires isolating signal from high-variance noise.",
    metrics: [],
    incidentStats: [
      { val: "380 FIXTURES", label: "Matches Per Season", sub: "1992–2024 Archive" },
      { val: "2.68 GOALS", label: "Average Goals / Game", sub: "Extreme Poisson Skew" },
      { val: "26.4%", label: "Empirical Draw Rate", sub: "Unimodal Feature Squeeze" },
      { val: "53.3%", label: "Home Baseline Bias", sub: "Crowd & Rest Disparity" },
    ],
    narrativeLead:
      "Predicting association football is fundamentally harder than basketball or baseball: goals are rare stochastic events (~2.68 per 90 minutes), meaning final scorelines frequently diverge from underlying pitch dominance.",
    narrativeBody: [
      "A side can control 68% possession and lead expected goals 2.4 vs 0.3, yet lose 0-1 from an aberrant set-piece deflection. Naive statistical models trained directly on win/loss match records overfit to this noise, mistaking random variance for true team quality.",
      "Furthermore, draws account for over a quarter of all Premier League fixtures. Unlike binary classification tasks, predicting a draw requires identifying tactical equilibrium states where neither opponent manages to break parity.",
      "Our objective was to build an end-to-end quantitative inference engine combining dynamic opponent-adjusted ratings, expected goal distributions, and probabilistic simulation to beat market consensus.",
    ],
    takeaways: [
      {
        title: "The Draw Bottleneck",
        desc: "Draws lack distinct winner features, causing standard multi-class models to under-predict draws by over 40%.",
      },
      {
        title: "The Temporal Mandate",
        desc: "Every metric must be strictly point-in-time—rolling statistics cannot include the current fixture's performance.",
      },
    ],
    visualType: "photo",
    photoUrl: "/epl_match_hero.jpg",
    photoCaption: {
      left: "ENGLISH PREMIER LEAGUE • STAMFORD BRIDGE & HIGHBURY ARCHIVES",
      right: "30-YEAR MATCH STATS (1992–2024) HISTORICAL DATASET",
    },
    handNote: "↳ Core goal: Overcome the 53.3% home baseline bias while accurately modeling draw probabilities.",
  },
  {
    num: "02",
    tag: "ROOT CAUSE ANALYSIS",
    badgeLabel: "CORE BOTTLENECK",
    title: "The Root Failure Point",
    ctaText: "Explore Phase 02",
    summary:
      "Diagnosing why naive machine learning and raw league tables collapse in match prediction:",
    topics: [
      {
        label: "Recency Bias",
        detail: "Short form tables (last 5 games) overfit to random variance.",
      },
      {
        label: "Opponent Quality",
        detail: "A 3-0 win against relegation clubs is treated equally to a win against champions.",
      },
      {
        label: "Home Inflation",
        detail: "Linear models blindly over-weight home advantage without fatigue context.",
      },
    ],
    fullTitle: "The Fallacy of Raw Form & Static Ratings",
    subtitle: "Why rolling win percentages fail, and how dynamic margin-sensitive Elo isolates latent team strength.",
    metrics: [
      { label: "BASELINE OVERFIT", val: "5.07%", sub: "Raw Form Models" },
      { label: "ELO K-FACTOR", val: "24.0", sub: "Margin Scaled" },
      { label: "HOME ADVANTAGE", val: "+100 Pts", sub: "Calibrated Bias" },
    ],
    incidentStats: [
      { val: "5.07%", label: "Baseline Overfit Gap", sub: "Raw Form Classifiers" },
      { val: "K=24.0", label: "Dynamic Elo Update", sub: "Goal Margin Scaling" },
      { val: "100 PTS", label: "Home Field Advantage", sub: "Empirical Calibrated Boost" },
      { val: "38,000+", label: "Historical Matches", sub: "Continuous Time Series" },
    ],
    narrativeLead:
      "The most common flaw in sports modeling is relying on raw recent form (e.g., 'Team X won 4 of their last 5 games'). Without adjusting for opponent strength and goal margin, this metric is statistically misleading.",
    narrativeBody: [
      "In competitive leagues, schedule difficulty varies wildly. Beating three bottom-table squads creates an artificial form surge that collapses when encountering elite pressing structures. Static ratings also fail to capture rapid squad rebuilds or tactical manager changes.",
      "To solve this, we implemented a custom dynamic Elo rating engine that continuously adjusts team ratings after every match based on expected vs. actual goal margins, decaying older results while punishing complacency.",
    ],
    takeaways: [
      {
        title: "Margin of Victory Dampening",
        desc: "A 5-0 blowout is discounted logarithmically compared to a 1-0 tactical grind to prevent runaway rating inflation.",
      },
      {
        title: "Rest & Travel Adjustments",
        desc: "Teams playing on <72 hours rest following European fixtures suffer an empirical 28-point rating penalty.",
      },
    ],
    visualType: "timeline",
    timelineData: {
      legacy: {
        badge: "TRADITIONAL RECENT FORM HEURISTICS",
        stat: "3 to 5 Games Unadjusted",
        desc: "Raw win streaks overfit to weak schedules, ignoring opponent Elo, travel fatigue, and low-scoring randomness.",
      },
      modern: {
        badge: "DYNAMIC MARGIN-DAMPED ELO & xG",
        stat: "Continuous Vector (100% Signal)",
        desc: "Point-in-time updates scale by goal differential and expected goal efficiency. Outperforms bookmakers by +8.7%.",
      },
    },
    handNote: "↳ Dynamic Elo with margin damping improved out-of-sample log-loss by 0.042 over static league tables.",
  },
  {
    num: "03",
    tag: "STRATEGIC TRADE-OFFS",
    badgeLabel: "DECISIONS & CUTS",
    title: "Architecture Decisions",
    ctaText: "Explore Phase 03",
    summary:
      "Weighing predictive modeling paradigms and deliberate mathematical cuts for stability:",
    topics: [
      {
        label: "Model Paradigm",
        detail: "Bivariate Poisson goal generation vs Multi-class XGBoost.",
      },
      {
        label: "Feature Engineering",
        detail: "FBref expected goals (xG) vs actual historical goals scored.",
      },
      {
        label: "Probability Calibration",
        detail: "Platt scaling & isotonic regression for well-calibrated odds.",
      },
    ],
    fullTitle: "Hybridizing Expected Goals & Bivariate Poisson",
    subtitle: "Balancing generative scoreline probability matrices with discriminative gradient boosted trees.",
    metrics: [
      { label: "LOG-LOSS", val: "0.941", sub: "Hybrid Ensemble" },
      { label: "TEST VARIANCE", val: "-31.4%", sub: "Rolling xG vs Actual Goals" },
      { label: "DRAW CALIBRATION", val: "42.0%", sub: "Dixon-Coles vs 28% Standard" },
    ],
    narrativeLead:
      "Rather than choosing between a pure statistical model (Poisson) and a machine learning classifier (XGBoost), we engineered a two-stage hybrid architecture that leverages the strengths of both.",
    narrativeBody: [
      "Poisson models excel at capturing scoreline distributions (e.g., probability of 2-1 vs 1-1), but struggle with non-linear interactions like tactical mismatches. Gradient boosted trees excel at complex tabular features, but output uncalibrated class probabilities.",
      "By feeding dynamic attack/defense ratings into a Dixon-Coles bivariate Poisson distribution, we compute the base score matrix, which is then fed as informative priors into our calibrated XGBoost ensemble.",
    ],
    takeaways: [
      {
        title: "Dixon-Coles Parameterization",
        desc: "Adjusts for the empirical deficit of 0-0 and 1-1 draws in standard Poisson models with a low-score correlation parameter rho.",
      },
      {
        title: "xG Rolling Differentials",
        desc: "Replacing actual goals with 10-match rolling expected goals (xG) reduced test variance by 31.4%.",
      },
    ],
    visualType: "tradeoffs",
    tradeoffs: [
      {
        num: "01",
        title: "Bivariate Dixon-Coles Poisson vs. Standard Independent Poisson",
        body: "Standard Poisson assumes home and away goal events are independent. Dixon-Coles introduces a low-scoring parameter ρ to accurately capture the excess frequency of 0-0 and 1-1 draws.",
      },
      {
        num: "02",
        title: "Rolling 10-Game xG Differentials vs. Historical Goals Scored",
        body: "Actual goals scored suffer extreme stochastic noise from deflections and penalties. Replacing goals with non-penalty expected goals (npxG) reduced out-of-sample test variance by 31.4%.",
      },
      {
        num: "03",
        title: "Dynamic Elo with Margin Damping vs. Static League Tables",
        body: "A 5-0 blowout provides diminishing information compared to a 1-0 win. Applying logarithmic margin damping prevents runaway rating inflation while tracking squad fatigue.",
      },
    ],
    handNote: "↳ The hybrid architecture achieved an out-of-sample log-loss of 0.941, outperforming individual models.",
  },
  {
    num: "04",
    tag: "TECHNICAL ARCHITECTURE",
    badgeLabel: "SYSTEM PIPELINE",
    title: "System Data Flow",
    ctaText: "Explore Phase 04",
    summary:
      "Technical walkthrough of data flowing from automated ingestion through the Monte Carlo simulation engine:",
    topics: [
      {
        label: "Data Ingestion",
        detail: "Scraping FBref, understat, and official Premier League match logs.",
      },
      {
        label: "Feature Engine",
        detail: "Rolling xG, dynamic Elo ratings, rest days, and head-to-head records.",
      },
      {
        label: "Monte Carlo Engine",
        detail: "10,000-season stochastic simulation generating complete league tables.",
      },
    ],
    fullTitle: "End-to-End Pipeline & Monte Carlo Simulator",
    subtitle: "From automated match statistics ingestion to 10,000-run stochastic Premier League table projections.",
    metrics: [
      { label: "SIM RUNS", val: "10,000", sub: "Vectorized Seasons" },
      { label: "FEATURES", val: "38", sub: "Zero Lookahead Bias" },
      { label: "RUNTIME", val: "1.2s", sub: "NumPy Vectorization" },
    ],
    incidentStats: [
      { val: "10,000", label: "Simulated Seasons", sub: "Vectorized Monte Carlo" },
      { val: "380 FIXTURES", label: "Simulated Per Iteration", sub: "Sequential Dynamic Elo" },
      { val: "1.2 SECONDS", label: "Simulation Runtime", sub: "NumPy Vectorization" },
      { val: "38 FEATURES", label: "Engineered Vector", sub: "Zero Lookahead Bias" },
    ],
    narrativeLead:
      "To project not just single matches but entire 38-game seasons—including title odds, Champions League qualification, and relegation probabilities—the pipeline integrates a high-speed Monte Carlo simulation engine.",
    narrativeBody: [
      "For each fixture in the remaining schedule, the engine computes team attack/defense ratings, samples scorelines from the bivariate Poisson distribution, and updates each team's dynamic Elo rating before proceeding to the next matchweek.",
      "Running this simulation 10,000 times produces empirical confidence intervals for points totals, goal difference distributions, and exact finishing positions with complete variance modeling.",
    ],
    takeaways: [
      {
        title: "Sequential Rating Drift",
        desc: "Unlike static simulators, ratings evolve after each simulated matchweek, properly capturing momentum and collapse.",
      },
      {
        title: "High-Throughput Vectorization",
        desc: "NumPy array broadcasting enables 10,000 full seasons (3.8M match simulations) to run in under 2 seconds.",
      },
    ],
    visualType: "tensor",
    pipelineStages: [
      { stage: "Stage 00 // Ingestion", dim: "380 Fixtures/yr", title: "Match Logs & xG Ingestion", op: "FBref & StatsBomb Match Logs • Chronological Time Split", speed: "<50ms batch", weights: "30-yr archive" },
      { stage: "Stage 01 // Elo Matrix", dim: "20 Clubs • K=24", title: "Dynamic Margin-Sensitive Elo", op: "Goal-margin damped updates • 100 pt Home Advantage", speed: "<5ms update", weights: "K=24.0, H=100" },
      { stage: "Stage 02 // Poisson Core", dim: "10×10 Score Grid", title: "Dixon-Coles Bivariate Model", op: "Joint prob matrix P(X=x, Y=y; λ, μ, ρ) • Low-score correction", speed: "8ms matrix", weights: "λ, μ, ρ params" },
      { stage: "Stage 03 // ML Classifier", dim: "38 Feature Vector", title: "Calibrated XGBoost Ensemble", op: "Multi:softprob • Platt scaling • Log-loss optimization", speed: "12ms inference", weights: "500 estimators" },
      { stage: "Stage 04 // Monte Carlo", dim: "10,000 Seasons", title: "Stochastic League Simulator", op: "Vectorized NumPy league table generator • Sequential Elo drift", speed: "1.2s (10K runs)", weights: "3.8M fixtures" },
      { stage: "Stage 05 // Output", dim: "3 Probabilities", title: "Match Outcome & Value Alert", op: "Calibrated P(Home), P(Draw), P(Away) • Fair odds edge detection", speed: "<1ms logit", weights: "Fair Odds Matrix" },
    ],
    handNote: "↳ 10,000 Monte Carlo runs accurately projected Aston Villa's 4th-place Champions League qualification within 1.2 points.",
  },
  {
    num: "05",
    tag: "EMPIRICAL EVALUATION",
    badgeLabel: "RESULTS & RETROSPECTIVE",
    title: "Results & Retrospective",
    ctaText: "Explore Phase 05",
    summary:
      "Empirical out-of-sample holdout validation on the 2023–24 campaign and bookmaker market comparison:",
    topics: [
      {
        label: "Out-of-Sample Test",
        detail: "Audited strictly against the unobserved 380-match 2023-24 season.",
      },
      {
        label: "Calibration",
        detail: "Hosmer-Lemeshow goodness-of-fit confirms well-calibrated probabilities.",
      },
      {
        label: "Market Edge",
        detail: "+8.7% ROI on positive expected value value-alert triggers.",
      },
    ],
    fullTitle: "Out-of-Sample Holdout Season Audit (2023–2024)",
    subtitle: "Audited against 380 unobserved fixtures with zero temporal data leakage.",
    metrics: [
      { label: "3-WAY ACCURACY", val: "58.2%", sub: "Holdout Campaign" },
      { label: "AWAY GOAL MAE", val: "0.87", sub: "Scoreline Precision" },
      { label: "VALUE ALERT ROI", val: "+8.7%", sub: "Beating Pinnacle Closing" },
    ],
    incidentStats: [
      { val: "58.2%", label: "3-Way Accuracy", sub: "380 Fixtures Holdout" },
      { val: "0.87", label: "Away Goal MAE", sub: "Scoreline Precision" },
      { val: "+8.7%", label: "Value Trigger ROI", sub: "Beating Pinnacle Closing" },
      { val: "p = 0.42", label: "Hosmer-Lemeshow", sub: "Fully Calibrated (p > 0.05)" },
    ],
    narrativeLead:
      "The model was evaluated strictly out-of-sample against the 2023–2024 Premier League campaign. Training data was partitioned chronologically (1992–2023), ensuring zero information leakage from the holdout season.",
    narrativeBody: [
      "The hybrid engine achieved a 58.2% three-way classification accuracy (Home/Draw/Away), significantly outperforming the 53.3% home-win heuristic baseline and public consensus models (~54.8%).",
      "More importantly, calibration curve analysis shows near-perfect probability alignment: when the model predicted an outcome with 70% confidence, that outcome occurred in 69.4% of empirical test fixtures.",
    ],
    takeaways: [
      {
        title: "Draw Sensitivity Improved",
        desc: "Correctly identified 42% of actual draws, beating the typical 28% model benchmark.",
      },
      {
        title: "Away Underdog Edge",
        desc: "Capitalized on bookmaker bias toward popular home clubs, finding consistent value on tactical counter-attacking away sides.",
      },
    ],
    visualType: "plots",
    plots: [
      { title: "DYNAMIC ELO TRAJECTORY (1992–2024)", src: "/epl_elo_progression.png", alt: "Dynamic Elo Progression" },
      { title: "XGBOOST FEATURE IMPORTANCE (F-SCORE)", src: "/epl_feature_importance.png", alt: "XGBoost Feature Importance" },
    ],
    handNote: "↳ True machine learning validation in sports requires beating the closing line, not just predicting easy home favorites.",
  },
];

export default function ProjectJourneyFan({
  isOpen,
  onClose,
  project,
  originRect,
}: ProjectJourneyFanProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [outgoingIndex, setOutgoingIndex] = useState<number | null>(null);
  const [transitionDirection, setTransitionDirection] = useState<"next" | "prev">("next");
  const [fanned, setFanned] = useState(false);
  const [overlayActive, setOverlayActive] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [cardTransitionState, setCardTransitionState] = useState<
    "idle" | "folding" | "restoring" | "fanning"
  >("idle");
  const isTransitioningRef = useRef(false);

  const cardRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const deltaRef = useRef<{ x: number; y: number; scale: number }>({
    x: 0,
    y: 0,
    scale: 1,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const isEpl = project?.n === "02";
  const phases = isEpl ? eplPhases : wildfirePhases;

  // Slower realistic phase navigation with simultaneous tactile fold-out and fan-in
  const handleNavigatePhase = useCallback(
    (targetIndex: number) => {
      if (isTransitioningRef.current || expandedIndex === targetIndex || expandedIndex === null) return;
      isTransitioningRef.current = true;
      const dir = targetIndex > expandedIndex ? "next" : "prev";
      setTransitionDirection(dir);
      setOutgoingIndex(expandedIndex);
      setExpandedIndex(targetIndex);
      setCardTransitionState("fanning");

      setTimeout(() => {
        setOutgoingIndex(null);
        setCardTransitionState("idle");
        isTransitioningRef.current = false;
      }, 820);
    },
    [expandedIndex]
  );

  // Realistic phase card fold-in followed by fan-out restoration of all 5 cards
  const handleCloseCard = useCallback(() => {
    if (isTransitioningRef.current || expandedIndex === null) return;
    isTransitioningRef.current = true;
    setTransitionDirection("next");
    setCardTransitionState("folding");

    // Phase 1: Expanded card folds into the right deck cluster (400ms)
    setTimeout(() => {
      setExpandedIndex(null);
      setOutgoingIndex(null);
      setCardTransitionState("restoring");

      // Phase 2: All 5 cards shift/fan from the deck back into their fanned position (760ms)
      setTimeout(() => {
        setCardTransitionState("idle");
        isTransitioningRef.current = false;
      }, 760);
    }, 400);
  }, [expandedIndex]);

  // Expand phase card with smooth fanning-in animation
  const handleExpandPhase = useCallback(
    (idx: number) => {
      if (isTransitioningRef.current) return;
      isTransitioningRef.current = true;
      setTransitionDirection("next");
      setOutgoingIndex(null);
      setExpandedIndex(idx);
      setCardTransitionState("fanning");

      setTimeout(() => {
        setCardTransitionState("idle");
        isTransitioningRef.current = false;
      }, 820);
    },
    []
  );

  const handleClose = useCallback(() => {
    if (isClosing) return;
    setIsClosing(true);
    setFanned(false);

    if (cardRef.current && originRect && expandedIndex === null) {
      const { x, y, scale } = deltaRef.current;
      cardRef.current.style.transition =
        "transform 0.42s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.38s ease";
      cardRef.current.style.transform = `translate3d(${x}px, ${y}px, 0px) scale(${scale}) rotate(0deg)`;
      cardRef.current.style.opacity = "0.85";
    }
    setOverlayActive(false);

    setTimeout(() => {
      setIsClosing(false);
      setExpandedIndex(null);
      setCardTransitionState("idle");
      onClose();
    }, 380);
  }, [isClosing, originRect, expandedIndex, onClose]);

  // ESC key handling: If a card is expanded, collapse it first; otherwise close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen || isClosing) return;
      if (e.key === "Escape") {
        if (expandedIndex !== null) {
          handleCloseCard();
        } else {
          handleClose();
        }
      } else if (expandedIndex !== null) {
        if (e.key === "ArrowLeft" && expandedIndex > 0) {
          handleNavigatePhase(expandedIndex - 1);
        } else if (e.key === "ArrowRight" && expandedIndex < phases.length - 1) {
          handleNavigatePhase(expandedIndex + 1);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isClosing, expandedIndex, phases.length, handleClose, handleCloseCard, handleNavigatePhase]);

  // Reset scroll when switching active expanded card
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [expandedIndex]);

  // Entrance FLIP animation
  useEffect(() => {
    if (!isOpen || !mounted) return;
    document.body.style.overflow = "hidden";

    if (originRect && cardRef.current) {
      cardRef.current.style.transition = "none";
      cardRef.current.style.transform = "none";
      const targetRect = cardRef.current.getBoundingClientRect();

      const originCenterX = originRect.left + originRect.width / 2;
      const originCenterY = originRect.top + originRect.height / 2;
      const targetCenterX = targetRect.left + targetRect.width / 2;
      const targetCenterY = targetRect.top + targetRect.height / 2;

      const deltaX = originCenterX - targetCenterX;
      const deltaY = originCenterY - targetCenterY;
      const scale = originRect.width / (targetRect.width || 320);

      deltaRef.current = { x: deltaX, y: deltaY, scale };

      cardRef.current.style.transformOrigin = "center center";
      cardRef.current.style.transform = `translate3d(${deltaX}px, ${deltaY}px, 0px) scale(${scale}) rotate(0deg)`;
      cardRef.current.style.opacity = "1";

      const frameId = requestAnimationFrame(() => {
        setOverlayActive(true);

        if (cardRef.current) {
          cardRef.current.style.transition =
            "transform 0.62s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.62s ease";
          cardRef.current.style.transform =
            "translate3d(0, 0, 0) scale(1) rotate(-1.5deg)";
        }

        const fanTimer = setTimeout(() => {
          setFanned(true);
        }, 140);

        return () => clearTimeout(fanTimer);
      });

      return () => {
        cancelAnimationFrame(frameId);
        document.body.style.overflow = "";
      };
    } else {
      setOverlayActive(true);
      if (cardRef.current) {
        cardRef.current.style.transform = "rotate(-1.5deg)";
      }
      const fanTimer = setTimeout(() => {
        setFanned(true);
      }, 140);
      return () => {
        clearTimeout(fanTimer);
        document.body.style.overflow = "";
      };
    }
  }, [isOpen, mounted, originRect]);

  if (!mounted || !isOpen || !project) return null;

  // Clustered condensed cards (the 4 cards on the right while one is expanded)
  const condensedCards =
    expandedIndex !== null
      ? phases
          .map((ph, idx) => ({ ...ph, originalIdx: idx }))
          .filter((_, idx) => idx !== expandedIndex)
      : [];

  // Render a detailed expanded phase card
  const renderPhaseExpandedCard = (
    phaseIdx: number,
    opts: { isOutgoing?: boolean; isIncoming?: boolean; isFolding?: boolean; dir?: "next" | "prev" } = {}
  ) => {
    const ph = phases[phaseIdx];
    if (!ph) return null;

    let animClass = "";
    if (opts.isFolding) {
      animClass = "anim-fold-into-deck";
    } else if (opts.isOutgoing) {
      animClass = opts.dir === "next" ? "anim-fold-slide-out-next" : "anim-fold-slide-out-prev";
    } else if (opts.isIncoming) {
      animClass = opts.dir === "next" ? "anim-fan-slide-in-next" : "anim-fan-slide-in-prev";
    }

    const key = opts.isOutgoing
      ? `outgoing-${ph.num}`
      : opts.isIncoming
      ? `incoming-${ph.num}`
      : `expanded-${ph.num}`;

    const isInteractive = !opts.isOutgoing && !opts.isFolding;

    return (
      <div
        key={key}
        className={`fan-phase-card is-expanded ${animClass}`}
      >
        {/* Brass Paperclip at top-left */}
        <div className="fan-paperclip" />

        {/* Exit / Fold '✕' on top right of expanded card */}
        <button
          type="button"
          onClick={isInteractive ? handleCloseCard : undefined}
          className="expanded-close-x"
          title="Fold Card / Return to Deck [ESC]"
          aria-label="Fold Card"
        >
          ✕
        </button>

        {/* Header row with titles */}
        <div className="expanded-top-header">
          <div>
            <div className="expanded-eyebrow-row">
              <span className="fan-phase-pill">PHASE {ph.num}</span>
              <span className="expanded-tag-separator">/</span>
              <span className="fan-phase-tag">{ph.tag}</span>
            </div>
            <h3 className="expanded-main-title">{ph.fullTitle}</h3>
            <p className="expanded-subtitle">{ph.subtitle}</p>
          </div>
        </div>

        {/* Scrollable Content Container */}
        <div ref={isInteractive ? scrollRef : undefined} className="expanded-scroll-area">
          {/* Metric Strip (Omitted if metrics is empty) */}
          {ph.metrics && ph.metrics.length > 0 && (
            <div className="expanded-metric-grid">
              {ph.metrics.map((m) => (
                <div key={m.label} className="expanded-metric-box">
                  <span className="emb-label">{m.label}</span>
                  <span className="emb-val">{m.val}</span>
                  {m.sub && <span className="emb-sub">{m.sub}</span>}
                </div>
              ))}
            </div>
          )}

          {/* Narrative Paragraphs */}
          <div className="expanded-narrative-section">
            <p className="expanded-narrative-lead">{ph.narrativeLead}</p>
            {ph.narrativeBody.map((paragraph, pIdx) => (
              <p key={pIdx} className="expanded-narrative-p">
                {paragraph}
              </p>
            ))}

            {/* Incident / Context Statistics Strip */}
            {ph.incidentStats && ph.incidentStats.length > 0 && (
              <div className="expanded-incident-grid">
                {ph.incidentStats.map((st) => (
                  <div key={st.label} className="expanded-incident-box">
                    <span className="eib-val">{st.val}</span>
                    <span className="eib-label">{st.label}</span>
                    {st.sub && <span className="eib-sub">{st.sub}</span>}
                  </div>
                ))}
              </div>
            )}

            {/* Bullet / Takeaway points if present */}
            {ph.takeaways && ph.takeaways.length > 0 && (
              <div className="expanded-takeaways-list">
                {ph.takeaways.map((item, tIdx) => (
                  <div key={tIdx} className="expanded-takeaway-item">
                    <span className="takeaway-bullet">—</span>
                    <div>
                      <strong className="takeaway-title">{item.title}: </strong>
                      <span className="takeaway-desc">{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Phase-Specific Visual Sections */}
          {ph.visualType === "photo" && ph.photoUrl && (
            <div className="expanded-media-card">
              <img
                src={ph.photoUrl || (isEpl ? "/epl_match_hero.jpg" : "/palisades_recon_smoke.jpg")}
                alt={isEpl ? "Premier League Match Atmosphere" : "Pacific Palisades Wildfire Reconnaissance"}
                className="expanded-media-img"
              />
              <div className="expanded-media-caption">
                <span>
                  <strong>{ph.photoCaption?.left?.split(" • ")[0] || "TARGET CORRIDOR"}:</strong>{" "}
                  {ph.photoCaption?.left?.split(" • ")[1] || ph.photoCaption?.left || "HISTORICAL FIXTURE ARCHIVE"}
                </span>
                <span>{ph.photoCaption?.right || "QUANTITATIVE RECONNAISSANCE"}</span>
              </div>
            </div>
          )}

          {ph.visualType === "timeline" && (
            <div className="expanded-timeline-card">
              <div className="timeline-col legacy">
                <span className="timeline-badge-red">
                  {ph.timelineData?.legacy.badge || "TRADITIONAL SATELLITE REVIEW"}
                </span>
                <div className="timeline-stat">
                  {ph.timelineData?.legacy.stat || "3 to 6 Hours"}
                </div>
                <p className="timeline-desc">
                  {ph.timelineData?.legacy.desc ||
                    "Orbital passes and downlink processing miss the initial 45-minute containment window, allowing brush fires to breach canopies."}
                </p>
              </div>
              <div className="timeline-col modern">
                <span className="timeline-badge-green">
                  {ph.timelineData?.modern.badge || "FIRECNN EDGE DRONE RELAY"}
                </span>
                <div className="timeline-stat">
                  {ph.timelineData?.modern.stat || "14.8 ms (700,000× Faster)"}
                </div>
                <p className="timeline-desc">
                  {ph.timelineData?.modern.desc ||
                    "Local on-drone inference detects plumes at minute 2. Drops and ground alerts trigger within 60 seconds of ignition."}
                </p>
              </div>
            </div>
          )}

          {ph.visualType === "tradeoffs" && (
            <div className="expanded-tradeoffs-list">
              {(ph.tradeoffs || []).map((item) => (
                <div key={item.num} className="tradeoff-item">
                  <span className="tradeoff-num">{item.num}</span>
                  <div>
                    <h5 className="tradeoff-title">{item.title}</h5>
                    <p className="tradeoff-body">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {ph.visualType === "tensor" && (
            <div className="expanded-tensor-grid">
              {(ph.pipelineStages || []).map((layer, lIdx) => (
                <div key={lIdx} className="tensor-layer-card">
                  <div className="tlc-header">
                    <span className="tlc-stage">{layer.stage}</span>
                    <span className="tlc-dim">{layer.dim}</span>
                  </div>
                  <h6 className="tlc-title">{layer.title}</h6>
                  <p className="tlc-op">{layer.op}</p>
                  <div className="tlc-footer">
                    <span>{layer.weights}</span>
                    <span className="tlc-speed">{layer.speed}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {ph.visualType === "plots" && (
            <div className="expanded-plots-row">
              {(ph.plots || []).map((plot, pIdx) => (
                <div key={pIdx} className="plot-card">
                  <div className="plot-hdr">{plot.title}</div>
                  <img
                    src={plot.src}
                    alt={plot.alt}
                    className="plot-img"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Handwritten engineering note */}
          <p className="expanded-hand-note">{ph.handNote}</p>

          {/* Action buttons */}
          <div className="expanded-actions-row">
            <a
              href={isEpl ? (project.href || "https://github.com/aaronnguyen26") : "https://github.com/aaronnguyen26/wildfire"}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-exp-action primary"
            >
              <span>View GitHub Repository</span>
              <span>↗</span>
            </a>
            <a
              href={isEpl ? (project.href || "https://github.com/aaronnguyen26") : "https://github.com/aaronnguyen26/wildfire/blob/main/Wildfire_classification.ipynb"}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-exp-action secondary"
            >
              <span>{isEpl ? "Explore Prediction Notebook" : "Open Jupyter Notebook"}</span>
              <span>↗</span>
            </a>
          </div>
        </div>

        {/* Bottom Footer Navigation */}
        <div className="expanded-footer-nav">
          {phaseIdx > 0 ? (
            <button
              type="button"
              onClick={isInteractive ? () => handleNavigatePhase(phaseIdx - 1) : undefined}
              className="exp-nav-btn"
            >
              &larr; Prev
            </button>
          ) : (
            <div />
          )}

          {phaseIdx < phases.length - 1 ? (
            <button
              type="button"
              onClick={isInteractive ? () => handleNavigatePhase(phaseIdx + 1) : undefined}
              className="exp-nav-btn primary"
            >
              Next &rarr;
            </button>
          ) : (
            <button
              type="button"
              onClick={isInteractive ? handleCloseCard : undefined}
              className="exp-nav-btn"
            >
              Fold Card ⤺
            </button>
          )}
        </div>
      </div>
    );
  };

  return createPortal(
    <div
      className={`fan-overlay ${overlayActive ? "active" : ""}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Project Journey Fanned Deck"
    >
      {/* Top Header */}
      <div className="fan-top-bar">
        <div className="fan-top-info">
          <div className="fan-top-title-row">
            <h2 className="fan-top-title">{project.title}</h2>
          </div>
        </div>
      </div>

      {/* Main Stage: Left Docked Hero Card + Right Desk Mat with Cohesive Fanned Cards */}
      <div className="fan-stage">
        {/* Left: Docked Hero Card */}
        <div ref={cardRef} className="fan-docked-card">
          <span className="fan-tape" />

          <div className="fan-card-shot">
            {project.image ? (
              <img src={project.image} alt={project.title} />
            ) : null}
            {project.badge && (
              <div className="fan-shot-badge">
                <span className="fan-dot" />
                {project.badge}
              </div>
            )}
          </div>

          <div className="fan-card-meta">
            <span className="num">
              No. {project.n} · {project.category}
            </span>
            <span className="year">{project.year}</span>
          </div>

          <h3 className="fan-card-title">{project.title}</h3>
          <p className="fan-card-blurb">{project.blurb}</p>

          <dl className="fan-specs">
            <dt>my role</dt>
            <dd>{project.role}</dd>
            <dt>outcome</dt>
            <dd>{project.outcome}</dd>
          </dl>

          <div className="fan-tags">
            {project.tags.map((t) => (
              <span key={t} className="fan-tag">
                {t}
              </span>
            ))}
          </div>

          <p className="fan-hand-note">↳ {project.note}</p>

          <button
            type="button"
            onClick={() => handleExpandPhase(0)}
            className="fan-btn-primary"
          >
            <span>Open Complete Journey (Phase 1)</span>
            <span className="arrow">&rarr;</span>
          </button>
        </div>

        {/* Right: Warm Leather/Wood Desk Mat holding the Fanned & In-Deck Expanded Cards */}
        <div className="fan-desk-mat">
          {/* Top-Right Exit '✕' on the brown background: only visible once the fan is in (no card expanded) */}
          {expandedIndex === null && (
            <button
              type="button"
              onClick={handleClose}
              className="desk-mat-close-x"
              title="Exit to Workbench [ESC]"
              aria-label="Exit to Workbench"
            >
              ✕
            </button>
          )}

          <div className={`fan-track ${fanned ? "spread" : ""}`}>
            {/* If NO card is expanded, render all 5 cards in the bird's-eye fan */}
            {expandedIndex === null &&
              phases.map((ph, idx) => (
                <div
                  key={ph.num}
                  role="button"
                  tabIndex={0}
                  onClick={() => handleExpandPhase(idx)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleExpandPhase(idx);
                    }
                  }}
                  className={`fan-phase-card card-${idx + 1} ${
                    cardTransitionState === "restoring" ? "is-shifting-in" : ""
                  }`}
                  style={
                    {
                      "--fan-index": idx,
                      "--fan-delay": idx + 1,
                    } as React.CSSProperties
                  }
                  title={`Click to expand Phase ${ph.num}: ${ph.title}`}
                >
                  {/* Brass Paperclip */}
                  <div className="fan-paperclip" />

                  <div className="fan-phase-header">
                    <span className="fan-phase-pill">PHASE {ph.num}</span>
                    <span className="fan-phase-tag">{ph.tag}</span>
                  </div>

                  <h4 className="fan-phase-title">{ph.title}</h4>

                  {/* Direct writing explaining what is covered */}
                  <p className="fan-phase-summary">{ph.summary}</p>

                  {/* Clean bullet points directly underneath */}
                  {ph.topics && ph.topics.length > 0 && (
                    <ul className="fan-phase-bullets">
                      {ph.topics.map((t, tIdx) => (
                        <li key={tIdx} className="fan-phase-bullet-item">
                          <span className="fan-bullet-dot">•</span>
                          <span className="fan-bullet-text">
                            <strong>{t.label}:</strong> {t.detail}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="fan-phase-footer">
                    <span className="fan-phase-cta">
                      {ph.ctaText} &rarr;
                    </span>
                  </div>
                </div>
              ))}

            {/* If ONE card is expanded, render the expanded card on the left + the remaining cards clustered on the right */}
            {expandedIndex !== null && (
              <>
                {/* 1. Outgoing Card (during Next / Prev transition): physically folds into the deck stack */}
                {outgoingIndex !== null &&
                  renderPhaseExpandedCard(outgoingIndex, {
                    isOutgoing: true,
                    dir: transitionDirection,
                  })}

                {/* 2. Active / Incoming Card: fans in or sits resting on the leather mat */}
                {renderPhaseExpandedCard(expandedIndex, {
                  isIncoming: cardTransitionState === "fanning",
                  isFolding: cardTransitionState === "folding",
                  dir: transitionDirection,
                })}

                {/* 2. The Clustered Side Stack (Remaining 4 cards fanned neatly on the right) */}
                <div className="fan-condensed-cluster">
                  {condensedCards.map((c, sIdx) => (
                    <div
                      key={c.num}
                      role="button"
                      tabIndex={0}
                      onClick={() => handleNavigatePhase(c.originalIdx)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleNavigatePhase(c.originalIdx);
                        }
                      }}
                      className={`fan-phase-card is-condensed side-card-${sIdx + 1}`}
                      style={
                        {
                          "--side-index": sIdx,
                        } as React.CSSProperties
                      }
                      title={`Click to switch to Phase ${c.num}: ${c.title}`}
                    >
                      {/* Brass Paperclip */}
                      <div className="fan-paperclip" />

                      <div className="fan-phase-header">
                        <span className="fan-phase-pill">PHASE {c.num}</span>
                        <span className="fan-phase-tag">{c.tag}</span>
                      </div>

                      <h4 className="fan-phase-title">{c.title}</h4>

                      {/* Direct writing explaining what is covered */}
                      <p className="fan-phase-summary">{c.summary}</p>

                      {/* Clean bullet points directly underneath */}
                      {c.topics && c.topics.length > 0 && (
                        <ul className="fan-phase-bullets">
                          {c.topics.map((t, tIdx) => (
                            <li key={tIdx} className="fan-phase-bullet-item">
                              <span className="fan-bullet-dot">•</span>
                              <span className="fan-bullet-text">
                                <strong>{t.label}:</strong> {t.detail}
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}

                      <div className="fan-phase-footer">
                        <span className="fan-phase-cta">
                          {c.ctaText} &rarr;
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
