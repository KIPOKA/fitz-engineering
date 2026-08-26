import ContentSection from "./ContentSection";

const metrics = [
  ["LOAD", "PATH"],
  ["LATERAL", "STABILITY"],
  ["MATERIAL", "INTELLIGENCE"],
];

export default function EngineeringSection() {
  return (
    <ContentSection
      id="engineering"
      tone="blue"
      eyebrow="02 — STRUCTURAL ENGINEERING"
      title={
        <>
          THE BUILDING
          <br />
          HAS A <em>SKELETON.</em>
        </>
      }
      description="Columns. Beams. Slabs. Core. Foundation. Every visible gesture begins with an invisible logic of forces."
    >
      <div className="metrics">
        {metrics.map(([title, label]) => (
          <div key={title}>
            <b>{title}</b>
            <span>{label}</span>
          </div>
        ))}
      </div>
    </ContentSection>
  );
}
