import Book from "@/components/Book";
import Spread from "@/components/Spread";
import TurnLink from "@/components/TurnLink";
import { site } from "@/data/site";

export default function Home() {
  return (
    <Book>
      <section className="hero">
        <h1 className="display rise">{site.name}</h1>
        <p className="lede rise d1">
          student &amp; <span className="hl">curious builder</span>, capturing the{" "}
          <span className="hl">stories &amp; systems</span> behind what I create.
        </p>

        <div className="rise d2">
          <Spread />
        </div>

        <div className="rise d3" style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", marginTop: 30 }}>
          <TurnLink href="/projects" className="btn solid mono">View projects &rarr;</TurnLink>
          <TurnLink href="/about" className="btn mono">Read my story</TurnLink>
        </div>
      </section>

      <section className="explore" style={{ marginTop: 52 }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 16 }}>
          <h2>Recent Explorations</h2>
          <span className="mono" style={{ fontSize: "0.75rem", color: "var(--ink-soft)" }}>
            CHAPTER 02 &bull; PROJECT INDEX [DECIDING]
          </span>
        </div>

        <div className="row" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 18 }}>
          <div style={{ background: "var(--paper-2)", border: "1px solid rgba(31, 26, 20, 0.12)", borderRadius: 6, padding: "18px 20px" }}>
            <span className="mono" style={{ color: "var(--cardinal)", fontWeight: 600, fontSize: "0.72rem", display: "block" }}>
              EXPLORATION 01
            </span>
            <div style={{ fontSize: "0.98rem", fontWeight: 600, color: "var(--ink)", marginTop: 2 }}>
              [ Project Alpha &mdash; Quantitative macro simulator ]
            </div>
            <p className="mono" style={{ marginTop: 8, color: "var(--ink-soft)", fontSize: "0.69rem", lineHeight: 1.4 }}>
              Placeholder project &bull; Exploring incentive models and market agent dynamics.
            </p>
          </div>

          <div style={{ background: "var(--paper-2)", border: "1px solid rgba(31, 26, 20, 0.12)", borderRadius: 6, padding: "18px 20px" }}>
            <span className="mono" style={{ color: "var(--cardinal)", fontWeight: 600, fontSize: "0.72rem", display: "block" }}>
              EXPLORATION 02
            </span>
            <div style={{ fontSize: "0.98rem", fontWeight: 600, color: "var(--ink)", marginTop: 2 }}>
              [ Project Beta &mdash; Network analysis of market contagion ]
            </div>
            <p className="mono" style={{ marginTop: 8, color: "var(--ink-soft)", fontSize: "0.69rem", lineHeight: 1.4 }}>
              Placeholder project &bull; Graph theory applied to financial network cascades.
            </p>
          </div>

          <div style={{ background: "var(--paper-2)", border: "1px solid rgba(31, 26, 20, 0.12)", borderRadius: 6, padding: "18px 20px" }}>
            <span className="mono" style={{ color: "var(--cardinal)", fontWeight: 600, fontSize: "0.72rem", display: "block" }}>
              EXPLORATION 03
            </span>
            <div style={{ fontSize: "0.98rem", fontWeight: 600, color: "var(--ink)", marginTop: 2 }}>
              [ Project Gamma &mdash; Machine learning pipelines for microdata ]
            </div>
            <p className="mono" style={{ marginTop: 8, color: "var(--ink-soft)", fontSize: "0.69rem", lineHeight: 1.4 }}>
              Placeholder project &bull; Empirical pipelines predicting consumer behavior shifts.
            </p>
          </div>
        </div>
      </section>
    </Book>
  );
}
