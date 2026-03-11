const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function updateRouteProgress() {
  const basePath = document.getElementById("route-base");
  const progressPath = document.getElementById("route-progress");
  const climber = document.getElementById("climber");

  if (!basePath || !progressPath || !climber) return;

  const totalLength = basePath.getTotalLength();
  progressPath.style.strokeDasharray = `${totalLength}`;
  progressPath.style.strokeDashoffset = `${totalLength}`;

  const move = () => {
    const doc = document.documentElement;
    const maxScroll = doc.scrollHeight - window.innerHeight;
    const raw = maxScroll > 0 ? window.scrollY / maxScroll : 0;
    const progress = Math.min(Math.max(raw, 0), 1);

    const currentLength = totalLength * progress;
    progressPath.style.strokeDashoffset = `${totalLength - currentLength}`;

    const point = basePath.getPointAtLength(currentLength);
    const svg = basePath.ownerSVGElement.getBoundingClientRect();
    const scaleX = svg.width / basePath.ownerSVGElement.viewBox.baseVal.width;
    const scaleY = svg.height / basePath.ownerSVGElement.viewBox.baseVal.height;

    climber.style.left = `${svg.left + point.x * scaleX}px`;
    climber.style.top = `${svg.top + point.y * scaleY}px`;
  };

  move();
  window.addEventListener("scroll", move, { passive: true });
  window.addEventListener("resize", move);
}

function animateCounters() {
  const counters = document.querySelectorAll(".count-up");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = Number(el.dataset.target || "0");
        const duration = reducedMotion ? 100 : 1500;
        const start = performance.now();

        const tick = (now) => {
          const progress = Math.min((now - start) / duration, 1);
          const ease = 1 - Math.pow(1 - progress, 3);
          el.firstChild.textContent = Math.floor(target * ease).toLocaleString("ru-RU");
          if (progress < 1) {
            requestAnimationFrame(tick);
          }
        };

        requestAnimationFrame(tick);
        observer.unobserve(el);
      });
    },
    { threshold: 0.55 }
  );

  counters.forEach((counter) => observer.observe(counter));
}

function initSectionAnimations() {
  if (reducedMotion || typeof gsap === "undefined") return;
  gsap.registerPlugin(ScrollTrigger);

  gsap.utils.toArray(".panel").forEach((panel) => {
    const items = panel.querySelectorAll("h2, h3, p, .glass, .kpi-card, .chart-card, .stat-card, .timeline-item");
    gsap.from(items, {
      opacity: 0,
      y: 30,
      stagger: 0.06,
      duration: 0.8,
      ease: "power2.out",
      scrollTrigger: {
        trigger: panel,
        start: "top 75%",
      },
    });
  });
}

function baseChartOptions() {
  return {
    responsive: true,
    maintainAspectRatio: false,
    animation: reducedMotion ? false : { duration: 900 },
    plugins: {
      legend: {
        labels: {
          color: "#d7e4f1",
          font: {
            family: "Sora",
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(5, 20, 35, 0.95)",
        borderColor: "rgba(255,255,255,0.14)",
        borderWidth: 1,
        titleColor: "#fff7ec",
        bodyColor: "#d4e4f1",
      },
    },
    scales: {
      x: {
        ticks: { color: "#bdd0e2", font: { family: "Sora" } },
        grid: { color: "rgba(189,208,226,0.14)" },
      },
      y: {
        ticks: { color: "#bdd0e2", font: { family: "Sora" } },
        grid: { color: "rgba(189,208,226,0.14)" },
      },
    },
  };
}

function initCharts() {
  if (typeof Chart === "undefined") return;

  new Chart(document.getElementById("reportsChart"), {
    type: "bar",
    data: {
      labels: ["Авг", "Сен", "Окт", "Ноя", "Дек", "Янв", "Фев"],
      datasets: [
        {
          label: "Отчеты",
          data: [12, 16, 19, 24, 31, 38, 46],
          borderRadius: 7,
          backgroundColor: ["#4fc3b4", "#57c9b2", "#63cfb0", "#79d5a4", "#8fdb98", "#a5e08f", "#bfdc89"],
        },
      ],
    },
    options: baseChartOptions(),
  });

  new Chart(document.getElementById("callsChart"), {
    type: "line",
    data: {
      labels: ["Авг", "Сен", "Окт", "Ноя", "Дек", "Янв", "Фев"],
      datasets: [
        {
          label: "Часы созвонов",
          data: [18, 24, 35, 42, 48, 63, 82],
          borderColor: "#ffb76a",
          backgroundColor: "rgba(255, 183, 106, 0.2)",
          fill: true,
          tension: 0.35,
          pointRadius: 3,
          pointBackgroundColor: "#ffe2be",
        },
      ],
    },
    options: baseChartOptions(),
  });

  new Chart(document.getElementById("focusChart"), {
    type: "doughnut",
    data: {
      labels: ["Дашборды", "SQL/ETL", "Проверка качества", "Коммуникация", "Ad-hoc анализ"],
      datasets: [
        {
          data: [31, 27, 16, 14, 12],
          backgroundColor: ["#43c6ac", "#f7bb7e", "#59a6e8", "#ec8e73", "#91d66f"],
          borderWidth: 0,
        },
      ],
    },
    options: {
      ...baseChartOptions(),
      scales: {},
      cutout: "66%",
    },
  });

  new Chart(document.getElementById("skillsChart"), {
    type: "radar",
    data: {
      labels: ["SQL", "BI Viz", "Data Modeling", "Storytelling", "Product Sense", "Automation"],
      datasets: [
        {
          label: "До",
          data: [22, 28, 18, 30, 34, 16],
          borderColor: "rgba(160, 183, 201, 0.85)",
          backgroundColor: "rgba(160, 183, 201, 0.16)",
          pointBackgroundColor: "#c5d6e8",
        },
        {
          label: "Сейчас",
          data: [84, 88, 79, 86, 80, 76],
          borderColor: "#ffb76a",
          backgroundColor: "rgba(255, 183, 106, 0.23)",
          pointBackgroundColor: "#ffdcb8",
        },
      ],
    },
    options: {
      ...baseChartOptions(),
      scales: {
        r: {
          angleLines: { color: "rgba(189,208,226,0.16)" },
          grid: { color: "rgba(189,208,226,0.2)" },
          pointLabels: { color: "#d8e6f3", font: { family: "Sora" } },
          ticks: {
            color: "#abc0d4",
            backdropColor: "rgba(0,0,0,0)",
            stepSize: 20,
          },
          suggestedMin: 0,
          suggestedMax: 100,
        },
      },
    },
  });
}

updateRouteProgress();
animateCounters();
initSectionAnimations();
initCharts();
