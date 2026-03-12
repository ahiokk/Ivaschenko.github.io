"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import BuildingScene from "@/components/building-scene";
import GrowthLineChart from "@/components/charts/growth-line-chart";
import RadarSkillChart from "@/components/charts/radar-skill-chart";
import SkillBars from "@/components/charts/skill-bars";
import StageProgress from "@/components/stage-progress";
import { buildSteps, BuildStep } from "@/lib/site-data";

const clamp = (value: number, min = 0, max = 1) => Math.min(Math.max(value, min), max);

const stepNarrative: Record<
  BuildStep["key"],
  {
    title: string;
    subtitle: string;
    copy: string;
    quote: string;
    panel?: "radar" | "line" | "kpi" | "none";
  }
> = {
  site: {
    title: "Site Grid",
    subtitle: "Разметка участка и архитектурный чертеж.",
    copy: "Начало пути: пустая площадка, структура мышления и ясный план роста.",
    quote: "Рост начинается с точной разметки."
  },
  foundation: {
    title: "Foundation",
    subtitle: "База, дисциплина, инженерная системность.",
    copy: "Сильный фундамент: методика анализа, SQL-мышление, аккуратная работа с источниками данных.",
    quote: "Сильный результат начинается с правильного фундамента.",
    panel: "kpi"
  },
  columns: {
    title: "Columns",
    subtitle: "Первые опорные проекты и практическая устойчивость.",
    copy: "Появляются первые рабочие кейсы, первые сложные решения и уверенность в реальной среде.",
    quote: "Я строила себя шаг за шагом."
  },
  beams: {
    title: "Frame Beams",
    subtitle: "Каркас навыков и техническая уверенность.",
    copy: "Навыки соединяются в систему: BI, SQL, data modeling и storytelling перестают быть разрозненными.",
    quote: "Каждый уровень опирается на основание.",
    panel: "radar"
  },
  floors: {
    title: "Floor Plates",
    subtitle: "Наращивание зрелых процессов и аналитического покрытия.",
    copy: "Больше сценариев, больше ответственности, более глубокая связка данных и бизнес-решений.",
    quote: "Рост — это архитектура, а не случайность."
  },
  facade: {
    title: "Glass Facade",
    subtitle: "Визуальная прозрачность и доверие к данным.",
    copy: "Метрики становятся видимыми и понятными для команд, а dashboards — частью ежедневных решений.",
    quote: "Хорошая аналитика делает сложное прозрачным.",
    panel: "line"
  },
  upper: {
    title: "Upper Levels",
    subtitle: "Сложные кейсы и стратегическая глубина.",
    copy: "На верхних уровнях — мультикомандные задачи, архитектура KPI и зрелая ответственность.",
    quote: "Чем выше уровень, тем важнее конструкция мышления."
  },
  rooftop: {
    title: "Rooftop",
    subtitle: "Текущий уровень и следующий горизонт.",
    copy: "Сейчас я работаю как системный BI-аналитик и готова к следующему уровню сложности.",
    quote: "Следующая высота — продолжение той же архитектуры."
  }
};

