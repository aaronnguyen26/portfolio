import Book from "@/components/Book";
import Footer from "@/components/Footer";
import TurnLink from "@/components/TurnLink";
import ContactForm from "@/components/ContactForm";
import ContactAside from "@/components/ContactAside";

export const metadata = {
  title: "Contact & Dispatch | Aaron Nguyen",
  description: "Send a note, propose a collaboration, or connect with Aaron Nguyen.",
};

export default function Contact() {
  return (
    <Book>
      <span className="eyebrow mono rise">04 / Contact · Say hello</span>
      <h1 className="display rise d1">
        Let&rsquo;s <em>talk</em>.
      </h1>
      <p className="lede rise d2">
        Recruiter, classmate, or fellow builder? <span className="hl">Send a note</span>, I read and reply to every message.
      </p>

      <div
        className="split rise d3"
        style={{
          display: "grid",
          gridTemplateColumns: "1.45fr 1fr",
          gap: "clamp(24px, 4vw, 56px)",
          alignItems: "start",
          marginTop: 28,
        }}
      >
        {/* Left: Vintage Airmail Dispatch Form */}
        <section aria-label="Dispatch Composer">
          <ContactForm />
        </section>

        {/* Right: Direct Channels, Live Status & CV */}
        <ContactAside />
      </div>

      {/* Chapter Turn Continuity Navigation */}
      <nav aria-label="Journal chapter navigation" className="contact-chapter-turn">
        <TurnLink href="/writing" className="turn-chapter-link">
          <span aria-hidden="true">←</span>
          <span>03 / Writing · Thoughts, in ink</span>
        </TurnLink>

        <TurnLink href="/" className="turn-chapter-link">
          <span>00 / Cover · Return to beginning</span>
          <span aria-hidden="true">→</span>
        </TurnLink>
      </nav>

      <Footer />
    </Book>
  );
}
