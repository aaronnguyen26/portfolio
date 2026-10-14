import { portfolioData, Experience as ExperienceType } from "@/data/portfolio";
import { Award, Calendar, MapPin, CheckCircle2 } from "lucide-react";

export function Experience() {
  const { experiences } = portfolioData;

  const getBadgeStyle = (type: ExperienceType["type"]) => {
    switch (type) {
      case "Leadership":
        return "bg-blue-950/80 text-blue-300 border-blue-500/40";
      case "Academic":
        return "bg-emerald-950/80 text-emerald-300 border-emerald-500/40";
      case "High School Highlight":
        return "bg-purple-950/80 text-purple-300 border-purple-500/40";
      default:
        return "bg-slate-800 text-slate-300 border-slate-700";
    }
  };

  return (
    <section id="experience" className="py-20 md:py-28 border-t border-slate-800/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-12">
          <div className="flex items-center gap-2 text-xs font-mono font-semibold tracking-wider text-blue-400 uppercase mb-2">
            <Award className="w-4 h-4" />
            <span>Leadership & Background</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Experience & Activities
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-2">
            Campus involvement, peer mentoring, and pre-collegiate engineering leadership.
          </p>
        </div>

        {/* Experience Timeline */}
        <div className="space-y-6">
          {experiences.map((exp) => (
            <div
              key={exp.id}
              className="rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700/80 p-6 sm:p-7 transition-all duration-300"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-bold text-white">
                      {exp.role}
                    </h3>
                    <span
                      className={`text-[11px] font-mono px-2.5 py-0.5 rounded-full border ${getBadgeStyle(
                        exp.type
                      )}`}
                    >
                      {exp.type}
                    </span>
                  </div>
                  <div className="text-sm font-medium text-blue-400 mt-1">
                    {exp.organization}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>{exp.period}</span>
                  </div>
                  <span>&bull;</span>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span>{exp.location}</span>
                  </div>
                </div>
              </div>

              {/* Bullet Points */}
              <div className="mt-4 space-y-2">
                {exp.bullets.map((bullet, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300 leading-relaxed">
                    <CheckCircle2 className="w-4 h-4 text-blue-400/80 flex-shrink-0 mt-0.5" />
                    <span>{bullet}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
