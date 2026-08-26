type Mode = "hybrid" | "structure" | "architecture";

interface ModeSwitchProps {
  mode: Mode;
  onChange: (mode: Mode) => void;
}

const modes: Mode[] = ["structure", "hybrid", "architecture"];

export default function ModeSwitch({ mode, onChange }: ModeSwitchProps) {
  return (
    <div className="mode-switch">
      {modes.map((item) => (
        <button
          key={item}
          className={mode === item ? "active" : ""}
          onClick={() => onChange(item)}
        >
          {item}
        </button>
      ))}
    </div>
  );
}
