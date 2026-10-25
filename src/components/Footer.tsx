import { site } from "@/data/site";
import ResumeButton from "@/components/ResumeButton";
import LLMButton from "@/components/LLMButton";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="big" aria-hidden="true">
        {site.name}
      </div>
      <div className="links mono">
        {site.links.map((l) => (
          l.label === "Resume" ? (
            <ResumeButton key={l.label}>
              {l.label}
            </ResumeButton>
          ) : (
            <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer">
              {l.label}
            </a>
          )
        ))}
        <a href="/contact">Contact</a>
        <LLMButton>llm.txt</LLMButton>
      </div>
      <p className="mono" style={{ marginTop: 22, color: "var(--ink-soft)" }}>
        {site.location} · {site.school} · {site.major} · 2026
      </p>
    </footer>
  );
}
