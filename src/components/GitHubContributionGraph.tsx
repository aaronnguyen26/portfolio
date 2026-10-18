"use client";

import React, { useState } from "react";

export default function GitHubContributionGraph() {
  const [imgSrc, setImgSrc] = useState("/api/contributions/graph.svg");

  return (
    <section className="contrib-section-bottom">
      <div className="contrib-workbench-card">
        <span className="tape" />
        <a
          href="https://github.com/aaronnguyen26"
          target="_blank"
          rel="noopener noreferrer"
          className="contrib-scroll"
          title="View Aaron Nguyen on GitHub"
        >
          <img
            src={imgSrc}
            alt="Aaron Nguyen GitHub Contributions"
            className="contrib-svg-img"
            onError={() => {
              // Graceful fallback to static cached SVG if API is unreachable
              if (imgSrc !== "/github_contributions.svg") {
                setImgSrc("/github_contributions.svg");
              }
            }}
          />
        </a>
      </div>
    </section>
  );
}
