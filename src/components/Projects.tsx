"use client";

import { useState } from "react";
import { portfolioData, Project } from "@/data/portfolio";
import { ExternalLink, Code2, CheckCircle2 } from "lucide-react";
import { GithubIcon } from "@/components/Icons";

export function Projects() {
  const { projects } = portfolioData;
  const categories = ["All", "Desktop & Systems", "Full Stack", "CS Fundamentals"] as const;
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const filteredProjects =
    selectedCategory === "All"
      ? projects
      : projects.filter((p) => p.category === selectedCategory);

  return (
    <section id="projects" className="py-20 md:py-28 border-t border-slate-800/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-semibold tracking-wider text-blue-400 uppercase mb-2">
              <Code2 className="w-4 h-4" />
              <span>Proof of Work</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Featured Projects
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-xl">
              Software built to solve practical campus problems and explore core computer science fundamentals. Each project is deployed and open-source.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs sm:text-sm font-medium px-3.5 py-1.5 rounded-lg transition-all ${
                  selectedCategory === cat
                    ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20"
                    : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project: Project) => (
            <div
              key={project.id}
              className="flex flex-col rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-blue-500/40 p-6 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 group"
            >
              {/* Category & Links Header */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono font-medium px-2.5 py-1 rounded-md bg-blue-950/60 border border-blue-500/30 text-blue-300">
                  {project.category}
                </span>

                <div className="flex items-center gap-2">
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition"
                    aria-label={`View ${project.title} GitHub repository`}
                  >
                    <GithubIcon className="w-4 h-4" />
                  </a>
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-md text-slate-400 hover:text-blue-400 hover:bg-slate-800 transition"
                      aria-label={`View ${project.title} live demo`}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>

              {/* Title & Tagline */}
              <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors mb-2">
                {project.title}
              </h3>
              <p className="text-xs sm:text-sm font-medium text-slate-300 mb-3">
                {project.tagline}
              </p>

              {/* Short Description */}
              <p className="text-xs text-slate-400 leading-relaxed mb-5">
                {project.description}
              </p>

              {/* Bullet Breakdown */}
              <div className="space-y-2 mb-6 flex-1">
                {project.bullets.map((bullet, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-400 leading-relaxed">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400/80 flex-shrink-0 mt-0.5" />
                    <span>{bullet}</span>
                  </div>
                ))}
              </div>

              {/* Tech Stack Tags */}
              <div className="pt-4 border-t border-slate-800/80 flex flex-wrap gap-1.5">
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Action Link Footer */}
              <div className="mt-5 pt-3 flex items-center justify-between text-xs font-semibold">
                {project.demoUrl ? (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-blue-400 hover:text-blue-300 transition"
                  >
                    <span>Try Live Demo</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                ) : (
                  <span className="text-slate-500 font-normal">Internal CLI Utility</span>
                )}
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-slate-400 hover:text-slate-200 transition"
                >
                  <span>Codebase &rarr;</span>
                </a>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
