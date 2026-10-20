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

interface PhaseSection {
  partLabel: string;
  lead?: string;
  body?: string[];
  stats?: { val: string; label: string; sub?: string }[];
  bullets?: { val: string; text: string }[];
  takeaways?: { title: string; desc: string }[];
}

interface SplitItem {
  title: string;
  desc: string;
}

interface SplitColumn {
  tag: string;
  title: string;
  items: SplitItem[];
}

interface SplitComparison {
  left: SplitColumn;
  right: SplitColumn;
}

interface DecisionItem {
  num: string;
  title: string;
  what: string;
  why: string;
  impact: string;
}

interface ConvolutionStage {
  num: string;
  stageTag?: string;
  title: string;
  specs: string;
  role: string;
  what: string;
  why?: string;
}

interface EvaluationFigure {
  num: string;
  stageTag?: string;
  title: string;
  badge?: string;
  src: string;
  alt: string;
  caption?: string;
  stats: { label: string; val: string; detail?: string }[];
  numbersBreakdown: { label: string; desc: string }[];
  whatItMeans: string;
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
  sections?: PhaseSection[];
  splitComparison?: SplitComparison;
  decisions?: DecisionItem[];
  cnnDiagram?: {
    src: string;
    alt: string;
    caption?: string;
  };
  convolutionStages?: ConvolutionStage[];
  evaluationFigures?: EvaluationFigure[];
  evaluationFiguresWithoutDropout?: EvaluationFigure[];
  evaluationFiguresWithDropout?: EvaluationFigure[];
  evaluationAccuracyFigures?: EvaluationFigure[];
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
    tag: "PROBLEM & ORIGIN",
    badgeLabel: "PROBLEM & ORIGIN",
    title: "Context & Constraints",
    ctaText: "Explore Phase 01",
    summary:
      "Understanding the California wildfire crisis and the Pacific Palisades origin catalyst:",
    topics: [
      {
        label: "Statewide Crisis",
        detail: "2.5M+ acres burned & $10B+ damage annually.",
      },
      {
        label: "Palisades Origin",
        detail: "1,200 acres burned & 10,000 evacuated.",
      },
      {
        label: "The Breakthrough",
        detail: "Sub-15ms edge inference to beat detection lag.",
      },
    ],
    fullTitle: "California's Wildfire Crisis & The Pacific Palisades Origin",
    subtitle:
      "Bridging the statewide crisis with the ground reality I witnessed in the Palisades.",
    metrics: [],
    incidentStats: [],
    narrativeLead: "",
    narrativeBody: [],
    takeaways: [],
    sections: [
      {
        partLabel: "PART I · THE STATEWIDE CRISIS",
        bullets: [
          {
            val: "2.5M+ Acres Burned",
            text: "Burned annually across peak California wildfire seasons.",
          },
          {
            val: "7,000+ Incidents",
            text: "Wildfire ignitions logged each year statewide across CAL FIRE jurisdictions.",
          },
          {
            val: "$10B to $15B Losses",
            text: "Annual economic destruction, property loss, and emergency suppression expenditures.",
          },
        ],
      },
      {
        partLabel: "PART II · THE PACIFIC PALISADES ORIGIN",
        lead:
          "Watching the Pacific Palisades wildfire ignite over the Santa Monica Mountains from Los Angeles was my personal turning point. I watched a small canyon plume explode into a fast-moving front while emergency crews lacked real-time ridge visibility.",
        bullets: [
          {
            val: "1,200+ Acres Scorched",
            text: "Coastal canyon and ridge chaparral consumed within hours across extreme terrain.",
          },
          {
            val: "10,000+ Residents Evacuated",
            text: "Forced under immediate mandatory evacuation orders across Pacific Palisades and Topanga.",
          },
          {
            val: "500+ Homes Directly Threatened",
            text: "Canyon residences and mountain structures endangered before ridge containment was established.",
          },
        ],
      },
    ],
    visualType: "none",
    handNote:
      "↳ What I realized: We cannot rely on delayed satellites or blocked engines. Drones need sub-15ms on-device vision to alert commanders within 60 seconds of ignition.",
  },
  {
    num: "02",
    tag: "SCOPE & ROOT CAUSE",
    badgeLabel: "STATUS QUO VS AIM",
    title: "Scope & Status Quo",
    ctaText: "Explore Phase 02",
    summary:
      "Analyzing current wildfire detection bottlenecks and defining a focused, pragmatic project scope:",
    topics: [
      {
        label: "Current Bottlenecks",
        detail: "Why 911 calls, satellites & cloud models lag.",
      },
      {
        label: "Pragmatic Aim",
        detail: "A compact local model for binary fire detection.",
      },
      {
        label: "Grounded Scope",
        detail: "Software classification, not replacing drone hardware.",
      },
    ],
    fullTitle: "Status Quo Bottlenecks & The Focused Project Scope",
    subtitle:
      "Why existing detection workflows fail early containment, and the pragmatic objective of engineering a lightweight local classification model.",
    metrics: [],
    narrativeLead: "",
    narrativeBody: [],
    splitComparison: {
      left: {
        tag: "CURRENT STATUS QUO (SQ)",
        title: "Existing Detection Bottlenecks",
        items: [
          {
            title: "Delayed Human Line-of-Sight (911 Calls)",
            desc: "Most initial ignitions are reported via emergency calls only after smoke plumes crest ridge lines or threaten homes, introducing 30 to 60 minutes of uncontained burn time.",
          },
          {
            title: "Orbital Satellite Revisit Lag",
            desc: "Commercial thermal satellites operate on 3 to 6-hour orbital passes. Overhead passes are frequently occluded by cloud cover and lack the spatial resolution needed for pinpointing spot fires.",
          },
          {
            title: "Cloud Connectivity Bottlenecks",
            desc: "Existing computer vision pipelines depend on high-bandwidth cloud servers. In steep backcountry canyons and remote ridges, cellular signals are nonexistent or severed by wildfire heat.",
          },
        ],
      },
      right: {
        tag: "PROJECT AIM & SCOPE",
        title: "Grounded Software Objective",
        items: [
          {
            title: "Compact, Lightweight Model Footprint",
            desc: "Engineering a small convolutional architecture (< 35MB parameter budget) that operates within the strict memory and compute limits of standard edge hardware.",
          },
          {
            title: "Autonomous Local Edge Inference",
            desc: "Executing image inference on-device in under 15ms per frame, ensuring immediate classification without requiring internet access or remote servers.",
          },
          {
            title: "Focused Binary Smoke & Fire Detection",
            desc: "A pragmatic, dedicated scope: accurately classifying whether an incoming image contains a wildfire or not, serving as an efficient software tool rather than overhauling drone hardware.",
          },
        ],
      },
    },
    visualType: "none",
    handNote:
      "↳ Grounded Scope: Building a fast, lightweight software classifier to verify smoke in aerial frames locally, keeping compute requirements small enough for real-time edge devices.",
  },
  {
    num: "03",
    tag: "STRATEGIC TRADE-OFFS",
    badgeLabel: "DECISIONS & CUTS",
    title: "Architecture Decisions",
    ctaText: "Explore Phase 03",
    summary:
      "Core engineering choices and trade-offs made to keep local inference fast, lightweight, and accurate:",
    topics: [
      {
        label: "Model Sizing",
        detail: "Custom compact CNN vs heavy backbones.",
      },
      {
        label: "Scope Cut",
        detail: "Classification over polygon segmentation.",
      },
      {
        label: "Regularization",
        detail: "Dense head dropout to stop overfitting.",
      },
    ],
    fullTitle: "Architectural Decisions",
    subtitle:
      "Key design trade-offs made to balance speed, memory, and generalization on edge devices.",
    metrics: [],
    incidentStats: [],
    narrativeLead: "",
    narrativeBody: [],
    takeaways: [],
    decisions: [
      {
        num: "01",
        title: "Custom 3-Stage CNN vs Heavy Backbones (ViT / ResNet)",
        what: "Engineered a compact 3-stage CNN (33.9MB footprint) instead of deploying heavy pretrained vision transformers or 50-layer ResNets.",
        why: "Pretrained transformer backbones require 80W+ power draws and massive memory bandwidth that drain edge batteries and choke low-power processors.",
        impact: "Achieved sub-15ms inference latency per frame with minimal memory consumption, ideal for standalone local execution.",
      },
      {
        num: "02",
        title: "Binary Smoke & Fire Classification vs Polygon Segmentation",
        what: "Scoped the model strictly to binary image classification (fire/smoke present vs clean) rather than pixel-level contour segmentation masks.",
        why: "Generating dense segmentation masks adds more than 300ms of latency per frame without providing extra value for initial ignition alerts.",
        impact: "Saved over 75% compute latency, maintaining continuous real-time 60+ FPS processing without frame-dropping.",
      },
      {
        num: "03",
        title: "Dense Head Dropout (p=0.5) Regularization",
        what: "Integrated a 50% dropout layer directly before the final dense classification head.",
        why: "Early baseline models memorized static background terrain features and mountain contours rather than generic smoke textures.",
        impact: "Eliminated terrain overfitting, narrowing the train-validation generalization gap from 16.1% down to 5.07%.",
      },
    ],
    visualType: "none",
    handNote:
      "↳ Core Engineering Takeaway: Cutting unnecessary segmentation complexity and prioritizing a compact CNN architecture delivered the sub-15ms speed required for local edge execution.",
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
    metrics: [],
    narrativeLead: "",
    narrativeBody: [],
    cnnDiagram: {
      src: "/firecnn_architecture_diagram.svg",
      alt: "FireCNN 3-Stage Convolutional Neural Network Architecture Diagram",
      caption: "FIRECNN TENSOR ARCHITECTURE • 128×128 INPUT TO BINARY DECISION",
    },
    convolutionStages: [
      {
        num: "01",
        title: "Convolution 1: Low-Level Spatial Edge Extractor",
        specs: "32 Filters (3×3) • ReLU • 2×2 MaxPool • 64×64×32",
        role: "Detects sharp spatial boundaries, flame contrast edges, and horizon contours.",
        what: "Applies 32 parallel 3×3 convolutional filters across normalized 128×128 RGB crops, followed by ReLU non-linearity and a 2×2 max pooling operation downsampling spatial dimensions to 64×64.",
      },
      {
        num: "02",
        title: "Convolution 2: Mid-Level Smoke Plume Texture",
        specs: "64 Filters (3×3) • ReLU • 2×2 MaxPool • 32×32×64",
        role: "Encodes turbulent smoke dispersion patterns, plume gradient flows, and vapor spread.",
        what: "Expands channel capacity to 64 filters operating on 64×64 feature maps, learning multi-pixel textural relationships before downsampling through 2×2 max pooling to 32×32.",
      },
      {
        num: "03",
        title: "Convolution 3: High-Level Combustion Filter",
        specs: "128 Filters (3×3) • ReLU • 2×2 MaxPool • 16×16×128",
        role: "Semantic combustion isolation and atmospheric false positive discrimination.",
        what: "Deepens the representation to 128 feature channels over 16×16 feature maps, synthesizing complex contextual cues and downsampling to a compact 16×16 spatial activation grid.",
      },
      {
        num: "04",
        title: "Classification Head: Dense Projection & Dropout Regularization",
        specs: "Flatten (32,768) • Dense 512 • Dropout (p=0.5) • 1 Binary Logit",
        role: "Feature map aggregation, spatial regularization, and calibrated fire probability output.",
        what: "Flattens 32,768 spatial activations into a 512-neuron dense layer with 50% dropout during training, projecting to a single scalar logit calibrated through a Sigmoid activation function.",
      },
    ],
    visualType: "none",
    handNote: "↳ Conv 3 filters isolate genuine smoke plumes from Malibu morning fog.",
  },
  {
    num: "05",
    tag: "RESULTS & GENERALIZATION",
    badgeLabel: "RESULTS & TELEMETRY",
    title: "Results & Generalization",
    ctaText: "Explore Phase 05",
    summary:
      "Empirical benchmarks, edge stress testing, and core architectural takeaways:",
    topics: [
      {
        label: "Without Dropout",
        detail: "Baseline model: severe loss divergence and premature 79.6% validation plateau.",
      },
      {
        label: "Dropout",
        detail: "Regularized model: stabilized convergence and 81.84% validation accuracy.",
      },
      {
        label: "Generalization",
        detail: "Eliminated static terrain memorization, narrowing the generalization gap to 5.07%.",
      },
    ],
    fullTitle: "Empirical Results & Generalization",
    subtitle: "Comparing loss and accuracy trajectories across two model configurations: without dropout vs dropout.",
    metrics: [],
    narrativeLead: "",
    narrativeBody: [],
    evaluationFiguresWithoutDropout: [
      {
        num: "01",
        stageTag: "FIGURE 01 // BASELINE LOSS",
        title: "Figure 1: Validation Loss Divergence (Without Dropout)",
        badge: "BASELINE MODEL · OVERFITTING",
        src: "/firecnn_without_dropout_loss.png",
        alt: "FireCNN Training and Validation Loss without Dropout Plot",
        caption: "BASELINE LOSS CURVE (10 EPOCHS) • SEVERE GENERALIZATION DIVERGENCE",
        stats: [
          { label: "MIN VAL LOSS", val: "0.426", detail: "Epoch 3 Inflection" },
          { label: "FINAL VAL LOSS", val: "0.634", detail: "Epoch 9 Divergence" },
          { label: "FINAL TRAIN LOSS", val: "0.125", detail: "Epoch 9 Min" },
          { label: "LOSS GAP", val: "0.509", detail: "Severe Overfit" },
        ],
        numbersBreakdown: [
          { label: "Epoch 0 (Initial Loss)", desc: "Training loss begins at 0.655 and validation loss begins at 0.567." },
          { label: "Epoch 3 (Inflection Point)", desc: "Validation loss reaches its lowest point of 0.426 before starting a sharp upward ascent." },
          { label: "Epoch 9 (Final State)", desc: "Training loss continues descending to 0.125, while validation loss explodes upward to 0.634." },
          { label: "Generalization Spread", desc: "The final loss gap reaches 0.509, representing an unregularized generalization spread." },
        ],
        whatItMeans:
          "The sharp divergence after epoch 3 illustrates classic deep neural network overfitting. Because the 32,768 weights in the dense classification head lacked regularization, individual neurons quickly memorized static landscape backgrounds (such as repetitive canyon rocks and chaparral contours) instead of generic wildfire smoke features. As training loss improved, the model lost its ability to evaluate unseen validation images correctly.",
      },
      {
        num: "02",
        stageTag: "FIGURE 02 // BASELINE ACCURACY",
        title: "Figure 2: Training & Validation Accuracy (Without Dropout)",
        badge: "BASELINE MODEL · 16.2% GAP",
        src: "/firecnn_without_dropout_accuracy.png",
        alt: "FireCNN Training and Validation Accuracy without Dropout Plot",
        caption: "BASELINE ACCURACY CURVE (10 EPOCHS) • PREMATURE VALIDATION PLATEAU",
        stats: [
          { label: "PEAK VAL ACC", val: "80.8%", detail: "Epoch 6 Stagnation" },
          { label: "FINAL VAL ACC", val: "79.6%", detail: "Epoch 9 Plateau" },
          { label: "FINAL TRAIN ACC", val: "95.8%", detail: "Epoch 9 Memorization" },
          { label: "ACCURACY GAP", val: "16.2%", detail: "Generalization Split" },
        ],
        numbersBreakdown: [
          { label: "Epoch 0 to 1 (Early Fit)", desc: "Validation accuracy starts at 70.4% and reaches 75.4% at epoch 1." },
          { label: "Epoch 4 to 9 (Plateau)", desc: "Validation accuracy stalls between 78.4% and 80.8%, ending at 79.6% at epoch 9." },
          { label: "Training Trajectory", desc: "Training accuracy climbs unchecked from 64.4% to 95.8%." },
          { label: "Generalization Gap", desc: "A 16.2% spread forms between training (95.8%) and validation (79.6%), indicating static background memorization." },
        ],
        whatItMeans:
          "The widening gap between training and validation accuracy demonstrates that subsequent training epochs ceased learning general smoke properties. The unregularized model simply fit noise in the training set, causing accuracy on novel validation scenes to stall below 80%.",
      },
    ],
    evaluationFiguresWithDropout: [
      {
        num: "01",
        stageTag: "FIGURE 01 // REGULARIZED LOSS",
        title: "Figure 1: Stabilized Loss Trajectory (Dropout p=0.5)",
        badge: "FINAL MODEL · DROPOUT p=0.5",
        src: "/firecnn_loss_plot.png",
        alt: "FireCNN Training and Validation Loss with Dropout Plot",
        caption: "REGULARIZED LOSS CURVE (10 EPOCHS) • STABILIZED CONVERGENCE TRACKING",
        stats: [
          { label: "MIN VAL LOSS", val: "0.386", detail: "Epoch 8 Best Checkpoint" },
          { label: "FINAL VAL LOSS", val: "0.419", detail: "Epoch 9 Stable" },
          { label: "FINAL TRAIN LOSS", val: "0.296", detail: "Epoch 9 Bounded" },
          { label: "LOSS GAP", val: "0.123", detail: "76% Reduction" },
        ],
        numbersBreakdown: [
          { label: "Epoch 0 (Initial Loss)", desc: "Training loss starts at 0.690 and validation loss starts at 0.606." },
          { label: "Epoch 4 (Close Tracking)", desc: "Validation loss tracks training loss closely, registering 0.426 versus 0.432 on training." },
          { label: "Epoch 8 to 9 (Convergence)", desc: "Validation loss reaches its lowest point of 0.386 at epoch 8 and settles at 0.419 at epoch 9, closely tracking training loss at 0.296." },
          { label: "Generalization Gap", desc: "The loss spread is cut from 0.509 down to 0.123, reducing the validation accuracy gap to 5.07% while achieving 81.84% top validation accuracy." },
        ],
        whatItMeans:
          "Randomly deactivating 50% of dense neurons during training forces the network to learn distributed, redundant smoke features rather than memorizing static terrain. Validation loss tracks training loss without diverging, proving that the model successfully learned invariant combustion features that generalize to new aerial scenes.",
      },
      {
        num: "02",
        stageTag: "FIGURE 02 // REGULARIZED ACCURACY",
        title: "Figure 2: Training & Validation Accuracy (Dropout p=0.5)",
        badge: "FINAL MODEL · 81.84% TOP ACC",
        src: "/firecnn_accuracy_plot.png",
        alt: "FireCNN Training and Validation Accuracy with Dropout Plot",
        caption: "REGULARIZED ACCURACY CURVE (10 EPOCHS) • BALANCED CONVERGENCE",
        stats: [
          { label: "PEAK VAL ACC", val: "81.84%", detail: "Epoch 8 Best Checkpoint" },
          { label: "FINAL VAL ACC", val: "77.6%", detail: "Epoch 9 Checkpoint" },
          { label: "FINAL TRAIN ACC", val: "87.8%", detail: "Epoch 9 Calibrated" },
          { label: "ACCURACY GAP", val: "5.07%", detail: "Narrowed Spread" },
        ],
        numbersBreakdown: [
          { label: "Epoch 0 to 2 (Stable Start)", desc: "Validation accuracy starts at 64.5% and climbs to 72.4% at epoch 2, tracking training accuracy." },
          { label: "Epoch 4 to 8 (Ascent)", desc: "Validation accuracy rises steadily from 78.1% to reach a peak validation accuracy of 81.84% at epoch 8." },
          { label: "Training Trajectory", desc: "Training accuracy scales in a calibrated, controlled curve up to 87.8%." },
          { label: "Generalization Gap", desc: "The gap between training and validation accuracy is narrowed down to 5.07%, confirming strong generalizability." },
        ],
        whatItMeans:
          "Dropout acts as an ensemble regularizer, forcing neurons to rely on multiple redundant smoke indicators (such as plume boundaries, color gradients, and opacity) rather than single pixels. This delivers an 81.84% top validation score with a tight 5.07% generalization spread.",
      },
    ],
    visualType: "none",
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
    subtitle: "Football match outcomes are notoriously low-scoring and volatile: predicting them requires isolating signal from high-variance noise.",
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
        desc: "Every metric must be strictly point-in-time, meaning rolling statistics cannot include the current fixture's performance.",
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
      "To project not just single matches but entire 38-game seasons (including title odds, Champions League qualification, and relegation probabilities), the pipeline integrates a high-speed Monte Carlo simulation engine.",
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
  const [dropoutTab, setDropoutTab] = useState<"without_dropout" | "with_dropout">("without_dropout");
  const isTransitioningRef = useRef(false);

  const cardRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleSelectDropoutTab = useCallback((tab: "without_dropout" | "with_dropout") => {
    setDropoutTab(tab);
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);
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
          {/* 2-Column Split Comparison (e.g. Phase 02 Status Quo vs Scope) */}
          {ph.splitComparison ? (
            <div
              className="expanded-split-comparison"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1px 1fr",
                gap: "24px",
                margin: "4px 0 16px 0",
              }}
            >
              {/* Left Column: Problem with current SQ */}
              <div
                className="split-col-sq"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "14px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderBottom: "1px solid rgba(70, 40, 10, 0.14)",
                    paddingBottom: "6px",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-mono, monospace)",
                      fontSize: "0.68rem",
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "#6b625b",
                    }}
                  >
                    {ph.splitComparison.left.tag}
                  </span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  {ph.splitComparison.left.items.map((item, idx) => (
                    <div key={idx} style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                      <div style={{ display: "flex", alignItems: "baseline", gap: "7px" }}>
                        <span style={{ color: "#78716c", fontSize: "0.80rem", fontWeight: 700, lineHeight: 1 }}>•</span>
                        <strong
                          style={{
                            fontFamily: "var(--font-serif, Georgia, serif)",
                            fontSize: "0.88rem",
                            fontWeight: 700,
                            color: "#1c1917",
                            letterSpacing: "-0.01em",
                          }}
                        >
                          {item.title}
                        </strong>
                      </div>
                      <p
                        style={{
                          fontFamily: "var(--font-serif, Georgia, serif)",
                          fontSize: "0.82rem",
                          lineHeight: 1.52,
                          color: "#44403c",
                          margin: "0 0 0 14px",
                        }}
                      >
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Center Vertical Divider */}
              <div
                className="split-center-divider"
                style={{
                  backgroundColor: "rgba(70, 40, 10, 0.14)",
                  width: "1px",
                  height: "100%",
                }}
              />

              {/* Right Column: Aim & Pragmatic Scope */}
              <div
                className="split-col-aim"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "14px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderBottom: "1px solid rgba(70, 40, 10, 0.14)",
                    paddingBottom: "6px",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-mono, monospace)",
                      fontSize: "0.68rem",
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "#6b625b",
                    }}
                  >
                    {ph.splitComparison.right.tag}
                  </span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  {ph.splitComparison.right.items.map((item, idx) => (
                    <div key={idx} style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                      <div style={{ display: "flex", alignItems: "baseline", gap: "7px" }}>
                        <span style={{ color: "#78716c", fontSize: "0.80rem", fontWeight: 700, lineHeight: 1 }}>•</span>
                        <strong
                          style={{
                            fontFamily: "var(--font-serif, Georgia, serif)",
                            fontSize: "0.88rem",
                            fontWeight: 700,
                            color: "#1c1917",
                            letterSpacing: "-0.01em",
                          }}
                        >
                          {item.title}
                        </strong>
                      </div>
                      <p
                        style={{
                          fontFamily: "var(--font-serif, Georgia, serif)",
                          fontSize: "0.82rem",
                          lineHeight: 1.52,
                          color: "#44403c",
                          margin: "0 0 0 14px",
                        }}
                      >
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : ph.decisions && ph.decisions.length > 0 ? (
            <div
              className="expanded-decisions-list"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                margin: "4px 0 16px 0",
              }}
            >
              {ph.decisions.map((dec, dIdx) => (
                <div
                  key={dec.num}
                  className="expanded-decision-card"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "9px",
                    paddingBottom: dIdx < ph.decisions!.length - 1 ? "16px" : "4px",
                    borderBottom:
                      dIdx < ph.decisions!.length - 1
                        ? "1px solid rgba(70, 40, 10, 0.14)"
                        : "none",
                  }}
                >
                  {/* Header: Number and Title */}
                  <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                    <span
                      style={{
                        fontFamily: "var(--font-mono, monospace)",
                        fontSize: "0.70rem",
                        fontWeight: 700,
                        color: "#78716c",
                        letterSpacing: "0.06em",
                      }}
                    >
                      DECISION {dec.num}
                    </span>
                    <span style={{ color: "rgba(70, 40, 10, 0.25)" }}>/</span>
                    <h4
                      style={{
                        fontFamily: "var(--font-serif, Georgia, serif)",
                        fontSize: "0.92rem",
                        fontWeight: 700,
                        color: "#1c1917",
                        margin: 0,
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {dec.title}
                    </h4>
                  </div>

                  {/* What / Why / Impact Rows */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "6px",
                      paddingLeft: "2px",
                    }}
                  >
                    {/* WHAT */}
                    <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                      <strong
                        style={{
                          fontFamily: "var(--font-serif, Georgia, serif)",
                          fontSize: "0.84rem",
                          fontWeight: 700,
                          color: "#1c1917",
                          minWidth: "62px",
                          flexShrink: 0,
                        }}
                      >
                        What:
                      </strong>
                      <span
                        style={{
                          fontFamily: "var(--font-serif, Georgia, serif)",
                          fontSize: "0.83rem",
                          lineHeight: 1.5,
                          color: "#383531",
                        }}
                      >
                        {dec.what}
                      </span>
                    </div>

                    {/* WHY */}
                    <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                      <strong
                        style={{
                          fontFamily: "var(--font-serif, Georgia, serif)",
                          fontSize: "0.84rem",
                          fontWeight: 700,
                          color: "#1c1917",
                          minWidth: "62px",
                          flexShrink: 0,
                        }}
                      >
                        Why:
                      </strong>
                      <span
                        style={{
                          fontFamily: "var(--font-serif, Georgia, serif)",
                          fontSize: "0.83rem",
                          lineHeight: 1.5,
                          color: "#383531",
                        }}
                      >
                        {dec.why}
                      </span>
                    </div>

                    {/* IMPACT */}
                    <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                      <strong
                        style={{
                          fontFamily: "var(--font-serif, Georgia, serif)",
                          fontSize: "0.84rem",
                          fontWeight: 700,
                          color: "#1c1917",
                          minWidth: "62px",
                          flexShrink: 0,
                        }}
                      >
                        Impact:
                      </strong>
                      <span
                        style={{
                          fontFamily: "var(--font-serif, Georgia, serif)",
                          fontSize: "0.83rem",
                          lineHeight: 1.5,
                          color: "#383531",
                        }}
                      >
                        {dec.impact}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : ph.convolutionStages && ph.convolutionStages.length > 0 ? (
            <div
              className="expanded-cnn-walkthrough"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "18px",
                margin: "4px 0 16px 0",
              }}
            >
              {/* Top: Image of the CNN Network */}
              {ph.cnnDiagram && (
                <div
                  className="cnn-diagram-card"
                  style={{
                    borderRadius: "8px",
                    border: "1px solid rgba(70, 40, 10, 0.16)",
                    backgroundColor: "#ffffff",
                    overflow: "hidden",
                    boxShadow: "0 2px 8px rgba(35, 25, 15, 0.04)",
                  }}
                >
                  <img
                    src={ph.cnnDiagram.src}
                    alt={ph.cnnDiagram.alt}
                    style={{ width: "100%", height: "auto", display: "block" }}
                  />
                </div>
              )}

              {/* Section Sub-Header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderBottom: "1px solid rgba(70, 40, 10, 0.14)",
                  paddingBottom: "6px",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-mono, monospace)",
                    fontSize: "0.68rem",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "#6b625b",
                  }}
                >
                  CONVOLUTIONAL STAGES &amp; LAYER EXPLANATIONS
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-mono, monospace)",
                    fontSize: "0.68rem",
                    color: "#8a1c1c",
                    fontWeight: 600,
                  }}
                >
                  3 CONV BLOCKS + DENSE HEAD
                </span>
              </div>

              {/* Convolution Stages Explanation List */}
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {ph.convolutionStages.map((stg, sIdx) => (
                  <div
                    key={stg.num}
                    className="expanded-conv-card"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "9px",
                      paddingBottom: sIdx < ph.convolutionStages!.length - 1 ? "16px" : "4px",
                      borderBottom:
                        sIdx < ph.convolutionStages!.length - 1
                          ? "1px solid rgba(70, 40, 10, 0.14)"
                          : "none",
                    }}
                  >
                    {/* Header: Title and Specs */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "baseline",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: "6px",
                      }}
                    >
                      <h4
                        style={{
                          fontFamily: "var(--font-serif, Georgia, serif)",
                          fontSize: "0.92rem",
                          fontWeight: 700,
                          color: "#1c1917",
                          margin: 0,
                          letterSpacing: "-0.01em",
                        }}
                      >
                        {stg.title}
                      </h4>

                      <span
                        style={{
                          fontFamily: "var(--font-mono, monospace)",
                          fontSize: "0.66rem",
                          color: "#8a1c1c",
                          backgroundColor: "rgba(138, 28, 28, 0.06)",
                          padding: "2px 7px",
                          borderRadius: "4px",
                          letterSpacing: "0.03em",
                        }}
                      >
                        {stg.specs}
                      </span>
                    </div>

                    {/* Details: Role and What */}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "6px",
                        paddingLeft: "2px",
                      }}
                    >
                      {/* ROLE */}
                      <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                        <strong
                          style={{
                            fontFamily: "var(--font-serif, Georgia, serif)",
                            fontSize: "0.84rem",
                            fontWeight: 700,
                            color: "#1c1917",
                            minWidth: "62px",
                            flexShrink: 0,
                          }}
                        >
                          Role:
                        </strong>
                        <span
                          style={{
                            fontFamily: "var(--font-serif, Georgia, serif)",
                            fontSize: "0.83rem",
                            lineHeight: 1.5,
                            color: "#383531",
                          }}
                        >
                          {stg.role}
                        </span>
                      </div>

                      {/* WHAT */}
                      <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                        <strong
                          style={{
                            fontFamily: "var(--font-serif, Georgia, serif)",
                            fontSize: "0.84rem",
                            fontWeight: 700,
                            color: "#1c1917",
                            minWidth: "62px",
                            flexShrink: 0,
                          }}
                        >
                          What:
                        </strong>
                        <span
                          style={{
                            fontFamily: "var(--font-serif, Georgia, serif)",
                            fontSize: "0.83rem",
                            lineHeight: 1.5,
                            color: "#383531",
                          }}
                        >
                          {stg.what}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (ph.evaluationFiguresWithoutDropout && ph.evaluationFiguresWithoutDropout.length > 0) || (ph.evaluationFigures && ph.evaluationFigures.length > 0) ? (
            <div
              className="expanded-evaluation-section"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                margin: "4px 0 16px 0",
              }}
            >
              {/* Tab Switcher Bar - scrolls naturally with content */}
              <div
                className="dropout-tabs-bar"
                style={{
                  padding: "4px 0 12px 0",
                  borderBottom: "1px solid rgba(70, 40, 10, 0.14)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "10px",
                  flexWrap: "wrap",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span
                    style={{
                      fontFamily: "var(--font-mono, monospace)",
                      fontSize: "0.68rem",
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "#6b625b",
                    }}
                  >
                    RESULTS & GENERALIZATION
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-mono, monospace)",
                      fontSize: "0.62rem",
                      fontWeight: 700,
                      padding: "2px 6px",
                      borderRadius: "3px",
                      backgroundColor: "rgba(138, 28, 28, 0.08)",
                      color: "#8a1c1c",
                      border: "1px solid rgba(138, 28, 28, 0.2)",
                    }}
                  >
                    2 FIGURES IN THIS TAB
                  </span>
                </div>

                {ph.evaluationFiguresWithoutDropout && ph.evaluationFiguresWithDropout && (
                  <div
                    style={{
                      display: "inline-flex",
                      borderRadius: "6px",
                      padding: "2px",
                      backgroundColor: "rgba(70, 40, 10, 0.08)",
                      border: "1px solid rgba(70, 40, 10, 0.14)",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => handleSelectDropoutTab("without_dropout")}
                      style={{
                        padding: "5px 14px",
                        fontSize: "0.72rem",
                        fontFamily: "var(--font-mono, monospace)",
                        fontWeight: 700,
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        transition: "all 0.15s ease",
                        backgroundColor:
                          dropoutTab === "without_dropout" ? "#ffffff" : "transparent",
                        color:
                          dropoutTab === "without_dropout" ? "#8a1c1c" : "#6b625b",
                        boxShadow:
                          dropoutTab === "without_dropout"
                            ? "0 1px 3px rgba(0,0,0,0.10)"
                            : "none",
                      }}
                    >
                      Without Dropout
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSelectDropoutTab("with_dropout")}
                      style={{
                        padding: "5px 14px",
                        fontSize: "0.72rem",
                        fontFamily: "var(--font-mono, monospace)",
                        fontWeight: 700,
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        transition: "all 0.15s ease",
                        backgroundColor:
                          dropoutTab === "with_dropout" ? "#ffffff" : "transparent",
                        color:
                          dropoutTab === "with_dropout" ? "#8a1c1c" : "#6b625b",
                        boxShadow:
                          dropoutTab === "with_dropout"
                            ? "0 1px 3px rgba(0,0,0,0.10)"
                            : "none",
                      }}
                    >
                      Dropout
                    </button>
                  </div>
                )}
              </div>

              {/* Vertical Stacked Figures: Exactly 2 figures in the selected tab */}
              {((ph.evaluationFiguresWithoutDropout && ph.evaluationFiguresWithDropout)
                ? (dropoutTab === "with_dropout" ? ph.evaluationFiguresWithDropout : ph.evaluationFiguresWithoutDropout)
                : (ph.evaluationFigures || [])
              ).map((fig, fIdx, arr) => (
                <div
                  key={fig.num || fIdx}
                  className="evaluation-figure-card"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "14px",
                    paddingBottom: fIdx < arr.length - 1 ? "24px" : "4px",
                    borderBottom:
                      fIdx < arr.length - 1
                        ? "1px solid rgba(70, 40, 10, 0.14)"
                        : "none",
                  }}
                >
                  {/* Figure Header: Title */}
                  <div>
                    <h4
                      style={{
                        fontFamily: "var(--font-serif, Georgia, serif)",
                        fontSize: "0.96rem",
                        fontWeight: 700,
                        color: "#1c1917",
                        margin: 0,
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {fig.title}
                    </h4>
                  </div>

                  {/* Figure Image Container */}
                  <div
                    style={{
                      borderRadius: "8px",
                      border: "1px solid rgba(70, 40, 10, 0.16)",
                      backgroundColor: "#ffffff",
                      overflow: "hidden",
                      boxShadow: "0 2px 6px rgba(35, 25, 15, 0.04)",
                    }}
                  >
                    <img
                      src={fig.src}
                      alt={fig.alt}
                      style={{
                        width: "100%",
                        height: "auto",
                        maxHeight: "340px",
                        objectFit: "contain",
                        display: "block",
                        backgroundColor: "#fcfaf6",
                      }}
                    />
                  </div>

                  {/* Quick Metric Ledger Strip */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(4, 1fr)",
                      gap: "6px",
                    }}
                  >
                    {fig.stats.map((st) => (
                      <div
                        key={st.label}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "2px",
                          padding: "6px 8px",
                          backgroundColor: "#fcfaf7",
                          border: "1px solid rgba(70, 40, 10, 0.12)",
                          borderRadius: "4px",
                          minWidth: 0,
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "var(--font-mono, monospace)",
                            fontSize: "0.58rem",
                            fontWeight: 700,
                            letterSpacing: "0.04em",
                            textTransform: "uppercase",
                            color: "#78716c",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {st.label}
                        </span>
                        <span
                          style={{
                            fontFamily: "var(--font-serif, Georgia, serif)",
                            fontSize: "0.96rem",
                            fontWeight: 700,
                            color: "#1c1917",
                          }}
                        >
                          {st.val}
                        </span>
                        {st.detail && (
                          <span
                            style={{
                              fontFamily: "var(--font-serif, Georgia, serif)",
                              fontSize: "0.64rem",
                              fontStyle: "italic",
                              color: "#8c827a",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {st.detail}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Numbers Explanation & Meaning */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                      padding: "4px 2px",
                    }}
                  >
                    {/* Numbers Breakdown */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      <strong
                        style={{
                          fontFamily: "var(--font-serif, Georgia, serif)",
                          fontSize: "0.85rem",
                          fontWeight: 700,
                          color: "#1c1917",
                          letterSpacing: "-0.01em",
                        }}
                      >
                        Numbers Breakdown:
                      </strong>
                      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                        {fig.numbersBreakdown.map((nb, nIdx) => (
                          <div
                            key={nIdx}
                            style={{
                              display: "flex",
                              alignItems: "baseline",
                              gap: "8px",
                            }}
                          >
                            <span
                              style={{
                                color: "var(--cardinal, #8a1c1c)",
                                fontWeight: 700,
                                flexShrink: 0,
                                fontSize: "0.80rem",
                                lineHeight: 1,
                              }}
                            >
                              •
                            </span>
                            <div style={{ fontSize: "0.83rem", lineHeight: 1.5, fontFamily: "var(--font-serif, Georgia, serif)" }}>
                              <strong style={{ color: "#1c1917", marginRight: "4px" }}>{nb.label}:</strong>
                              <span style={{ color: "#383531" }}>{nb.desc}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* What It Means */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginTop: "2px" }}>
                      <strong
                        style={{
                          fontFamily: "var(--font-serif, Georgia, serif)",
                          fontSize: "0.85rem",
                          fontWeight: 700,
                          color: "#1c1917",
                          letterSpacing: "-0.01em",
                        }}
                      >
                        What the Figure Means:
                      </strong>
                      <p
                        style={{
                          fontFamily: "var(--font-serif, Georgia, serif)",
                          fontSize: "0.83rem",
                          lineHeight: 1.55,
                          color: "#383531",
                          margin: 0,
                        }}
                      >
                        {fig.whatItMeans}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : ph.sections && ph.sections.length > 0 ? (
            <div className="expanded-narrative-section">
              {ph.sections.map((sec, sIdx) => (
                <div key={sIdx} className="expanded-editorial-part">
                  {sec.partLabel && (
                    <div className="expanded-part-header">
                      <span className="expanded-part-label">{sec.partLabel}</span>
                    </div>
                  )}

                  {sec.lead && (
                    <p
                      className="expanded-narrative-lead"
                      style={{
                        fontFamily: "var(--font-serif, Georgia, serif)",
                        fontWeight: 400,
                        color: "#383531",
                        fontSize: "0.85rem",
                        lineHeight: 1.55,
                        margin: "0 0 12px 0",
                      }}
                    >
                      {sec.lead}
                    </p>
                  )}

                  {sec.bullets && sec.bullets.length > 0 && (
                    <div className="expanded-bullet-list" style={{ display: "flex", flexDirection: "column", gap: "9px", margin: "8px 0 14px 0" }}>
                      {sec.bullets.map((b, bIdx) => (
                        <div
                          key={bIdx}
                          className="expanded-bullet-item"
                          style={{ display: "flex", alignItems: "baseline", gap: "8px" }}
                        >
                          <span
                            className="expanded-bullet-marker"
                            style={{
                              color: "var(--cardinal, #8a1c1c)",
                              fontWeight: 700,
                              flexShrink: 0,
                              fontSize: "0.82rem",
                              lineHeight: 1,
                            }}
                          >
                            •
                          </span>
                          <div className="expanded-bullet-content" style={{ flex: 1 }}>
                            <strong
                              className="expanded-bullet-val"
                              style={{
                                fontFamily: "var(--font-serif, Georgia, serif)",
                                fontSize: "0.92rem",
                                fontWeight: 700,
                                color: "#1c1917",
                                letterSpacing: "-0.01em",
                                marginRight: "5px",
                              }}
                            >
                              {b.val}:
                            </strong>{" "}
                            <span
                              className="expanded-bullet-text"
                              style={{
                                fontFamily: "var(--font-serif, Georgia, serif)",
                                color: "#383531",
                                fontSize: "0.83rem",
                                lineHeight: 1.5,
                              }}
                            >
                              {b.text}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {sec.body &&
                    sec.body.map((p, pIdx) => (
                      <p key={pIdx} className="expanded-narrative-p">
                        {p}
                      </p>
                    ))}

                  {sec.stats && sec.stats.length > 0 && (
                    <div className="expanded-incident-grid">
                      {sec.stats.map((st) => (
                        <div key={st.label} className="expanded-incident-box">
                          <span className="eib-val">{st.val}</span>
                          <span className="eib-label">{st.label}</span>
                          {st.sub && <span className="eib-sub">{st.sub}</span>}
                        </div>
                      ))}
                    </div>
                  )}

                  {sec.takeaways && sec.takeaways.length > 0 && (
                    <div className="expanded-takeaways-list">
                      {sec.takeaways.map((item, tIdx) => (
                        <div key={tIdx} className="expanded-takeaway-item">
                          <span className="takeaway-bullet">•</span>
                          <div>
                            <strong className="takeaway-title">{item.title}: </strong>
                            <span className="takeaway-desc">{item.desc}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <>
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
                {ph.narrativeLead && <p className="expanded-narrative-lead">{ph.narrativeLead}</p>}
                {ph.narrativeBody &&
                  ph.narrativeBody.map((paragraph, pIdx) => (
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
                        <span className="takeaway-bullet">•</span>
                        <div>
                          <strong className="takeaway-title">{item.title}: </strong>
                          <span className="takeaway-desc">{item.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

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

          <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "6px" }}>
            <button
              type="button"
              onClick={() => handleExpandPhase(0)}
              className="fan-btn-primary"
            >
              <span>Open Complete Journey (Phase 1)</span>
              <span className="arrow">&rarr;</span>
            </button>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
              <a
                href={isEpl ? (project.href || "https://github.com/aaronnguyen26") : "https://github.com/aaronnguyen26/wildfire"}
                target="_blank"
                rel="noopener noreferrer"
                className="fan-btn-docked-link"
              >
                <span>View GitHub</span>
                <span className="arrow">↗</span>
              </a>
              <a
                href={isEpl ? (project.href || "https://github.com/aaronnguyen26") : "https://github.com/aaronnguyen26/wildfire/blob/main/Wildfire_classification.ipynb"}
                target="_blank"
                rel="noopener noreferrer"
                className="fan-btn-docked-link"
              >
                <span>{isEpl ? "Prediction Notebook" : "Open Notebook"}</span>
                <span className="arrow">↗</span>
              </a>
            </div>
          </div>
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
