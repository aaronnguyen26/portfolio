import Book from "@/components/Book";
import Footer from "@/components/Footer";
import { site } from "@/data/site";

export const metadata = { title: "Contact — field journal" };

export default function Contact() {
  return (
    <Book>
      <span className="eyebrow mono rise">04 / Contact · Say hello</span>
      <h1 className="display rise d1">
        Let&rsquo;s <em>talk</em>.
      </h1>
      <p className="lede rise d2">
        Recruiter, classmate, or just curious? <span className="hl">Send a note</span>, I read everything.
      </p>

      <div className="split" style={{ alignItems: "start", marginTop: 26 }}>
        <form className="form" action={`mailto:${site.email}`} method="post" encType="text/plain">
          <label>
            <span className="mono">Your name</span>
            <input name="name" type="text" placeholder="Ada Lovelace" />
          </label>
          <label>
            <span className="mono">Your email</span>
            <input name="email" type="email" placeholder="ada@example.com" />
          </label>
          <label>
            <span className="mono">Message</span>
            <textarea name="message" rows={5} placeholder="Dear Aaron…" />
          </label>
          <button type="submit" className="btn solid mono" style={{ justifySelf: "start", cursor: "pointer" }}>
            Send note →
          </button>
        </form>

        <aside style={{ display: "grid", gap: 26, justifyItems: "start" }}>
          <div className="ticket mono rot-l">
            <span>Email</span>
            <a href={`mailto:${site.email}`}>{site.email}</a>
          </div>
          <div className="note hand rot-r">
            usually reply within a day or two!
          </div>
          <ul className="mono" style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 10 }}>
            {site.links.map((l) => (
              <li key={l.label}>
                <a href={l.href} target="_blank" rel="noopener noreferrer" className="circle">
                  {l.label} ↗
                </a>
              </li>
            ))}
          </ul>
        </aside>
      </div>
      <Footer />
    </Book>
  );
}
