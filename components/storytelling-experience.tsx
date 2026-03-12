"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import BuildingScene from "@/components/building-scene";
import GrowthLineChart from "@/components/charts/growth-line-chart";
import RadarSkillChart from "@/components/charts/radar-skill-chart";
import SkillBars from "@/components/charts/skill-bars";
import StageProgress from "@/components/stage-progress";
import { buildSteps, BuildStep, kpiCards } from "@/lib/site-data";

const clamp = (value: number, min = 0, max = 1) => Math.min(Math.max(value, min), max);
const SCENE_HEIGHT_VH = 820;

const stepNarrative: Record<
  BuildStep["key"],
  {
    title: string;
    subtitle: string;
    copy: string;
    quote: string;
    highlights: string[];
    panel?: "radar" | "line" | "kpi" | "none";
  }
> = {
  site: {
    title: "Site Grid",
    subtitle: "Разметка участка и архитектурный чертеж.",
    copy: "Начало пути: пустая площадка, структура мышления и ясный план роста.",
    quote: "Рост начинается с точной разметки.",
    highlights: ["Системность", "Curiosity", "Blueprint Thinking"]
  },
  foundation: {
    title: "Foundation",
    subtitle: "База, дисциплина, инженерная системность.",
    copy: "Сильный фундамент: методика анализа, SQL-мышление, аккуратная работа с источниками данных.",
    quote: "Сильный результат начинается с правильного фундамента.",
    highlights: ["SQL Core", "Data Hygiene", "Methodology"],
    panel: "kpi"
  },
  columns: {
    title: "Columns",
    subtitle: "Первые опорные проекты и практическая устойчивость.",
    copy: "Появляются первые рабочие кейсы, первые сложные решения и уверенность в реальной среде.",
    quote: "Я строила себя шаг за шагом.",
    highlights: ["Real Projects", "Iterations", "Ownership"]
  },
  beams: {
    title: "Frame Beams",
    subtitle: "Каркас навыков и техническая уверенность.",
    copy: "Навыки соединяются в систему: BI, SQL, data modeling и storytelling перестают быть разрозненными.",
    quote: "Каждый уровень опирается на основание.",
    highlights: ["BI Systems", "Data Model", "Storytelling"],
    panel: "radar"
  },
  floors: {
    title: "Floor Plates",
    subtitle: "Наращивание зрелых процессов и аналитического покрытия.",
    copy: "Больше сценариев, больше ответственности, более глубокая связка данных и бизнес-решений.",
    quote: "Рост — это архитектура, а не случайность.",
    highlights: ["Coverage", "Velocity", "Decision Support"]
  },
  facade: {
    title: "Glass Facade",
    subtitle: "Визуальная прозрачность и доверие к данным.",
    copy: "Метрики становятся видимыми и понятными для команд, а dashboards — частью ежедневных решений.",
    quote: "Хорошая аналитика делает сложное прозрачным.",
    highlights: ["Clarity", "Dashboards", "Trust"],
    panel: "line"
  },
  upper: {
    title: "Upper Levels",
    subtitle: "Сложные кейсы и стратегическая глубина.",
    copy: "На верхних уровнях — мультикомандные задачи, архитектура KPI и зрелая ответственность.",
    quote: "Чем выше уровень, тем важнее конструкция мышления.",
    highlights: ["Complex Cases", "Cross-team", "KPI Architecture"]
  },
  rooftop: {
    title: "Rooftop",
    subtitle: "Текущий уровень и следующий горизонт.",
    copy: "Сейчас я работаю как системный BI-аналитик и готова к следующему уровню сложности.",
    quote: "Следующая высота — продолжение той же архитектуры.",
    highlights: ["BI Analyst", "Strategy", "Next Level"]
  }
};

const floatingProjects = [
  { title: "Sales Pulse", summary: "Первый production dashboard для операционной команды.", stack: "SQL / BI / QA" },
  { title: "Ops Review", summary: "Еженедельная отчетность с ручного формата переведена в систему.", stack: "ETL / Metrics" }
];

const advancedCases = [
  { title: "Metric Architecture", summary: "Собрала логику KPI и ownership между командами.", meta: "12 core metrics" },
  { title: "Decision Layer", summary: "Сделала dashboards частью регулярных продуктовых решений.", meta: "74% automation" }
];

