import Book from "@/components/Book";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";
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
        <ContactForm />

        <aside style={{ display: "grid", gap: 26, justifyItems: "start" }}>
          <div className="ticket mono rot-l">
            <span>Inquiries</span>
            <span>Direct dispatch</span>
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
