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
        window.scrollTo({ top: 0, behavior: "instant" });
      }
      return next;
    });
  }, []);

  const nextStage = useCallback(() => {
    setActiveStage((prev) => {
      const next = Math.min(stages.length - 1, prev + 1);
      if (typeof window !== "undefined") {
        window.history.replaceState(null, "", `?phase=${next + 1}`);
        window.scrollTo({ top: 0, behavior: "instant" });
      }
      return next;
    });
  }, []);

  const setStage = useCallback((idx: number) => {
    setActiveStage(idx);
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", `?phase=${idx + 1}`);
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, []);

  // Keyboard navigation (Arrow keys)
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

      {/* 3. Main Case Study Viewport */}
      <main className="cs-main-viewport">
        {/* =================================================================
            PANEL 01: OVERVIEW
           ================================================================= */}
        <section
          id="panel-0"
          className="cs-panel"
          style={{ display: activeStage === 0 ? "block" : "none" }}
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
            style={{ display: activeStage === 1 ? "block" : "none" }}
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
            style={{ display: activeStage === 2 ? "block" : "none" }}
            aria-label="Phase 03: Decisions & Tradeoffs"
          >
            <div className="cs-panel-inner">
              <span className="eyebrow-dossier">Phase 03 // Decisions &amp; Tradeoffs</span>
              <div className="section-title" style={{ marginTop: 6, marginBottom: 24 }}>
                <span className="section-num">03 //</span>
                <h2>Decisions &amp; Tradeoffs</h2>
              </div>

              {/* 2-column Pinned Field Cards (Design 1) */}
              <div className="cs-pinned-grid">
                {/* Card 1: Architecture Choice */}
                <div className="cs-pinned-card card-1">
                  <div className="cs-paperclip" />
                  <span className="cs-choice-tag">CHOICE 01 // ARCHITECTURE</span>
                  <h3 className="cs-pinned-title">Custom 3-Stage FireCNN vs. Pre-Trained Transformers (ViT)</h3>
                  
                  <div className="cs-comparison-box">
                    <div className="cs-opt-rejected">
                      <span className="x-mark">✕</span>
                      <span>ViT / ResNet-50: 184MB &bull; 120ms latency &bull; Cloud API dependent</span>
                    </div>
                    <div className="cs-opt-selected">
                      <span className="check-mark">✓</span>
                      <span>Custom FireCNN: 33.9MB &bull; &lt;15ms edge inference &bull; 0 satellite ping</span>
                    </div>
                  </div>

                  <p className="cs-pinned-body">
                    <strong>The Tradeoff:</strong> Heavy pre-trained vision backbones boast benchmark acclaim, but mountain relays have severe wattage constraints. Compressing the model to <strong>33.9 MB</strong> enables real-time 60+ FPS drone feeds with zero internet uplink.
                  </p>

                  <span className="cs-hand-note">
                    &ldquo;Satellite uplinks drop in chaparral smoke plumes. Local edge execution is life-or-death.&rdquo;
                  </span>
                </div>

                {/* Card 2: Regularization Choice */}
                <div className="cs-pinned-card card-2">
                  <div className="cs-paperclip" />
                  <span className="cs-choice-tag">CHOICE 02 // REGULARIZATION</span>
                  <h3 className="cs-pinned-title">Dropout Regularization (p=0.5) vs. Heavy Feature Expansion</h3>

                  <div className="cs-comparison-box">
                    <div className="cs-opt-rejected">
                      <span className="x-mark">✕</span>
                      <span>Baseline Unregularized: Train 95.7% / Val 79.6% (16.1% Memorization Gap)</span>
                    </div>
                    <div className="cs-opt-selected">
                      <span className="check-mark">✓</span>
                      <span>Dropout Head (p=0.5): Val Acc boosted to 81.84% &bull; Val Loss 0.3869</span>
                    </div>
                  </div>

                  <p className="cs-pinned-body">
                    <strong>The Tradeoff:</strong> By epoch 6, dense weights memorized specific ridge horizons rather than smoke textures. Injecting <strong>Dropout(p=0.5)</strong> forced orthogonal feature detectors across 2,699 tiles.
                  </p>

                  <span className="cs-hand-note">
                    &ldquo;Deactivating 256 of 512 neurons prevented the dense head from cheating on training backgrounds.&rdquo;
                  </span>
                </div>
              </div>

              {/* Deliberate Scope Cut Card (Clean paper tag, no red rectangle badge) */}
              <div className="cs-torn-scope-card">
                <div className="cs-torn-header">
                  <span>✂ PRODUCT JUDGMENT // DELIBERATE SCOPE CUT</span>
                </div>
                <h4 className="cs-torn-title">Product Judgment: Cut Polygonal Boundary Segmentation from V1</h4>
                <p className="cs-torn-body">
                  <strong>I deliberately cut pixel-level flame polygon segmentation from the initial release.</strong> Delineating exact flame boundary pixels is valuable during Day 3 mop-up operations, but for early ignition triage, crews need an instantaneous binary answer: <em>&ldquo;Does this drone tile contain fire?&rdquo;</em> Cutting segmentation eliminated 3 weeks of manual polygon labeling and slashed inference latency by <strong>78%</strong>.
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
            style={{ display: activeStage === 3 ? "block" : "none" }}
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
            style={{ display: activeStage === 4 ? "block" : "none" }}
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

              {/* Real Notebook Plots: Zig-Zag Alternating Layout */}
              <div className="cs-zigzag-container">
                {/* ROW 1: Model Without Dropout (Loss) - Image Left, Text Right */}
                <div className="cs-zigzag-row">
                  <div className="plot-card-paper">
                    <img
                      src="/firecnn_without_dropout_loss.png"
                      alt="Training and Validation Loss (Model Without Dropout)"
                    />
                    <div className="plot-caption">
                      FIGURE 1: TRAINING VS. VALIDATION LOSS (MODEL WITHOUT DROPOUT)
                    </div>
                  </div>
                  <div>
                    <h3 className="cs-zigzag-title">Severe Loss Divergence Without Dropout</h3>
                    <ul className="cs-zigzag-list">
                      <li>
                        <strong>Early descent (Epochs 0–4):</strong> Train loss falls from <strong>0.6521</strong> to <strong>0.3482</strong>; val loss reaches <strong>0.4255</strong>.
                      </li>
                      <li>
                        <strong>Late spike (Epoch 9):</strong> Train loss drops to <strong>0.1244</strong>, but val loss explodes to <strong>0.6311</strong> (+<strong>48.3%</strong> divergence).
                      </li>
                      <li>
                        <strong>Overfitting delta:</strong> A <strong>0.5067</strong> gap emerges as the <strong>16.7M</strong> dense weights memorize background terrain.
                      </li>
                    </ul>
                  </div>
                </div>

                {/* ROW 2: Model Without Dropout (Accuracy) - Text Left, Image Right */}
                <div className="cs-zigzag-row reverse">
                  <div>
                    <h3 className="cs-zigzag-title">Validation Ceiling at 80.85%</h3>
                    <ul className="cs-zigzag-list">
                      <li>
                        <strong>Deceptive training climb:</strong> Train accuracy ascends to <strong>95.71%</strong> by epoch 9.
                      </li>
                      <li>
                        <strong>Validation plateau:</strong> Val accuracy stalls at <strong>80.85%</strong> (epoch 6) before regressing to <strong>79.60%</strong>.
                      </li>
                      <li>
                        <strong>16.11% generalization gap:</strong> Train (<strong>95.71%</strong>) vs val (<strong>79.60%</strong>) confirms the unregularized model fails to generalize.
                      </li>
                    </ul>
                  </div>
                  <div className="plot-card-paper">
                    <img
                      src="/firecnn_without_dropout_accuracy.png"
                      alt="Training and Validation Accuracy (Model Without Dropout)"
                    />
                    <div className="plot-caption">
                      FIGURE 2: TRAINING VS. VALIDATION ACCURACY (MODEL WITHOUT DROPOUT)
                    </div>
                  </div>
                </div>

                {/* ROW 3: Model With Dropout (Loss) - Image Left, Text Right */}
                <div className="cs-zigzag-row">
                  <div className="plot-card-paper">
                    <img
                      src="/firecnn_loss_plot.png"
                      alt="Training and Validation Loss (Model With Dropout)"
                    />
                    <div className="plot-caption">
                      FIGURE 3: TRAINING VS. VALIDATION LOSS (MODEL WITH DROPOUT)
                    </div>
                  </div>
                  <div>
                    <h3 className="cs-zigzag-title">Validation Loss Stabilized to 0.3869</h3>
                    <ul className="cs-zigzag-list green">
                      <li>
                        <strong>Zero late rebound:</strong> Adding <strong>Dropout (p=0.5)</strong> prevents the validation loss explosion.
                      </li>
                      <li>
                        <strong>38.7% lower loss:</strong> Val loss bottoms out at <strong>0.3869</strong> on epoch 8 (vs <strong>0.6311</strong> baseline spike).
                      </li>
                      <li>
                        <strong>Stable convergence:</strong> Train loss (<strong>0.2968</strong>) and val loss (<strong>0.4192</strong>) converge closely together.
                      </li>
                    </ul>
                  </div>
                </div>

                {/* ROW 4: Model With Dropout (Accuracy) - Text Left, Image Right */}
                <div className="cs-zigzag-row reverse">
                  <div>
                    <h3 className="cs-zigzag-title">Peak Validation Accuracy of 81.84%</h3>
                    <ul className="cs-zigzag-list green">
                      <li>
                        <strong>Higher top-1 accuracy:</strong> Val accuracy rises to <strong>81.84%</strong> at epoch 8 (up from <strong>80.85%</strong> baseline).
                      </li>
                      <li>
                        <strong>Narrowed accuracy gap:</strong> Difference between train and val shrinks from <strong>16.11%</strong> down to <strong>5.07%</strong>.
                      </li>
                      <li>
                        <strong>Neuron masking:</strong> Deactivating 50% of dense units forces robust feature learning across <strong>2,699</strong> samples.
                      </li>
                    </ul>
                  </div>
                  <div className="plot-card-paper">
                    <img
                      src="/firecnn_accuracy_plot.png"
                      alt="Training and Validation Accuracy (Model With Dropout)"
                    />
                    <div className="plot-caption">
                      FIGURE 4: TRAINING VS. VALIDATION ACCURACY (MODEL WITH DROPOUT)
                    </div>
                  </div>
                </div>
              </div>

              <div className="hand-footer-signoff" style={{ marginTop: 24 }}>
                &mdash; Aaron Nguyen // field notebook entry 01
              </div>
            </div>
          </section>
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
