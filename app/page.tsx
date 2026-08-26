"use client";

import { useMemo, useState } from "react";
import Scene3D from "@/components/scenes/Scene3D";
import Navigation from "@/components/sections/Navigation";
import HeroSection from "@/components/sections/HeroSection";
import EngineeringSection from "@/components/sections/EngineeringSection";
import ArchitectureSection from "@/components/sections/ArchitectureSection";
import StatementSection from "@/components/sections/StatementSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import ProcessSection from "@/components/sections/ProcessSection";
import CtaSection from "@/components/sections/CtaSection";
import Footer from "@/components/sections/Footer";
import ModeSwitch from "@/components/ui/ModeSwitch";
import ScrollIndex from "@/components/ui/ScrollIndex";
import "./page.css";

type Mode = "hybrid" | "structure" | "architecture";

export default function Home() {
  const [progress, setProgress] = useState(0);
  const [mode, setMode] = useState<Mode>("hybrid");

  const phase = useMemo(() => {
    if (progress < 0.22) return "FOUNDATION";
    if (progress < 0.48) return "STRUCTURE";
    if (progress < 0.73) return "ENVELOPE";
    return "ARCHITECTURE";
  }, [progress]);

  return (
    <main className="site">
      <Scene3D mode={mode} setProgress={setProgress} />
      <Navigation phase={phase} />
      <ModeSwitch mode={mode} onChange={setMode} />
      <ScrollIndex progress={progress} />

      <HeroSection />

      <section className="spacer">
        <div className="phase-label">01 — THE IDEA</div>
      </section>

      <EngineeringSection />
      <ArchitectureSection />
      <StatementSection />
      <ProjectsSection />
      <ProcessSection />
      <CtaSection />
      <Footer />
    </main>
  );
}
