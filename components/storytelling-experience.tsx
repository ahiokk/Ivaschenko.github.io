"use client";

import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import BuildingScene from "@/components/building-scene";
import { buildSteps, BuildStep } from "@/lib/site-data";

const clamp = (value: number, min = 0, max = 1) => Math.min(Math.max(value, min), max);

const SCENE_HEIGHT_VH = 840;

const stageContent: Record<
  BuildStep["key"],
  {
    nav: string;
    eyebrow: string;
    title: string;
    copy: string;
    bullets: string[];
    supportTitle: string;
    supportItems: Array<{ label: string; value: string }>;
  }
> = {
  site: {
    nav: "Site",
    eyebrow: "01 / Site & Foundation",
    title: "Основа пути intern BI analyst.",
    copy: "Старт с базы: Excel, SQL fundamentals, внимательность к данным и привычка мыслить структурно.",
    bullets: ["Excel -> SQL", "Analytical discipline", "Data attention"],
    supportTitle: "Base Layer",
    supportItems: [
      { label: "Study Focus", value: "SQL / Excel" },
      { label: "Practice Hours", value: "120h" }
    ]
  },
  foundation: {
    nav: "Foundation",
    eyebrow: "02 / First Structure",
    title: "Первые запросы и первые реальные задачи.",
    copy: "Появляются рабочие выгрузки, разбор источников и первые запросы от команды, где уже нельзя ошибаться в цифрах.",
    bullets: ["First queries", "Source mapping", "Report hygiene"],
    supportTitle: "Task Signals",
    supportItems: [
      { label: "SQL Tasks", value: "40+" },
      { label: "Checks", value: "25" }
    ]
  },
  columns: {
    nav: "Structure",
    eyebrow: "03 / Framework",
    title: "Каркас навыков и уверенность в данных.",
    copy: "Метрики, data quality и понимание структуры отчетности складываются в стабильный аналитический каркас.",
    bullets: ["Metrics logic", "Data quality", "Reporting structure"],
    supportTitle: "Framework",
    supportItems: [
      { label: "Core Metrics", value: "14" },
      { label: "BI Stack", value: "2 tools" }
    ]
  },
  beams: {
    nav: "Frame",
    eyebrow: "04 / Floor Systems",
    title: "Первые dashboard-системы.",
    copy: "От единичных отчетов к интерфейсам, где важны фильтры, логика, визуализация и интерпретация цифр.",
    bullets: ["Dashboards", "Filters", "Visual logic"],
    supportTitle: "Systems",
    supportItems: [
      { label: "Dashboards", value: "6" },
      { label: "Filters", value: "18" }
    ]
  },
  floors: {
    nav: "Systems",
    eyebrow: "05 / BI Layer",
    title: "Системность и повторяемость.",
    copy: "Отчеты становятся устойчивыми процессами. Появляется автоматизация, понятные шаблоны и предсказуемый BI-flow.",
    bullets: ["Automation", "Repeatability", "Stable delivery"],
    supportTitle: "Operations",
    supportItems: [
      { label: "Reports", value: "186+" },
      { label: "Automation", value: "74%" }
    ]
  },
  facade: {
    nav: "Facade",
    eyebrow: "06 / Facade",
    title: "Данные становятся понятными для бизнеса.",
    copy: "Здесь важна уже не только точность, но и доверие: stakeholder communication, storytelling through data и уверенная интерпретация.",
    bullets: ["Stakeholders", "Storytelling", "Prioritization"],
    supportTitle: "Communication",
    supportItems: [
      { label: "Sync Hours", value: "312h" },
      { label: "Narratives", value: "12" }
    ]
  },
  upper: {
    nav: "Upper",
    eyebrow: "07 / Upper Levels",
    title: "Самостоятельность и ownership.",
    copy: "Появляются более зрелые задачи: KPI, ответственность за блоки аналитики и уверенное решение BI-вопросов без постоянного контроля.",
    bullets: ["Ownership", "KPI work", "Independent delivery"],
    supportTitle: "Ownership",
    supportItems: [
      { label: "Owned Areas", value: "2" },
      { label: "Recurring BI", value: "5 flows" }
    ]
  },
  rooftop: {
    nav: "Rooftop",
    eyebrow: "08 / Junior Ready",
    title: "Уровень Junior BI Analyst.",
    copy: "Финал этого roadmap: уверенная работа с SQL, BI и метриками, готовность к junior-level задачам и самостоятельной аналитике.",
    bullets: ["SQL confidence", "BI delivery", "Junior-ready"],
    supportTitle: "Current Position",
    supportItems: [
      { label: "Role", value: "Junior Ready" },
      { label: "Focus", value: "SQL / BI / Metrics" }
    ]
  }
};

