export default function ContactSection() {
  return (
    <section id="contact" className="pb-8 pt-12 lg:pt-16">
      <div className="glass-panel rounded-[30px] p-6 lg:p-10">
        <p className="section-kicker">Final CTA</p>
        <h2 className="display-title mt-4 max-w-3xl text-3xl leading-tight text-slate-100 lg:text-5xl">
          Каждый уровень опирается на основание. Следующий уровень строим вместе.
        </h2>
        <p className="soft-muted mt-4 max-w-2xl text-base leading-relaxed lg:text-lg">
          Если вам нужен BI-аналитик с системным подходом, инженерной дисциплиной и сильной визуальной подачей данных,
          давайте обсудим задачи вашей команды.
        </p>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <a
            href="mailto:hello@example.com"
            className="rounded-2xl border border-slate-300/20 bg-slate-800/35 px-4 py-3 transition hover:border-blue-100/40 hover:bg-slate-800/55"
          >
            <p className="text-xs uppercase tracking-[0.12rem] text-slate-400">Email</p>
            <p className="mt-2 text-slate-100">hello@example.com</p>
          </a>
          <a
            href="https://t.me/username"
            className="rounded-2xl border border-slate-300/20 bg-slate-800/35 px-4 py-3 transition hover:border-blue-100/40 hover:bg-slate-800/55"
          >
            <p className="text-xs uppercase tracking-[0.12rem] text-slate-400">Telegram</p>
            <p className="mt-2 text-slate-100">@username</p>
          </a>
          <a
            href="https://www.linkedin.com/"
            className="rounded-2xl border border-slate-300/20 bg-slate-800/35 px-4 py-3 transition hover:border-blue-100/40 hover:bg-slate-800/55"
          >
            <p className="text-xs uppercase tracking-[0.12rem] text-slate-400">LinkedIn</p>
            <p className="mt-2 text-slate-100">linkedin.com/in/your-profile</p>
          </a>
        </div>
      </div>
    </section>
  );
}
