"use client";

import React, { useEffect } from "react";
import Link from "next/link";

interface FireCNNDossierProps {
  onClose?: () => void;
  isModal?: boolean;
}

export default function FireCNNDossier({ onClose, isModal = true }: FireCNNDossierProps) {
  useEffect(() => {
    if (!isModal) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && onClose) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModal, onClose]);

  const content = (
    <div className="dossier-window" onClick={(e) => e.stopPropagation()}>
      {/* Sticky Header Bar */}
      <div className="dossier-bar">
        {onClose ? (
          <button type="button" onClick={onClose} className="back-btn">
            <span>&larr; Back to Projects Workbench</span>
          </button>
        ) : (
          <Link href="/projects" className="back-btn">
            <span>&larr; Back to Projects Workbench</span>
          </Link>
        )}
        <span className="stamp-classified">PROJECT DOSSIER // ENTRY 01</span>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dossier"
            style={{
              background: "transparent",
              border: "none",
              fontSize: "1.2rem",
              cursor: "pointer",
              color: "var(--ink)",
              padding: "4px 8px",
            }}
          >
            &times;
          </button>
        )}
      </div>

      <div className="dossier-content">
        {/* 1. HEADER (SCAN IN A FEW SECONDS) */}
        <section className="section-header">
          <span className="eyebrow-dossier">Project Journey &amp; Thinking Process</span>
          <h1 className="project-title">
            FireCNN: <em>Wildfire</em> Image Detection
          </h1>

          <div className="one-line-outcome">
            &ldquo;A lightweight 3-stage convolutional neural network detecting early-stage wildfire ignitions in under 15ms.&rdquo;
          </div>

          <div className="meta-tags-bar">
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

          <div className="links-bar">
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

          {/* Real Palisades Wildfire Photo */}
          <div className="hero-image-wrap">
            <img
              src="/palisades_fire_real.jpg"
              alt="Pacific Palisades Wildfire Ground Photo"
            />
            <div className="hero-image-caption">
              <span>
                <strong>PACIFIC PALISADES WILDFIRE</strong> // LOS ANGELES COASTLINE IGNITION SPREAD
              </span>
              <span>DATASET TARGET STUDY: 128x128x3 TILES</span>
            </div>
          </div>
        </section>

        {/* 2. PROBLEM AND USER (THE PM CONTEXT) */}
        <section className="dossier-section">
          <div className="section-title">
            <span className="section-num">02 //</span>
            <h2>
              Problem &amp; User <em>(The PM Context)</em>
            </h2>
          </div>

          <div className="problem-box-red">
            <p>
              Emergency dispatchers and wildland forestry teams monitor tens of thousands of square miles of brush daily. Manual human scanning of satellite and aerial feeds takes <strong>3 to 6 hours</strong>&mdash;creating a catastrophic delay during which a single ground ember crowns into an uncontrollable canopy inferno.
            </p>
            <span className="evidence-badge">Evidence Checked: Containment Dropoff Timeline</span>
            <p>
              Historical wildfire logs from the California Department of Forestry show that initial aerial containment success is over <strong>85%</strong> when aircraft drop retardant within the first <strong>45 minutes</strong> of ignition, but collapses to under <strong>25%</strong> once fire reaches the tree canopy.
            </p>
          </div>
        </section>

        {/* 3. DECISIONS AND TRADEOFFS (WHY I BUILT IT THIS WAY) */}
        <section className="dossier-section">
          <div className="section-title">
            <span className="section-num">03 //</span>
            <h2>
              Decisions &amp; Tradeoffs <em>(Why I Built It This Way)</em>
            </h2>
          </div>

          <div className="decisions-container-red">
            <div className="choice-item">
              <div className="choice-header">
                <span className="choice-badge">CHOICE 1</span>
                <span className="choice-title">
                  Custom 3-Stage FireCNN over Pre-Trained Transformers (ViT) / ResNet
                </span>
              </div>
              <p className="choice-body">
                <strong>Why:</strong> Drone scout stations and field relays have severe compute and battery constraints. A custom 3-stage CNN keeps the footprint down to <strong>33.9 MB</strong> and achieves <strong>sub-15ms inference</strong> locally, removing the need for expensive satellite internet uplinks.
              </p>
            </div>

            <div className="choice-item">
              <div className="choice-header">
                <span className="choice-badge">CHOICE 2</span>
                <span className="choice-title">
                  Dropout Regularization (p=0.5) over Heavy Feature Expansion
                </span>
              </div>
              <p className="choice-body">
                <strong>Why:</strong> The initial unregularized CNN began severely overfitting by epoch 6 (training loss dropped to 0.12 while validation loss stalled). Adding a <strong>Dropout(p=0.5)</strong> head boosted peak validation accuracy to <strong>81.84%</strong> and stabilized validation loss across training runs.
              </p>
            </div>
          </div>

          <div className="scope-cut-card">
            <h4>Deliberate Scope Cut (Product Judgment):</h4>
            <p>
              <strong>I deliberately cut polygonal perimeter segmentation (masking) from V1.</strong> Delineating exact flame boundary pixels is valuable during Day 3 mop-up operations, but for early warning dispatch, teams need an instant, 100% reliable binary signal: <em>&ldquo;Does this tile contain fire?&rdquo;</em> Cutting segmentation saved weeks of polygon labeling and cut inference latency by <strong>78%</strong>.
            </p>
          </div>
        </section>

        {/* 4. HOW IT WORKS: ARCHITECTURE DIRECTLY ON PARCHMENT CANVAS */}
        <section className="dossier-section">
          <div className="section-title">
            <span className="section-num">04 //</span>
            <h2>
              How It Works <em>(Architecture on Native Canvas)</em>
            </h2>
          </div>

          <p style={{ fontSize: "1.05rem", lineHeight: 1.6, marginBottom: 12 }}>
            The custom <code>FireCNN</code> architecture feeds normalized 128&times;128&times;3 RGB crops through three convolutional and max-pooling stages into a 512-neuron fully connected head with dropout regularization:
          </p>

          <div className="arch-diagram-paper">
            <svg
              className="cnn-pipeline-svg"
              viewBox="0 0 860 220"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Stage 1: Input Image */}
              <rect
                x="10"
                y="50"
                width="90"
                height="90"
                rx="4"
                fill="#f3ecdc"
                stroke="#8a1c1c"
                strokeWidth="2"
              />
              <image
                href="/palisades_fire_real.jpg"
                x="15"
                y="55"
                width="80"
                height="80"
                preserveAspectRatio="xMidYMid slice"
              />
              <text
                x="55"
                y="158"
                fontFamily="'JetBrains Mono', monospace"
                fontSize="11"
                fontWeight="700"
                fill="#26211b"
                textAnchor="middle"
              >
                Input Tile
              </text>
              <text
                x="55"
                y="172"
                fontFamily="'JetBrains Mono', monospace"
                fontSize="9"
                fill="#5b5246"
                textAnchor="middle"
              >
                128x128x3 RGB
              </text>

              {/* Arrow 1 */}
              <path d="M 108 95 L 140 95" stroke="#8a1c1c" strokeWidth="2" />

              {/* Stage 2: Conv Block 1 */}
              <rect
                x="145"
                y="40"
                width="75"
                height="110"
                rx="4"
                fill="#fdfbf7"
                stroke="#7a4a2a"
                strokeWidth="1.8"
              />
              <text
                x="182"
                y="70"
                fontFamily="'JetBrains Mono', monospace"
                fontSize="11"
                fontWeight="700"
                fill="#8a1c1c"
                textAnchor="middle"
              >
                Conv 1
              </text>
              <text
                x="182"
                y="86"
                fontFamily="'JetBrains Mono', monospace"
                fontSize="9"
                fill="#26211b"
                textAnchor="middle"
              >
                32 filters (3x3)
              </text>
              <text
                x="182"
                y="100"
                fontFamily="'JetBrains Mono', monospace"
                fontSize="9"
                fill="#5b5246"
                textAnchor="middle"
              >
                ReLU + MaxPool
              </text>
              <text
                x="182"
                y="125"
                fontFamily="'JetBrains Mono', monospace"
                fontSize="9"
                fontWeight="700"
                fill="#7a4a2a"
                textAnchor="middle"
              >
                64x64x32
              </text>

              {/* Arrow 2 */}
              <path d="M 226 95 L 256 95" stroke="#8a1c1c" strokeWidth="2" />

              {/* Stage 3: Conv Block 2 */}
              <rect
                x="260"
                y="48"
                width="75"
                height="94"
                rx="4"
                fill="#fdfbf7"
                stroke="#7a4a2a"
                strokeWidth="1.8"
              />
              <text
                x="297"
                y="76"
                fontFamily="'JetBrains Mono', monospace"
                fontSize="11"
                fontWeight="700"
                fill="#8a1c1c"
                textAnchor="middle"
              >
                Conv 2
              </text>
              <text
                x="297"
                y="92"
                fontFamily="'JetBrains Mono', monospace"
                fontSize="9"
                fill="#26211b"
                textAnchor="middle"
              >
                64 filters (3x3)
              </text>
              <text
                x="297"
                y="106"
                fontFamily="'JetBrains Mono', monospace"
                fontSize="9"
                fill="#5b5246"
                textAnchor="middle"
              >
                ReLU + MaxPool
              </text>
              <text
                x="297"
                y="128"
                fontFamily="'JetBrains Mono', monospace"
                fontSize="9"
                fontWeight="700"
                fill="#7a4a2a"
                textAnchor="middle"
              >
                32x32x64
              </text>

              {/* Arrow 3 */}
              <path d="M 340 95 L 370 95" stroke="#8a1c1c" strokeWidth="2" />

              {/* Stage 4: Conv Block 3 */}
              <rect
                x="375"
                y="56"
                width="75"
                height="78"
                rx="4"
                fill="#fdfbf7"
                stroke="#7a4a2a"
                strokeWidth="1.8"
              />
              <text
                x="412"
                y="82"
                fontFamily="'JetBrains Mono', monospace"
                fontSize="11"
                fontWeight="700"
                fill="#8a1c1c"
                textAnchor="middle"
              >
                Conv 3
              </text>
              <text
                x="412"
                y="96"
                fontFamily="'JetBrains Mono', monospace"
                fontSize="9"
                fill="#26211b"
                textAnchor="middle"
              >
                128 filters
              </text>
              <text
                x="412"
                y="110"
                fontFamily="'JetBrains Mono', monospace"
                fontSize="9"
                fill="#5b5246"
                textAnchor="middle"
              >
                ReLU + MaxPool
              </text>
              <text
                x="412"
                y="124"
                fontFamily="'JetBrains Mono', monospace"
                fontSize="9"
                fontWeight="700"
                fill="#7a4a2a"
                textAnchor="middle"
              >
                16x16x128
              </text>

              {/* Arrow 4 */}
              <path d="M 456 95 L 486 95" stroke="#8a1c1c" strokeWidth="2" />

              {/* Stage 5: Flatten & Dense */}
              <rect
                x="492"
                y="44"
                width="95"
                height="102"
                rx="4"
                fill="#fdfbf7"
                stroke="#26211b"
                strokeWidth="1.8"
              />
              <text
                x="539"
                y="70"
                fontFamily="'JetBrains Mono', monospace"
                fontSize="11"
                fontWeight="700"
                fill="#8a1c1c"
                textAnchor="middle"
              >
                Dense Head
              </text>
              <text
                x="539"
                y="86"
                fontFamily="'JetBrains Mono', monospace"
                fontSize="9"
                fill="#26211b"
                textAnchor="middle"
              >
                Linear(32K, 512)
              </text>
              <text
                x="539"
                y="102"
                fontFamily="'JetBrains Mono', monospace"
                fontSize="9"
                fill="#8a1c1c"
                fontWeight="700"
                textAnchor="middle"
              >
                Dropout(0.5)
              </text>
              <text
                x="539"
                y="128"
                fontFamily="'JetBrains Mono', monospace"
                fontSize="9"
                fill="#5b5246"
                textAnchor="middle"
              >
                Linear(512, 1)
              </text>

              {/* Arrow 5 */}
              <path d="M 592 95 L 630 95" stroke="#8a1c1c" strokeWidth="2" />

              {/* Output: Binary Classification */}
              <g transform="translate(636, 52)">
                <rect
                  x="0"
                  y="0"
                  width="105"
                  height="38"
                  rx="4"
                  fill="#ffece6"
                  stroke="#8a1c1c"
                  strokeWidth="2"
                />
                <text
                  x="52"
                  y="24"
                  fontFamily="'JetBrains Mono', monospace"
                  fontSize="11"
                  fontWeight="700"
                  fill="#8a1c1c"
                  textAnchor="middle"
                >
                  🔥 FIRE (1)
                </text>

                <rect
                  x="0"
                  y="48"
                  width="105"
                  height="38"
                  rx="4"
                  fill="#edf7ee"
                  stroke="#2b6e3f"
                  strokeWidth="2"
                />
                <text
                  x="52"
                  y="72"
                  fontFamily="'JetBrains Mono', monospace"
                  fontSize="11"
                  fontWeight="700"
                  fill="#2b6e3f"
                  textAnchor="middle"
                >
                  🌲 NO FIRE (0)
                </text>
              </g>
            </svg>
          </div>
        </section>

        {/* 5. QUANTITATIVE RESULTS DIRECTLY FROM GITHUB REPO NOTEBOOK */}
        <section className="dossier-section">
          <div className="section-title">
            <span className="section-num">05 //</span>
            <h2>
              Quantitative Results <em>(From GitHub Notebook)</em>
            </h2>
          </div>

          <div className="summary-metrics-row">
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

          <p style={{ fontSize: "1.02rem", lineHeight: 1.5, marginBottom: 14 }}>
            Direct training and validation curves extracted from <code>Wildfire_classification.ipynb</code> showing the regularization impact of <strong>Dropout (p=0.5)</strong> over 10 epochs:
          </p>

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

          <div className="hand-footer-signoff">
            &mdash; Aaron Nguyen // field notebook entry 01
          </div>
        </section>
      </div>
    </div>
  );

  if (isModal) {
    return (
      <div className="dossier-overlay" onClick={onClose}>
        {content}
      </div>
    );
  }

  return content;
}
