import React from "react";

export default function GitHubContributionGraph() {
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
            src="/api/contributions/graph.svg"
            alt="Aaron Nguyen GitHub Contributions"
            className="contrib-svg-img"
          />
        </a>
      </div>
    </section>
  );
}
