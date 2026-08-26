import Eyebrow from "@/components/ui/Eyebrow";

interface ContentSectionProps {
  id: string;
  side?: "left" | "right";
  tone: "blue" | "orange";
  eyebrow: string;
  title: React.ReactNode;
  description: string;
  children: React.ReactNode;
}

export default function ContentSection({
  id,
  side = "left",
  tone,
  eyebrow,
  title,
  description,
  children,
}: ContentSectionProps) {
  return (
    <section
      className={`content-section ${side === "right" ? "right" : ""}`}
      id={id}
    >
      <div className={`content-card ${tone}-card`}>
        <Eyebrow tone={tone}>{eyebrow}</Eyebrow>
        <h2>{title}</h2>
        <p>{description}</p>
        {children}
      </div>
    </section>
  );
}
