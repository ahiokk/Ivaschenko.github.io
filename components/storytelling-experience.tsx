"use client";

import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import BuildingScene from "@/components/building-scene";
import GrowthLineChart from "@/components/charts/growth-line-chart";
import RadarSkillChart from "@/components/charts/radar-skill-chart";
import SkillBars from "@/components/charts/skill-bars";
import { buildSteps, BuildStep, kpiCards } from "@/lib/site-data";

const clamp = (value: number, min = 0, max = 1) => Math.min(Math.max(value, min), max);

const SCENE_HEIGHT_VH = 900;
const TIMELINE_CARD_SPAN = 178;
const TIMELINE_BASE_OFFSET = 120;

const roadmapCopy: Record<
  BuildStep["key"],
  {
    eyebrow: string;
    title: string;
    description: string;
    quote: string;
    tags: string[];
  }
> = {
  site: {
    eyebrow: "Stage 01 / Entry",
    title: "Старт стажировки BI-аналитика.",
    description: "Первый этап - вход в команду, знакомство с данными, бизнес-контекстом и базовой архитектурой отчетности.",
    quote: "Любой рост начинается с понимания системы.",
    tags: ["Onboarding", "Domain", "Business Context"]
  },
  foundation: {
    eyebrow: "Stage 02 / Foundation",
    title: "База: SQL, дисциплина и аккуратность в данных.",
    description: "Здесь закладывается фундамент: запросы, проверка цифр, внимательность к источникам и аналитическая гигиена.",
    quote: "Сильный junior строится на сильной базе.",
    tags: ["SQL", "Data Quality", "Discipline"]
  },
  columns: {
    eyebrow: "Stage 03 / First Tasks",
    title: "Первые рабочие задачи и первые ошибки.",
    description: "Первые выгрузки, первые разборы метрик, первые вопросы от команды. Ошибки становятся частью реального обучения.",
    quote: "Практика превращает теорию в опору.",
    tags: ["First Requests", "Iteration", "Feedback"]
  },
  beams: {
    eyebrow: "Stage 04 / First Dashboards",
    title: "От отдельных задач к первым dashboard-решениям.",
    description: "Появляются первые панели, логика визуализации, привычка не просто считать, а объяснять, что происходит в продукте.",
    quote: "BI начинается там, где цифры становятся понятными.",
    tags: ["Dashboards", "Storytelling", "BI Logic"]
  },
  floors: {
    eyebrow: "Stage 05 / Framework",
    title: "Каркас: системность, автоматизация и повторяемость.",
    description: "Работа перестает быть разовой. Появляются шаблоны, устойчивые процессы и уверенность в собственных аналитических решениях.",
    quote: "Рост ускоряется, когда процессы перестают быть ручными.",
    tags: ["Automation", "Process", "Reliability"]
  },
  facade: {
    eyebrow: "Stage 06 / Communication",
    title: "Данные становятся прозрачными для бизнеса.",
    description: "На этом уровне BI уже работает не только с таблицами, но и с доверием команды: метрики видны, решения читаются, дашборды живут в работе.",
    quote: "Хорошая аналитика делает сложное прозрачным.",
    tags: ["Stakeholders", "Transparency", "Trust"]
  },
  upper: {
    eyebrow: "Stage 07 / Ownership",
    title: "Собственная зона ответственности и зрелые кейсы.",
    description: "Появляются задачи посложнее: несколько команд, ответственность за KPI, самостоятельная проработка аналитического слоя.",
    quote: "Следующий уровень начинается с ответственности.",
    tags: ["Ownership", "KPI", "Cross-team"]
  },
  rooftop: {
    eyebrow: "Stage 08 / Junior Level",
    title: "Уровень junior BI analyst.",
    description: "Финальная точка этой истории: уже не стажер, а junior, который может собирать отчетность, строить dashboard-логику и разговаривать с бизнесом на языке метрик.",
    quote: "Junior - это не конец пути, а первая собранная высота.",
    tags: ["Junior BI", "Decision Support", "Next Growth"]
  }
};

const firstTasks = [
  { title: "First SQL Requests", detail: "Собирала первые выборки по продуктовым и операционным вопросам." },
  { title: "Metric Validation", detail: "Проверяла цифры и искала расхождения до того, как их увидят на встрече." }
];

const ownershipCases = [
  { title: "Weekly Ops Dashboard", detail: "Перевела ручной отчет в стабильную BI-панель.", meta: "12 metrics" },
  { title: "KPI Review Layer", detail: "Собрала логику показателей для еженедельных созвонов команды.", meta: "74% automated" }
];

