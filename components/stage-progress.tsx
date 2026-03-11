"use client";

import { BuildStep } from "@/lib/site-data";

interface StageProgressProps {
  steps: BuildStep[];
  activeKey: BuildStep["key"];
  progress: number;
}

export default function StageProgress({ steps, activeKey, progress }: StageProgressProps) {
  return (
    <aside className="pointer-events-none absolute right-3 top-1/2 z-30 hidden w-48 -translate-y-1/2 lg:block">
      <div className="glass-panel rounded-2xl p-3">
        <p className="section-kicker mb-3">Construction Progress</p>
        <div className="relative">
          <div className="story-track absolute left-[7px] top-1 h-[calc(100%-10px)] w-[2px] rounded-full" />
          <div
            className="story-track-fill absolute left-[7px] top-1 w-[2px] rounded-full transition-all duration-300"
            style={{ height: `calc((100% - 10px) * ${progress})` }}
          />
          <ul className="space-y-2.5">
            {steps.map((step) => {
              const active = step.key === activeKey;
              return (
                <li key={step.key} className="flex items-center gap-2">
                  <span
                    className={`h-4 w-4 rounded-full border ${
                      active
                        ? "border-blue-100 bg-blue-200 shadow-[0_0_14px_rgba(154,208,255,0.7)]"
                        : "border-slate-400/30 bg-slate-500/10"
                    }`}
                  />
                  <div>
                    <p className={`text-[0.57rem] uppercase tracking-[0.13rem] ${active ? "text-blue-100" : "text-slate-500"}`}>
                      {step.short}
                    </p>
                    <p className={`text-[0.72rem] ${active ? "text-slate-100" : "text-slate-400"}`}>{step.label}</p>
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
