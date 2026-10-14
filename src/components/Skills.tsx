import { portfolioData } from "@/data/portfolio";
import { Cpu, BookOpen, Check, Clock } from "lucide-react";

export function Skills() {
  const { skills, coursework } = portfolioData;

  return (
    <section id="skills" className="py-20 md:py-28 border-t border-slate-800/80 bg-slate-950/40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-12">
          <div className="flex items-center gap-2 text-xs font-mono font-semibold tracking-wider text-blue-400 uppercase mb-2">
            <Cpu className="w-4 h-4" />
            <span>Technical Capabilities</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Skills & Coursework
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-2">
            Technologies I build with daily, alongside foundational computer science coursework.
          </p>
        </div>

        {/* Categorized Skills Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {skills.map((category) => (
            <div
              key={category.title}
              className="rounded-2xl bg-slate-900/50 border border-slate-800/80 p-5 flex flex-col justify-between"
            >
              <div>
                <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider font-mono mb-4 pb-2 border-b border-slate-800">
                  {category.title}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill) => (
                    <span
                      key={skill.name}
                      className={`text-xs px-2.5 py-1 rounded-md font-medium transition ${
                        skill.highlight
                          ? "bg-blue-950/80 text-blue-300 border border-blue-500/40 font-semibold"
                          : "bg-slate-800/70 text-slate-300 border border-slate-700/60"
                      }`}
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-4 pt-3 text-[11px] text-slate-500">
                {category.skills.filter((s) => s.highlight).length} primary focus
              </div>
            </div>
          ))}
        </div>

        {/* Academic Coursework Sub-Section */}
        <div className="rounded-2xl bg-gradient-to-r from-slate-900/90 to-blue-950/20 border border-slate-800 p-6 sm:p-8">
          <div className="flex items-center gap-2.5 mb-6">
            <BookOpen className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-bold text-white">
              University Coursework & Curriculum
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Completed Coursework */}
            <div>
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold mb-3">
                <Check className="w-4 h-4" />
                <span>Completed Foundations</span>
              </div>
              <ul className="space-y-2.5">
                {coursework.completed.map((course, idx) => (
                  <li key={idx} className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>{course}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* In Progress Coursework */}
            <div>
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-sky-400 font-semibold mb-3">
                <Clock className="w-4 h-4" />
                <span>Currently In Progress</span>
              </div>
              <ul className="space-y-2.5">
                {coursework.inProgress.map((course, idx) => (
                  <li key={idx} className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
                    <span>{course}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
