"use client";

import { StageContent } from "@/lib/site-data";

interface StageProgressProps {
  stages: StageContent[];
  activeKey: StageContent["key"];
  progress: number;
}

export default function StageProgress({ stages, activeKey, progress }: StageProgressProps) {
  return (
    <aside className="pointer-events-none fixed right-3 top-1/2 z-40 hidden w-44 -translate-y-1/2 rounded-2xl px-3 py-4 lg:block">
      <div className="glass-panel rounded-2xl px-3 py-4">
        <p className="section-kicker mb-3">Build Progress</p>
        <div className="relative ml-1">
          <div className="story-track absolute left-[7px] top-1 h-[calc(100%-12px)] w-[2px] rounded-full" />
          <div
            className="story-track-fill absolute left-[7px] top-1 w-[2px] rounded-full transition-all duration-300"
            style={{ height: `calc((100% - 12px) * ${Math.max(0, Math.min(1, progress))})` }}
          />
          <ul className="space-y-3">
            {stages.map((stage) => {
              const isActive = stage.key === activeKey;
              return (
                <li key={stage.key} className="flex items-center gap-2">
                  <span
                    className={`h-4 w-4 rounded-full border transition ${
                      isActive
                        ? "border-blue-100 bg-blue-200 shadow-[0_0_14px_rgba(154,208,255,0.7)]"
                        : "border-slate-400/40 bg-slate-500/10"
                    }`}
                  />
                  <div>
                    <p className={`text-[0.6rem] uppercase tracking-[0.14rem] ${isActive ? "text-blue-100" : "text-slate-500"}`}>
                      {stage.stepLabel}
                    </p>
                    <p className={`text-[0.73rem] ${isActive ? "text-slate-100" : "text-slate-400"}`}>{stage.stageLabel}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </aside>
  );
}
