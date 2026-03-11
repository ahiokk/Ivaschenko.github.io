"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { BuildStep } from "@/lib/site-data";

const ArchitecturalScene = dynamic(() => import("@/components/three/architectural-scene"), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-[radial-gradient(circle_at_50%_30%,rgba(140,180,220,0.2),transparent_70%)]" />
});

interface BuildingSceneProps {
  progress: number;
  activeStep: BuildStep;
}

function FallbackTower({ progress }: { progress: number }) {
  const p = useMemo(() => Math.max(0, Math.min(1, progress)), [progress]);
  const stage = (start: number, end: number) => {
    if (p <= start) return 0;
    if (p >= end) return 1;
    const t = (p - start) / (end - start);
    return t * t * (3 - 2 * t);
  };

  const foundation = stage(0.08, 0.2);
  const columns = stage(0.17, 0.34);
  const beams = stage(0.28, 0.48);
  const floors = stage(0.4, 0.64);
  const facade = stage(0.56, 0.82);
  const upper = stage(0.74, 0.91);
  const roof = stage(0.87, 1);

  return (
    <svg viewBox="0 0 900 900" className="h-full w-full">
      <defs>
        <linearGradient id="fg1" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#9dc4ea" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#3f5e7f" stopOpacity="0.06" />
        </linearGradient>
      </defs>
      <g opacity={0.35}>
        <rect x="180" y="120" width="540" height="640" fill="none" stroke="#6b86a5" strokeWidth="1.2" />
        {Array.from({ length: 13 }).map((_, i) => (
          <line key={`grid-h-${i}`} x1="180" y1={120 + i * 49} x2="720" y2={120 + i * 49} stroke="#5e7897" strokeWidth="0.7" />
        ))}
        {Array.from({ length: 10 }).map((_, i) => (
          <line key={`grid-v-${i}`} x1={180 + i * 60} y1="120" x2={180 + i * 60} y2="760" stroke="#5e7897" strokeWidth="0.7" />
        ))}
      </g>

      <rect x="260" y="690" width="380" height={50 * foundation} fill="#2f3742" />
      <rect x="300" y={650 - 40 * foundation} width="300" height={40 * foundation} fill="#3d4653" />

      {Array.from({ length: 6 }).map((_, i) => {
        const x = 310 + i * 56;
        return <rect key={`col-${i}`} x={x} y={260 + (380 - 380 * columns)} width="14" height={380 * columns} fill="#8e9eb0" />;
      })}

      {Array.from({ length: 9 }).map((_, i) => (
        <rect key={`beam-${i}`} x="300" y={630 - i * 41} width={300 * beams} height="7" fill="#7288a0" />
      ))}

      {Array.from({ length: 9 }).map((_, i) => {
        const w = 320 - i * 8;
        return <rect key={`floor-${i}`} x={290 + i * 4} y={634 - i * 41} width={w * floors} height="8" fill="#4a5d72" />;
      })}

      <rect x="306" y="300" width="286" height={344 * facade} fill="url(#fg1)" opacity={0.85} />

      {Array.from({ length: 4 }).map((_, i) => {
        const w = 242 - i * 16;
        return <rect key={`upper-${i}`} x={329 + i * 8} y={258 - i * 34} width={w * upper} height="26" fill="#6f8298" />;
      })}

      <rect x="365" y="118" width={170 * roof} height="10" fill="#c7d5e4" />
      <rect x="450" y={115 - 32 * roof} width="4" height={32 * roof} fill="#9cc3ea" />
      <circle cx="452" cy="80" r={6 * roof} fill="#b5d8fb" />
    </svg>
  );
}

export default function BuildingScene({ progress, activeStep }: BuildingSceneProps) {
  const [webglSupported, setWebglSupported] = useState(true);

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl2 = canvas.getContext("webgl2");
      const gl = canvas.getContext("webgl");
      setWebglSupported(Boolean(gl2 || gl));
    } catch {
      setWebglSupported(false);
    }
  }, []);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-none lg:rounded-[26px]">
      {webglSupported ? <ArchitecturalScene progress={progress} /> : <FallbackTower progress={progress} />}

      <div className="pointer-events-none absolute inset-0 architecture-grid opacity-25" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_82%,rgba(133,171,212,0.1),transparent_46%),radial-gradient(circle_at_82%_8%,rgba(203,223,245,0.15),transparent_32%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#060910] via-[#060910]/35 to-transparent" />

      <div className="pointer-events-none absolute left-4 top-4 rounded-xl border border-slate-200/20 bg-slate-900/55 px-3 py-2 backdrop-blur-sm">
        <p className="text-[0.62rem] uppercase tracking-[0.14rem] text-slate-400">Current Build Phase</p>
        <p className="display-title mt-1 text-sm text-slate-100">{activeStep.label}</p>
      </div>
    </div>
  );
}
