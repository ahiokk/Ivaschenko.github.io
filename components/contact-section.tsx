export default function ContactSection() {
  return (
    <section id="contact" className="mx-auto max-w-[1200px] pb-10 pt-8">
      <div className="glass-panel rounded-[28px] p-6 lg:p-10">
        <p className="section-kicker">Rooftop / Contact</p>
        <h2 className="display-title mt-4 max-w-4xl text-3xl leading-tight text-slate-100 lg:text-5xl">
          Текущий уровень собран. Следующий строим вместе.
        </h2>
        <p className="soft-muted mt-4 max-w-2xl text-sm leading-relaxed lg:text-base">
          Если вам нужен BI-специалист с системным мышлением, архитектурным подходом и вниманием к визуальной подаче данных,
          давайте обсудим ваш проект.
        </p>

        <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <a
            href="mailto:hello@example.com"
            className="rounded-2xl border border-slate-300/20 bg-slate-800/35 px-4 py-3 transition hover:border-blue-200/40 hover:bg-slate-800/55"
          >
            <p className="text-[0.68rem] uppercase tracking-[0.13rem] text-slate-400">Email</p>
            <p className="mt-2 text-slate-100">hello@example.com</p>
          </a>
          <a
            href="https://t.me/username"
            className="rounded-2xl border border-slate-300/20 bg-slate-800/35 px-4 py-3 transition hover:border-blue-200/40 hover:bg-slate-800/55"
          >
            <p className="text-[0.68rem] uppercase tracking-[0.13rem] text-slate-400">Telegram</p>
            <p className="mt-2 text-slate-100">@username</p>
          </a>
          <a
            href="https://www.linkedin.com/"
            className="rounded-2xl border border-slate-300/20 bg-slate-800/35 px-4 py-3 transition hover:border-blue-200/40 hover:bg-slate-800/55"
          >
            <p className="text-[0.68rem] uppercase tracking-[0.13rem] text-slate-400">LinkedIn</p>
            <p className="mt-2 text-slate-100">linkedin.com/in/your-profile</p>
          </a>
        </div>
      </div>
    </section>
  );
}
