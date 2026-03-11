"use client";

import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import BuildingScene from "@/components/building-scene";
import GrowthLineChart from "@/components/charts/growth-line-chart";
import RadarSkillChart from "@/components/charts/radar-skill-chart";
import SkillBars from "@/components/charts/skill-bars";
import StageProgress from "@/components/stage-progress";
import { BuildStageKey, projectCards, stageContent } from "@/lib/site-data";

const defaultStage = stageContent[0].key;

export default function StorytellingExperience() {
  const storyRef = useRef<HTMLElement>(null);
  const stageRefs = useRef(new Map<BuildStageKey, HTMLElement>());
  const [activeStage, setActiveStage] = useState<BuildStageKey>(defaultStage);
  const [progress, setProgress] = useState(0);

  const { scrollYProgress } = useScroll({
    target: storyRef,
    offset: ["start start", "end end"]
  });

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    setProgress(value);
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (!visible.length) return;
        const next = visible[0].target.getAttribute("data-stage") as BuildStageKey | null;
        if (next) setActiveStage(next);
      },
      {
        threshold: [0.3, 0.5, 0.7],
        rootMargin: "-18% 0px -30% 0px"
      }
    );

    stageRefs.current.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  const progressClamped = useMemo(() => Math.max(0, Math.min(1, progress)), [progress]);

  return (
    <section ref={storyRef} className="relative pb-16" id="story">
      <StageProgress stages={stageContent} activeKey={activeStage} progress={progressClamped} />

      <div className="grid gap-7 xl:grid-cols-[minmax(360px,41%)_minmax(0,59%)]">
        <div className="relative">
          <div className="sticky top-24">
            <BuildingScene storyRef={storyRef} activeStage={activeStage} />
          </div>
        </div>

        <div className="space-y-16 lg:space-y-24">
          {stageContent.map((stage) => (
            <motion.article
              key={stage.key}
              id={stage.sectionId}
              ref={(node) => {
                if (node) stageRefs.current.set(stage.key, node);
              }}
              data-stage={stage.key}
              initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: false, amount: 0.28 }}
              transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
              className={`glass-panel rounded-[26px] p-6 lg:p-8 ${stage.key === activeStage ? "border-blue-200/40" : ""}`}
            >
              <div className="flex items-start justify-between gap-3">
                <p className="section-kicker">
                  Stage {stage.stepLabel} · {stage.stageLabel}
                </p>
                <span className="pill-outline rounded-full px-3 py-1 text-[0.68rem] uppercase tracking-[0.14rem] text-slate-300">
                  {stage.key === activeStage ? "active" : "pending"}
                </span>
              </div>

              <h2 className="display-title mt-4 max-w-2xl text-2xl leading-tight text-slate-100 lg:text-4xl">{stage.title}</h2>
              <p className="soft-muted mt-4 max-w-3xl leading-relaxed lg:text-lg">{stage.description}</p>

              {stage.notes && (
                <ul className="mt-5 grid gap-2">
                  {stage.notes.map((note) => (
                    <li
                      key={note}
                      className="rounded-xl border border-slate-300/15 bg-slate-800/30 px-3 py-2 text-sm text-slate-300"
                    >
                      {note}
                    </li>
                  ))}
                </ul>
              )}

              {stage.key === "firstFloor" && (
                <div className="mt-6 grid gap-3 md:grid-cols-3">
                  {projectCards.map((project) => (
                    <article key={project.name} className="rounded-2xl border border-slate-300/20 bg-slate-800/35 p-4">
                      <p className="display-title text-base text-slate-100">{project.name}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.12rem] text-blueprint">{project.stack}</p>
                      <p className="mt-3 text-sm text-slate-300">{project.summary}</p>
                      <p className="mt-3 text-xs text-slate-200">{project.result}</p>
                    </article>
                  ))}
                </div>
              )}

              {stage.key === "framework" && (
                <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
                  <div className="rounded-2xl border border-slate-300/20 bg-slate-800/35 p-4">
                    <p className="blueprint-label mb-3">Skill Radar</p>
                    <RadarSkillChart />
                  </div>
                  <div className="rounded-2xl border border-slate-300/20 bg-slate-800/35 p-4">
                    <p className="blueprint-label mb-3">Structural Capacity</p>
                    <SkillBars />
                  </div>
                </div>
              )}

              {stage.key === "upperFloors" && (
                <div className="mt-6 space-y-4">
                  <div className="rounded-2xl border border-slate-300/20 bg-slate-800/35 p-4">
                    <p className="blueprint-label mb-3">Growth Dynamics</p>
                    <GrowthLineChart />
                  </div>
                  <div className="grid gap-3 md:grid-cols-3">
                    <div className="rounded-xl border border-slate-300/15 bg-slate-900/35 p-3">
                      <p className="text-xs uppercase tracking-[0.12rem] text-slate-400">Before</p>
                      <p className="mt-2 text-sm text-slate-300">Ручные отчеты и долгие сверки между отделами.</p>
                    </div>
                    <div className="rounded-xl border border-slate-300/15 bg-slate-900/35 p-3">
                      <p className="text-xs uppercase tracking-[0.12rem] text-slate-400">After</p>
                      <p className="mt-2 text-sm text-slate-300">Автоматизированные витрины и единая версия метрик.</p>
                    </div>
                    <div className="rounded-xl border border-slate-300/15 bg-slate-900/35 p-3">
                      <p className="text-xs uppercase tracking-[0.12rem] text-slate-400">Impact</p>
                      <p className="mt-2 text-sm text-slate-300">Быстрее решения, меньше ручного труда, выше доверие к данным.</p>
                    </div>
                  </div>
                </div>
              )}

              {stage.key === "rooftop" && (
                <div className="mt-6 rounded-2xl border border-blue-200/20 bg-[linear-gradient(130deg,rgba(151,198,240,0.13),rgba(24,39,58,0.44))] p-4">
                  <p className="text-sm text-slate-200">
                    Сильный результат начинается с правильного фундамента. Сейчас я готова брать более сложные задачи в BI,
                    строить масштабируемую аналитику и доводить данные до уровня решений.
                  </p>
                  <a
                    href="#contact"
                    className="mt-4 inline-flex rounded-full border border-blue-100/40 bg-blue-100/15 px-4 py-2 text-sm text-blue-100 transition hover:bg-blue-100/25"
                  >
                    Перейти к контакту
                  </a>
                </div>
              )}
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
