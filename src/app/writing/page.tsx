import Book from "@/components/Book";
import { essays } from "@/data/site";

export const metadata = { title: "Writing — field journal" };

export default function Writing() {
  const [featured, ...rest] = essays;
  return (
    <Book>
      <span className="eyebrow mono rise">03 / Writing · Notes &amp; reflections</span>
      <h1 className="display rise d1">
        Thoughts, <em>in ink</em>.
      </h1>

      <article style={{ margin: "30px 0 10px", maxWidth: 680 }}>
        <span className="mono" style={{ color: "var(--cardinal)" }}>
          Featured · {featured.date} · {featured.mins} min read
        </span>
        <h2 className="title" style={{ fontSize: "clamp(2rem, 5vw, 3.4rem)", marginTop: 10 }}>
          <em>{featured.title}</em>
        </h2>
        <p className="body dropcap">
          {featured.excerpt} Placeholder text continues here. This is where the opening lines of your best
          essay would appear, set in the same serif as the rest of the journal with a cardinal drop cap.
        </p>
        <a href="#" className="btn mono">Read entry →</a>
      </article>

      <h2 className="title" style={{ marginTop: 46 }}>More <em>entries</em></h2>
      <div>
        {rest.map((e, i) => (
          <a key={e.title} href="#" className="entry">
            <div className="big-n">{String(i + 2).padStart(2, "0")}</div>
            <div>
              <span className="mono" style={{ color: "var(--cardinal)" }}>
                {e.date} · {e.mins} min
              </span>
              <h3>{e.title}</h3>
              <p className="body" style={{ margin: 0 }}>{e.excerpt}</p>
            </div>
          </a>
        ))}
      </div>
    </Book>
  );
}
