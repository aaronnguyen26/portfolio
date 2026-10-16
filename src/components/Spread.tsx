import Polaroid from "@/components/Polaroid";

/**
 * The hero centerpiece: an open leather journal, laid out to match the design mockup.
 * All positions/widths are percentages of a single page (each .leaf), so nothing overlaps.
 */
export default function Spread() {
  return (
    <div className="spread" aria-label="Illustration of an open field journal">
      {/* LEFT LEAF */}
      <div className="leaf left">
        <div className="stamp" style={{ left: "6%", top: "3.5%" }}>
          VOL. 01 / FIELD JOURNAL &bull; SOUTHERN CA
        </div>

        {/* Polaroid 1: Hahn Central Plaza */}
        <Polaroid
          style={{ left: "6%", top: "12%", width: "33%", transform: "rotate(-3deg)" }}
          caption="Hahn Central Plaza"
          tape
        >
          <img src="/photo_usc.jpg" alt="Hahn Central Plaza" />
        </Polaroid>

        <p className="hand ink" style={{ left: "42%", top: "9%", width: "53%", fontSize: "clamp(0.85rem, 1.8cqw, 1.15rem)", lineHeight: 1.25 }}>
          Keeping a notebook for all of it: questions worth asking, ideas worth sketching, and staying curious every day.
        </p>

        {/* Polaroid 2: Volunteer Crew */}
        <Polaroid
          style={{ left: "45%", top: "35%", width: "31%", transform: "rotate(1.5deg)" }}
          caption="volunteer crew"
          tape
        >
          <img src="/photo_volunteer.jpg" alt="Volunteer Crew" />
        </Polaroid>

        <p className="hand ink" style={{ left: "6%", top: "57%", width: "35%", fontSize: "clamp(0.95rem, 2cqw, 1.25rem)" }}>
          craft over noise, learning by doing
        </p>

        {/* Architectural Diagram / Sketch notes */}
        <div style={{ position: "absolute", left: "6%", top: "76%", width: "42%", opacity: 0.9 }}>
          <svg viewBox="0 0 220 54" fill="none" stroke="#243b6b" strokeWidth="1.3" style={{ width: "100%" }}>
            <rect x="5" y="8" width="56" height="38" rx="3" strokeDasharray="2 2" />
            <text x="33" y="27" fontFamily="JetBrains Mono, monospace" fontSize="7.5" textAnchor="middle" fill="#243b6b" stroke="none">Data &amp; Theory</text>
            <path d="M 61 27 L 82 27" stroke="#243b6b" />
            <rect x="82" y="8" width="50" height="38" rx="3" />
            <text x="107" y="27" fontFamily="JetBrains Mono, monospace" fontSize="7.5" textAnchor="middle" fill="#243b6b" stroke="none">Models</text>
            <path d="M 132 27 L 152 27" stroke="#243b6b" />
            <rect x="152" y="8" width="56" height="38" rx="3" />
            <text x="180" y="27" fontFamily="JetBrains Mono, monospace" fontSize="7.5" textAnchor="middle" fill="#243b6b" stroke="none">Insights</text>
          </svg>
        </div>
        <p className="hand ink" style={{ left: "52%", top: "79%", width: "43%", fontSize: "clamp(0.85rem, 1.8cqw, 1.15rem)" }}>
          exploring the questions behind the data
        </p>
      </div>

      {/* RIGHT LEAF */}
      <div className="leaf right">
        {/* School & Studying Note */}
        <div style={{ position: "absolute", left: "6%", top: "5%", width: "48%" }}>
          <div className="ticket-pair">
            <div className="stub mono">FIELD NOTE // NOTEBOOK 01</div>
          </div>
          <div style={{ marginTop: "10px", background: "rgba(255, 248, 220, 0.6)", borderLeft: "3px solid #8a1c1c", padding: "7px 14px", borderRadius: "2px" }}>
            <p className="hand" style={{ fontSize: "clamp(1.1rem, 2.3cqw, 1.48rem)", lineHeight: 1.35, color: "#243b6b", fontWeight: 600 }}>
              <span style={{ color: "#8a1c1c", fontWeight: 700 }}>school:</span> usc<br />
              <span style={{ color: "#8a1c1c", fontWeight: 700 }}>studying:</span> econ &amp; data science
            </p>
          </div>
        </div>

        {/* Polaroid 3: Baby Aaron playing chess */}
        <Polaroid
          style={{ left: "62%", top: "5%", width: "31%", transform: "rotate(2deg)" }}
          caption="chess, 2014"
          tape
        >
          <img src="/photo_chess.jpg" alt="Playing Chess, 2014" />
        </Polaroid>

        {/* Current Focuses (clean colons, left-aligned) */}
        <div style={{ position: "absolute", left: "6%", top: "37%", width: "48%", textAlign: "left" }}>
          <p className="hand" style={{ fontSize: "clamp(1.15rem, 2.4cqw, 1.55rem)", color: "#8a1c1c", fontWeight: 700, marginBottom: "6px" }}>
            current focuses:
          </p>
          <div className="mono" style={{ fontSize: "clamp(0.58rem, 1.1cqw, 0.72rem)", lineHeight: 1.38 }}>
            <div style={{ marginBottom: "8px" }}>
              <strong style={{ color: "var(--ink)" }}>Economic modeling:</strong> studying market dynamics &amp; quantitative incentives
            </div>
            <div style={{ marginBottom: "8px" }}>
              <strong style={{ color: "var(--ink)" }}>Data science &amp; ML:</strong> predictive statistics &amp; computing tools
            </div>
            <div>
              <strong style={{ color: "var(--ink)" }}>Systems &amp; prototypes:</strong> building tools to explore real-world questions
            </div>
          </div>
        </div>

        {/* Polaroid 4: Kitesurfing */}
        <Polaroid
          style={{ left: "62%", top: "46%", width: "31%", transform: "rotate(-1.5deg)" }}
          caption="kitesurfing"
          tape
        >
          <img src="/photo_kitesurfing.jpg" alt="Kitesurfing" style={{ objectPosition: "center 30%" }} />
        </Polaroid>

        {/* Bottom Note */}
        <p className="hand ink" style={{ left: "6%", top: "82%", width: "48%", fontSize: "clamp(0.95rem, 2cqw, 1.25rem)", color: "#243b6b" }}>
          finding good questions is always harder than finding answers.
        </p>
      </div>
    </div>
  );
}
