import Book from "@/components/Book";
import Polaroid from "@/components/Polaroid";
import { timeline, toolkits } from "@/data/site";

export const metadata = { title: "About — Aaron Nguyen" };

export default function About() {
  return (
    <Book>
      <span className="eyebrow mono rise">01 / About · The story so far</span>
      <h1 className="display rise d1">
        A little <em>backstory</em>.
      </h1>

      <div
        className="split"
        style={{
          display: "grid",
          gridTemplateColumns: "1.35fr 1fr",
          gap: "clamp(28px, 4vw, 56px)",
          alignItems: "start",
          marginTop: 20,
        }}
      >
        <section>
          <p className="body dropcap" style={{ fontSize: "1.15rem", lineHeight: 1.82 }}>
            I am currently at the University of Southern California (USC), studying Economics &amp; Data Science.
            I spend my time building predictive statistics pipelines, modeling economic systems and market dynamics,
            and turning complex quantitative questions into clean, interactive tools and software prototypes. To me,
            code and empirical data are lenses to explore the world—curious about how incentives shape decisions and
            why finding the right question is always harder than finding the answer.
          </p>
        </section>

        <aside style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20, paddingTop: 4 }}>
          <Polaroid tape caption="that's me" className="rot-r" style={{ width: "100%", maxWidth: 280, margin: 0 }}>
            <img
              src="/photo_thats_me.jpg"
              alt="Aaron Nguyen"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center 38%",
                display: "block",
              }}
            />
          </Polaroid>

          <div
            className="note hand rot-l"
            style={{
              maxWidth: 260,
              fontSize: "1.2rem",
              lineHeight: 1.35,
              background: "#fff1a0",
              boxShadow: "0 8px 16px -8px rgba(0,0,0,.35)",
              padding: "14px 16px 16px",
            }}
          >
            <div
              className="mono"
              style={{
                fontSize: "0.72rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--cardinal)",
                fontWeight: 700,
                marginBottom: 6,
              }}
            >
              Currently exploring
            </div>
            Market incentives, quantitative microdata, and hunting down the best coffee in LA.
          </div>

          <div
            className="mono"
            style={{
              border: "1.5px dashed var(--cardinal)",
              padding: "6px 14px",
              fontSize: "0.74rem",
              letterSpacing: "0.08em",
              color: "var(--cardinal)",
              background: "rgba(138, 28, 28, 0.05)",
              borderRadius: 3,
              fontWeight: 600,
              textAlign: "center",
            }}
          >
            USC TROJAN • CLASS OF 2028 • ECON &amp; DS
          </div>
        </aside>
      </div>

      <h2 className="title" style={{ marginTop: 48 }}>
        <em>Timeline</em> of chapters
      </h2>
      <ol className="timeline">
        {timeline.map((t) => (
          <li key={t.year}>
            <div
              className="mono"
              style={{
                display: "flex",
                gap: 12,
                alignItems: "center",
                fontSize: "0.82rem",
                letterSpacing: "0.06em",
                marginBottom: 4,
              }}
            >
              <span style={{ color: "var(--cardinal)", fontWeight: 700 }}>{t.year}</span>
              {"place" in t && t.place && (
                <span style={{ color: "var(--ink-soft)", opacity: 0.85 }}>{t.place}</span>
              )}
            </div>
            <h3 style={{ margin: "4px 0 6px", fontWeight: 600, fontSize: "1.45rem" }}>{t.title}</h3>
            <p className="body" style={{ margin: 0, fontSize: "1rem", lineHeight: 1.65 }}>
              {t.text}
            </p>
          </li>
        ))}
      </ol>

      <h2 className="title" style={{ marginTop: 44 }}>
        Tools in my <em>pencil case</em>
      </h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 18,
          marginTop: 16,
        }}
      >
        {toolkits.map((kit) => (
          <div
            key={kit.n}
            style={{
              background: "rgba(255, 253, 248, 0.9)",
              border: "1.5px solid var(--rule)",
              borderRadius: 6,
              padding: "18px 20px 20px",
              boxShadow: "0 4px 12px -4px rgba(44, 24, 16, 0.08)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                borderBottom: "1px dashed var(--rule)",
                paddingBottom: 8,
                marginBottom: 14,
              }}
            >
              <h3 style={{ margin: 0, fontSize: "1.08rem", fontWeight: 600, color: "var(--ink)" }}>
                {kit.category}
              </h3>
              <span className="mono" style={{ fontSize: "0.78rem", color: "var(--cardinal)", fontWeight: 700 }}>
                {kit.n}
              </span>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 8px" }}>
              {kit.tools.map((tool) => (
                <span
                  key={tool}
                  className="mono"
                  style={{
                    display: "inline-block",
                    padding: "3px 10px",
                    background: "rgba(238, 220, 160, 0.25)",
                    border: "1px solid rgba(44, 24, 16, 0.25)",
                    borderRadius: 99,
                    fontSize: "0.82rem",
                    color: "var(--ink)",
                  }}
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Field notes: beyond the desk */}
      <h2 className="title" style={{ marginTop: 48 }}>
        Field notes: <em>beyond the desk</em>
      </h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 18,
          marginTop: 16,
        }}
      >
        <div
          style={{
            background: "rgba(255, 253, 248, 0.9)",
            border: "1.5px solid var(--rule)",
            borderRadius: 6,
            padding: "18px 20px 20px",
            boxShadow: "0 4px 12px -4px rgba(44, 24, 16, 0.08)",
          }}
        >
          <div className="mono" style={{ fontSize: "0.78rem", color: "var(--cardinal)", fontWeight: 700, marginBottom: 6 }}>
            DISCIPLINE // 01
          </div>
          <h3 style={{ margin: "0 0 8px", fontSize: "1.15rem", fontWeight: 600 }}>Tactics &amp; The Pitch</h3>
          <p className="body" style={{ fontSize: "0.94rem", lineHeight: 1.55, margin: "0 0 12px" }}>
            An avid football fan with a personal collection of 11+ match jerseys. Fascinated by positional pressing, tactical setups, and spatial coordination under pressure.
          </p>
          <span className="mono" style={{ fontSize: "0.78rem", color: "var(--ink-soft)", borderTop: "1px dashed var(--rule)", paddingTop: 6, display: "block" }}>
            ↳ Messi, Modrić &amp; Ødegaard
          </span>
        </div>

        <div
          style={{
            background: "rgba(255, 253, 248, 0.9)",
            border: "1.5px solid var(--rule)",
            borderRadius: 6,
            padding: "18px 20px 20px",
            boxShadow: "0 4px 12px -4px rgba(44, 24, 16, 0.08)",
          }}
        >
          <div className="mono" style={{ fontSize: "0.78rem", color: "var(--cardinal)", fontWeight: 700, marginBottom: 6 }}>
            DISCIPLINE // 02
          </div>
          <h3 style={{ margin: "0 0 8px", fontSize: "1.15rem", fontWeight: 600 }}>Wind &amp; Water</h3>
          <p className="body" style={{ fontSize: "0.94rem", lineHeight: 1.55, margin: "0 0 12px" }}>
            Kitesurfing whenever the wind picks up along California beaches or Southeast Asian coastlines. The best way to reset focus away from backlit monitors.
          </p>
          <span className="mono" style={{ fontSize: "0.78rem", color: "var(--ink-soft)", borderTop: "1px dashed var(--rule)", paddingTop: 6, display: "block" }}>
            ↳ high wind, clear horizon
          </span>
        </div>

        <div
          style={{
            background: "rgba(255, 253, 248, 0.9)",
            border: "1.5px solid var(--rule)",
            borderRadius: 6,
            padding: "18px 20px 20px",
            boxShadow: "0 4px 12px -4px rgba(44, 24, 16, 0.08)",
          }}
        >
          <div className="mono" style={{ fontSize: "0.78rem", color: "var(--cardinal)", fontWeight: 700, marginBottom: 6 }}>
            DISCIPLINE // 03
          </div>
          <h3 style={{ margin: "0 0 8px", fontSize: "1.15rem", fontWeight: 600 }}>Live Acoustic Sessions</h3>
          <p className="body" style={{ fontSize: "0.94rem", lineHeight: 1.55, margin: "0 0 12px" }}>
            Unwinding at cozy live acoustic music sets in Saigon and LA coffeehouses. Good sound, warm lighting, and a physical notebook in hand.
          </p>
          <span className="mono" style={{ fontSize: "0.78rem", color: "var(--ink-soft)", borderTop: "1px dashed var(--rule)", paddingTop: 6, display: "block" }}>
            ↳ coffee, warm chords &amp; ink
          </span>
        </div>
      </div>

      {/* Guiding Principles */}
      <div
        style={{
          marginTop: 24,
          background: "rgba(238, 220, 160, 0.28)",
          border: "1.5px solid var(--gold)",
          borderRadius: 6,
          padding: "18px 22px",
        }}
      >
        <div className="mono" style={{ fontSize: "0.76rem", color: "var(--cardinal)", fontWeight: 700, letterSpacing: "0.08em", marginBottom: 10 }}>
          NOTEBOOK OBSERVATIONS // GUIDING PRINCIPLES
        </div>
        <div style={{ display: "grid", gap: 8, fontSize: "0.98rem", lineHeight: 1.6 }}>
          <p style={{ margin: 0 }}>
            <strong>01. Models are maps, not the terrain:</strong> Always test theoretical assumptions against messy, empirical human reality.
          </p>
          <p style={{ margin: 0 }}>
            <strong>02. Finding good questions beats easy answers:</strong> The most valuable breakthrough usually starts with framing the problem right.
          </p>
          <p style={{ margin: 0 }}>
            <strong>03. Build the prototype early:</strong> Test intuition with code and data before the curiosity fades.
          </p>
        </div>
      </div>
    </Book>
  );
}