export default function StorytellingExperience() {
  const sectionRef = useRef<HTMLElement>(null);
  const stepRefs = useRef(new Map<BuildStep["key"], HTMLElement>());
  const [progress, setProgress] = useState(0);
  const [activeKey, setActiveKey] = useState<BuildStep["key"]>("site");

  useEffect(() => {
    const onScroll = () => {
      if (!sectionRef.current) return;

      const section = sectionRef.current;
      const absoluteTop = section.getBoundingClientRect().top + window.scrollY;
      const total = Math.max(section.offsetHeight - window.innerHeight, 1);
      const raw = (window.scrollY - absoluteTop + window.innerHeight * 0.3) / total;
      setProgress(clamp(raw));

      const viewportCenter = window.innerHeight * 0.5;
      let nearest: BuildStep["key"] = "site";
      let best = Number.POSITIVE_INFINITY;

      stepRefs.current.forEach((node, key) => {
        const rect = node.getBoundingClientRect();
        const center = rect.top + rect.height * 0.5;
        const dist = Math.abs(center - viewportCenter);
        if (dist < best) {
          best = dist;
          nearest = key;
        }
      });

      setActiveKey(nearest);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const activeStep = useMemo(() => buildSteps.find((step) => step.key === activeKey) ?? buildSteps[0], [activeKey]);

  return (
    <section ref={sectionRef} id="story" className="relative pb-14 pt-2 lg:pt-4">
      <StageProgress steps={buildSteps} activeKey={activeKey} progress={progress} />

      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,63%)_minmax(340px,37%)]">
        <div className="relative">
          <div className="sticky top-0 h-screen py-2 lg:top-20 lg:h-[calc(100vh-5.5rem)] lg:py-0">
            <div className="h-full overflow-hidden rounded-[26px]">
              <BuildingScene progress={progress} activeStep={activeStep} />
            </div>
          </div>
        </div>

        <div className="relative z-20">
          {buildSteps.map((step) => {
            const copy = stepNarrative[step.key];
            const isActive = activeKey === step.key;
            return (
              <article
                key={step.key}
                id={step.anchor}
                ref={(node) => {
                  if (node) {
                    stepRefs.current.set(step.key, node);
                  } else {
                    stepRefs.current.delete(step.key);
                  }
                }}
                className="min-h-[95vh] py-10"
              >
                <div className="sticky top-24 lg:top-28">
                  <motion.div
                    initial={{ opacity: 0.28, y: 20 }}
                    animate={{ opacity: isActive ? 1 : 0.52, y: isActive ? 0 : 10 }}
                    transition={{ duration: 0.4 }}
                    className={`glass-panel rounded-[24px] p-5 lg:p-6 ${isActive ? "border-blue-200/40" : ""}`}
                  >
                    <p className="section-kicker">
                      {step.short} · {copy.title}
                    </p>
                    <h3 className="display-title mt-3 text-2xl leading-tight text-slate-100 lg:text-4xl">{copy.subtitle}</h3>
                    <p className="soft-muted mt-3 text-sm leading-relaxed lg:text-base">{copy.copy}</p>
                    <p className="mt-4 text-sm italic text-blueprint">{copy.quote}</p>

                    <AnimatePresence mode="wait">
                      {copy.panel === "radar" && isActive && (
                        <motion.div
                          key="radar"
                          initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
                          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                          exit={{ opacity: 0, y: 8, filter: "blur(6px)" }}
                          className="mt-5 space-y-4"
                        >
                          <div className="rounded-2xl border border-slate-300/20 bg-slate-900/30 p-4">
                            <p className="blueprint-label mb-2">Skill Framework</p>
                            <RadarSkillChart />
                          </div>
                          <div className="rounded-2xl border border-slate-300/20 bg-slate-900/30 p-4">
                            <p className="blueprint-label mb-3">Capability Load</p>
                            <SkillBars />
                          </div>
                        </motion.div>
                      )}

                      {copy.panel === "line" && isActive && (
                        <motion.div
                          key="line"
                          initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
                          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                          exit={{ opacity: 0, y: 8, filter: "blur(6px)" }}
                          className="mt-5 rounded-2xl border border-slate-300/20 bg-slate-900/30 p-4"
                        >
                          <p className="blueprint-label mb-2">Growth Dynamics</p>
                          <GrowthLineChart />
                        </motion.div>
                      )}

                      {copy.panel === "kpi" && isActive && (
                        <motion.div
                          key="kpi"
                          initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
                          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                          exit={{ opacity: 0, y: 8, filter: "blur(6px)" }}
                          className="mt-5 grid grid-cols-2 gap-2"
                        >
                          <div className="rounded-xl border border-slate-300/20 bg-slate-900/35 p-3">
                            <p className="text-[0.62rem] uppercase tracking-[0.12rem] text-slate-400">Study Hours</p>
                            <p className="mt-2 text-xl text-slate-100">900+</p>
                          </div>
                          <div className="rounded-xl border border-slate-300/20 bg-slate-900/35 p-3">
                            <p className="text-[0.62rem] uppercase tracking-[0.12rem] text-slate-400">SQL Modules</p>
                            <p className="mt-2 text-xl text-slate-100">42</p>
                          </div>
                          <div className="rounded-xl border border-slate-300/20 bg-slate-900/35 p-3">
                            <p className="text-[0.62rem] uppercase tracking-[0.12rem] text-slate-400">Frameworks</p>
                            <p className="mt-2 text-xl text-slate-100">6</p>
                          </div>
                          <div className="rounded-xl border border-slate-300/20 bg-slate-900/35 p-3">
                            <p className="text-[0.62rem] uppercase tracking-[0.12rem] text-slate-400">Discipline Score</p>
                            <p className="mt-2 text-xl text-slate-100">A+</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
