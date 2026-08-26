import Eyebrow from "@/components/ui/Eyebrow";

export default function HeroSection() {
  return (
    <section className="hero panel">
      <Eyebrow line>ARCHITECTURE × STRUCTURAL ENGINEERING</Eyebrow>

      <h1>
        ENGINEER
        <br />
        <em>THE VISION.</em>
      </h1>

      <p>
        We turn architectural ambition into buildings that stand, perform and
        endure.
      </p>

      <div className="scroll-hint">
        <span>↓</span> SCROLL TO BUILD
      </div>

      <div className="coordinates">
        03°14' / 07°42'
        <br />
        STRUCTURAL GRID / A
      </div>
    </section>
  );
}
