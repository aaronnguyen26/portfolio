"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { site } from "@/data/site";

interface ResumeContextType {
  isOpen: boolean;
  viewMode: "picker" | "viewer";
  openResume: (mode?: "picker" | "viewer") => void;
  closeResume: () => void;
}

const ResumeContext = createContext<ResumeContextType>({
  isOpen: false,
  viewMode: "picker",
  openResume: () => {},
  closeResume: () => {},
});

export const useResume = () => useContext(ResumeContext);

export function ResumeProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"picker" | "viewer">("picker");

  const openResume = useCallback((mode: "picker" | "viewer" = "picker") => {
    setViewMode(mode);
    setIsOpen(true);
  }, []);

  const closeResume = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <ResumeContext.Provider value={{ isOpen, viewMode, openResume, closeResume }}>
      {children}
      <ResumeModal
        isOpen={isOpen}
        viewMode={viewMode}
        onClose={closeResume}
        onSwitchToViewer={() => setViewMode("viewer")}
        onSwitchToPicker={() => setViewMode("picker")}
      />
    </ResumeContext.Provider>
  );
}

interface ResumeModalProps {
  isOpen: boolean;
  viewMode: "picker" | "viewer";
  onClose: () => void;
  onSwitchToViewer: () => void;
  onSwitchToPicker: () => void;
}

const ZOOM_STEPS = [0.75, 0.85, 1.0, 1.15, 1.3, 1.5, 1.75];

