import { site } from "@/data/site";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="big" aria-hidden="true">
        {site.name}
      </div>
      <div className="links mono">
        {site.links.map((l) => (
          <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer">
            {l.label}
          </a>
        ))}
        <a href={`mailto:${site.email}`}>Email</a>
      </div>
      <p className="mono" style={{ marginTop: 22, color: "var(--ink-soft)" }}>
        {site.location} · placeholder content · 2026
      </p>
    </footer>
  );
}