function CompactProgress({
  progress,
  activeKey
}: {
  progress: number;
  activeKey: BuildStep["key"];
}) {
  return (
    <div className="flex items-center gap-4">
      <div className="h-24 w-[2px] rounded-full bg-white/10">
        <div className="story-track-fill w-full rounded-full" style={{ height: `${progress * 100}%` }} />
      </div>
      <div className="space-y-1">
        {buildSteps.map((step) => {
          const active = step.key === activeKey;
          return (
            <div key={step.key} className="flex items-center gap-2">
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  active ? "bg-blue-200 shadow-[0_0_12px_rgba(154,208,255,0.75)]" : "bg-slate-500/30"
                }`}
              />
              <span className={`text-[0.58rem] uppercase tracking-[0.14rem] ${active ? "text-blue-100" : "text-slate-500"}`}>
                {step.short}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function StorytellingExperience() {
  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useLayoutEffect(() => {
    if (!sectionRef.current || !viewportRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    const viewport = viewportRef.current;

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      pin: viewport,
      pinSpacing: false,
      scrub: 0.9,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        setProgress(clamp(self.progress));
      }
    });

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);

    return () => {
      window.removeEventListener("load", refresh);
      trigger.kill();
    };
  }, []);

  const activeStep = useMemo(() => {
    let current = buildSteps[0];
    for (const step of buildSteps) {
      if (progress >= step.start) current = step;
    }
    return current;
  }, [progress]);

  const currentIndex = useMemo(() => buildSteps.findIndex((step) => step.key === activeStep.key), [activeStep.key]);
  const nextStart = buildSteps[currentIndex + 1]?.start ?? 1;
  const stageProgress = clamp((progress - activeStep.start) / Math.max(nextStart - activeStep.start, 0.0001));
  const sceneOrbitX = Math.sin(progress * Math.PI * 0.9) * 14;
  const sceneScale = 1 - progress * 0.025;
  const copy = stageContent[activeStep.key];

  return (
    <section ref={sectionRef} id="story" className="relative" style={{ height: `${SCENE_HEIGHT_VH}vh` }}>
      <div id="intro" className="absolute top-0 h-px w-px" />
      {buildSteps.map((step) => (
        <div key={step.key} id={step.anchor} className="absolute left-0 h-px w-px" style={{ top: `${Math.max(step.start * 100, 1)}%` }} />
      ))}

      <div ref={viewportRef} className="h-screen overflow-hidden">
        <div className="mx-auto h-full w-[min(1760px,100vw)] px-2 pb-2 pt-20 lg:px-3 lg:pb-3 lg:pt-24">
          <div className="relative h-full overflow-hidden rounded-[30px] border border-slate-200/10 bg-[#04070d] shadow-[0_30px_120px_rgba(0,0,0,0.48)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(128,166,207,0.14),transparent_22%),radial-gradient(circle_at_82%_12%,rgba(200,220,244,0.08),transparent_20%)]" />

            <div className="absolute inset-y-0 left-0 right-0 lg:right-[21rem]">
              <motion.div
                className="h-full w-full will-change-transform"
                animate={{ x: sceneOrbitX, scale: sceneScale }}
                transition={{ type: "spring", stiffness: 70, damping: 24, mass: 0.9 }}
              >
                <BuildingScene progress={progress} />
              </motion.div>

              <div className="pointer-events-none absolute left-5 top-5 hidden lg:block">
                <div className="glass-panel rounded-[22px] px-4 py-3">
                  <p className="section-kicker">Intern / Junior</p>
                  <p className="mt-2 max-w-[15rem] text-sm leading-relaxed text-slate-300">
                    Одна premium scroll-scene, где башня строится как roadmap роста в BI.
                  </p>
                </div>
              </div>
            </div>

            <aside className="absolute inset-y-0 right-0 z-30 w-full max-w-[21rem] border-l border-slate-200/10 bg-[linear-gradient(180deg,rgba(7,11,18,0.72)_0%,rgba(4,7,13,0.86)_100%)] backdrop-blur-md">
              <div className="flex h-full flex-col justify-between px-4 pb-5 pt-5 lg:px-5 lg:pb-6">
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="section-kicker">{copy.eyebrow}</p>
                      <h2 className="display-title mt-3 text-3xl leading-[0.98] text-slate-100">{copy.title}</h2>
                    </div>
                    <CompactProgress progress={progress} activeKey={activeStep.key} />
                  </div>

                  <p className="mt-5 text-sm leading-relaxed text-slate-300">{copy.copy}</p>

                  <div className="mt-5 space-y-2">
                    {copy.bullets.map((item) => (
                      <div key={item} className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-200" />
                        <span className="text-sm text-slate-300">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeStep.key}
                    initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: 8, filter: "blur(8px)" }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="glass-panel rounded-[26px] p-4"
                  >
                    <p className="text-[0.62rem] uppercase tracking-[0.14rem] text-slate-500">{copy.supportTitle}</p>
                    <div className="mt-4 space-y-3">
                      {copy.supportItems.map((item) => (
                        <div key={item.label} className="flex items-end justify-between border-b border-slate-200/8 pb-2">
                          <span className="text-[0.7rem] uppercase tracking-[0.12rem] text-slate-500">{item.label}</span>
                          <span className="display-title text-lg text-slate-100">{item.value}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 h-[2px] overflow-hidden rounded-full bg-white/10">
                      <div className="story-track-fill h-full rounded-full" style={{ width: `${(activeStep.start + stageProgress * (nextStart - activeStep.start)) * 100}%` }} />
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </aside>

            <div className="absolute left-3 right-3 top-3 z-30 flex items-center justify-between lg:hidden">
              <div className="glass-panel rounded-full px-3 py-2">
                <p className="text-[0.58rem] uppercase tracking-[0.14rem] text-slate-400">{copy.nav}</p>
              </div>
              <div className="glass-panel rounded-full px-3 py-2">
                <p className="text-[0.58rem] uppercase tracking-[0.14rem] text-slate-400">{Math.round(progress * 100)}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
