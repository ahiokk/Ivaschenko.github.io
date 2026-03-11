"use client";

import dynamic from "next/dynamic";
import { BuildStep } from "@/lib/site-data";

const ArchitecturalScene = dynamic(() => import("@/components/three/architectural-scene"), {
  ssr: false
});

interface BuildingSceneProps {
  progress: number;
  activeStep: BuildStep;
}

export default function BuildingScene({ progress, activeStep }: BuildingSceneProps) {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-none lg:rounded-[26px]">
      <ArchitecturalScene progress={progress} />

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
