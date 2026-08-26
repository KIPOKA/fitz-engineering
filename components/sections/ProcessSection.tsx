import Eyebrow from "@/components/ui/Eyebrow";

const steps = [
  "CONCEPT",
  "ANALYSIS",
  "STRUCTURE",
  "ARCHITECTURE",
  "COORDINATION",
  "DELIVERY",
];

export default function ProcessSection() {
  return (
    <section className="process">
      <Eyebrow>05 — OUR METHOD</Eyebrow>

      <h2>
        ONE PROCESS.
        <br />
        <em>NO DIVISION.</em>
      </h2>

      <div className="process-line">
        {steps.map((step, index) => (
          <div key={step}>
            <b>0{index + 1}</b>
            <span>{step}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
