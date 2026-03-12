"use client";

import { BuildStep } from "@/lib/site-data";

interface StageProgressProps {
  steps: BuildStep[];
  activeKey: BuildStep["key"];
  progress: number;
  stageProgress: number;
}

export default function StageProgress({ steps, activeKey, progress, stageProgress }: StageProgressProps) {
  const activeStep = steps.find((step) => step.key === activeKey) ?? steps[0];

  return (
    <aside className="pointer-events-none absolute right-5 top-5 z-30 hidden w-56 lg:block">
      <div className="glass-panel rounded-[24px] p-4">
        <p className="section-kicker">Construction Progress</p>

        <div className="mt-3">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[0.68rem] uppercase tracking-[0.13rem] text-slate-400">Active Phase</p>
              <p className="mt-1 text-sm text-slate-100">{activeStep.label}</p>
            </div>
            <p className="display-title text-2xl text-slate-100">{Math.round(progress * 100)}%</p>
          </div>

          <div className="mt-3 h-[2px] overflow-hidden rounded-full bg-white/10">
            <div className="story-track-fill h-full rounded-full" style={{ width: `${progress * 100}%` }} />
          </div>

          <p className="mt-2 text-[0.68rem] uppercase tracking-[0.12rem] text-slate-500">
            {Math.round(stageProgress * 100)}% of current phase
          </p>
        </div>

        <div className="relative mt-5">
          <div className="story-track absolute left-[7px] top-1 h-[calc(100%-10px)] w-[2px] rounded-full" />
          <div
            className="story-track-fill absolute left-[7px] top-1 w-[2px] rounded-full transition-all duration-300"
            style={{ height: `calc((100% - 10px) * ${progress})` }}
          />

          <ul className="space-y-2.5">
            {steps.map((step) => {
              const active = step.key === activeKey;
              const completed = progress >= step.start;

              return (
                <li key={step.key} className="flex items-center gap-2">
                  <span
                    className={`h-4 w-4 rounded-full border ${
                      active
                        ? "border-blue-100 bg-blue-200 shadow-[0_0_14px_rgba(154,208,255,0.7)]"
                        : completed
                          ? "border-blue-200/40 bg-blue-200/20"
                          : "border-slate-400/30 bg-slate-500/10"
                    }`}
                  />
                  <div>
                    <p className={`text-[0.57rem] uppercase tracking-[0.13rem] ${active ? "text-blue-100" : "text-slate-500"}`}>
                      {step.short}
                    </p>
                    <p className={`text-[0.72rem] ${active ? "text-slate-100" : completed ? "text-slate-300" : "text-slate-400"}`}>
                      {step.label}
                    </p>
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
