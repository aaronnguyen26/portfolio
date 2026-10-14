import { portfolioData } from "@/data/portfolio";
import { User, Sparkles, Heart, Compass } from "lucide-react";

export function About() {
  const { personal } = portfolioData;

  return (
    <section id="about" className="py-20 md:py-28 border-t border-slate-800/80 bg-slate-950/40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-12">
          <div className="flex items-center gap-2 text-xs font-mono font-semibold tracking-wider text-blue-400 uppercase mb-2">
            <User className="w-4 h-4" />
            <span>Behind the Code</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            About Me
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-2">
            My background, what drives my interest in technology, and what I do outside of lectures.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Bio Text */}
          <div className="lg:col-span-2 space-y-4 text-sm sm:text-base text-slate-300 leading-relaxed rounded-2xl bg-slate-900/40 border border-slate-800/80 p-6 sm:p-8">
            {personal.bio.map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}

            <div className="pt-4 border-t border-slate-800/80">
              <div className="flex items-center gap-2 text-xs font-mono font-semibold text-slate-400 uppercase mb-3">
                <Compass className="w-4 h-4 text-blue-400" />
                <span>Core Values & Engineering Mindset</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800">
                  <span className="font-semibold text-blue-300 block mb-1">Learning Velocity First</span>
                  <span className="text-slate-400">Not afraid of unknown codebases or unfamiliar toolchains.</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800">
                  <span className="font-semibold text-blue-300 block mb-1">Clean Documentation</span>
                  <span className="text-slate-400">Readable code, thoughtful git commits, and clear READMEs.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Currently Learning & Hobbies */}
          <div className="space-y-6">
            
            {/* What I'm Learning */}
            <div className="rounded-2xl bg-gradient-to-br from-blue-950/40 to-slate-900/60 border border-blue-500/20 p-6">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-blue-400 font-semibold mb-3">
                <Sparkles className="w-4 h-4" />
                <span>Currently Exploring</span>
              </div>
              <ul className="space-y-2.5">
                {personal.currentlyLearning.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Non-coding Hobbies */}
            <div className="rounded-2xl bg-slate-900/50 border border-slate-800/80 p-6">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold mb-3">
                <Heart className="w-4 h-4 text-pink-400" />
                <span>Beyond Programming</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {personal.interests.map((interest, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-300"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
