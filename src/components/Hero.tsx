import { portfolioData } from "@/data/portfolio";
import {
  Mail,
  FileText,
  ArrowDown,
  Terminal,
  MapPin,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/Icons";

export function Hero() {
  const { personal, links } = portfolioData;

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-grid-pattern">
      {/* Decorative radial gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-1/4 -translate-x-1/2 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-12">
          
          {/* Left Column: Intro & Pitch */}
          <div className="flex-1 max-w-2xl">
            {/* Status Badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-blue-950/70 border border-blue-500/30 text-blue-300 text-xs sm:text-sm font-medium mb-6 backdrop-blur-md shadow-sm shadow-blue-950/40">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span>{personal.status.seeking}</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-5 leading-[1.15]">
              Hi, I&apos;m{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300">
                {personal.name}
              </span>
              .
            </h1>

            {/* Tagline */}
            <p className="text-lg sm:text-xl font-medium text-slate-300 mb-4">
              {personal.headline}
            </p>

            {/* Sub-headline / Elevator Pitch */}
            <p className="text-base text-slate-400 leading-relaxed mb-8 max-w-xl">
              {personal.subheadline}
            </p>

            {/* Quick Education & Location Badges */}
            <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-slate-400 mb-8">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-900 border border-slate-800">
                <GraduationCap className="w-4 h-4 text-blue-400" />
                <span>{personal.university} &bull; {personal.major} ({personal.gradYear})</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-900 border border-slate-800">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span>{personal.location}</span>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-10">
              <a
                href="#projects"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-md shadow-blue-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>View Featured Projects</span>
                <ArrowDown className="w-4 h-4" />
              </a>

              <a
                href={links.resumePdf}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-semibold text-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <FileText className="w-4 h-4 text-blue-400" />
                <span>Download Resume</span>
              </a>

              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl hover:bg-slate-900/60 text-slate-300 font-semibold text-sm transition-colors"
              >
                <span>Get in Touch &rarr;</span>
              </a>
            </div>

            {/* Social Icons Bar */}
            <div className="flex items-center gap-4 text-slate-400">
              <span className="text-xs uppercase font-mono tracking-wider text-slate-500">
                Find me online:
              </span>
              <a
                href={links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:text-white transition"
                aria-label="GitHub Profile"
              >
                <GithubIcon className="w-4 h-4" />
              </a>
              <a
                href={links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:text-white transition"
                aria-label="LinkedIn Profile"
              >
                <LinkedinIcon className="w-4 h-4" />
              </a>
              <a
                href={`mailto:${links.email}`}
                className="p-2.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:text-white transition"
                aria-label="Email Me"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Right Column: Interactive Terminal Card */}
          <div className="w-full lg:w-96 flex-shrink-0">
            <div className="rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl shadow-blue-950/20 overflow-hidden font-mono text-xs">
              {/* Terminal Window Header */}
              <div className="flex items-center justify-between px-4 py-3 bg-slate-950 border-b border-slate-800/80">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>student-profile.json</span>
                </div>
                <div className="w-8" />
              </div>

              {/* Terminal Content */}
              <div className="p-4 sm:p-5 space-y-3 leading-relaxed text-slate-300">
                <div className="text-slate-500">
                  // First-Year CS Developer Snapshot
                </div>
                <div>
                  <span className="text-blue-400">const</span>{" "}
                  <span className="text-sky-300">candidate</span> = &#123;
                </div>
                <div className="pl-4 space-y-1">
                  <div>
                    <span className="text-slate-400">name:</span>{" "}
                    <span className="text-emerald-300">&quot;{personal.name}&quot;</span>,
                  </div>
                  <div>
                    <span className="text-slate-400">status:</span>{" "}
                    <span className="text-emerald-300">&quot;Freshman @ UC&quot;</span>,
                  </div>
                  <div>
                    <span className="text-slate-400">gradYear:</span>{" "}
                    <span className="text-yellow-300">2028</span>,
                  </div>
                  <div>
                    <span className="text-slate-400">passions:</span> [
                    <span className="text-emerald-300">&quot;Web Apps&quot;</span>,{" "}
                    <span className="text-emerald-300">&quot;Algorithms&quot;</span>,{" "}
                    <span className="text-emerald-300">&quot;Distributed Systems&quot;</span>],
                  </div>
                  <div>
                    <span className="text-slate-400">seeking:</span>{" "}
                    <span className="text-emerald-300">&quot;Summer 2027 SWE Internships&quot;</span>,
                  </div>
                  <div>
                    <span className="text-slate-400">learningVelocity:</span>{" "}
                    <span className="text-yellow-300">&infin;</span>,
                  </div>
                </div>
                <div>&#125;;</div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                  <span className="flex items-center gap-1 text-emerald-400">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Ready for technical interviews</span>
                  </span>
                  <span className="text-slate-500">v1.0.0</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
