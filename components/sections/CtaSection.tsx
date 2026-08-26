import Eyebrow from "@/components/ui/Eyebrow";

export default function CtaSection() {
  return (
    <section className="cta" id="contact">
      <Eyebrow>06 — START A PROJECT</Eyebrow>

      <h2>
        LET&apos;S BUILD
        <br />
        <em>WHAT&apos;S NEXT.</em>
      </h2>

      <p>
        Bring us the difficult idea. We&apos;ll bring architecture and structure
        together.
      </p>

      <a className="cta-button" href="mailto:hello@axisform.com">
        START A CONVERSATION <span>↗</span>
      </a>
    </section>
  );
}
