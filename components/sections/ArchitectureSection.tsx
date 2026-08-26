import ContentSection from "./ContentSection";

const materials = ["GLASS", "CONCRETE", "STEEL", "LIGHT"];

export default function ArchitectureSection() {
  return (
    <ContentSection
      id="architecture"
      side="right"
      tone="orange"
      eyebrow="03 — ARCHITECTURE"
      title={
        <>
          WHEN ENGINEERING
          <br />
          BECOMES <em>FORM.</em>
        </>
      }
      description="The façade wraps around the structural system. Light, material, proportion and space turn technical intelligence into architecture."
    >
      <div className="material-row">
        {materials.map((material) => (
          <span key={material}>{material}</span>
        ))}
      </div>
    </ContentSection>
  );
}
