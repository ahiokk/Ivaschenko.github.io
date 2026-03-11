"use client";

import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useMemo, useRef, useState } from "react";
import BuildingScene from "@/components/building-scene";
import GrowthLineChart from "@/components/charts/growth-line-chart";
import RadarSkillChart from "@/components/charts/radar-skill-chart";
import SkillBars from "@/components/charts/skill-bars";
import StageProgress from "@/components/stage-progress";
import { buildSteps, narrativeMoments } from "@/lib/site-data";

const clamp = (value: number, min = 0, max = 1) => Math.min(Math.max(value, min), max);

export default function StorytellingExperience() {
  const sectionRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (!sectionRef.current) return;

    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        setProgress(clamp(self.progress));
      }
    });

    return () => trigger.kill();
  }, []);

  const activeStep = useMemo(() => {
    const sorted = [...buildSteps].sort((a, b) => a.start - b.start);
    let current = sorted[0];
    for (const step of sorted) {
      if (progress >= step.start) current = step;
    }
    return current;
  }, [progress]);

  const activeMoment = useMemo(() => {
    const sorted = [...narrativeMoments].sort((a, b) => a.start - b.start);
    let current = sorted[0];
    for (const moment of sorted) {
      if (progress >= moment.start) current = moment;
    }
    return current;
  }, [progress]);

  return (
    <section ref={sectionRef} id="experience" className="relative h-[760vh]">
      {buildSteps.map((step) => (
        <span key={step.key} id={step.anchor} className="absolute left-0 h-px w-px" style={{ top: `${step.start * 100}%` }} />
      ))}

      <div className="sticky top-0 h-screen overflow-hidden">
        <BuildingScene progress={progress} activeStep={activeStep} />

        <StageProgress steps={buildSteps} activeKey={activeStep.key} progress={progress} />

        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 px-4 pt-20 lg:px-10">
          <div className="mx-auto flex w-full max-w-[1500px] items-start justify-between gap-4">
            <div className="rounded-xl border border-slate-200/20 bg-slate-950/55 px-3 py-2 backdrop-blur-sm">
              <p className="text-[0.62rem] uppercase tracking-[0.14rem] text-slate-400">Build Progress</p>
              <p className="display-title mt-1 text-sm text-slate-100">{Math.round(progress * 100)}%</p>
            </div>
            <div className="rounded-xl border border-slate-200/20 bg-slate-950/55 px-3 py-2 backdrop-blur-sm">
              <p className="text-[0.62rem] uppercase tracking-[0.14rem] text-slate-400">Stage</p>
              <p className="display-title mt-1 text-sm text-slate-100">{activeStep.label}</p>
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-0 z-20 px-4 pb-6 pt-28 lg:px-10 lg:pb-10">
          <div className="mx-auto grid h-full w-full max-w-[1500px] grid-cols-12 items-end gap-4">
            <div className="col-span-12 lg:col-span-5">
              <AnimatePresence mode="wait">
                <motion.article
                  key={activeMoment.key}
                  initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                  transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
                  className="glass-panel rounded-2xl p-4 lg:p-6"
                >
                  <p className="section-kicker">{activeMoment.title}</p>
                  <h2 className="display-title mt-3 max-w-xl text-2xl leading-tight text-slate-100 lg:text-4xl">
                    {activeMoment.subtitle}
                  </h2>
                  <p className="soft-muted mt-3 max-w-xl text-sm leading-relaxed lg:text-base">{activeMoment.copy}</p>
                  <p className="mt-4 text-sm italic text-blueprint lg:text-base">{activeMoment.quote}</p>
                </motion.article>
              </AnimatePresence>
            </div>

            <div className="col-span-12 lg:col-span-4 lg:col-start-9">
              <AnimatePresence mode="wait">
                {activeMoment.key === "framework" && (
                  <motion.div
                    key="framework-panel"
                    initial={{ opacity: 0, y: 22, filter: "blur(8px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: 12, filter: "blur(6px)" }}
                    transition={{ duration: 0.55 }}
                    className="glass-panel rounded-2xl p-4"
                  >
                    <p className="blueprint-label mb-2">Framework Diagnostics</p>
                    <RadarSkillChart />
                    <div className="mt-4">
                      <SkillBars />
                    </div>
                  </motion.div>
                )}

                {activeMoment.key === "upperFloors" && (
                  <motion.div
                    key="growth-panel"
                    initial={{ opacity: 0, y: 22, filter: "blur(8px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: 12, filter: "blur(6px)" }}
                    transition={{ duration: 0.55 }}
                    className="glass-panel rounded-2xl p-4"
                  >
                    <p className="blueprint-label mb-2">Complexity / Output Growth</p>
                    <GrowthLineChart />
                  </motion.div>
                )}

                {activeMoment.key === "firstStructure" && (
                  <motion.div
                    key="kpi-panel"
                    initial={{ opacity: 0, y: 22, filter: "blur(8px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: 12, filter: "blur(6px)" }}
                    transition={{ duration: 0.55 }}
                    className="glass-panel rounded-2xl p-4"
                  >
                    <p className="blueprint-label mb-3">Execution Metrics</p>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="rounded-xl border border-slate-200/20 bg-slate-800/35 p-3">
                        <p className="text-[0.62rem] uppercase tracking-[0.12rem] text-slate-400">First Releases</p>
                        <p className="mt-2 text-xl text-slate-100">12+</p>
                      </div>
                      <div className="rounded-xl border border-slate-200/20 bg-slate-800/35 p-3">
                        <p className="text-[0.62rem] uppercase tracking-[0.12rem] text-slate-400">Dashboards</p>
                        <p className="mt-2 text-xl text-slate-100">9</p>
                      </div>
                      <div className="rounded-xl border border-slate-200/20 bg-slate-800/35 p-3">
                        <p className="text-[0.62rem] uppercase tracking-[0.12rem] text-slate-400">Iteration Cycles</p>
                        <p className="mt-2 text-xl text-slate-100">34</p>
                      </div>
                      <div className="rounded-xl border border-slate-200/20 bg-slate-800/35 p-3">
                        <p className="text-[0.62rem] uppercase tracking-[0.12rem] text-slate-400">Manual Work</p>
                        <p className="mt-2 text-xl text-slate-100">-62%</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeMoment.key === "rooftop" && (
                  <motion.div
                    key="rooftop-panel"
                    initial={{ opacity: 0, y: 22, filter: "blur(8px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: 12, filter: "blur(6px)" }}
                    transition={{ duration: 0.55 }}
                    className="glass-panel rounded-2xl p-4"
                  >
                    <p className="blueprint-label">Current Positioning</p>
                    <p className="mt-2 text-sm leading-relaxed text-slate-200">
                      BI Analyst with architectural approach to data systems, visual storytelling and scalable metric design.
                    </p>
                    <a
                      href="#contact"
                      className="pointer-events-auto mt-4 inline-flex rounded-full border border-blue-100/35 bg-blue-100/10 px-4 py-2 text-xs uppercase tracking-[0.12rem] text-blue-100 transition hover:bg-blue-100/20"
                    >
                      Contact
                    </a>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 px-4 pb-3 lg:px-10 lg:pb-5">
          <div className="mx-auto flex max-w-[1500px] items-center gap-2 overflow-x-auto">
            {buildSteps.map((step) => (
              <span
                key={step.key}
                className={`rounded-full border px-3 py-1 text-[0.62rem] uppercase tracking-[0.14rem] ${
                  activeStep.key === step.key
                    ? "border-blue-100/55 bg-blue-100/18 text-blue-100"
                    : "border-slate-400/35 bg-slate-900/45 text-slate-400"
                }`}
              >
                {step.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