function SupportPanel({ activeKey }: { activeKey: BuildStep["key"] }) {
  switch (activeKey) {
    case "site":
      return (
        <div className="glass-panel rounded-[24px] p-4 lg:p-5">
          <p className="section-kicker">Intro Signals</p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {kpiCards.map((item) => (
              <div key={item.label} className="rounded-2xl border border-slate-300/15 bg-slate-950/30 p-3">
                <p className="text-[0.6rem] uppercase tracking-[0.12rem] text-slate-500">{item.label}</p>
                <p className="display-title mt-2 text-2xl text-slate-100">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      );
    case "foundation":
      return (
        <div className="glass-panel rounded-[24px] p-4 lg:p-5">
          <p className="section-kicker">Foundation Metrics</p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {[
              ["Study Hours", "900+"],
              ["SQL Modules", "42"],
              ["Frameworks", "6"],
              ["Discipline", "A+"]
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-slate-300/15 bg-slate-950/30 p-3">
                <p className="text-[0.6rem] uppercase tracking-[0.12rem] text-slate-500">{label}</p>
                <p className="display-title mt-2 text-2xl text-slate-100">{value}</p>
              </div>
            ))}
          </div>
        </div>
      );
    case "columns":
      return (
        <div className="glass-panel rounded-[24px] p-4 lg:p-5">
          <p className="section-kicker">First Structures</p>
          <div className="mt-4 space-y-3">
            {floatingProjects.map((project) => (
              <div key={project.title} className="rounded-2xl border border-slate-300/15 bg-slate-950/30 p-4">
                <p className="display-title text-lg text-slate-100">{project.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">{project.summary}</p>
                <p className="mt-3 text-[0.65rem] uppercase tracking-[0.12rem] text-blueprint">{project.stack}</p>
              </div>
            ))}
          </div>
        </div>
      );
    case "beams":
      return (
        <div className="glass-panel rounded-[24px] p-4 lg:p-5">
          <p className="section-kicker">Framework Signals</p>
          <div className="mt-4 rounded-2xl border border-slate-300/15 bg-slate-950/30 p-3">
            <RadarSkillChart />
          </div>
          <div className="mt-3 rounded-2xl border border-slate-300/15 bg-slate-950/30 p-3">
            <SkillBars />
          </div>
        </div>
      );
    case "floors":
      return (
        <div className="glass-panel rounded-[24px] p-4 lg:p-5">
          <p className="section-kicker">Operational Scale</p>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {[
              ["Reports", "186+"],
              ["Sync Hours", "312"],
              ["Coverage", "74%"]
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-slate-300/15 bg-slate-950/30 p-3">
                <p className="text-[0.58rem] uppercase tracking-[0.12rem] text-slate-500">{label}</p>
                <p className="display-title mt-2 text-xl text-slate-100">{value}</p>
              </div>
            ))}
          </div>
        </div>
      );
    case "facade":
      return (
        <div className="glass-panel rounded-[24px] p-4 lg:p-5">
          <p className="section-kicker">Growth Dynamics</p>
          <div className="mt-4 rounded-2xl border border-slate-300/15 bg-slate-950/30 p-3">
            <GrowthLineChart />
          </div>
        </div>
      );
    case "upper":
      return (
        <div className="glass-panel rounded-[24px] p-4 lg:p-5">
          <p className="section-kicker">Upper-Level Cases</p>
          <div className="mt-4 space-y-3">
            {advancedCases.map((item) => (
              <div key={item.title} className="rounded-2xl border border-slate-300/15 bg-slate-950/30 p-4">
                <div className="flex items-start justify-between gap-3">
                  <p className="display-title text-lg text-slate-100">{item.title}</p>
                  <p className="text-[0.62rem] uppercase tracking-[0.12rem] text-blueprint">{item.meta}</p>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">{item.summary}</p>
              </div>
            ))}
          </div>
        </div>
      );
    case "rooftop":
      return (
        <div className="glass-panel rounded-[24px] p-4 lg:p-5">
          <p className="section-kicker">Current Level</p>
          <p className="display-title mt-3 text-2xl leading-tight text-slate-100">BI-аналитик, который строит систему решений, а не просто отчеты.</p>
          <div className="mt-4 space-y-2">
            <a href="mailto:hello@example.com" className="block rounded-2xl border border-slate-300/15 bg-slate-950/30 px-4 py-3 text-sm text-slate-200 transition hover:border-blue-200/40">
              hello@example.com
            </a>
            <a href="https://t.me/username" className="block rounded-2xl border border-slate-300/15 bg-slate-950/30 px-4 py-3 text-sm text-slate-200 transition hover:border-blue-200/40">
              @username
            </a>
          </div>
        </div>
      );
    default:
      return null;
  }
}

export default function StorytellingExperience() {
  const sectionRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      if (!sectionRef.current) return;

      const section = sectionRef.current;
      const total = Math.max(section.offsetHeight - window.innerHeight, 1);
      const raw = -section.getBoundingClientRect().top / total;
      setProgress(clamp(raw));
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
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
  const copy = stepNarrative[activeStep.key];

  return (
    <section ref={sectionRef} id="story" className="relative" style={{ height: `${SCENE_HEIGHT_VH}vh` }}>
      <div id="intro" className="absolute top-0 h-px w-px" />
      {buildSteps.map((step) => (
        <div key={step.key} id={step.anchor} className="absolute left-0 h-px w-px" style={{ top: `${Math.max(step.start * 100, 1)}%` }} />
      ))}

      <div className="sticky top-0 h-screen">
        <div className="mx-auto h-full w-[min(1720px,99vw)] px-2 pb-3 pt-20 lg:px-3 lg:pb-4 lg:pt-24">
          <div className="relative h-full overflow-hidden rounded-[30px] border border-slate-200/10 bg-[#04070d] shadow-[0_30px_120px_rgba(0,0,0,0.45)]">
            <BuildingScene progress={progress} />

            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(128,166,207,0.14),transparent_22%),radial-gradient(circle_at_82%_12%,rgba(200,220,244,0.08),transparent_20%)]" />

            <div className="absolute left-3 right-3 top-3 z-30 flex items-center justify-between lg:hidden">
              <div className="glass-panel rounded-full px-3 py-2">
                <p className="text-[0.6rem] uppercase tracking-[0.14rem] text-slate-400">
                  {activeStep.short} · {activeStep.label}
                </p>
              </div>
              <div className="glass-panel rounded-full px-3 py-2">
                <p className="text-[0.6rem] uppercase tracking-[0.14rem] text-slate-400">{Math.round(progress * 100)}%</p>
              </div>
            </div>

            <StageProgress steps={buildSteps} activeKey={activeStep.key} progress={progress} stageProgress={stageProgress} />

            <div className="absolute left-3 top-20 z-30 w-[min(92vw,31rem)] lg:left-6 lg:top-6 lg:w-[31rem]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep.key}
                  initial={{ opacity: 0, y: 18, filter: "blur(10px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -12, filter: "blur(8px)" }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="glass-panel rounded-[28px] p-5 lg:p-6"
                >
                  <p className="section-kicker">
                    {activeStep.short} · {copy.title}
                  </p>
                  <h2 className="display-title mt-4 text-3xl leading-[0.96] text-slate-100 lg:text-5xl">{copy.subtitle}</h2>
                  <p className="soft-muted mt-4 max-w-xl text-sm leading-relaxed lg:text-base">{copy.copy}</p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {copy.highlights.map((item) => (
                      <span key={item} className="rounded-full border border-slate-200/15 bg-slate-900/35 px-3 py-1 text-[0.66rem] uppercase tracking-[0.12rem] text-slate-300">
                        {item}
                      </span>
                    ))}
                  </div>

                  <div className="mt-5">
                    <div className="flex items-center justify-between text-[0.64rem] uppercase tracking-[0.12rem] text-slate-500">
                      <span>Build Completion</span>
                      <span>{Math.round(progress * 100)}%</span>
                    </div>
                    <div className="mt-2 h-[2px] overflow-hidden rounded-full bg-white/10">
                      <div className="story-track-fill h-full rounded-full" style={{ width: `${progress * 100}%` }} />
                    </div>
                  </div>

                  <p className="mt-5 text-sm italic text-blueprint">{copy.quote}</p>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="absolute bottom-3 left-3 z-30 hidden w-[22rem] lg:block lg:bottom-6 lg:left-6">
              <div className="glass-panel rounded-[24px] px-4 py-3">
                <p className="section-kicker">Pinned Story Scene</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">
                  Одна scroll-driven сцена. Скролл двигает только стадию строительства, ракурс и overlay-подачу.
                </p>
              </div>
            </div>

            <div className="absolute bottom-3 right-3 z-30 w-[min(92vw,24rem)] lg:bottom-6 lg:right-6 lg:w-[24rem]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${activeStep.key}-panel`}
                  initial={{ opacity: 0, y: 18, filter: "blur(10px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: 10, filter: "blur(8px)" }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                >
                  <SupportPanel activeKey={activeStep.key} />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
