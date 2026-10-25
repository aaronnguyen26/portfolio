"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getLlmsTxt } from "@/data/llms-content";

interface LLMContextType {
  isOpen: boolean;
  openLLM: () => void;
  closeLLM: () => void;
}

const LLMContext = createContext<LLMContextType>({
  isOpen: false,
  openLLM: () => {},
  closeLLM: () => {},
});

export const useLLM = () => useContext(LLMContext);

export function LLMProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openLLM = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeLLM = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <LLMContext.Provider value={{ isOpen, openLLM, closeLLM }}>
      {children}
      <LLMModal isOpen={isOpen} onClose={closeLLM} />
    </LLMContext.Provider>
  );
}

interface LLMModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LLMModal({ isOpen, onClose }: LLMModalProps) {
  const [copied, setCopied] = useState(false);
  const content = getLlmsTxt();

  // Escape key closes viewer
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      const orig = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = orig;
      };
    }
  }, [isOpen]);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div
      className="llm-black-viewer"
      role="dialog"
      aria-modal="true"
      aria-label="llm.txt plain text viewer"
    >
      <style>{`
        .llm-black-viewer {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          width: 100vw;
          height: 100vh;
          background: #000000;
          color: #e6edf3;
          z-index: 100000;
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
          animation: llmViewerFadeIn 0.15s ease-out forwards;
        }

        @keyframes llmViewerFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .llm-viewer-topbar {
          background: #000000;
          border-bottom: 1px solid rgba(255, 255, 255, 0.12);
          padding: 10px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-shrink: 0;
          user-select: none;
        }

        .llm-viewer-title {
          font-family: var(--font-mono, ui-monospace, Menlo, Monaco, monospace);
          font-size: 0.82rem;
          color: #a0a0a0;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .llm-viewer-title strong {
          color: #ffffff;
          font-weight: 600;
        }

        .llm-viewer-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .llm-viewer-btn {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 4px;
          color: #d0d0d0;
          font-family: var(--font-mono, ui-monospace, Menlo, Monaco, monospace);
          font-size: 0.74rem;
          padding: 4px 10px;
          cursor: pointer;
          transition: background 0.15s ease, color 0.15s ease;
        }

        .llm-viewer-btn:hover {
          background: rgba(255, 255, 255, 0.16);
          color: #ffffff;
        }

        .llm-viewer-btn-copied {
          color: #4ade80 !important;
          border-color: rgba(74, 222, 128, 0.4) !important;
        }

        .llm-viewer-raw-link {
          color: #888888;
          font-family: var(--font-mono, ui-monospace, Menlo, Monaco, monospace);
          font-size: 0.74rem;
          text-decoration: none;
          padding: 4px 6px;
        }

        .llm-viewer-raw-link:hover {
          color: #ffffff;
        }

        .llm-viewer-close-btn {
          background: none;
          border: none;
          color: #888888;
          font-size: 1.25rem;
          cursor: pointer;
          padding: 4px 8px;
          line-height: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.15s ease;
        }

        .llm-viewer-close-btn:hover {
          color: #ffffff;
        }

        .llm-viewer-content {
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
          background: #000000;
          padding: 20px 20px calc(40px + env(safe-area-inset-bottom, 20px));
          box-sizing: border-box;
          -webkit-overflow-scrolling: touch;
        }

        .llm-viewer-pre {
          max-width: 900px;
          margin: 0 auto;
          font-family: var(--font-mono, ui-monospace, Menlo, Monaco, "Courier New", monospace);
          font-size: 0.85rem;
          line-height: 1.65;
          color: #e2e8f0;
          white-space: pre-wrap;
          word-break: break-word;
        }

        @media (max-width: 640px) {
          .llm-viewer-pre {
            font-size: 0.78rem;
            line-height: 1.55;
          }
          .llm-viewer-topbar {
            padding: 8px 12px;
          }
        }
      `}</style>

      {/* Top minimal bar */}
      <header className="llm-viewer-topbar">
        <div className="llm-viewer-title">
          <strong>llm.txt</strong>
          <span style={{ opacity: 0.4 }}>/</span>
          <span style={{ fontSize: "0.74rem", opacity: 0.8 }}>plain text</span>
        </div>

        <div className="llm-viewer-actions">
          <button
            type="button"
            onClick={handleCopy}
            className={`llm-viewer-btn ${copied ? "llm-viewer-btn-copied" : ""}`}
            title="Copy all text to clipboard"
          >
            {copied ? "Copied ✓" : "Copy"}
          </button>
          <a
            href="/llms.txt"
            target="_blank"
            rel="noopener noreferrer"
            className="llm-viewer-raw-link"
            title="Open raw text in new tab"
          >
            Raw ↗
          </a>
          <button
            type="button"
            onClick={onClose}
            className="llm-viewer-close-btn"
            aria-label="Close text viewer"
            title="Close (Esc)"
          >
            ✕
          </button>
        </div>
      </header>

      {/* Pure black txt body */}
      <main className="llm-viewer-content">
        <pre className="llm-viewer-pre">
          {content}
        </pre>
      </main>
    </div>
  );
}
