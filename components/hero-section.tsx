import { kpiCards } from "@/lib/site-data";

export default function HeroSection() {
  return (
    <section id="hero" className="relative min-h-[82vh] py-10 lg:py-16">
      <div className="absolute inset-x-0 top-[16%] -z-10 h-[420px] rounded-[40px] bg-[radial-gradient(circle_at_50%_50%,rgba(125,165,206,0.20),transparent_70%)]" />

      <div className="glass-panel architecture-grid rounded-[32px] p-6 lg:p-10">
        <p className="section-kicker">Blueprint Start</p>
        <h1 className="display-title mt-4 max-w-4xl text-4xl leading-[1.03] text-slate-100 sm:text-5xl lg:text-7xl">
          Рост - это не удача. <span className="text-blueprint">Это архитектура.</span>
        </h1>
        <p className="soft-muted mt-6 max-w-2xl text-base leading-relaxed lg:text-lg">
          Этот сайт показывает мой путь как последовательное строительство архитектурной башни. Каждое решение, каждый
          проект и каждый навык стали новым этажом. Я строила себя шаг за шагом, а не рывками.
        </p>

        <div className="mt-8 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {kpiCards.map((item) => (
            <article key={item.label} className="glass-panel rounded-2xl p-4">
              <p className="text-[0.72rem] uppercase tracking-[0.12rem] text-slate-400">{item.label}</p>
              <p className="display-title mt-2 text-3xl text-slate-100">{item.value}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
