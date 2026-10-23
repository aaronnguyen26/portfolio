"use client";

import React, { useState } from "react";
import TurnLink from "@/components/TurnLink";
import MobileWildfirePhaseModal from "@/components/MobileWildfirePhaseModal";
import MobileEPLPhaseModal from "@/components/MobileEPLPhaseModal";
import { nav, projects, site } from "@/data/site";

interface MobileProjectsLayoutProps {
  initialOpenSlug?: string;
}

export default function MobileProjectsLayout({ initialOpenSlug }: MobileProjectsLayoutProps = {}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedJourneyProject, setSelectedJourneyProject] = useState<
    (typeof projects)[0] | null
  >(() => {
    if (initialOpenSlug) {
      return projects.find((p) => p.slug === initialOpenSlug) || null;
    }
    return null;
  });
  const [cardOriginRect, setCardOriginRect] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
  } | null>(null);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const targetSlug = params.get("open") || params.get("view");
      if (targetSlug === "firecnn" || targetSlug === "wildfire") {
        const p = projects.find((proj) => proj.slug === "firecnn") || null;
        if (p) setSelectedJourneyProject(p);
      } else if (targetSlug === "epl-predictor" || targetSlug === "epl") {
        const p = projects.find((proj) => proj.slug === "epl-predictor") || null;
        if (p) setSelectedJourneyProject(p);
      }
    }
  }, []);

  const handleOpenJourney = (
    e: React.MouseEvent,
    slug: string
  ) => {
    e.preventDefault();
    e.stopPropagation();
    const p = projects.find((proj) => proj.slug === slug) || null;
    if (p) {
      const article = (e.currentTarget as HTMLElement).closest("article");
      if (article) {
        const rect = article.getBoundingClientRect();
        setCardOriginRect({
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        });
      } else {
        setCardOriginRect(null);
      }
      setSelectedJourneyProject(p);
    }
  };

  const [isExpanded, setIsExpanded] = useState(false);

  // Ordered strictly by recency: 1. Wildfire, 2. EPL, 3. Audio Canvas, 4. ATS, 5. Micro-Kitchen, 6. Robotics
  const allProjectsList = React.useMemo(
    () =>
      [
        projects.find((p) => p.slug === "firecnn")!,
        projects.find((p) => p.slug === "epl-predictor")!,
        projects.find((p) => p.slug === "placeholder-01")!,
        projects.find((p) => p.slug === "placeholder-04")!,
        projects.find((p) => p.slug === "placeholder-05")!,
        projects.find((p) => p.slug === "placeholder-06")!,
      ].filter(Boolean),
    []
  );

  const filteredProjects = allProjectsList.filter((p) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "ml") {
      return (
        p.category.toLowerCase().includes("vision") ||
        p.category.toLowerCase().includes("ml") ||
        p.category.toLowerCase().includes("intelligence") ||
        p.category.toLowerCase().includes("ai")
      );
    }
    if (activeFilter === "econ") {
      return (
        p.category.toLowerCase().includes("econom") ||
        p.category.toLowerCase().includes("sports")
      );
    }
    if (activeFilter === "systems") {
      return (
        p.category.toLowerCase().includes("systems") ||
        p.category.toLowerCase().includes("audio") ||
        p.category.toLowerCase().includes("ios") ||
        p.category.toLowerCase().includes("nlp") ||
        p.category.toLowerCase().includes("marketplace")
      );
    }
    return true;
  });

  const visibleProjects = isExpanded ? filteredProjects : filteredProjects.slice(0, 3);
  const hasMore = filteredProjects.length > 3;

  return (
    <div className="mobile-projects-container">
      {/* Top Bar with Persistent Brand Mark */}
      <div className="mobile-projects-header">
        <button
          type="button"
          className="mobile-minimal-brand"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-label="Toggle navigation menu"
          aria-expanded={isMenuOpen}
        >
          {site.name}
        </button>

        {/* Floating popover menu */}
        {isMenuOpen && (
          <>
            <div
              className="mobile-home-menu-backdrop"
              onClick={() => setIsMenuOpen(false)}
            />
            <nav className="mobile-home-nav-drawer" aria-label="Mobile Navigation">
              <ul>
                {nav.map((item) => {
                  const isActive = item.href === "/projects";
                  return (
                    <li key={item.href}>
                      <TurnLink
                        href={item.href}
                        className={`mobile-home-nav-link ${isActive ? "active" : ""}`}
                        aria-current={isActive ? "page" : undefined}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <span className="mobile-home-nav-n">{item.n}</span>
                        <span>{item.label}</span>
                      </TurnLink>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </>
        )}
      </div>

      {/* Hero Section */}
      <div className="mobile-projects-hero">
        <h1 className="mobile-projects-title">
          Pages from the <span className="hl">workbench</span>.
        </h1>
        <p className="mobile-projects-lede">
          each project is an entry: the problem, the decisions, and the journey behind what was built.
        </p>
      </div>

      {/* Category Filter Pills */}
      <div className="mobile-projects-filter-bar">
        <button
          type="button"
          className={`mobile-projects-filter-pill ${activeFilter === "all" ? "active" : ""}`}
          onClick={() => setActiveFilter("all")}
          aria-pressed={activeFilter === "all"}
        >
          All ({projects.length})
        </button>
        <button
          type="button"
          className={`mobile-projects-filter-pill ${activeFilter === "ml" ? "active" : ""}`}
          onClick={() => setActiveFilter("ml")}
          aria-pressed={activeFilter === "ml"}
        >
          Machine Learning
        </button>
        <button
          type="button"
          className={`mobile-projects-filter-pill ${activeFilter === "econ" ? "active" : ""}`}
          onClick={() => setActiveFilter("econ")}
          aria-pressed={activeFilter === "econ"}
        >
          Econometrics
        </button>
        <button
          type="button"
          className={`mobile-projects-filter-pill ${activeFilter === "systems" ? "active" : ""}`}
          onClick={() => setActiveFilter("systems")}
          aria-pressed={activeFilter === "systems"}
        >
          Systems
        </button>
      </div>

      {/* Unified Projects Stream (Single Section, Top 3 Initial with Recency Order) */}
      <div className="mobile-projects-list">
        {visibleProjects.map((p, index) => {
          if (p.slug === "firecnn") {
            return (
              <article
                key={p.slug}
                className="mobile-projects-featured-card is-clickable"
                onClick={(e) => handleOpenJourney(e, "firecnn")}
              >
                <div className="mobile-projects-washi-tape" aria-hidden="true" />
                <div className="mobile-projects-card-header">
                  <span className="mobile-projects-card-cat">Computer Vision · Edge AI</span>
                  <span className="mobile-projects-card-meta-n">No. 01</span>
                </div>

                <div className="mobile-projects-img-wrap">
                  <img
                    src="/palisades_fire_real.jpg"
                    alt="Palisades Fire Multi-spectral Satellite Imagery"
                    className="mobile-projects-img"
                  />
                  <div className="mobile-projects-img-badge">
                    <span className="mobile-projects-img-dot" />
                    <span>Palisades Fire · LA</span>
                  </div>
                </div>

                <h2 className="mobile-projects-card-title">
                  Wildfire Image Detection
                </h2>

                <p className="mobile-projects-card-desc">
                  Lightweight deep learning computer vision pipeline classifying early-stage wildfire ignitions from multi-spectral satellite imagery.
                </p>

                <div className="mobile-projects-card-footer">
                  <button
                    type="button"
                    className="mobile-projects-more-btn"
                    onClick={(e) => handleOpenJourney(e, "firecnn")}
                    aria-label="Open more details for Wildfire Image Detection"
                  >
                    <span>More</span>
                    <span className="more-arrow" aria-hidden="true">&rarr;</span>
                  </button>
                </div>
              </article>
            );
          }

          if (p.slug === "epl-predictor") {
            return (
              <article
                key={p.slug}
                className="mobile-projects-featured-card is-clickable"
                onClick={(e) => handleOpenJourney(e, "epl-predictor")}
              >
                <div className="mobile-projects-washi-tape right" aria-hidden="true" />
                <div className="mobile-projects-card-header">
                  <span className="mobile-projects-card-cat">Sports Econometrics · ML</span>
                  <span className="mobile-projects-card-meta-n">No. 02</span>
                </div>

                <div className="mobile-projects-img-wrap">
                  <img
                    src="/epl_match_hero.jpg"
                    alt="Premier League Match Outcome Predictor"
                    className="mobile-projects-img"
                  />
                  <div className="mobile-projects-img-badge">
                    <span className="mobile-projects-img-dot" />
                    <span>Premier League · UK</span>
                  </div>
                </div>

                <h2 className="mobile-projects-card-title">
                  EPL 2025: Match Outcome Predictor
                </h2>

                <p className="mobile-projects-card-desc">
                  Hybrid XGBoost and Poisson simulation framework forecasting Premier League match outcomes and scorelines.
                </p>

                <div className="mobile-projects-card-footer">
                  <button
                    type="button"
                    className="mobile-projects-more-btn"
                    onClick={(e) => handleOpenJourney(e, "epl-predictor")}
                    aria-label="Open more details for EPL 2025 Match Outcome Predictor"
                  >
                    <span>More</span>
                    <span className="more-arrow" aria-hidden="true">&rarr;</span>
                  </button>
                </div>
              </article>
            );
          }

          return (
            <div key={p.slug || index} className="mobile-projects-compact-card">
              <div className="mobile-projects-compact-top">
                <span className="mobile-projects-compact-n">{`No. 0${index + 1}`}</span>
                <span className="mobile-projects-compact-cat">{p.category}</span>
              </div>
              <h4 className="mobile-projects-compact-title">{p.title}</h4>
              <p className="mobile-projects-compact-blurb">{p.blurb}</p>
              {p.tags && p.tags.length > 0 && (
                <div className="mobile-projects-compact-tags">
                  {p.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="mobile-projects-compact-tag">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Horizontal Line with View More / View Less Toggle Button */}
      {hasMore && (
        <button
          type="button"
          className="mobile-projects-toggle-line"
          onClick={() => setIsExpanded((prev) => !prev)}
          aria-expanded={isExpanded}
          aria-label={isExpanded ? "Collapse projects list to top 3" : `View all ${filteredProjects.length} projects`}
        >
          <span className="mobile-projects-toggle-rule" aria-hidden="true" />
          <span className="mobile-projects-toggle-badge">
            <span>{isExpanded ? "View less" : `View more (${filteredProjects.length - 3})`}</span>
            <span className="mobile-projects-toggle-arrow" aria-hidden="true">{isExpanded ? "↑" : "↓"}</span>
          </span>
          <span className="mobile-projects-toggle-rule" aria-hidden="true" />
        </button>
      )}

      {/* Bottom Action Pill Buttons */}
      <div className="mobile-projects-actions">
        <TurnLink href="/contact" className="mobile-home-btn-primary">
          Get in touch &rarr;
        </TurnLink>
        <TurnLink href="/about" className="mobile-home-btn-secondary">
          Read my story
        </TurnLink>
      </div>

      {/* Mobile Wildfire Phase Modal */}
      <MobileWildfirePhaseModal
        isOpen={!!selectedJourneyProject && (selectedJourneyProject.slug === "firecnn" || selectedJourneyProject.n === "03")}
        onClose={() => {
          setSelectedJourneyProject(null);
          setCardOriginRect(null);
        }}
      />

      {/* Mobile EPL Match Outcome Predictor Modal (Continuous 5-Phase Scroll) */}
      <MobileEPLPhaseModal
        isOpen={!!selectedJourneyProject && (selectedJourneyProject.slug === "epl-predictor" || selectedJourneyProject.n === "02")}
        onClose={() => {
          setSelectedJourneyProject(null);
          setCardOriginRect(null);
        }}
      />
    </div>
  );
}
