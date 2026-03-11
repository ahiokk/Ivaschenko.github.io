import { kpiCards } from "@/lib/site-data";

export default function HeroSection() {
  return (
    <section id="hero" className="relative min-h-[92vh] pb-16 pt-12 lg:pt-16">
      <div className="pointer-events-none absolute inset-x-0 top-8 -z-10 h-[58vh] bg-[radial-gradient(circle_at_50%_25%,rgba(120,165,210,0.26),transparent_70%)]" />

      <div className="mx-auto max-w-[1200px] text-center">
        <p className="section-kicker">Cinematic Architectural Storytelling</p>
        <h1 className="display-title mx-auto mt-6 max-w-5xl text-4xl leading-[0.98] text-slate-100 sm:text-6xl xl:text-8xl">
          Профессиональный рост через <span className="text-blueprint">строительство премиальной башни</span>
        </h1>
        <p className="soft-muted mx-auto mt-6 max-w-3xl text-sm leading-relaxed sm:text-base lg:text-lg">
          Ниже - режиссированная сцена: участок, фундамент, каркас, фасад и верхние уровни. Башня собирается по мере скролла,
          как метафора моего развития в аналитике.
        </p>
      </div>

      <div className="mx-auto mt-10 grid max-w-[1200px] gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {kpiCards.map((item) => (
          <article key={item.label} className="glass-panel rounded-2xl px-4 py-4 text-left">
            <p className="text-[0.65rem] uppercase tracking-[0.15rem] text-slate-400">{item.label}</p>
            <p className="display-title mt-2 text-3xl text-slate-100">{item.value}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
