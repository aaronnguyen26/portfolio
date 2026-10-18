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
  visualType: "photo" | "timeline" | "tradeoffs" | "tensor" | "plots";
  photoUrl?: string;
  photoCaption?: { left: string; right: string };
  handNote: string;
}

const phases: PhaseDetail[] = [
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
    metrics: [], // Deleted the top row of validation accuracy / model size as requested!
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
    visualType: "photo",
    photoUrl: "/palisades_recon_smoke.jpg",
    photoCaption: {
      left: "PACIFIC PALISADES WILDFIRE • SANTA MONICA MOUNTAIN OVERLOOK",
      right: "BILLOWING SMOKE PLUME OVER CANYON RIDGELINES",
    },
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
    handNote: "↳ Stable loss convergence sustained across all 20 training epochs.",
  },
];

const cnnLayers = [
  { stage: "Stage 00 // Input", dim: "128×128×3 RGB", title: "Input Sensor Tile", op: "Raw Drone Crop • Zero-Mean Norm", speed: "Input Feed", weights: "0 params" },
  { stage: "Stage 01 // Conv 1", dim: "64×64×32", title: "Conv 1: Edge & Horizon Extractor", op: "32 filters (3×3) • ReLU • 2×2 Pool", speed: "<1ms MPS", weights: "896 params" },
  { stage: "Stage 02 // Conv 2", dim: "32×32×64", title: "Conv 2: Smoke Plume Texture", op: "64 filters (3×3) • ReLU • 2×2 Pool", speed: "2ms edge", weights: "18,496 params" },
  { stage: "Stage 03 // Conv 3", dim: "16×16×128", title: "Conv 3: Combustion Filter", op: "128 filters (3×3) • ReLU • 2×2 Pool", speed: "3ms edge", weights: "73,856 params" },
  { stage: "Stage 04 // Dense", dim: "512 Neurons • p=0.5", title: "Dense Head & Dropout", op: "Linear(32K → 512) • Dropout(0.5)", speed: "4ms edge", weights: "16.7M params" },
  { stage: "Stage 05 // Logits", dim: "1 Logit • Sigmoid", title: "Output: Fire Probability", op: "Linear(512 → 1) • Weighted BCE", speed: "<1ms logit", weights: "513 params" },
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
  }, [isOpen, isClosing, expandedIndex, handleClose, handleCloseCard, handleNavigatePhase]);

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
        cardRef.current.style.opacity = "1";
        cardRef.current.style.transform =
          "translate3d(0, 0, 0) scale(1) rotate(-1.5deg)";
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

  if (!isOpen || !project || !mounted) return null;

  // Compute condensed cards list when one card is expanded (exclude both active and outgoing transitioning cards)
  const condensedCards =
    expandedIndex !== null
      ? phases
          .map((p, idx) => ({ ...p, originalIdx: idx }))
          .filter((_, idx) => idx !== expandedIndex && idx !== outgoingIndex)
      : [];

  const renderPhaseExpandedCard = (
    phaseIdx: number,
    opts: {
      isOutgoing?: boolean;
      isIncoming?: boolean;
      isFolding?: boolean;
      dir: "next" | "prev";
    }
  ) => {
    const ph = phases[phaseIdx];
    if (!ph) return null;

    let animClass = "";
    if (opts.isFolding) {
      animClass = "is-folding-to-deck";
    } else if (opts.isOutgoing) {
      animClass = `is-folding-out dir-${opts.dir}`;
    } else if (opts.isIncoming) {
      animClass = `is-fanning-in dir-${opts.dir}`;
    }

    const key = opts.isOutgoing
      ? `outgoing-${ph.num}`
      : opts.isFolding
      ? `folding-${ph.num}`
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
          {/* Metric Strip (Omitted for Phase 01 where metrics is empty) */}
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
                    <span className="takeaway-bullet">›</span>
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
          {ph.visualType === "photo" && (
            <div className="expanded-media-card">
              <img
                src={ph.photoUrl || "/palisades_recon_smoke.jpg"}
                alt="Pacific Palisades Wildfire Reconnaissance"
                className="expanded-media-img"
              />
              <div className="expanded-media-caption">
                <span>
                  <strong>{ph.photoCaption?.left?.split(" • ")[0] || "TARGET CORRIDOR"}:</strong>{" "}
                  {ph.photoCaption?.left?.split(" • ")[1] || ph.photoCaption?.left || "PACIFIC PALISADES COASTAL RIDGELINE"}
                </span>
                <span>{ph.photoCaption?.right || "AERIAL RECONNAISSANCE OVERLOOK"}</span>
              </div>
            </div>
          )}

          {ph.visualType === "timeline" && (
            <div className="expanded-timeline-card">
              <div className="timeline-col legacy">
                <span className="timeline-badge-red">TRADITIONAL SATELLITE REVIEW</span>
                <div className="timeline-stat">3 to 6 Hours</div>
                <p className="timeline-desc">
                  Orbital passes and downlink processing miss the initial 45-minute containment window, allowing brush fires to breach canopies.
                </p>
              </div>
              <div className="timeline-col modern">
                <span className="timeline-badge-green">FIRECNN EDGE DRONE RELAY</span>
                <div className="timeline-stat">14.8 ms (700,000× Faster)</div>
                <p className="timeline-desc">
                  Local on-drone inference detects plumes at minute 2. Drops and ground alerts trigger within 60 seconds of ignition.
                </p>
              </div>
            </div>
          )}

          {ph.visualType === "tradeoffs" && (
            <div className="expanded-tradeoffs-list">
              <div className="tradeoff-item">
                <span className="tradeoff-num">01</span>
                <div>
                  <h5 className="tradeoff-title">Custom 3-Stage CNN vs. Vision Transformers (ViT)</h5>
                  <p className="tradeoff-body">
                    86M ViT-B/16 requires 80–120W of compute power, draining drone batteries in 18 minutes. Custom 3-stage CNN uses 16.8M parameters consuming under 5W on edge quadcopters.
                  </p>
                </div>
              </div>
              <div className="tradeoff-item">
                <span className="tradeoff-num">02</span>
                <div>
                  <h5 className="tradeoff-title">Dense Head Dropout (p=0.5)</h5>
                  <p className="tradeoff-body">
                    Baseline models memorized specific mountain ridge angles (16.1% generalization gap). 50% random masking across 512 latent units narrowed the spread down to 5.07%.
                  </p>
                </div>
              </div>
              <div className="tradeoff-item">
                <span className="tradeoff-num">03</span>
                <div>
                  <h5 className="tradeoff-title">Classification over Polygon Segmentation</h5>
                  <p className="tradeoff-body">
                    Cut contour segmentation (+320ms per tile) to preserve real-time 60+ FPS edge throughput and sub-15ms ignition classification.
                  </p>
                </div>
              </div>
            </div>
          )}

          {ph.visualType === "tensor" && (
            <div className="expanded-tensor-grid">
              {cnnLayers.map((layer, lIdx) => (
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
              <div className="plot-card">
                <div className="plot-hdr">TRAINING &amp; VAL LOSS (DROPOUT p=0.5)</div>
                <img
                  src="/firecnn_loss_plot.png"
                  alt="Loss Plot"
                  className="plot-img"
                />
              </div>
              <div className="plot-card">
                <div className="plot-hdr">ACCURACY DIVERGENCE (81.84% VAL ACC)</div>
                <img
                  src="/firecnn_accuracy_plot.png"
                  alt="Accuracy Plot"
                  className="plot-img"
                />
              </div>
            </div>
          )}

          {/* Handwritten engineering note */}
          <p className="expanded-hand-note">{ph.handNote}</p>

          {/* Action buttons */}
          <div className="expanded-actions-row">
            <a
              href="https://github.com/aaronnguyen26/wildfire"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-exp-action primary"
            >
              <span>View GitHub Repository</span>
              <span>↗</span>
            </a>
            <a
              href="https://github.com/aaronnguyen26/wildfire/blob/main/Wildfire_classification.ipynb"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-exp-action secondary"
            >
              <span>Open Jupyter Notebook</span>
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

          <span className="exp-page-indicator">
            PHASE {ph.num} OF 05
          </span>

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
          {/* Top-Right Exit '✕' on the brown background */}
          <button
            type="button"
            onClick={expandedIndex !== null ? handleCloseCard : handleClose}
            className="desk-mat-close-x"
            title={expandedIndex !== null ? "Fold Phase / Return to Deck [ESC]" : "Exit to Workbench [ESC]"}
            aria-label={expandedIndex !== null ? "Fold Phase / Return to Deck" : "Exit to Workbench"}
          >
            ✕
          </button>

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

                      {/* Clean archival spec badge (No generic green pill) */}
                      <div className="condensed-phase-spec">
                        {c.badgeLabel}
                      </div>

                      <div className="condensed-tap-hint">
                        <span>Click to view &rarr;</span>
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
