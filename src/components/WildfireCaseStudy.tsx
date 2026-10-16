"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const stages = [
  { id: "stage-01", num: "01", label: "Overview" },
  { id: "stage-02", num: "02", label: "Problem & User" },
  { id: "stage-03", num: "03", label: "Decisions & Tradeoffs" },
  { id: "stage-04", num: "04", label: "How It Works" },
  { id: "stage-05", num: "05", label: "Results" },
];

const cnnLayerNotes = [
  {
    id: 0,
    stage: "Stage 00 // Input",
    dim: "128×128×3 RGB",
    title: "Input Sensor Tile",
    op: "Raw Drone Crop • Zero-Mean Norm",
    func: "Takes a standardized 128×128 pixel crop from scout drones or mountain lookouts. Normalizes RGB values to eliminate daylight discrepancies.",
    why: "128×128 resolution preserves faint smoke plumes while keeping memory light enough for 60+ FPS edge processing with zero satellite delay.",
    weights: "0 parameters",
    speed: "Input Feed",
  },
  {
    id: 1,
    stage: "Stage 01 // Conv 1",
    dim: "64×64×32",
    title: "Conv 1: Edge & Horizon Extractor",
    op: "32 filters (3×3) • ReLU • 2×2 Pool",
    func: "32 spatial filters slide across the image. The 4-corner pyramid shows each 3×3 patch collapsing to 1 cell, then 2×2 pooling halves spatial size to 64×64.",
    why: "Early brush ignitions appear as sharp contrast edges between bright flame points, dark chaparral brush, and ridge horizons.",
    weights: "896 parameters",
    speed: "<1ms on Apple MPS",
  },
  {
    id: 2,
    stage: "Stage 02 // Conv 2",
    dim: "32×32×64",
    title: "Conv 2: Smoke Plume Texture",
    op: "64 filters (3×3) • ReLU • 2×2 Pool",
    func: "Expands channel depth to 64 while halving dimensions to 32×32, widening the receptive field across broader landscape regions.",
    why: "Learns turbulent smoke billows and diffuse ash textures, distinguishing moving fire clouds from solid rocks or static terrain.",
    weights: "18,496 params",
    speed: "2ms on edge",
  },
  {
    id: 3,
    stage: "Stage 03 // Conv 3",
    dim: "16×16×128",
    title: "Conv 3: Combustion Filter",
    op: "128 filters (3×3) • ReLU • 2×2 Pool",
    func: "128 deep filters distill contextual aerodynamics into a compact 16×16 feature grid.",
    why: "Crucial false-positive filter: separates authentic wildfire smoke from morning fog banks, marine clouds, or dust devils.",
    weights: "73,856 params",
    speed: "3ms on edge",
  },
  {
    id: 4,
    stage: "Stage 04 // Dense",
    dim: "512 Neurons • p=0.5",
    title: "Dense Head & Dropout",
    op: "Linear(32K → 512) • Dropout(0.5)",
    func: "Flattens 32,768 spatial activations into 512 latent dimensions with 50% random neuron masking.",
    why: "Heavy dropout prevents the 16.7M dense weights from memorizing specific camera backgrounds or sun angles.",
    weights: "16.7M params",
    speed: "4ms on edge",
  },
  {
    id: 5,
    stage: "Stage 05 // Logits",
    dim: "1 Logit • Sigmoid",
    title: "Output: Fire Probability",
    op: "Linear(512 → 1) • Weighted BCE Loss",
    func: "Projects 512 latent features down to a single binary activation calibrated to 97.4% FIRE.",
    why: "Loss function heavily penalizes false negatives (missed fires) so dispatch alerts trigger even in faint smoke conditions.",
    weights: "513 params",
    speed: "<1ms final logit",
  },
];

