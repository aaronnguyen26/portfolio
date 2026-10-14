"use client";

import { portfolioData } from "@/data/portfolio";
import { ArrowUp } from "lucide-react";

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="border-t border-slate-900 bg-slate-950 py-12 text-slate-500 text-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
        
        <div>
          <p className="text-slate-400 font-medium">
            &copy; 2026 {portfolioData.personal.name}. All rights reserved.
          </p>
          <p className="mt-1 text-[11px] text-slate-600">
            Crafted with Next.js, TypeScript, &amp; Tailwind CSS. Deployed on Vercel.
          </p>
        </div>

        <div className="flex items-center gap-6">
          <a
            href={portfolioData.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-slate-300 transition"
          >
            GitHub
          </a>
          <a
            href={portfolioData.links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-slate-300 transition"
          >
            LinkedIn
          </a>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition"
            aria-label="Back to top"
          >
            <span>Top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </footer>
  );
}