function DetailPanel({ activeKey }: { activeKey: BuildStep["key"] }) {
  switch (activeKey) {
    case "site":
      return (
        <div className="glass-panel rounded-[26px] p-4 lg:p-5">
          <p className="section-kicker">Entry Snapshot</p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {kpiCards.map((item) => (
              <div key={item.label} className="rounded-2xl border border-slate-300/15 bg-slate-950/30 p-3">
                <p className="text-[0.58rem] uppercase tracking-[0.12rem] text-slate-500">{item.label}</p>
                <p className="display-title mt-2 text-xl text-slate-100">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      );
    case "foundation":
      return (
        <div className="glass-panel rounded-[26px] p-4 lg:p-5">
          <p className="section-kicker">Foundation Load</p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {[
              ["Study Hours", "900+"],
              ["SQL Modules", "42"],
              ["Practice Tasks", "118"],
              ["Accuracy", "97%"]
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-slate-300/15 bg-slate-950/30 p-3">
                <p className="text-[0.58rem] uppercase tracking-[0.12rem] text-slate-500">{label}</p>
                <p className="display-title mt-2 text-xl text-slate-100">{value}</p>
              </div>
            ))}
          </div>
        </div>
      );
    case "columns":
      return (
        <div className="glass-panel rounded-[26px] p-4 lg:p-5">
          <p className="section-kicker">First Task Log</p>
          <div className="mt-4 space-y-3">
            {firstTasks.map((task) => (
              <div key={task.title} className="rounded-2xl border border-slate-300/15 bg-slate-950/30 p-4">
                <p className="display-title text-base text-slate-100">{task.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">{task.detail}</p>
              </div>
            ))}
          </div>
        </div>
      );
    case "beams":
      return (
        <div className="glass-panel rounded-[26px] p-4 lg:p-5">
          <p className="section-kicker">Dashboard Skill Stack</p>
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
        <div className="glass-panel rounded-[26px] p-4 lg:p-5">
          <p className="section-kicker">Scale Layer</p>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {[
              ["Reports", "186+"],
              ["Calls", "312h"],
              ["Coverage", "74%"]
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-slate-300/15 bg-slate-950/30 p-3">
                <p className="text-[0.58rem] uppercase tracking-[0.12rem] text-slate-500">{label}</p>
                <p className="display-title mt-2 text-lg text-slate-100">{value}</p>
              </div>
            ))}
          </div>
        </div>
      );
    case "facade":
      return (
        <div className="glass-panel rounded-[26px] p-4 lg:p-5">
          <p className="section-kicker">Growth Curve</p>
          <div className="mt-4 rounded-2xl border border-slate-300/15 bg-slate-950/30 p-3">
            <GrowthLineChart />
          </div>
        </div>
      );
    case "upper":
      return (
        <div className="glass-panel rounded-[26px] p-4 lg:p-5">
          <p className="section-kicker">Ownership Cases</p>
          <div className="mt-4 space-y-3">
            {ownershipCases.map((item) => (
              <div key={item.title} className="rounded-2xl border border-slate-300/15 bg-slate-950/30 p-4">
                <div className="flex items-start justify-between gap-3">
                  <p className="display-title text-base text-slate-100">{item.title}</p>
                  <p className="text-[0.58rem] uppercase tracking-[0.12rem] text-blueprint">{item.meta}</p>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      );
    case "rooftop":
      return (
        <div className="glass-panel rounded-[26px] p-4 lg:p-5">
          <p className="section-kicker">Current Positioning</p>
          <p className="display-title mt-3 text-2xl leading-[1.02] text-slate-100">
            Junior BI analyst with strong SQL base, dashboard thinking and growing ownership.
          </p>
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
  const timelineProgress = currentIndex + stageProgress;
  const timelineOffset = timelineProgress * TIMELINE_CARD_SPAN;
  const story = roadmapCopy[activeStep.key];

  const sceneTranslateY = -(timelineProgress * 92);
  const sceneTranslateX = timelineProgress * 22;
  const sceneScale = 1 + progress * 0.12;

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

            <div className="absolute inset-y-0 left-0 right-0 lg:right-[28rem]">
              <motion.div
                className="h-full w-full will-change-transform"
                animate={{ x: sceneTranslateX, y: sceneTranslateY, scale: sceneScale }}
                transition={{ type: "spring", stiffness: 55, damping: 22, mass: 0.8 }}
              >
                <BuildingScene progress={progress} />
              </motion.div>
            </div>

            <div className="pointer-events-none absolute inset-y-0 right-[28rem] hidden w-24 bg-gradient-to-l from-[#04070d] via-[#04070d]/80 to-transparent lg:block" />

            <div className="absolute left-4 top-4 z-30 right-[calc(28rem+1rem)] hidden lg:flex items-start justify-between">
              <div className="glass-panel max-w-[24rem] rounded-[24px] px-4 py-3">
                <p className="section-kicker">BI Internship Roadmap</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">
                  Одна pinned scene: пользователь скроллит вниз, башня растет и смещается вверх, а справа развивается история от стажировки до junior.
                </p>
              </div>

              <div className="glass-panel rounded-[20px] px-4 py-3">
                <p className="text-[0.62rem] uppercase tracking-[0.14rem] text-slate-500">Build Progress</p>
                <p className="display-title mt-2 text-3xl text-slate-100">{Math.round(progress * 100)}%</p>
              </div>
            </div>

            <aside className="absolute inset-y-0 right-0 z-30 w-full max-w-[28rem] border-l border-slate-200/10 bg-[linear-gradient(180deg,rgba(7,11,18,0.88)_0%,rgba(4,7,13,0.94)_100%)] backdrop-blur-md">
              <div className="flex h-full flex-col">
                <div className="border-b border-slate-200/10 px-4 pb-4 pt-5 lg:px-5">
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <p className="section-kicker">{story.eyebrow}</p>
                      <h2 className="display-title mt-3 text-2xl leading-[0.98] text-slate-100 lg:text-3xl">{story.title}</h2>
                    </div>
                    <div className="text-right">
                      <p className="text-[0.62rem] uppercase tracking-[0.14rem] text-slate-500">Stage</p>
                      <p className="display-title mt-2 text-2xl text-slate-100">{activeStep.short}</p>
                    </div>
                  </div>

                  <p className="mt-4 text-sm leading-relaxed text-slate-300">{story.description}</p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {story.tags.map((tag) => (
                      <span key={tag} className="rounded-full border border-slate-200/15 bg-slate-950/25 px-3 py-1 text-[0.62rem] uppercase tracking-[0.12rem] text-slate-300">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center justify-between text-[0.62rem] uppercase tracking-[0.12rem] text-slate-500">
                      <span>Roadmap Completion</span>
                      <span>{Math.round(progress * 100)}%</span>
                    </div>
                    <div className="mt-2 h-[2px] overflow-hidden rounded-full bg-white/10">
                      <div className="story-track-fill h-full rounded-full" style={{ width: `${progress * 100}%` }} />
                    </div>
                  </div>
                </div>

                <div className="relative flex-1 overflow-hidden px-4 py-4 lg:px-5">
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#05080f] to-transparent" />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#05080f] to-transparent" />
                  <div className="pointer-events-none absolute left-[1.15rem] top-0 bottom-0 w-px story-track" />
                  <div className="pointer-events-none absolute left-0 right-0 top-[6.65rem] h-20 rounded-[20px] border border-blue-200/10 bg-blue-200/[0.03]" />

                  <motion.div
                    className="relative space-y-5"
                    animate={{ y: TIMELINE_BASE_OFFSET - timelineOffset }}
                    transition={{ type: "spring", stiffness: 60, damping: 24, mass: 0.85 }}
                  >
                    {buildSteps.map((step, index) => {
                      const stepStory = roadmapCopy[step.key];
                      const distance = Math.abs(index - timelineProgress);
                      const emphasis = clamp(1 - distance * 0.34, 0.28, 1);
                      const isActive = step.key === activeStep.key;

                      return (
                        <motion.article
                          key={step.key}
                          className="relative pl-8"
                          animate={{
                            opacity: emphasis,
                            x: isActive ? 0 : Math.min(distance * 16, 20),
                            scale: isActive ? 1 : 0.96
                          }}
                          transition={{ duration: 0.28 }}
                        >
                          <span
                            className={`absolute left-[0.55rem] top-5 h-3.5 w-3.5 -translate-x-1/2 rounded-full border ${
                              isActive
                                ? "border-blue-100 bg-blue-200 shadow-[0_0_18px_rgba(154,208,255,0.8)]"
                                : progress >= step.start
                                  ? "border-blue-200/40 bg-blue-200/20"
                                  : "border-slate-400/30 bg-slate-500/10"
                            }`}
                          />

                          <div
                            className={`rounded-[24px] border px-4 py-4 ${
                              isActive
                                ? "border-blue-200/30 bg-[linear-gradient(160deg,rgba(16,26,39,0.92)_0%,rgba(8,15,24,0.78)_100%)] shadow-[0_16px_48px_rgba(3,10,20,0.35)]"
                                : "border-slate-200/10 bg-slate-950/18"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="text-[0.58rem] uppercase tracking-[0.12rem] text-slate-500">{step.short}</p>
                                <p className="display-title mt-2 text-lg text-slate-100">{stepStory.title}</p>
                              </div>
                              <p className="text-[0.62rem] uppercase tracking-[0.12rem] text-blueprint">{step.label}</p>
                            </div>
                            <p className="mt-3 text-sm leading-relaxed text-slate-300">{stepStory.description}</p>
                          </div>
                        </motion.article>
                      );
                    })}
                  </motion.div>
                </div>

                <div className="border-t border-slate-200/10 px-4 pb-4 pt-4 lg:px-5">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`detail-${activeStep.key}`}
                      initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      exit={{ opacity: 0, y: 10, filter: "blur(8px)" }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <DetailPanel activeKey={activeStep.key} />
                      <p className="mt-3 px-1 text-sm italic text-blueprint">{story.quote}</p>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </aside>

            <div className="absolute left-3 right-3 top-3 z-30 flex items-center justify-between lg:hidden">
              <div className="glass-panel rounded-full px-3 py-2">
                <p className="text-[0.58rem] uppercase tracking-[0.14rem] text-slate-400">
                  {activeStep.short} · {activeStep.label}
                </p>
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
