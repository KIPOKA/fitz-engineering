interface EyebrowProps {
  children: React.ReactNode;
  tone?: "default" | "blue" | "orange";
  line?: boolean;
}

export default function Eyebrow({
  children,
  tone = "default",
  line = false,
}: EyebrowProps) {
  return (
    <div className={`eyebrow ${tone !== "default" ? tone : ""}`}>
      {line && <span />}
      {children}
    </div>
  );
}
