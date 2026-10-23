"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface MobileWildfirePhaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileWildfirePhaseModal({
  isOpen,
  onClose,
}: MobileWildfirePhaseModalProps) {
  const [mounted, setMounted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;
    if (deltaY > 50) {
      onClose();
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen && scrollRef.current) {
      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        const p = params.get("phase");
        if (p && ["2", "3", "4", "5"].includes(p)) {
          setTimeout(() => {
            const el = document.getElementById(`phase-0${p}-anchor`);
            if (el && scrollRef.current) {
              scrollRef.current.scrollTop = el.offsetTop - 10;
            }
          }, 50);
          return;
        }
      }
      scrollRef.current.scrollTop = 0;
    }
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div
      className="mobile-dossier-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Wildfire Image Detection Dossier 01"
    >
      <style>{`
        .mobile-dossier-overlay {
          position: fixed !important;
          inset: 0 !important;
          z-index: 999999 !important;
          background: rgba(26, 21, 16, 0.72) !important;
          backdrop-filter: blur(8px) !important;
          -webkit-backdrop-filter: blur(8px) !important;
          display: flex !important;
          align-items: flex-end !important;
          justify-content: center !important;
          padding: 0 10px !important;
          box-sizing: border-box !important;
          animation: mobileDossierFade 0.22s ease-out !important;
        }

        @keyframes mobileDossierFade {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .mobile-dossier-sheet {
          position: relative !important;
          width: 100% !important;
          max-width: 410px !important;
          height: 75vh !important;
          max-height: 75vh !important;
          margin: 0 auto !important;
          background-color: #FBF7EE !important;
          background-image: radial-gradient(#E2D9C8 1px, transparent 1px) !important;
          background-size: 16px 16px !important;
          border: 1px solid #E4DCCF !important;
          border-bottom: none !important;
          border-top-left-radius: 22px !important;
          border-top-right-radius: 22px !important;
          border-bottom-left-radius: 0 !important;
          border-bottom-right-radius: 0 !important;
          box-shadow: 
            0 -12px 40px rgba(26, 21, 16, 0.4),
            0 -2px 10px rgba(0, 0, 0, 0.1) !important;
          display: flex !important;
          flex-direction: column !important;
          overflow: hidden !important;
          box-sizing: border-box !important;
          animation: mobileDossierSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important;
        }

        @keyframes mobileDossierSlideUp {
          from {
            opacity: 0;
            transform: translateY(100%);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Pull Handle Bar */
        .mobile-dossier-handle-bar {
          display: flex !important;
          justify-content: center !important;
          padding: 8px 0 2px !important;
          background: rgba(251, 247, 238, 0.98) !important;
          border-top-left-radius: 24px !important;
          border-top-right-radius: 24px !important;
          flex-shrink: 0 !important;
        }

        .mobile-dossier-handle-pill {
          width: 38px !important;
          height: 4.5px !important;
          border-radius: 999px !important;
          background: #D4CABE !important;
        }

        /* Top Pinned Nav Bar */
        .mobile-dossier-topbar {
          position: sticky !important;
          top: 0 !important;
          z-index: 30 !important;
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
          padding: 8px 16px 10px !important;
          background: rgba(251, 247, 238, 0.95) !important;
          backdrop-filter: blur(8px) !important;
          -webkit-backdrop-filter: blur(8px) !important;
          border-bottom: 1px solid #EAE3D2 !important;
          flex-shrink: 0 !important;
        }

        .mobile-dossier-folio-tag {
          font-family: var(--font-mono, monospace) !important;
          font-size: 10px !important;
          font-weight: 700 !important;
          letter-spacing: 0.08em !important;
          color: #8A1C1C !important;
          text-transform: uppercase !important;
          display: flex !important;
          align-items: center !important;
          gap: 6px !important;
        }

        .mobile-dossier-close-btn {
          width: 28px !important;
          height: 28px !important;
          border-radius: 50% !important;
          background: #FFFDF9 !important;
          border: 1px solid #DED6C7 !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          font-size: 12px !important;
          color: #5A524A !important;
          cursor: pointer !important;
          box-shadow: 0 1px 2px rgba(38, 33, 27, 0.04) !important;
          transition: all 0.15s ease !important;
          padding: 0 !important;
          line-height: 1 !important;
          position: relative !important;
        }

        .mobile-dossier-close-btn::after {
          content: "" !important;
          position: absolute !important;
          inset: -8px !important;
        }

        .mobile-dossier-close-btn:hover {
          background: #dc2626 !important;
          color: #ffffff !important;
          border-color: #dc2626 !important;
        }

        /* Scroll Body */
        .mobile-dossier-body {
          padding: 14px 12px 24px !important;
          overflow-y: auto !important;
          overflow-x: hidden !important;
          flex: 1 !important;
          box-sizing: border-box !important;
          scrollbar-width: thin !important;
          scrollbar-color: rgba(100, 70, 30, 0.25) transparent !important;
        }

        .mobile-dossier-body::-webkit-scrollbar {
          width: 4px !important;
        }

        .mobile-dossier-body::-webkit-scrollbar-thumb {
          background: rgba(100, 70, 30, 0.22) !important;
          border-radius: 4px !important;
        }

        /* Paper Leaf Card */
        .mobile-dossier-leaf {
          background: #FFFDF9 !important;
          border: 1px solid #E4DCCF !important;
          border-radius: 14px !important;
          padding: 16px 14px 18px !important;
          position: relative !important;
          box-shadow: 
            0 1px 2px rgba(38, 33, 27, 0.04),
            0 4px 14px rgba(38, 33, 27, 0.03) !important;
          box-sizing: border-box !important;
        }

        /* Washi Tape Header Decor */
        .mobile-dossier-washi-tape {
          position: absolute !important;
          top: -9px !important;
          left: 50% !important;
          transform: translateX(-50%) !important;
          width: 96px !important;
          height: 18px !important;
          background: rgba(227, 216, 192, 0.85) !important;
          border: 1px dashed rgba(184, 169, 142, 0.5) !important;
          box-shadow: 0 1px 2px rgba(38, 33, 27, 0.05) !important;
        }

        /* Metadata Header */
        .mobile-dossier-meta {
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
          margin-bottom: 6px !important;
        }

        .mobile-dossier-cat-pill {
          font-family: var(--font-mono, monospace) !important;
          font-size: 9.5px !important;
          font-weight: 700 !important;
          letter-spacing: 0.08em !important;
          color: #8A1C1C !important;
          text-transform: uppercase !important;
        }

        .mobile-dossier-year {
          font-family: var(--font-mono, monospace) !important;
          font-size: 9px !important;
          color: #877E72 !important;
        }

        .mobile-dossier-title {
          font-family: var(--font-serif, Georgia, serif) !important;
          font-size: 25px !important;
          font-weight: 700 !important;
          line-height: 1.15 !important;
          color: #26211B !important;
          letter-spacing: -0.01em !important;
          margin: 4px 0 5px !important;
        }

        .mobile-dossier-desc {
          font-family: var(--font-serif, Georgia, serif) !important;
          font-size: 12px !important;
          line-height: 1.45 !important;
          color: #5A524A !important;
          margin: 0 0 12px 0 !important;
        }

        /* Hero Image Wrap */
        .mobile-dossier-hero-wrap {
          position: relative !important;
          border-radius: 7px !important;
          overflow: hidden !important;
          border: 1px solid #DED6C7 !important;
          margin-bottom: 5px !important;
          background: #26211B !important;
        }

        .mobile-dossier-hero-img {
          width: 100% !important;
          height: 130px !important;
          object-fit: cover !important;
          display: block !important;
          filter: contrast(1.05) !important;
        }

        .mobile-dossier-hero-tag {
          position: absolute !important;
          bottom: 5px !important;
          left: 5px !important;
          background: rgba(38, 33, 27, 0.85) !important;
          backdrop-filter: blur(4px) !important;
          color: #FBF7EE !important;
          font-family: var(--font-mono, monospace) !important;
          font-size: 8px !important;
          font-weight: 600 !important;
          padding: 2px 6px !important;
          border-radius: 3px !important;
          letter-spacing: 0.05em !important;
        }

        .mobile-dossier-caption {
          font-family: var(--font-serif, Georgia, serif) !important;
          font-size: 10.5px !important;
          color: #7A7062 !important;
          line-height: 1.35 !important;
          font-style: italic !important;
          margin: 0 0 10px 0 !important;
        }

        /* Architecture Diagram Wrap */
        .mobile-dossier-diagram-wrap {
          background: #26211B !important;
          border-radius: 7px !important;
          padding: 8px !important;
          border: 1px solid #DED6C7 !important;
          margin-bottom: 5px !important;
        }

        .mobile-dossier-diagram-img {
          width: 100% !important;
          height: auto !important;
          max-height: 125px !important;
          object-fit: contain !important;
          display: block !important;
        }

        /* Empirical Plot Wrap */
        .mobile-dossier-plot-wrap {
          background: #FFFFFF !important;
          border-radius: 7px !important;
          padding: 6px !important;
          border: 1px solid #DED6C7 !important;
          margin-bottom: 5px !important;
        }

        .mobile-dossier-plot-img {
          width: 100% !important;
          height: auto !important;
          max-height: 140px !important;
          object-fit: contain !important;
          display: block !important;
        }

        /* Section Divider */
        .mobile-dossier-divider {
          border-top: 1px dashed rgba(70, 40, 10, 0.18) !important;
          margin: 14px 0 12px !important;
        }

        .mobile-dossier-sec-tag {
          font-family: var(--font-mono, monospace) !important;
          font-size: 9.5px !important;
          font-weight: 700 !important;
          letter-spacing: 0.08em !important;
          color: #8A1C1C !important;
          text-transform: uppercase !important;
          display: flex !important;
          align-items: center !important;
          gap: 5px !important;
          margin-bottom: 4px !important;
        }

        .mobile-dossier-sec-dot {
          width: 5px !important;
          height: 5px !important;
          border-radius: 50% !important;
          background: #8A1C1C !important;
          display: inline-block !important;
        }

        .mobile-dossier-sec-title {
          font-family: var(--font-serif, Georgia, serif) !important;
          font-size: 18px !important;
          font-weight: 700 !important;
          line-height: 1.2 !important;
          color: #26211B !important;
          margin: 0 0 6px 0 !important;
        }

        .mobile-dossier-lead-p {
          font-family: var(--font-serif, Georgia, serif) !important;
          font-size: 11.5px !important;
          line-height: 1.5 !important;
          color: #4A4239 !important;
          margin: 0 0 10px 0 !important;
        }

        /* Part Labels */
        .mobile-dossier-part-label {
          font-family: var(--font-mono, monospace) !important;
          font-size: 8.5px !important;
          font-weight: 700 !important;
          letter-spacing: 0.08em !important;
          text-transform: uppercase !important;
          color: #8A1C1C !important;
          margin: 10px 0 6px 0 !important;
        }

        /* Concise Bullet Points */
        .mobile-dossier-bullets {
          display: flex !important;
          flex-direction: column !important;
          gap: 6px !important;
        }

        .mobile-dossier-bullet-row {
          display: flex !important;
          align-items: baseline !important;
          gap: 6px !important;
        }

        .mobile-dossier-bullet-marker {
          color: #8A1C1C !important;
          font-size: 9px !important;
          font-weight: 700 !important;
          line-height: 1 !important;
          flex-shrink: 0 !important;
        }

        .mobile-dossier-bullet-text {
          font-family: var(--font-serif, Georgia, serif) !important;
          font-size: 11px !important;
          line-height: 1.45 !important;
          color: #383531 !important;
        }

        .mobile-dossier-bullet-bold {
          font-weight: 700 !important;
          color: #1c1917 !important;
          margin-right: 3px !important;
        }

        /* Handwritten Reflection Box */
        .mobile-dossier-handwritten {
          background: #F8F4EA !important;
          border: 1px dashed #D5CAB5 !important;
          border-radius: 7px !important;
          padding: 9px 11px !important;
          margin-top: 12px !important;
        }

        .mobile-dossier-handwritten-text {
          font-family: var(--font-hand, cursive) !important;
          font-size: 15px !important;
          line-height: 1.35 !important;
          color: #1A365D !important;
          margin: 0 !important;
        }

        /* Editorial Takeaway Note (No sticky note box) */
        .mobile-dossier-takeaway {
          font-family: var(--font-serif, Georgia, serif) !important;
          font-size: 11px !important;
          line-height: 1.45 !important;
          color: #5A524A !important;
          font-style: italic !important;
          margin: 12px 0 4px 0 !important;
          padding-left: 8px !important;
          border-left: 2px solid #D5CBB8 !important;
        }
      `}</style>

      <div className="mobile-dossier-sheet" onClick={(e) => e.stopPropagation()}>
        {/* Pull Handle Bar with swipe-down dismissal */}
        <div
          className="mobile-dossier-handle-bar"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="mobile-dossier-handle-pill" />
        </div>

        {/* Sticky Top Bar */}
        <div className="mobile-dossier-topbar">
          <span className="mobile-dossier-folio-tag">
            DOSSIER 01 · WILDFIRE CV
          </span>

          <button
            type="button"
            onClick={onClose}
            className="mobile-dossier-close-btn"
            aria-label="Close dossier"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div ref={scrollRef} className="mobile-dossier-body">
          <div className="mobile-dossier-leaf">
            {/* Washi Tape */}
            <div className="mobile-dossier-washi-tape" aria-hidden="true" />

            {/* Header Metadata */}
            <div className="mobile-dossier-meta">
              <span className="mobile-dossier-cat-pill">COMPUTER VISION · EDGE AI</span>
              <span className="mobile-dossier-year">SUMMER 2024</span>
            </div>

            <h2 className="mobile-dossier-title">Wildfire Image Detection</h2>
            <p className="mobile-dossier-desc">
              Sub-15ms edge CV pipeline classifying early wildfire ignitions from aerial frames.
            </p>

            {/* Hero Image */}
            <div className="mobile-dossier-hero-wrap">
              <img
                src="/palisades_recon_smoke.jpg"
                alt="Palisades Fire Aerial Frame"
                className="mobile-dossier-hero-img"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = "/palisades_fire_real.jpg";
                }}
              />
              <div className="mobile-dossier-hero-tag">
                RECONNAISSANCE AERIAL FRAME • TOPANGA CANYON
              </div>
            </div>
            <p className="mobile-dossier-caption">
              Fig 01: Early smoke plume cresting the ridge line.
            </p>

            {/* Phase 01 Divider */}
            <div className="mobile-dossier-divider" />

            {/* Phase 01 Header */}
            <div className="mobile-dossier-sec-tag">
              <span className="mobile-dossier-sec-dot" />
              <span>PHASE 01 · PROBLEM &amp; ORIGIN</span>
            </div>

            <h3 className="mobile-dossier-sec-title">
              Crisis &amp; Palisades Origin
            </h3>

            <p className="mobile-dossier-lead-p">
              Watching the Palisades fire rapidly expand over the Santa Monica Mountains exposed a critical flaw: crews lacked real-time ridge visibility.
            </p>

            {/* PART I: The Statewide Crisis */}
            <div className="mobile-dossier-part-label">PART I · STATEWIDE CRISIS</div>
            <div className="mobile-dossier-bullets">
              <div className="mobile-dossier-bullet-row">
                <span className="mobile-dossier-bullet-marker">•</span>
                <div className="mobile-dossier-bullet-text">
                  <strong className="mobile-dossier-bullet-bold">2.5M+ Acres:</strong>
                  <span>Burned per peak season.</span>
                </div>
              </div>
              <div className="mobile-dossier-bullet-row">
                <span className="mobile-dossier-bullet-marker">•</span>
                <div className="mobile-dossier-bullet-text">
                  <strong className="mobile-dossier-bullet-bold">7,000+ Fires:</strong>
                  <span>Logged annually statewide.</span>
                </div>
              </div>
              <div className="mobile-dossier-bullet-row">
                <span className="mobile-dossier-bullet-marker">•</span>
                <div className="mobile-dossier-bullet-text">
                  <strong className="mobile-dossier-bullet-bold">$10B–$15B:</strong>
                  <span>Annual losses &amp; suppression costs.</span>
                </div>
              </div>
            </div>

            {/* PART II: The Pacific Palisades Origin */}
            <div className="mobile-dossier-part-label" style={{ marginTop: "10px" }}>
              PART II · PALISADES ORIGIN
            </div>
            <div className="mobile-dossier-bullets">
              <div className="mobile-dossier-bullet-row">
                <span className="mobile-dossier-bullet-marker">•</span>
                <div className="mobile-dossier-bullet-text">
                  <strong className="mobile-dossier-bullet-bold">1,200+ Acres:</strong>
                  <span>Scorched along canyon ridges in hours.</span>
                </div>
              </div>
              <div className="mobile-dossier-bullet-row">
                <span className="mobile-dossier-bullet-marker">•</span>
                <div className="mobile-dossier-bullet-text">
                  <strong className="mobile-dossier-bullet-bold">10,000+ Evacuated:</strong>
                  <span>Under emergency orders.</span>
                </div>
              </div>
              <div className="mobile-dossier-bullet-row">
                <span className="mobile-dossier-bullet-marker">•</span>
                <div className="mobile-dossier-bullet-text">
                  <strong className="mobile-dossier-bullet-bold">500+ Homes:</strong>
                  <span>Directly endangered before containment.</span>
                </div>
              </div>
            </div>

            {/* Fountain Pen Note */}
            <div className="mobile-dossier-handwritten">
              <p className="mobile-dossier-handwritten-text">
                &ldquo;Drones need sub-15ms on-device vision to alert commanders within 60 seconds of ignition.&rdquo;
              </p>
            </div>

            {/* Phase 02 Divider */}
            <div id="phase-02-anchor" className="mobile-dossier-divider" style={{ margin: "22px 0 14px" }} />

            {/* Phase 02 Header */}
            <div className="mobile-dossier-sec-tag">
              <span className="mobile-dossier-sec-dot" />
              <span>PHASE 02 · SCOPE &amp; ROOT CAUSE</span>
            </div>

            <h3 className="mobile-dossier-sec-title">
              Status Quo vs. Project Aim
            </h3>

            <p className="mobile-dossier-lead-p">
              Why existing detection workflows fail early containment and setting a pragmatic edge software scope.
            </p>

            {/* PART I: Current Bottlenecks */}
            <div className="mobile-dossier-part-label">PART I · STATUS QUO BOTTLENECKS</div>
            <div className="mobile-dossier-bullets">
              <div className="mobile-dossier-bullet-row">
                <span className="mobile-dossier-bullet-marker">•</span>
                <div className="mobile-dossier-bullet-text">
                  <strong className="mobile-dossier-bullet-bold">911 Calls Lag:</strong>
                  <span>30–60 min delay before human sighting reaches dispatch.</span>
                </div>
              </div>
              <div className="mobile-dossier-bullet-row">
                <span className="mobile-dossier-bullet-marker">•</span>
                <div className="mobile-dossier-bullet-text">
                  <strong className="mobile-dossier-bullet-bold">Satellite Orbit Gap:</strong>
                  <span>3–6 hr revisit cycles &amp; frequent cloud occlusion.</span>
                </div>
              </div>
              <div className="mobile-dossier-bullet-row">
                <span className="mobile-dossier-bullet-marker">•</span>
                <div className="mobile-dossier-bullet-text">
                  <strong className="mobile-dossier-bullet-bold">Zero Cloud Access:</strong>
                  <span>Steep canyon terrain severs cellular signals during fires.</span>
                </div>
              </div>
            </div>

            {/* PART II: Project Aim & Scope */}
            <div className="mobile-dossier-part-label" style={{ marginTop: "12px" }}>
              PART II · PROJECT AIM &amp; SCOPE
            </div>
            <div className="mobile-dossier-bullets">
              <div className="mobile-dossier-bullet-row">
                <span className="mobile-dossier-bullet-marker">•</span>
                <div className="mobile-dossier-bullet-text">
                  <strong className="mobile-dossier-bullet-bold">&lt;35MB Footprint:</strong>
                  <span>Fits within strict micro-device RAM limits.</span>
                </div>
              </div>
              <div className="mobile-dossier-bullet-row">
                <span className="mobile-dossier-bullet-marker">•</span>
                <div className="mobile-dossier-bullet-text">
                  <strong className="mobile-dossier-bullet-bold">Sub-15ms Inference:</strong>
                  <span>Instant on-device classification without internet.</span>
                </div>
              </div>
              <div className="mobile-dossier-bullet-row">
                <span className="mobile-dossier-bullet-marker">•</span>
                <div className="mobile-dossier-bullet-text">
                  <strong className="mobile-dossier-bullet-bold">Binary Smoke Detection:</strong>
                  <span>Dedicated classifier instead of complex drone overhauls.</span>
                </div>
              </div>
            </div>

            {/* Grounded Scope Note (Clean editorial inline note, NO sticky box!) */}
            <p className="mobile-dossier-takeaway">
              Grounded Scope: Build a fast, lightweight software classifier to verify smoke in aerial frames locally — keeping compute small enough for real-time edge devices.
            </p>

            {/* Phase 03 Divider */}
            <div id="phase-03-anchor" className="mobile-dossier-divider" style={{ margin: "22px 0 14px" }} />

            {/* Phase 03 Header */}
            <div className="mobile-dossier-sec-tag">
              <span className="mobile-dossier-sec-dot" />
              <span>PHASE 03 · STRATEGIC TRADE-OFFS</span>
            </div>

            <h3 className="mobile-dossier-sec-title">
              Architecture Decisions &amp; Cuts
            </h3>

            <p className="mobile-dossier-lead-p">
              Key engineering design trade-offs made to balance speed, memory, and generalization on edge devices.
            </p>

            {/* PART I: Decisions & Sizing */}
            <div className="mobile-dossier-part-label">PART I · WHAT WAS CUT</div>
            <div className="mobile-dossier-bullets">
              <div className="mobile-dossier-bullet-row">
                <span className="mobile-dossier-bullet-marker">•</span>
                <div className="mobile-dossier-bullet-text">
                  <strong className="mobile-dossier-bullet-bold">No Heavy ViT / ResNet:</strong>
                  <span>Pretrained vision transformers draw 80W+ power and exceed micro-drone payload limits.</span>
                </div>
              </div>
              <div className="mobile-dossier-bullet-row">
                <span className="mobile-dossier-bullet-marker">•</span>
                <div className="mobile-dossier-bullet-text">
                  <strong className="mobile-dossier-bullet-bold">Classification over Segmentation:</strong>
                  <span>Avoided dense polygon masks, eliminating a 300ms per-frame compute latency bottleneck.</span>
                </div>
              </div>
            </div>

            {/* PART II: Chosen Strategy */}
            <div className="mobile-dossier-part-label" style={{ marginTop: "12px" }}>
              PART II · WHAT WAS CHOSEN
            </div>
            <div className="mobile-dossier-bullets">
              <div className="mobile-dossier-bullet-row">
                <span className="mobile-dossier-bullet-marker">•</span>
                <div className="mobile-dossier-bullet-text">
                  <strong className="mobile-dossier-bullet-bold">Custom 3-Stage CNN:</strong>
                  <span>Compact 33.9MB footprint designed strictly for local device memory bandwidth.</span>
                </div>
              </div>
              <div className="mobile-dossier-bullet-row">
                <span className="mobile-dossier-bullet-marker">•</span>
                <div className="mobile-dossier-bullet-text">
                  <strong className="mobile-dossier-bullet-bold">Dense Head Dropout (p=0.5):</strong>
                  <span>Eliminated terrain memorization, shrinking the generalization gap from 16.2% to 5.07%.</span>
                </div>
              </div>
            </div>

            <p className="mobile-dossier-takeaway">
              Trade-off Synthesis: Prioritizing binary classification and custom sizing saved 75% compute latency, maintaining continuous real-time edge execution.
            </p>

            {/* Phase 04 Divider */}
            <div id="phase-04-anchor" className="mobile-dossier-divider" style={{ margin: "22px 0 14px" }} />

            {/* Phase 04 Header */}
            <div className="mobile-dossier-sec-tag">
              <span className="mobile-dossier-sec-dot" />
              <span>PHASE 04 · TECHNICAL ARCHITECTURE</span>
            </div>

            <h3 className="mobile-dossier-sec-title">
              System Pipeline &amp; Tensor Flow
            </h3>

            <p className="mobile-dossier-lead-p">
              Sequential tensor stages converting raw 128&times;128 sensor frames into a single calibrated fire logit.
            </p>

            {/* Architecture Diagram */}
            <div className="mobile-dossier-diagram-wrap">
              <img
                src="/firecnn_architecture_diagram.svg"
                alt="FireCNN 3-Stage Convolutional Architecture Diagram"
                className="mobile-dossier-diagram-img"
              />
            </div>
            <p className="mobile-dossier-caption">
              Fig 02: 3-stage convolutional tensor pipeline from 128&times;128 crop to single binary logit.
            </p>

            {/* PART I: Convolutional Stages */}
            <div className="mobile-dossier-part-label">PART I · FEATURE EXTRACTION STAGES</div>
            <div className="mobile-dossier-bullets">
              <div className="mobile-dossier-bullet-row">
                <span className="mobile-dossier-bullet-marker">•</span>
                <div className="mobile-dossier-bullet-text">
                  <strong className="mobile-dossier-bullet-bold">Conv 1 (32 Filters, 3&times;3):</strong>
                  <span>Extracts sharp spatial boundaries, flame contrast edges, and horizon contours.</span>
                </div>
              </div>
              <div className="mobile-dossier-bullet-row">
                <span className="mobile-dossier-bullet-marker">•</span>
                <div className="mobile-dossier-bullet-text">
                  <strong className="mobile-dossier-bullet-bold">Conv 2 (64 Filters, 3&times;3):</strong>
                  <span>Encodes mid-level smoke plume textures, turbulent expansion, and vapor dispersion.</span>
                </div>
              </div>
              <div className="mobile-dossier-bullet-row">
                <span className="mobile-dossier-bullet-marker">•</span>
                <div className="mobile-dossier-bullet-text">
                  <strong className="mobile-dossier-bullet-bold">Conv 3 (128 Filters, 3&times;3):</strong>
                  <span>High-level combustion filter separating authentic smoke from coastal marine fog.</span>
                </div>
              </div>
            </div>

            {/* PART II: Classification Head */}
            <div className="mobile-dossier-part-label" style={{ marginTop: "12px" }}>
              PART II · CLASSIFICATION HEAD
            </div>
            <div className="mobile-dossier-bullets">
              <div className="mobile-dossier-bullet-row">
                <span className="mobile-dossier-bullet-marker">•</span>
                <div className="mobile-dossier-bullet-text">
                  <strong className="mobile-dossier-bullet-bold">Dense Projection (512 Nodes):</strong>
                  <span>Flattens 32,768 spatial activations with 50% dropout regularization.</span>
                </div>
              </div>
              <div className="mobile-dossier-bullet-row">
                <span className="mobile-dossier-bullet-marker">•</span>
                <div className="mobile-dossier-bullet-text">
                  <strong className="mobile-dossier-bullet-bold">Calibrated Sigmoid Output:</strong>
                  <span>Emits single wildfire probability score in 14.8ms average latency.</span>
                </div>
              </div>
            </div>

            <p className="mobile-dossier-takeaway">
              Pipeline Highlight: Conv 3 filters isolate genuine smoke plumes from Malibu morning fog.
            </p>

            {/* Phase 05 Divider */}
            <div id="phase-05-anchor" className="mobile-dossier-divider" style={{ margin: "22px 0 14px" }} />

            {/* Phase 05 Header */}
            <div className="mobile-dossier-sec-tag">
              <span className="mobile-dossier-sec-dot" />
              <span>PHASE 05 · RESULTS &amp; GENERALIZATION</span>
            </div>

            <h3 className="mobile-dossier-sec-title">
              Empirical Results &amp; Benchmarks
            </h3>

            <p className="mobile-dossier-lead-p">
              Comparing loss and accuracy convergence across configurations: baseline unregularized vs. dropout.
            </p>

            {/* Telemetry Plot */}
            <div className="mobile-dossier-plot-wrap">
              <img
                src="/firecnn_accuracy_plot.png"
                alt="FireCNN Accuracy Convergence Curve with Dropout"
                className="mobile-dossier-plot-img"
              />
            </div>
            <p className="mobile-dossier-caption">
              Fig 03: Balanced convergence trajectory achieving 81.84% top validation accuracy.
            </p>

            {/* PART I: Baseline vs Regularized */}
            <div className="mobile-dossier-part-label">PART I · DROPOUT COMPARISON</div>
            <div className="mobile-dossier-bullets">
              <div className="mobile-dossier-bullet-row">
                <span className="mobile-dossier-bullet-marker">•</span>
                <div className="mobile-dossier-bullet-text">
                  <strong className="mobile-dossier-bullet-bold">Without Dropout (Baseline):</strong>
                  <span>Validation stalled at 79.6% while training climbed to 95.8% (16.2% overfit).</span>
                </div>
              </div>
              <div className="mobile-dossier-bullet-row">
                <span className="mobile-dossier-bullet-marker">•</span>
                <div className="mobile-dossier-bullet-text">
                  <strong className="mobile-dossier-bullet-bold">With Dropout (p=0.5):</strong>
                  <span>Validation climbed steadily to 81.84% peak with narrow 5.07% spread.</span>
                </div>
              </div>
            </div>

            {/* PART II: Production Telemetry */}
            <div className="mobile-dossier-part-label" style={{ marginTop: "12px" }}>
              PART II · PRODUCTION TELEMETRY
            </div>
            <div className="mobile-dossier-bullets">
              <div className="mobile-dossier-bullet-row">
                <span className="mobile-dossier-bullet-marker">•</span>
                <div className="mobile-dossier-bullet-text">
                  <strong className="mobile-dossier-bullet-bold">Model Size:</strong>
                  <span>33.9 MB footprint; fits on micro-drone flash memory without compression.</span>
                </div>
              </div>
              <div className="mobile-dossier-bullet-row">
                <span className="mobile-dossier-bullet-marker">•</span>
                <div className="mobile-dossier-bullet-text">
                  <strong className="mobile-dossier-bullet-bold">Inference Latency:</strong>
                  <span>14.8 ms per frame on PyTorch MPS for real-time aerial processing.</span>
                </div>
              </div>
              <div className="mobile-dossier-bullet-row">
                <span className="mobile-dossier-bullet-marker">•</span>
                <div className="mobile-dossier-bullet-text">
                  <strong className="mobile-dossier-bullet-bold">Generalization Gain:</strong>
                  <span>Loss divergence cut by 76% through distributed feature learning.</span>
                </div>
              </div>
            </div>

            <p className="mobile-dossier-takeaway">
              Final Synthesis: Sub-15ms edge inference delivers continuous autonomous ridge scouting within 60 seconds of ignition, beating legacy human dispatch lag.
            </p>

          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
