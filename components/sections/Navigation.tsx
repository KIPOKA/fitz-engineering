import Logo from "@/components/ui/Logo";

interface NavigationProps {
  phase: string;
}

export default function Navigation({ phase }: NavigationProps) {
  return (
    <header className="nav">
      <Logo />

      <nav>
        <a href="#work">Projects</a>
        <a href="#engineering">Engineering</a>
        <a href="#architecture">Architecture</a>
        <a href="#contact">Contact</a>
      </nav>

      <div className="status">
        <i /> {phase}
      </div>
    </header>
  );
}
