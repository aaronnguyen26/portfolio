"use client";

import React from "react";
import Link from "next/link";
import { Code, Skyline, Group, Coffee, FloorPlan, BuildingSketch } from "@/components/JournalArt";
import { projects } from "@/data/site";
import GitHubContributionGraph from "@/components/GitHubContributionGraph";

const tilts = ["rot-l", "rot-r", "rot-l2"];

export default function ProjectsWorkbench() {

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
              <Link
                href={`/projects/${p.slug || "firecnn"}`}
                className={`btn-view-journey ${p.featured ? "primary" : "secondary"}`}
              >
                <span>View Project &amp; Journey</span>
                <span className="arrow">&rarr;</span>
              </Link>
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
    </>
  );
}
