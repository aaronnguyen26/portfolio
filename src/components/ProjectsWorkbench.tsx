"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Code, Skyline, Group, Coffee, FloorPlan, BuildingSketch } from "@/components/JournalArt";
import { projects } from "@/data/site";
import GitHubContributionGraph from "@/components/GitHubContributionGraph";
import ProjectJourneyFan from "@/components/ProjectJourneyFan";

const tilts = ["rot-l", "rot-r", "rot-l2"];

export default function ProjectsWorkbench() {
  const [selectedJourneyProject, setSelectedJourneyProject] = useState<
    (typeof projects)[0] | null
  >(null);
  const [cardOriginRect, setCardOriginRect] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
  } | null>(null);

  const handleJourneyClick = (
    e: React.MouseEvent,
    p: (typeof projects)[0]
  ) => {
    e.preventDefault();
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
  };

  const renderArt = (art?: string) => {
    switch (art) {
      case "code":
        return <Code />;
      case "skyline":
        return <Skyline />;
      case "group":
        return <Group />;
      case "coffee":
        return <Coffee />;
      case "floorplan":
        return <FloorPlan />;
      case "building":
        return <BuildingSketch />;
      default:
        return <Code />;
    }
  };

  return (
    <>
      <span className="eyebrow mono rise">02 / Projects · Things I&rsquo;ve built</span>
      <h1 className="display rise d1">
        Pages from the <em>workbench</em>.
      </h1>
      <p className="lede rise d2">
        Each project is an entry: the problem, the decisions, the engineering tradeoffs, and the journey behind what was built.
      </p>

      <div className="cards">
        {projects.map((p, i) => (
          <article
            key={p.n}
            className={`card ${p.featured ? "featured " : ""}${tilts[i % tilts.length]}`}
          >
            <span className="tape" />

            <div className="shot-container">
              {p.image ? (
                <img src={p.image} alt={p.title} />
              ) : (
                renderArt(p.art)
              )}
              {p.badge && (
                <div className={`shot-badge ${!p.image ? "placeholder-badge" : ""}`}>
                  {p.image && <span className="dot" />}
                  {p.badge}
                </div>
              )}
            </div>

            <div className="card-meta">
              <span className="num">
                No. {p.n}{p.category ? ` · ${p.category}` : ""}
              </span>
              <span className="year">{p.year}</span>
            </div>

            <h3>{p.title}</h3>
            <p className="body" style={{ fontSize: "0.96rem", lineHeight: 1.48 }}>
              {p.blurb}
            </p>

            <dl className="specs">
              <dt>my role</dt>
              <dd>{p.role}</dd>
              <dt>outcome</dt>
              <dd>{p.outcome}</dd>
            </dl>

            <div className="tags">
              {p.tags.map((t) => (
                <span key={t} className="tag mono">
                  {t}
                </span>
              ))}
            </div>

            <p className="hand-note">↳ {p.note}</p>

            {p.hasJourney ? (
              <button
                type="button"
                onClick={(e) => handleJourneyClick(e, p)}
                className={`btn-view-journey ${p.featured ? "primary" : "secondary"}`}
              >
                <span>View Project &amp; Journey</span>
                <span className="arrow">&rarr;</span>
              </button>
            ) : (
              <a
                href={p.href}
                className={`btn-view-journey ${p.featured ? "primary" : "secondary"}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>View Project &amp; Journey</span>
                <span className="arrow">&rarr;</span>
              </a>
            )}
          </article>
        ))}
      </div>

      {/* GitHub Contribution Graph at the end of the page */}
      <GitHubContributionGraph />

      {/* Project Journey Fan Overlay (Zoom & Fan Out Animation) */}
      <ProjectJourneyFan
        isOpen={!!selectedJourneyProject}
        onClose={() => {
          setSelectedJourneyProject(null);
          setCardOriginRect(null);
        }}
        project={selectedJourneyProject}
        originRect={cardOriginRect}
      />
    </>
  );
}