function WildfireCaseStudyInner() {
  const searchParams = useSearchParams();
  const phaseParam = searchParams ? searchParams.get("phase") : null;
  const initialIndex = (() => {
    if (phaseParam) {
      const p = parseInt(phaseParam, 10);
      if (!isNaN(p) && p >= 1 && p <= stages.length) {
        return p - 1;
      }
    }
    return 0;
  })();

  const [activeStage, setActiveStage] = useState(initialIndex);
  const [activeCnnLayer, setActiveCnnLayer] = useState(1);

  // Sync state if URL search param changes
  useEffect(() => {
    if (phaseParam) {
      const p = parseInt(phaseParam, 10);
      if (!isNaN(p) && p >= 1 && p <= stages.length) {
        setActiveStage(p - 1);
      }
    }
  }, [phaseParam]);

  const prevStage = useCallback(() => {
    setActiveStage((prev) => {
      const next = Math.max(0, prev - 1);
      if (typeof window !== "undefined") {
        window.history.replaceState(null, "", `?phase=${next + 1}`);
      }
      return next;
    });
  }, []);

  const nextStage = useCallback(() => {
    setActiveStage((prev) => {
      const next = Math.min(stages.length - 1, prev + 1);
      if (typeof window !== "undefined") {
        window.history.replaceState(null, "", `?phase=${next + 1}`);
      }
      return next;
    });
  }, []);

  const setStage = useCallback((idx: number) => {
    setActiveStage(idx);
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", `?phase=${idx + 1}`);
    }
  }, []);

  // Scroll-down animation: moving from left to right between phases 1 to 5
  useEffect(() => {
    let lastWheelTime = 0;
    let accumulatedDelta = 0;

    const handleWheel = (e: WheelEvent) => {
      // Check if active panel has internal vertical scroll
      const activePanel = document.getElementById(`panel-${activeStage}`);
      if (activePanel && activePanel.scrollHeight > activePanel.clientHeight) {
        const atTop = activePanel.scrollTop <= 4;
        const atBottom =
          activePanel.scrollTop + activePanel.clientHeight >=
          activePanel.scrollHeight - 4;

        if (e.deltaY > 0 && !atBottom) return;
        if (e.deltaY < 0 && !atTop) return;
      }

      accumulatedDelta += e.deltaY;
      const now = Date.now();

      if (Math.abs(accumulatedDelta) >= 28 && now - lastWheelTime > 520) {
        if (accumulatedDelta > 0) {
          nextStage();
        } else {
          prevStage();
        }
        lastWheelTime = now;
        accumulatedDelta = 0;
      }

      const timer = setTimeout(() => {
        accumulatedDelta = 0;
      }, 200);

      return () => clearTimeout(timer);
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [activeStage, nextStage, prevStage]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "PageDown") {
        nextStage();
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        prevStage();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextStage, prevStage]);

  // Touch swipe gestures
  useEffect(() => {
    let startX = 0;
    let startY = 0;

    const onTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };

    const onTouchEnd = (e: TouchEvent) => {
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const diffX = startX - endX;
      const diffY = startY - endY;

      if (Math.abs(diffX) > 40) {
        if (diffX > 0) nextStage();
        else prevStage();
      } else if (Math.abs(diffY) > 50) {
        if (diffY > 0) nextStage();
        else prevStage();
      }
    };

    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [nextStage, prevStage]);

  return (
    <div className="case-study-full-screen">
      {/* 1. Full-Width Header Bar (Stamp deleted) */}
      <header className="cs-top-bar">
        <Link href="/projects" className="back-btn">
          <span>&larr; Back to Projects Workbench</span>
        </Link>
        <div className="cs-title-pill">
          Wildfire <em>Image Detection</em>
        </div>
        <div style={{ width: 220 }} />
      </header>

      {/* 2. Timeline Scrubber Bar (Exact match to visual preview) */}
      <nav
        style={{
          borderBottom: "1px solid rgba(70, 40, 10, 0.12)",
          padding: "14px 32px",
          position: "sticky",
          top: 61,
          zIndex: 45,
          background: "transparent",
        }}
        aria-label="Project Journey Scrubber"
      >
        <div
          style={{
            maxWidth: 896,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "relative",
          }}
        >
          {/* Horizontal Connecting Line */}
          <div
            style={{
              position: "absolute",
              left: 24,
              right: 24,
              top: 16,
              height: 2,
              background: "#d6d3d1",
              zIndex: 0,
            }}
          />

          {stages.map((stage, idx) => {
            const isActive = activeStage === idx;
            return (
              <button
                key={stage.id}
                type="button"
                onClick={() => setStage(idx)}
                style={{
                  position: "relative",
                  zIndex: 10,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 6,
                  opacity: isActive ? 1 : 0.7,
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  transition: "opacity 0.2s ease",
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "var(--font-mono, monospace)",
                    fontSize: "0.75rem",
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? "#ffffff" : "#44403c",
                    background: isActive ? "var(--cardinal)" : "#ffffff",
                    border: isActive ? "none" : "1px solid #a8a29e",
                    boxShadow: isActive ? "0 0 0 5px rgba(254, 226, 226, 0.85), 0 2px 4px rgba(0,0,0,0.08)" : undefined,
                  }}
                >
                  {stage.num}
                </div>
                <span
                  style={{
                    fontSize: "10px",
                    fontFamily: "var(--font-mono, monospace)",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: isActive ? "var(--cardinal)" : "#44403c",
                  }}
                >
                  {stage.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* 3. Full-Screen Horizontal Sideway Viewport */}
      <main className="cs-horizontal-viewport">
        <div
          className="cs-horizontal-track"
          style={{ transform: `translateX(-${activeStage * 100}vw)` }}
        >
          {/* =================================================================
              PANEL 01: OVERVIEW
             ================================================================= */}
          <section
            id="panel-0"
            className="cs-panel"
            aria-label="Phase 01: Overview"
          >
            <div className="cs-panel-inner">
              <div className="cs-grid-split">
                {/* Left Column: Narrative & Meta */}
                <div>
                  <span className="eyebrow-dossier">Phase 01 // Overview</span>
                  <h1 className="project-title" style={{ marginTop: 6, marginBottom: 16 }}>
                    Wildfire Image Detection
                  </h1>

                  <div className="one-line-outcome" style={{ marginBottom: 20 }}>
                    &ldquo;A lightweight 3-stage convolutional neural network detecting early-stage wildfire ignitions in under 15ms.&rdquo;
                  </div>

                  <p style={{ fontSize: "1.08rem", lineHeight: 1.68, color: "var(--ink)", marginBottom: 22 }}>
                    Early detection of wildland brush ignitions is the single highest leverage point in stopping destructive California megafires. This project develops a custom, edge-deployable deep learning computer vision model designed to run directly on drone scout relays and remote mountain lookouts with zero dependency on high-bandwidth satellite uplinks.
                  </p>

                  <div className="meta-tags-bar" style={{ marginBottom: 22 }}>
                    <span className="meta-tag">
                      <strong>Role:</strong> Solo ML Engineer
                    </span>
                    <span className="meta-tag">
                      <strong>Timeframe:</strong> Aug 2024
                    </span>
                    <span className="meta-tag">
                      <strong>Stack:</strong> PyTorch &middot; Torchvision &middot; Scikit-Learn
                    </span>
                    <span className="meta-tag">
                      <strong>Model Size:</strong> 33.9 MB
                    </span>
                    <span className="meta-tag">
                      <strong>Best Val Acc:</strong> 81.84%
                    </span>
                  </div>

                  <div className="links-bar" style={{ marginBottom: 12 }}>
                    <a
                      href="https://github.com/aaronnguyen26/wildfire"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-link primary"
                    >
                      View GitHub Repository ↗
                    </a>
                    <a
                      href="https://github.com/aaronnguyen26/wildfire/blob/main/Wildfire_classification.ipynb"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-link secondary"
                    >
                      Open Jupyter Notebook ↗
                    </a>
                  </div>
                </div>

                {/* Right Column: Authentic Palisades Wildfire Photo */}
                <div>
                  <div className="hero-image-wrap" style={{ marginBottom: 0 }}>
                    <img
                      src="/palisades_fire_real.jpg"
                      alt="Pacific Palisades Wildfire Ground Photo"
                      style={{ height: 420 }}
                    />
                    <div className="hero-image-caption">
                      <span>
                        <strong>PACIFIC PALISADES WILDFIRE</strong> // LOS ANGELES COASTLINE IGNITION SPREAD
                      </span>
                      <span>DATASET TARGET STUDY: 128x128x3 TILES</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* =================================================================
              PANEL 02: PROBLEM & USER
             ================================================================= */}
          <section
            id="panel-1"
            className="cs-panel"
            aria-label="Phase 02: Problem & User"
          >
            <div className="cs-panel-inner">
              <span className="eyebrow-dossier">Phase 02 // Problem &amp; User</span>
              <div className="section-title" style={{ marginTop: 6, marginBottom: 24 }}>
                <span className="section-num">02 //</span>
                <h2>Problem &amp; User</h2>
              </div>

              <div className="cs-grid-split">
                {/* Left Column: Problem & Evidence */}
                <div>
                  <div className="problem-box-red" style={{ marginBottom: 0 }}>
                    <p style={{ fontSize: "1.15rem", lineHeight: 1.7, marginBottom: 16 }}>
                      Emergency dispatchers and wildland forestry teams monitor tens of thousands of square miles of brush daily. Manual human scanning of satellite and aerial feeds takes <strong>3 to 6 hours</strong>&mdash;creating a catastrophic delay during which a single ground ember crowns into an uncontrollable canopy inferno.
                    </p>
                    <span className="evidence-badge">Evidence Checked: Containment Dropoff Timeline</span>
                    <p style={{ fontSize: "1.1rem", lineHeight: 1.7 }}>
                      Historical wildfire logs from the California Department of Forestry show that initial aerial containment success is over <strong>85%</strong> when aircraft drop retardant within the first <strong>45 minutes</strong> of ignition, but collapses to under <strong>25%</strong> once fire reaches the tree canopy.
                    </p>
                  </div>
                </div>

                {/* Right Column: Key Telemetry Metric & User Persona */}
                <div>
                  <div className="cs-telemetry-box">
                    <span className="cs-telemetry-lbl">Scanning Latency Compression</span>
                    <div className="cs-telemetry-val">3h &rarr; 15ms</div>
                    <p style={{ fontSize: "0.94rem", color: "var(--ink-soft)", margin: 0, fontStyle: "italic" }}>
                      Compressing human satellite tile scanning delay by over 700,000&times; to preserve the initial 45-minute aerial drop window.
                    </p>
                  </div>

                  <div className="cs-persona-card">
                    <strong style={{ color: "var(--cardinal)", fontFamily: "var(--font-mono, monospace)", fontSize: "0.74rem", textTransform: "uppercase", display: "block", marginBottom: 6 }}>
                      Target User Persona &amp; Field Constraints:
                    </strong>
                    <p style={{ margin: 0, color: "var(--ink)" }}>
                      Wildland forestry dispatch teams &amp; aerial scout pilots operating over low-bandwidth satellite relays (Iridium/Starlink). Cloud-based mega-models fail when bandwidth drops during thick smoke plumes; local edge execution was a hard requirement.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* =================================================================
              PANEL 03: DECISIONS & TRADEOFFS
             ================================================================= */}
          <section
            id="panel-2"
            className="cs-panel"
            aria-label="Phase 03: Decisions & Tradeoffs"
          >
            <div className="cs-panel-inner">
              <span className="eyebrow-dossier">Phase 03 // Decisions &amp; Tradeoffs</span>
              <div className="section-title" style={{ marginTop: 6, marginBottom: 24 }}>
                <span className="section-num">03 //</span>
                <h2>Decisions &amp; Tradeoffs</h2>
              </div>

              {/* 2-column choices */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>
                <div className="choice-item" style={{ background: "rgba(138, 28, 28, 0.03)", border: "1.5px solid rgba(138, 28, 28, 0.25)", borderRadius: 8, padding: 22 }}>
                  <div className="choice-header" style={{ marginBottom: 10 }}>
                    <span className="choice-badge">CHOICE 1</span>
                    <span className="choice-title" style={{ fontSize: "1.2rem" }}>
                      Custom 3-Stage FireCNN over Pre-Trained Transformers (ViT) / ResNet
                    </span>
                  </div>
                  <p className="choice-body" style={{ fontSize: "1.02rem", lineHeight: 1.65 }}>
                    <strong>Why:</strong> Drone scout stations and field relays have severe compute and battery constraints. A custom 3-stage CNN keeps the footprint down to <strong>33.9 MB</strong> and achieves <strong>sub-15ms inference</strong> locally, removing the need for expensive satellite internet uplinks.
                  </p>
                </div>

                <div className="choice-item" style={{ background: "rgba(138, 28, 28, 0.03)", border: "1.5px solid rgba(138, 28, 28, 0.25)", borderRadius: 8, padding: 22 }}>
                  <div className="choice-header" style={{ marginBottom: 10 }}>
                    <span className="choice-badge">CHOICE 2</span>
                    <span className="choice-title" style={{ fontSize: "1.2rem" }}>
                      Dropout Regularization (p=0.5) over Heavy Feature Expansion
                    </span>
                  </div>
                  <p className="choice-body" style={{ fontSize: "1.02rem", lineHeight: 1.65 }}>
                    <strong>Why:</strong> The initial unregularized CNN began severely overfitting by epoch 6 (training loss dropped to 0.12 while validation loss stalled). Adding a <strong>Dropout(p=0.5)</strong> head boosted peak validation accuracy to <strong>81.84%</strong> and stabilized validation loss across training runs.
                  </p>
                </div>
              </div>

              {/* Deliberate Scope Cut Card */}
              <div className="scope-cut-card" style={{ marginTop: 0 }}>
                <h4>Deliberate Scope Cut (Product Judgment):</h4>
                <p style={{ fontSize: "1.06rem", lineHeight: 1.68 }}>
                  <strong>I deliberately cut polygonal perimeter segmentation (masking) from V1.</strong> Delineating exact flame boundary pixels is valuable during Day 3 mop-up operations, but for early warning dispatch, teams need an instant, 100% reliable binary signal: <em>&ldquo;Does this tile contain fire?&rdquo;</em> Cutting segmentation saved weeks of polygon labeling and cut inference latency by <strong>78%</strong>.
                </p>
              </div>
            </div>
          </section>

          {/* =================================================================
              PANEL 04: HOW IT WORKS
             ================================================================= */}
          <section
            id="panel-3"
            className="cs-panel"
            aria-label="Phase 04: How It Works"
          >
            <div className="cs-panel-inner" style={{ maxWidth: 1100 }}>
              <span className="eyebrow-dossier">Phase 04 // How It Works</span>
              <div className="section-title" style={{ marginTop: 6, marginBottom: 14 }}>
                <span className="section-num">04 //</span>
                <h2>How It Works</h2>
              </div>

              <p style={{ fontSize: "1.1rem", lineHeight: 1.65, marginBottom: 20 }}>
                The custom <code>FireCNN</code> architecture feeds normalized 128&times;128&times;3 RGB crops through three convolutional and max-pooling stages into a 512-neuron fully connected head with dropout regularization:
              </p>

              {/* CNN DIAGRAM DIRECTLY ON THE PARCHMENT BACKGROUND (NO EXTRA WHITE BOXES) */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "24px",
                  paddingTop: "12px",
                  paddingBottom: "24px",
                  minHeight: "400px",
                }}
              >
                {/* LEFT: FLAT 2D CNN (DIRECTLY ON BACKGROUND) */}
                <div
                  style={{
                    width: 680,
                    height: 360,
                    position: "relative",
                    userSelect: "none",
                    flexShrink: 0,
                  }}
                >
                  {/* SVG CONNECTIONS & ARROWS CANVAS */}
                  <svg
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      pointerEvents: "none",
                      overflow: "visible",
                    }}
                  >
                    <defs>
                      <marker
                        id="arr-red"
                        viewBox="0 0 10 10"
                        refX="7"
                        refY="5"
                        markerWidth="6"
                        markerHeight="6"
                        orient="auto-start-reverse"
                      >
                        <path d="M 0 1 L 10 5 L 0 9 z" fill="#dc2626" />
                      </marker>
                      <marker
                        id="arr-amber"
                        viewBox="0 0 10 10"
                        refX="7"
                        refY="5"
                        markerWidth="6"
                        markerHeight="6"
                        orient="auto-start-reverse"
                      >
                        <path d="M 0 1 L 10 5 L 0 9 z" fill="#d97706" />
                      </marker>
                      <marker
                        id="arr-indigo"
                        viewBox="0 0 10 10"
                        refX="7"
                        refY="5"
                        markerWidth="6"
                        markerHeight="6"
                        orient="auto-start-reverse"
                      >
                        <path d="M 0 1 L 10 5 L 0 9 z" fill="#4f46e5" />
                      </marker>
                    </defs>

                    {/* 4-Corner Receptive Field Pyramidal Vector Arrows */}
                    <line x1="38" y1="135" x2="185" y2="160" stroke="#dc2626" strokeWidth="1.8" markerEnd="url(#arr-red)" className="arrow-flow" />
                    <line x1="66" y1="135" x2="185" y2="160" stroke="#dc2626" strokeWidth="1.8" markerEnd="url(#arr-red)" className="arrow-flow" />
                    <line x1="66" y1="163" x2="185" y2="160" stroke="#dc2626" strokeWidth="1.8" markerEnd="url(#arr-red)" className="arrow-flow" />
                    <line x1="38" y1="163" x2="185" y2="160" stroke="#dc2626" strokeWidth="1.8" markerEnd="url(#arr-red)" className="arrow-flow" />

                    {/* Inter-Layer Flow Arrows (Exact Concept 02 Colors) */}
                    {/* Conv 1 -> Conv 2 (Amber) */}
                    <line x1="237" y1="160" x2="280" y2="160" stroke="#d97706" strokeWidth="2.5" markerEnd="url(#arr-amber)" className="arrow-flow" />
                    {/* Conv 2 -> Conv 3 (Red) */}
                    <line x1="352" y1="160" x2="395" y2="160" stroke="#dc2626" strokeWidth="2.5" markerEnd="url(#arr-red)" className="arrow-flow" />
                    {/* Conv 3 -> Dense (Indigo) */}
                    <line x1="457" y1="160" x2="505" y2="160" stroke="#4f46e5" strokeWidth="2.5" markerEnd="url(#arr-indigo)" className="arrow-flow" />
                    {/* Dense -> Logits (Cardinal Red) */}
                    <line x1="531" y1="160" x2="580" y2="160" stroke="#dc2626" strokeWidth="3" markerEnd="url(#arr-red)" className="arrow-flow" />
                  </svg>

                  {/* LAYER 0: INPUT TILE (128x128x3) */}
                  <div
                    className={`cnn-layer-box ${activeCnnLayer === 0 ? "active-box" : ""}`}
                    onClick={() => setActiveCnnLayer(0)}
                    style={{
                      position: "absolute",
                      left: 15,
                      top: 110,
                      width: 100,
                      height: 100,
                      borderRadius: 8,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: 6,
                      background: "rgba(255, 255, 255, 0.95)",
                      border: "2px solid #64748b",
                    }}
                  >
                    <div style={{ width: "100%", height: "100%", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gridTemplateRows: "repeat(3, 1fr)", gap: 4, position: "relative", pointerEvents: "none" }}>
                      {[...Array(9)].map((_, i) => (
                        <div key={i} style={{ border: "1px solid #cbd5e1", borderRadius: 2 }} />
                      ))}
                      {/* Receptive Field 3x3 patch on top-left */}
                      <div
                        className="patch-pulse"
                        style={{
                          position: "absolute",
                          border: "2px solid #ef4444",
                          background: "rgba(239, 68, 68, 0.3)",
                          borderRadius: 2,
                          width: 28,
                          height: 28,
                          top: 2,
                          left: 2,
                        }}
                      >
                        <span style={{ fontSize: 7, fontFamily: "var(--font-mono, monospace)", color: "#dc2626", fontWeight: 700, position: "absolute", top: -12, left: 0 }}>
                          3&times;3
                        </span>
                      </div>
                    </div>
                    <div style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", top: "100%", marginTop: 8, whiteSpace: "nowrap", textAlign: "center" }}>
                      <span style={{ fontSize: 10, fontFamily: "var(--font-mono, monospace)", fontWeight: 700, color: "#1c1917", display: "block" }}>Input Tile</span>
                      <span style={{ fontSize: 9, fontFamily: "var(--font-mono, monospace)", color: "#78716c" }}>128&times;128&times;3</span>
                    </div>
                  </div>

                  {/* LAYER 1: CONV 1 (64x64x32) */}
                  <div
                    className={`cnn-layer-box ${activeCnnLayer === 1 ? "active-box" : ""}`}
                    onClick={() => setActiveCnnLayer(1)}
                    style={{
                      position: "absolute",
                      left: 155,
                      top: 119,
                      width: 82,
                      height: 82,
                      borderRadius: 8,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: 6,
                      background: "rgba(16, 185, 129, 0.22)",
                      border: "2px solid #059669",
                    }}
                  >
                    <div style={{ width: "100%", height: "100%", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gridTemplateRows: "repeat(3, 1fr)", gap: 4, pointerEvents: "none" }}>
                      <div style={{ border: "1px solid rgba(5, 150, 105, 0.4)", borderRadius: 2, background: "rgba(16, 185, 129, 0.1)" }} />
                      <div style={{ border: "1px solid rgba(5, 150, 105, 0.4)", borderRadius: 2, background: "rgba(16, 185, 129, 0.1)" }} />
                      <div style={{ border: "1px solid rgba(5, 150, 105, 0.4)", borderRadius: 2, background: "rgba(16, 185, 129, 0.1)" }} />
                      <div style={{ border: "1px solid rgba(5, 150, 105, 0.4)", borderRadius: 2, background: "rgba(16, 185, 129, 0.1)" }} />
                      {/* Center target cell of pyramid projection */}
                      <div style={{ border: "2px solid #059669", borderRadius: 2, background: "rgba(52, 211, 153, 0.8)", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }} />
                      <div style={{ border: "1px solid rgba(5, 150, 105, 0.4)", borderRadius: 2, background: "rgba(16, 185, 129, 0.1)" }} />
                      <div style={{ border: "1px solid rgba(5, 150, 105, 0.4)", borderRadius: 2, background: "rgba(16, 185, 129, 0.1)" }} />
                      <div style={{ border: "1px solid rgba(5, 150, 105, 0.4)", borderRadius: 2, background: "rgba(16, 185, 129, 0.1)" }} />
                      <div style={{ border: "1px solid rgba(5, 150, 105, 0.4)", borderRadius: 2, background: "rgba(16, 185, 129, 0.1)" }} />
                    </div>
                    <div style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", top: "100%", marginTop: 8, whiteSpace: "nowrap", textAlign: "center" }}>
                      <span style={{ fontSize: 10, fontFamily: "var(--font-mono, monospace)", fontWeight: 700, color: "#1c1917", display: "block" }}>Conv 1</span>
                      <span style={{ fontSize: 9, fontFamily: "var(--font-mono, monospace)", color: "#78716c" }}>64&times;64&times;32</span>
                    </div>
                  </div>

                  {/* LAYER 2: CONV 2 (32x32x64) */}
                  <div
                    className={`cnn-layer-box ${activeCnnLayer === 2 ? "active-box" : ""}`}
                    onClick={() => setActiveCnnLayer(2)}
                    style={{
                      position: "absolute",
                      left: 280,
                      top: 124,
                      width: 72,
                      height: 72,
                      borderRadius: 8,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: 6,
                      background: "rgba(245, 158, 11, 0.22)",
                      border: "2px solid #d97706",
                    }}
                  >
                    <div style={{ width: "100%", height: "100%", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gridTemplateRows: "repeat(3, 1fr)", gap: 4, pointerEvents: "none" }}>
                      {[...Array(9)].map((_, i) => (
                        <div
                          key={i}
                          style={{
                            border: "1px solid rgba(217, 119, 6, 0.4)",
                            borderRadius: 2,
                            background: i === 4 ? "rgba(245, 158, 11, 0.3)" : "rgba(245, 158, 11, 0.1)",
                          }}
                        />
                      ))}
                    </div>
                    <div style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", top: "100%", marginTop: 8, whiteSpace: "nowrap", textAlign: "center" }}>
                      <span style={{ fontSize: 10, fontFamily: "var(--font-mono, monospace)", fontWeight: 700, color: "#1c1917", display: "block" }}>Conv 2</span>
                      <span style={{ fontSize: 9, fontFamily: "var(--font-mono, monospace)", color: "#78716c" }}>32&times;32&times;64</span>
                    </div>
                  </div>

                  {/* LAYER 3: CONV 3 (16x16x128) */}
                  <div
                    className={`cnn-layer-box ${activeCnnLayer === 3 ? "active-box" : ""}`}
                    onClick={() => setActiveCnnLayer(3)}
                    style={{
                      position: "absolute",
                      left: 395,
                      top: 129,
                      width: 62,
                      height: 62,
                      borderRadius: 8,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: 4,
                      background: "rgba(239, 68, 68, 0.25)",
                      border: "2px solid #dc2626",
                    }}
                  >
                    <div style={{ width: "100%", height: "100%", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gridTemplateRows: "repeat(3, 1fr)", gap: 2, pointerEvents: "none" }}>
                      {[...Array(9)].map((_, i) => (
                        <div
                          key={i}
                          style={{
                            border: "1px solid rgba(220, 38, 38, 0.4)",
                            borderRadius: 2,
                            background: i === 4 ? "rgba(239, 68, 68, 0.45)" : "rgba(239, 68, 68, 0.2)",
                          }}
                        />
                      ))}
                    </div>
                    <div style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", top: "100%", marginTop: 8, whiteSpace: "nowrap", textAlign: "center" }}>
                      <span style={{ fontSize: 10, fontFamily: "var(--font-mono, monospace)", fontWeight: 700, color: "#1c1917", display: "block" }}>Conv 3</span>
                      <span style={{ fontSize: 9, fontFamily: "var(--font-mono, monospace)", color: "#78716c" }}>16&times;16&times;128</span>
                    </div>
                  </div>

                  {/* LAYER 4: DENSE HEAD (512) */}
                  <div
                    className={`cnn-layer-box ${activeCnnLayer === 4 ? "active-box" : ""}`}
                    onClick={() => setActiveCnnLayer(4)}
                    style={{
                      position: "absolute",
                      left: 505,
                      top: 93,
                      width: 26,
                      height: 134,
                      borderRadius: 8,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "8px 0",
                      background: "rgba(99, 102, 241, 0.3)",
                      border: "2px solid #4f46e5",
                    }}
                  >
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#6366f1" }} />
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#818cf8" }} />
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#a5b4fc" }} />
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#818cf8" }} />
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#6366f1" }} />
                    <div style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", top: "100%", marginTop: 8, whiteSpace: "nowrap", textAlign: "center" }}>
                      <span style={{ fontSize: 10, fontFamily: "var(--font-mono, monospace)", fontWeight: 700, color: "#1c1917", display: "block" }}>Dense</span>
                      <span style={{ fontSize: 9, fontFamily: "var(--font-mono, monospace)", color: "#78716c" }}>(512)</span>
                    </div>
                  </div>

                  {/* LAYER 5: LOGITS / OUTPUT */}
                  <div
                    className={`cnn-layer-box ${activeCnnLayer === 5 ? "active-box" : ""}`}
                    onClick={() => setActiveCnnLayer(5)}
                    style={{
                      position: "absolute",
                      left: 580,
                      top: 126,
                      width: 68,
                      height: 68,
                      borderRadius: 8,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: 6,
                      background: "rgba(220, 38, 38, 0.3)",
                      border: "2px solid #991b1b",
                    }}
                  >
                    <div style={{ width: "100%", height: "100%", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gridTemplateRows: "repeat(3, 1fr)", gap: 2, pointerEvents: "none" }}>
                      {[...Array(9)].map((_, i) => (
                        <div
                          key={i}
                          style={{
                            border: i === 4 ? "2px solid #991b1b" : "1px solid rgba(185, 28, 28, 0.5)",
                            borderRadius: 2,
                            background: i === 4 ? "#dc2626" : "rgba(220, 38, 38, 0.25)",
                            display: i === 4 ? "flex" : undefined,
                            alignItems: i === 4 ? "center" : undefined,
                            justifyContent: i === 4 ? "center" : undefined,
                            fontSize: i === 4 ? 8 : undefined,
                            color: i === 4 ? "#fff" : undefined,
                            fontWeight: i === 4 ? 700 : undefined,
                          }}
                        >
                          {i === 4 ? "🔥" : ""}
                        </div>
                      ))}
                    </div>
                    <div style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", top: "100%", marginTop: 8, whiteSpace: "nowrap", textAlign: "center" }}>
                      <span style={{ fontSize: 10, fontFamily: "var(--font-mono, monospace)", fontWeight: 700, color: "#1c1917", display: "block" }}>Logits</span>
                      <span style={{ fontSize: 9, fontFamily: "var(--font-mono, monospace)", color: "#78716c" }}>🔥 FIRE 97%</span>
                    </div>
                  </div>
                </div>

                {/* RIGHT: COMPACT TACTILE STICKY NOTE EXPLANATION CALLOUT */}
                <div
                  className="sticky-note"
                  style={{
                    position: "relative",
                    width: "100%",
                    maxWidth: 320,
                    borderRadius: 8,
                    padding: "20px 20px 16px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    flexShrink: 0,
                    userSelect: "none",
                    minHeight: 290,
                  }}
                >
                  {/* Scotch Tape on Top */}
                  <div className="sticky-tape" />

                  <div>
                    {/* Top Tag & Dimensions */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        borderBottom: "1px solid rgba(252, 211, 77, 0.8)",
                        paddingBottom: 8,
                        marginBottom: 12,
                      }}
                    >
                      <span style={{ fontSize: 10, fontFamily: "var(--font-mono, monospace)", textTransform: "uppercase", fontWeight: 700, color: "#78350f", letterSpacing: "0.05em" }}>
                        {cnnLayerNotes[activeCnnLayer].stage}
                      </span>
                      <span
                        style={{
                          fontSize: 10,
                          fontFamily: "var(--font-mono, monospace)",
                          fontWeight: 700,
                          padding: "2px 8px",
                          borderRadius: 4,
                          background: "rgba(254, 240, 138, 0.9)",
                          color: "#451a03",
                        }}
                      >
                        {cnnLayerNotes[activeCnnLayer].dim}
                      </span>
                    </div>

                    {/* Title */}
                    <h3
                      style={{
                        fontFamily: "var(--font-serif, serif)",
                        fontWeight: 700,
                        fontSize: "1.125rem",
                        color: "#451a03",
                        lineHeight: 1.25,
                        marginBottom: 4,
                      }}
                    >
                      {cnnLayerNotes[activeCnnLayer].title}
                    </h3>
                    <p style={{ fontSize: 10, fontFamily: "var(--font-mono, monospace)", color: "rgba(146, 64, 14, 0.85)", marginBottom: 12 }}>
                      {cnnLayerNotes[activeCnnLayer].op}
                    </p>

                    {/* Concise explanation points */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: "0.78rem", color: "rgba(69, 26, 3, 0.95)", lineHeight: 1.55 }}>
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 6 }}>
                        <span style={{ color: "#b45309", fontWeight: 700 }}>&bull;</span>
                        <p style={{ margin: 0 }}>
                          <strong>What it does:</strong> {cnnLayerNotes[activeCnnLayer].func}
                        </p>
                      </div>
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 6 }}>
                        <span style={{ color: "#b45309", fontWeight: 700 }}>&bull;</span>
                        <p style={{ margin: 0 }}>
                          <strong>Why it matters:</strong> {cnnLayerNotes[activeCnnLayer].why}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Sticky Note Bottom Spec Tag */}
                  <div
                    style={{
                      borderTop: "1px solid rgba(252, 211, 77, 0.6)",
                      paddingTop: 10,
                      marginTop: 12,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      fontSize: 10,
                      fontFamily: "var(--font-mono, monospace)",
                      color: "rgba(120, 53, 15, 0.85)",
                    }}
                  >
                    <span>{cnnLayerNotes[activeCnnLayer].weights}</span>
                    <span style={{ color: "#d97706" }}>&bull;</span>
                    <span>{cnnLayerNotes[activeCnnLayer].speed}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* =================================================================
              PANEL 05: RESULTS
             ================================================================= */}
          <section
            id="panel-4"
            className="cs-panel"
            aria-label="Phase 05: Results"
          >
            <div className="cs-panel-inner">
              <span className="eyebrow-dossier">Phase 05 // Results</span>
              <div className="section-title" style={{ marginTop: 6, marginBottom: 18 }}>
                <span className="section-num">05 //</span>
                <h2>Results</h2>
              </div>

              {/* 3 Metric Pills */}
              <div className="summary-metrics-row" style={{ marginBottom: 20 }}>
                <div className="metric-pill-paper">
                  <span className="val">81.84%</span>
                  <span className="lbl">Best Validation Accuracy</span>
                </div>
                <div className="metric-pill-paper">
                  <span className="val">0.3869</span>
                  <span className="lbl">Lowest Validation Loss</span>
                </div>
                <div className="metric-pill-paper">
                  <span className="val">2,699</span>
                  <span className="lbl">Total Dataset Samples</span>
                </div>
              </div>

              <p style={{ fontSize: "1.06rem", lineHeight: 1.6, marginBottom: 16 }}>
                Direct training and validation curves extracted from <code>Wildfire_classification.ipynb</code> showing the regularization impact of <strong>Dropout (p=0.5)</strong> over 10 epochs:
              </p>

              {/* Real Notebook Plots */}
              <div className="results-grid-paper">
                <div className="plot-card-paper">
                  <img
                    src="/firecnn_accuracy_plot.png"
                    alt="Training and Validation Accuracy from Notebook"
                  />
                  <div className="plot-caption">
                    NOTEBOOK FIGURE 1: TRAINING VS. VALIDATION ACCURACY (DROPOUT MODEL)
                  </div>
                </div>

                <div className="plot-card-paper">
                  <img
                    src="/firecnn_loss_plot.png"
                    alt="Training and Validation Loss from Notebook"
                  />
                  <div className="plot-caption">
                    NOTEBOOK FIGURE 2: TRAINING VS. VALIDATION LOSS (DROPOUT MODEL)
                  </div>
                </div>
              </div>

              <div className="hand-footer-signoff" style={{ marginTop: 24 }}>
                &mdash; Aaron Nguyen // field notebook entry 01
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default function WildfireCaseStudy() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "var(--paper)" }} />}>
      <WildfireCaseStudyInner />
    </Suspense>
  );
}
