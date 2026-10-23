"use client";

import React, { useState, useEffect } from "react";
import Book from "@/components/Book";
import ProjectsWorkbench from "@/components/ProjectsWorkbench";
import MobileProjectsLayout from "@/components/MobileProjectsLayout";

export default function Projects() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 768px)");
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    setIsMobile(mql.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return (
    <Book>
      {/* Mobile-Only Projects View */}
      {(isMobile === true || isMobile === null) && (
        <div className="mobile-only-projects">
          <MobileProjectsLayout />
        </div>
      )}

      {/* Desktop-Only Classic Two-Page Workbench Spread */}
      {(isMobile === false || isMobile === null) && (
        <div className="desktop-only-projects">
          <ProjectsWorkbench />
        </div>
      )}
    </Book>
  );
}
