"use client";

import { useRef } from "react";
import { useThreeScene } from "@/hooks/useThreeScene";

type Mode = "hybrid" | "structure" | "architecture";

interface Scene3DProps {
  mode: Mode;
  setProgress: (progress: number) => void;
}

export default function Scene3D({ mode, setProgress }: Scene3DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useThreeScene(canvasRef, mode, setProgress);

  return <canvas ref={canvasRef} className="scene" />;
}