export function ResumeModal({
  isOpen,
  viewMode,
  onClose,
  onSwitchToViewer,
  onSwitchToPicker,
}: ResumeModalProps) {
  const [zoomIndex, setZoomIndex] = useState<number>(2); // 1.0 (100%)
  const [isFitWidth, setIsFitWidth] = useState<boolean>(true);
  const sheetRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef<number>(0);
  const touchEndY = useRef<number>(0);

  // Keyboard accessibility: Escape closes modal
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll while modal is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // Reset zoom on open
  useEffect(() => {
    if (isOpen) {
      setZoomIndex(2); // 1.0
      setIsFitWidth(true);
    }
  }, [isOpen, viewMode]);

  // Mobile swipe-down to dismiss (picker only)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndY.current = e.changedTouches[0].clientY;
    const diff = touchEndY.current - touchStartY.current;
    if (diff > 90) {
      onClose();
    }
  };

  const handleOpenInNewTab = () => {
    window.open("/resume.pdf", "_blank", "noopener,noreferrer");
    onClose();
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = "/resume.pdf";
    link.download = "Aaron_Nguyen_Resume.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleZoomIn = () => {
    setIsFitWidth(false);
    setZoomIndex((prev) => Math.min(prev + 1, ZOOM_STEPS.length - 1));
  };

  const handleZoomOut = () => {
    setIsFitWidth(false);
    setZoomIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleToggleFit = () => {
    if (isFitWidth) {
      setIsFitWidth(false);
      setZoomIndex(2); // 100%
    } else {
      setIsFitWidth(true);
    }
  };

  const handleDoubleTapPaper = () => {
    if (isFitWidth) {
      setIsFitWidth(false);
      setZoomIndex(4); // 1.3x
    } else {
      setIsFitWidth(true);
      setZoomIndex(2);
    }
  };

  const currentScale = ZOOM_STEPS[zoomIndex];
  const zoomDisplay = isFitWidth ? "Fit" : `${Math.round(currentScale * 100)}%`;

  if (!isOpen) return null;

  return (
    <div
      className="resume-modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="resume-modal-title"
    >
      <style>{`
        .resume-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(18, 15, 13, 0.76);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          z-index: 10000;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          padding: 0;
          animation: resumeOverlayFadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes resumeOverlayFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @media (min-width: 641px) {
          .resume-modal-overlay {
            align-items: center;
            padding: 24px;
          }
        }

        /* -------------------------------------------------- */
        /* STAGE 1: 2-OPTIONS PICKER SHEET                    */
        /* -------------------------------------------------- */
        .resume-picker-sheet {
          background: #FFFDF9;
          width: 100%;
          max-width: 480px;
          border-radius: 20px 20px 0 0;
          box-shadow: 0 -10px 40px rgba(0,0,0,0.3);
          border: 1px solid rgba(0, 0, 0, 0.1);
          overflow: hidden;
          padding: 12px 20px 28px;
          animation: resumeSheetSlideUp 0.24s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          box-sizing: border-box;
        }

        @media (min-width: 641px) {
          .resume-picker-sheet {
            border-radius: 16px;
            box-shadow: 0 16px 50px rgba(0,0,0,0.35);
            padding: 24px 28px 24px;
          }
        }

        @keyframes resumeSheetSlideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }

        .resume-handle-bar {
          display: flex;
          justify-content: center;
          padding: 6px 0 14px;
          cursor: grab;
        }

        @media (min-width: 641px) {
          .resume-handle-bar {
            display: none;
          }
        }

        .resume-handle-pill {
          width: 38px;
          height: 4px;
          border-radius: 2px;
          background: rgba(0, 0, 0, 0.18);
        }

        .resume-picker-header {
          margin-bottom: 20px;
          text-align: left;
        }

        .resume-picker-eyebrow {
          display: inline-block;
          font-family: var(--font-mono);
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--cardinal, #990000);
          margin-bottom: 6px;
        }

        .resume-picker-title {
          font-family: var(--font-serif);
          font-size: 1.55rem;
          font-weight: 700;
          line-height: 1.2;
          color: #1A1614;
          margin: 0 0 6px 0;
        }

        .resume-picker-subtext {
          font-size: 0.88rem;
          line-height: 1.45;
          color: #6A6258;
          margin: 0;
        }

        .resume-picker-options {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 18px;
        }

        .resume-option-card {
          display: flex;
          align-items: center;
          gap: 14px;
          width: 100%;
          text-align: left;
          background: #F8F5EE;
          border: 1.5px solid rgba(0, 0, 0, 0.09);
          border-radius: 12px;
          padding: 14px 16px;
          cursor: pointer;
          transition: all 0.18s cubic-bezier(0.16, 1, 0.3, 1);
          color: inherit;
          text-decoration: none;
          box-sizing: border-box;
        }

        .resume-option-card:hover, .resume-option-card:focus-visible {
          background: #F1ECE0;
          border-color: var(--cardinal, #990000);
          transform: translateY(-1px);
          outline: none;
        }

        .resume-option-card-screen {
          background: #FFF9F3;
          border-color: rgba(153, 0, 0, 0.22);
        }

        .resume-option-card-screen:hover {
          background: #FDF1E6;
          border-color: var(--cardinal, #990000);
        }

        .resume-option-icon {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
          flex-shrink: 0;
          background: #EDE7D8;
          color: #3C3630;
        }

        .resume-option-card-screen .resume-option-icon {
          background: rgba(153, 0, 0, 0.08);
          color: var(--cardinal, #990000);
        }

        .resume-option-info {
          flex: 1;
          min-width: 0;
        }

        .resume-option-title-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          margin-bottom: 3px;
        }

        .resume-option-title {
          font-family: var(--font-serif);
          font-size: 1.05rem;
          font-weight: 700;
          color: #1A1614;
        }

        .resume-option-tag {
          font-family: var(--font-mono);
          font-size: 0.65rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 2px 7px;
          border-radius: 999px;
          background: rgba(0, 0, 0, 0.07);
          color: #554D45;
        }

        .resume-option-card-screen .resume-option-tag {
          background: var(--cardinal, #990000);
          color: #FFFFFF;
        }

        .resume-option-desc {
          font-size: 0.82rem;
          line-height: 1.4;
          color: #6C645A;
          margin: 0;
        }

        .resume-picker-cancel {
          width: 100%;
          padding: 12px;
          border-radius: 10px;
          border: 1px solid rgba(0, 0, 0, 0.12);
          background: transparent;
          font-family: var(--font-mono);
          font-size: 0.82rem;
          font-weight: 600;
          color: #6A6258;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .resume-picker-cancel:hover {
          background: rgba(0, 0, 0, 0.04);
          color: #1A1614;
        }

        /* -------------------------------------------------- */
        /* STAGE 2: BROWSER-STYLE PDF VIEWER UI               */
        /* -------------------------------------------------- */
        .resume-browser-viewer {
          background: #25211D;
          width: 100vw;
          height: 100dvh;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          animation: resumeSheetSlideUp 0.22s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          box-sizing: border-box;
          box-shadow: 0 16px 50px rgba(0,0,0,0.5);
        }

        @media (min-width: 768px) {
          .resume-browser-viewer {
            width: 92vw;
            max-width: 1020px;
            height: 94vh;
            border-radius: 12px;
            border: 1px solid rgba(255, 255, 255, 0.1);
          }
        }

        /* Browser PDF Chrome Toolbar */
        .resume-browser-toolbar {
          height: 48px;
          background: #1C1916;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 12px;
          gap: 8px;
          flex-shrink: 0;
          z-index: 10;
          color: #E8E2D6;
          box-sizing: border-box;
        }

        @media (min-width: 641px) {
          .resume-browser-toolbar {
            padding: 0 16px;
          }
        }

        /* Left side: Back + Document name + Page indicator */
        .resume-toolbar-left {
          display: flex;
          align-items: center;
          gap: 8px;
          min-width: 0;
        }

        .resume-tool-icon-btn {
          width: 32px;
          height: 32px;
          border-radius: 6px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.04);
          color: #E2DDD3;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.15s ease;
          flex-shrink: 0;
          padding: 0;
        }

        .resume-tool-icon-btn:hover {
          background: rgba(255, 255, 255, 0.12);
          color: #FFFFFF;
          border-color: rgba(255, 255, 255, 0.2);
        }

        .resume-tool-icon-btn:active {
          transform: scale(0.96);
        }

        .resume-doc-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: var(--font-mono);
          font-size: 0.75rem;
          color: #E8E2D6;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .resume-doc-icon {
          color: var(--cardinal, #990000);
          flex-shrink: 0;
        }

        .resume-doc-filename {
          font-weight: 500;
          display: none;
        }

        @media (min-width: 480px) {
          .resume-doc-filename {
            display: inline;
          }
        }

        .resume-page-counter {
          font-family: var(--font-mono);
          font-size: 0.68rem;
          font-weight: 600;
          color: #9C9486;
          background: rgba(255, 255, 255, 0.06);
          padding: 2px 7px;
          border-radius: 4px;
          border: 1px solid rgba(255, 255, 255, 0.06);
          flex-shrink: 0;
        }

        /* Right side: Integrated browser zoom pill + actions + close */
        .resume-toolbar-right {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-shrink: 0;
        }

        /* Browser Zoom Pill: [ - | 100% | + ] */
        .resume-browser-zoom-pill {
          display: inline-flex;
          align-items: center;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 6px;
          overflow: hidden;
          height: 30px;
          box-sizing: border-box;
        }

        .resume-zoom-pill-btn {
          background: transparent;
          border: none;
          color: #DDD7CB;
          width: 26px;
          height: 100%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.15s ease, color 0.15s ease;
          padding: 0;
        }

        .resume-zoom-pill-btn:hover {
          background: rgba(255, 255, 255, 0.12);
          color: #FFFFFF;
        }

        .resume-zoom-pill-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .resume-zoom-pill-display {
          font-family: var(--font-mono);
          font-size: 0.68rem;
          font-weight: 600;
          color: #E8E2D6;
          padding: 0 6px;
          cursor: pointer;
          user-select: none;
          border-left: 1px solid rgba(255, 255, 255, 0.08);
          border-right: 1px solid rgba(255, 255, 255, 0.08);
          height: 100%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 36px;
          background: transparent;
          border-top: none;
          border-bottom: none;
        }

        .resume-zoom-pill-display:hover {
          background: rgba(255, 255, 255, 0.08);
          color: #FFFFFF;
        }

        .resume-tool-icon-btn-highlight {
          color: var(--cardinal, #990000);
        }

        .resume-tool-icon-btn-highlight:hover {
          background: var(--cardinal, #990000);
          color: #FFFFFF;
          border-color: var(--cardinal, #990000);
        }

        .resume-tool-close-btn {
          width: 32px;
          height: 32px;
          border-radius: 6px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.04);
          color: #C8C0B2;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.15s ease;
          padding: 0;
        }

        .resume-tool-close-btn:hover {
          background: rgba(153, 0, 0, 0.85);
          color: #FFFFFF;
          border-color: var(--cardinal, #990000);
        }

        /* Document Workspace Canvas */
        .resume-canvas-viewport {
          flex: 1;
          overflow: auto;
          -webkit-overflow-scrolling: touch;
          background: #27221E;
          background-image: radial-gradient(rgba(255, 255, 255, 0.035) 1px, transparent 1px);
          background-size: 18px 18px;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 24px 16px 48px;
          box-sizing: border-box;
        }

        @media (max-width: 640px) {
          .resume-canvas-viewport {
            padding: 14px 8px 32px;
          }
        }

        /* Document Paper Sheet */
        .resume-canvas-paper {
          background: #FFFFFF;
          box-shadow: 0 4px 28px rgba(0, 0, 0, 0.5), 0 1px 4px rgba(0, 0, 0, 0.3);
          border-radius: 2px;
          transition: width 0.18s cubic-bezier(0.16, 1, 0.3, 1);
          cursor: zoom-in;
          display: flex;
          justify-content: center;
          overflow: hidden;
          flex-shrink: 0;
        }

        .resume-canvas-image {
          display: block;
          width: 100%;
          height: auto;
          user-select: none;
          -webkit-user-drag: none;
        }
      `}</style>

      {/* -------------------------------------------------- */}
      {/* VIEW MODE 1: PICKER DIALOG                         */}
      {/* -------------------------------------------------- */}
      {viewMode === "picker" && (
        <div
          ref={sheetRef}
          className="resume-picker-sheet"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Pull handle on mobile */}
          <div
            className="resume-handle-bar"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div className="resume-handle-pill" />
          </div>

          <div className="resume-picker-header">
            <span className="resume-picker-eyebrow">AARON NGUYEN · RESUME</span>
            <h2 id="resume-modal-title" className="resume-picker-title">
              Resume Options
            </h2>
            <p className="resume-picker-subtext">
              Choose how you would like to review my credentials:
            </p>
          </div>

          <div className="resume-picker-options">
            {/* OPTION 1: View on Website Screen */}
            <button
              type="button"
              className="resume-option-card resume-option-card-screen"
              onClick={onSwitchToViewer}
              autoFocus
            >
              <div className="resume-option-icon" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                </svg>
              </div>
              <div className="resume-option-info">
                <div className="resume-option-title-row">
                  <span className="resume-option-title">View on Screen</span>
                  <span className="resume-option-tag">Recommended</span>
                </div>
                <p className="resume-option-desc">
                  Read directly in the interactive portfolio viewer without leaving the page.
                </p>
              </div>
            </button>

            {/* OPTION 2: Open in Another Tab */}
            <button
              type="button"
              className="resume-option-card"
              onClick={handleOpenInNewTab}
            >
              <div className="resume-option-icon" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
              </div>
              <div className="resume-option-info">
                <div className="resume-option-title-row">
                  <span className="resume-option-title">Open in Another Tab</span>
                  <span className="resume-option-tag">PDF (108 KB)</span>
                </div>
                <p className="resume-option-desc">
                  Open the raw PDF in a new browser window or download for printing and archiving.
                </p>
              </div>
            </button>
          </div>

          <button
            type="button"
            className="resume-picker-cancel"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      )}

      {/* -------------------------------------------------- */}
      {/* STAGE 2: BROWSER-STYLE PDF VIEWER UI               */}
      {/* -------------------------------------------------- */}
      {viewMode === "viewer" && (
        <div
          ref={sheetRef}
          className="resume-browser-viewer"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Single Slim Browser PDF Chrome Toolbar */}
          <div className="resume-browser-toolbar">
            {/* Left: Back button + Doc name + Page indicator */}
            <div className="resume-toolbar-left">
              <button
                type="button"
                className="resume-tool-icon-btn"
                onClick={onSwitchToPicker}
                title="Back to options"
                aria-label="Back to resume options"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12"></line>
                  <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
              </button>

              <div className="resume-doc-badge">
                <svg className="resume-doc-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                </svg>
                <span className="resume-doc-filename">resume.pdf</span>
              </div>

              <span className="resume-page-counter">1 / 1</span>
            </div>

            {/* Right: Integrated Browser Zoom Pill + Fit + Open Tab + Download + Close */}
            <div className="resume-toolbar-right">
              {/* Browser-style compact zoom pill: [ - | % | + ] */}
              <div className="resume-browser-zoom-pill" role="group" aria-label="Zoom controls">
                <button
                  type="button"
                  className="resume-zoom-pill-btn"
                  onClick={handleZoomOut}
                  disabled={zoomIndex === 0 && !isFitWidth}
                  title="Zoom out"
                  aria-label="Zoom out"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                </button>

                <button
                  type="button"
                  className="resume-zoom-pill-display"
                  onClick={handleToggleFit}
                  title={isFitWidth ? "Switch to 100% zoom" : "Fit to width"}
                  aria-label={`Current zoom: ${zoomDisplay}. Click to toggle Fit Width`}
                >
                  {zoomDisplay}
                </button>

                <button
                  type="button"
                  className="resume-zoom-pill-btn"
                  onClick={handleZoomIn}
                  disabled={zoomIndex === ZOOM_STEPS.length - 1}
                  title="Zoom in"
                  aria-label="Zoom in"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                </button>
              </div>

              {/* Fit-to-Width icon button */}
              <button
                type="button"
                className={`resume-tool-icon-btn ${isFitWidth ? "resume-tool-icon-btn-highlight" : ""}`}
                onClick={handleToggleFit}
                title="Fit to width"
                aria-label="Fit to width"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="4 8 4 4 8 4"></polyline>
                  <polyline points="16 4 20 4 20 8"></polyline>
                  <polyline points="20 16 20 20 16 20"></polyline>
                  <polyline points="8 20 4 20 4 16"></polyline>
                  <line x1="8" y1="12" x2="16" y2="12"></line>
                </svg>
              </button>

              {/* Open in Another Tab */}
              <button
                type="button"
                className="resume-tool-icon-btn"
                onClick={handleOpenInNewTab}
                title="Open PDF in a new browser tab"
                aria-label="Open PDF in a new browser tab"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
              </button>

              {/* Download PDF */}
              <button
                type="button"
                className="resume-tool-icon-btn"
                onClick={handleDownload}
                title="Download Aaron Nguyen Resume PDF"
                aria-label="Download Aaron Nguyen Resume PDF"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
              </button>

              {/* Close Button */}
              <button
                type="button"
                className="resume-tool-close-btn"
                onClick={onClose}
                title="Close viewer"
                aria-label="Close viewer"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          </div>

          {/* Authentic Browser PDF Canvas */}
          <div className="resume-canvas-viewport">
            <div
              className="resume-canvas-paper"
              style={{
                width: isFitWidth ? "100%" : `${Math.round(100 * currentScale)}%`,
                maxWidth: isFitWidth ? "780px" : `${Math.round(780 * currentScale)}px`,
              }}
              onDoubleClick={handleDoubleTapPaper}
              title="Double click to toggle zoom"
            >
              <img
                src="/resume_preview.png"
                alt="Aaron Nguyen - Official Resume"
                className="resume-canvas-image"
                width={1545}
                height={2000}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
