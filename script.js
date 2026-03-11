const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function setupParallaxAscent() {
  const ascent = document.getElementById("ascent");
  const layers = Array.from(document.querySelectorAll(".parallax-layer"));
  const routeBase = document.getElementById("routeBase");
  const routeProgress = document.getElementById("routeProgress");
  const routeSvg = document.getElementById("routeSvg");
  const climber = document.getElementById("climber");
  const dots = Array.from(document.querySelectorAll(".checkpoint-dot"));
  const steps = Array.from(document.querySelectorAll(".story-step"));
  const altitudeMeter = document.getElementById("altitudeMeter");
  const stageMeter = document.getElementById("stageMeter");
  const trainGroup = document.getElementById("trainGroup");
  const cityBack = document.getElementById("cityBack");
  const cityFront = document.getElementById("cityFront");
  const cloudBack = document.getElementById("cloudBack");

  if (!ascent || !routeBase || !routeProgress || !routeSvg || !climber || !steps.length) return;

  const routeLength = routeBase.getTotalLength();
  routeProgress.style.strokeDasharray = String(routeLength);
  routeProgress.style.strokeDashoffset = String(routeLength);
  const viewBox = routeSvg.viewBox.baseVal;

  let activeIndex = -1;

  const getProgress = () => {
    const rect = ascent.getBoundingClientRect();
    const start = window.innerHeight * 0.2;
    const end = window.innerHeight * 0.82;
    const track = rect.height + start - end;
    if (track <= 0) return 0;
    return clamp((start - rect.top) / track, 0, 1);
  };

  const setActiveStep = (index) => {
    if (index === activeIndex) return;
    activeIndex = index;
    steps.forEach((step, stepIndex) => {
      step.classList.toggle("is-active", stepIndex === activeIndex);
    });

    dots.forEach((dot) => {
      const dotIndex = Number(dot.dataset.step || "0") - 1;
      dot.classList.toggle("active", dotIndex <= activeIndex);
    });

    if (stageMeter) {
      stageMeter.textContent = steps[activeIndex].dataset.label || "Этап";
    }
  };

  const updateActiveByViewport = () => {
    const center = window.innerHeight * 0.5;
    let nearest = 0;
    let minDist = Number.POSITIVE_INFINITY;

    steps.forEach((step, index) => {
      const rect = step.getBoundingClientRect();
      const stepCenter = rect.top + rect.height * 0.5;
      const dist = Math.abs(center - stepCenter);
      if (dist < minDist) {
        minDist = dist;
        nearest = index;
      }
    });

    setActiveStep(nearest);
  };

  const render = () => {
    const progress = getProgress();

    layers.forEach((layer) => {
      const tx = Number(layer.dataset.tx || "0") * progress;
      const ty = Number(layer.dataset.ty || "0") * progress;
      layer.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
    });

    if (cloudBack && !reducedMotion) {
      const cloudDrift = Math.sin(progress * Math.PI * 2) * 10;
      cloudBack.style.transform = `translate3d(${-80 * progress + cloudDrift}px, ${18 * progress}px, 0)`;
    }

    if (cityBack) cityBack.style.opacity = String(clamp(1 - progress * 0.82, 0.15, 1));
    if (cityFront) cityFront.style.opacity = String(clamp(1 - progress * 1.12, 0.08, 1));

    if (trainGroup) {
      const travel = (progress * 980) % 980;
      trainGroup.setAttribute("transform", `translate(${travel - 380}, 0)`);
    }

    const currentLength = routeLength * progress;
    routeProgress.style.strokeDashoffset = String(routeLength - currentLength);
    const point = routeBase.getPointAtLength(currentLength);
    climber.style.left = `${(point.x / viewBox.width) * 100}%`;
    climber.style.top = `${(point.y / viewBox.height) * 100}%`;

    if (altitudeMeter) {
      const altitude = Math.round(520 + (3100 - 520) * progress);
      altitudeMeter.textContent = altitude.toLocaleString("ru-RU");
    }
  };

  const onScroll = () => {
    updateActiveByViewport();
    render();
  };

  updateActiveByViewport();
  render();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
}

function setupCounters() {
  const counters = document.querySelectorAll(".count-up");
  if (!counters.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const el = entry.target;
        const target = Number(el.dataset.target || "0");
        const duration = reducedMotion ? 120 : 1400;
        const start = performance.now();
        const suffix = el.querySelector("span");

        const tick = (now) => {
          const progress = clamp((now - start) / duration, 0, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const value = Math.round(target * eased).toLocaleString("ru-RU");
          if (suffix) {
            el.firstChild.textContent = value;
          } else {
            el.textContent = value;
          }
          if (progress < 1) requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);
        observer.unobserve(el);
      });
    },
    { threshold: 0.45 }
  );

  counters.forEach((counter) => observer.observe(counter));
}

function chartOptions() {
  return {
    responsive: true,
    maintainAspectRatio: false,
    animation: reducedMotion ? false : { duration: 900 },
    plugins: {
      legend: {
        labels: {
          color: "#d9e8f7",
          font: { family: "Manrope" },
        },
      },
      tooltip: {
        backgroundColor: "rgba(7, 20, 35, 0.96)",
        titleColor: "#fff4e7",
        bodyColor: "#d5e7f8",
        borderColor: "rgba(255,255,255,0.17)",
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        ticks: { color: "#c5d9ee", font: { family: "Manrope" } },
        grid: { color: "rgba(197,217,238,0.14)" },
      },
      y: {
        ticks: { color: "#c5d9ee", font: { family: "Manrope" } },
        grid: { color: "rgba(197,217,238,0.14)" },
      },
    },
  };
}

function setupCharts() {
  if (typeof Chart === "undefined") return;

  const reportsChart = document.getElementById("reportsChart");
  if (reportsChart) {
    new Chart(reportsChart, {
      type: "bar",
      data: {
        labels: ["Авг", "Сен", "Окт", "Ноя", "Дек", "Янв", "Фев"],
        datasets: [
          {
            label: "Отчеты",
            data: [12, 16, 23, 29, 34, 39, 43],
            borderRadius: 8,
            backgroundColor: ["#59cab8", "#64cfb6", "#73d4b1", "#82d8a8", "#94dc9f", "#aadf94", "#bfdf8b"],
          },
        ],
      },
      options: chartOptions(),
    });
  }

  const meetingsChart = document.getElementById("meetingsChart");
  if (meetingsChart) {
    new Chart(meetingsChart, {
      type: "line",
      data: {
        labels: ["Авг", "Сен", "Окт", "Ноя", "Дек", "Янв", "Фев"],
        datasets: [
          {
            label: "Часы созвонов",
            data: [18, 25, 33, 44, 52, 65, 75],
            borderColor: "#ffbf79",
            backgroundColor: "rgba(255, 191, 121, 0.23)",
            pointBackgroundColor: "#ffe0ba",
            pointRadius: 3,
            fill: true,
            tension: 0.35,
          },
        ],
      },
      options: chartOptions(),
    });
  }

  const focusChart = document.getElementById("focusChart");
  if (focusChart) {
    new Chart(focusChart, {
      type: "doughnut",
      data: {
        labels: ["Dashboard Dev", "SQL/ETL", "Анализ гипотез", "Коммуникация", "Data QA"],
        datasets: [
          {
            data: [30, 27, 19, 14, 10],
            backgroundColor: ["#55cdb8", "#ffbd7a", "#69afe9", "#f09e7d", "#9adf76"],
            borderWidth: 0,
          },
        ],
      },
      options: {
        ...chartOptions(),
        scales: {},
        cutout: "64%",
      },
    });
  }

  const automationChart = document.getElementById("automationChart");
  if (automationChart) {
    new Chart(automationChart, {
      type: "line",
      data: {
        labels: ["Спринт 1", "Спринт 2", "Спринт 3", "Спринт 4", "Спринт 5"],
        datasets: [
          {
            label: "Автоматизация, %",
            data: [28, 39, 53, 65, 74],
            borderColor: "#67d8c4",
            backgroundColor: "rgba(103, 216, 196, 0.22)",
            pointBackgroundColor: "#ccf6ef",
            tension: 0.32,
            fill: true,
          },
        ],
      },
      options: chartOptions(),
    });
  }

  const skillsChart = document.getElementById("skillsChart");
  if (skillsChart) {
    new Chart(skillsChart, {
      type: "radar",
      data: {
        labels: ["SQL", "BI Viz", "Modeling", "Storytelling", "Product Sense", "Automation"],
        datasets: [
          {
            label: "До",
            data: [22, 31, 18, 35, 33, 20],
            borderColor: "rgba(163, 186, 208, 0.9)",
            backgroundColor: "rgba(163, 186, 208, 0.18)",
            pointBackgroundColor: "#c5d8ea",
          },
          {
            label: "Сейчас",
            data: [86, 90, 83, 89, 84, 79],
            borderColor: "#ffbf7a",
            backgroundColor: "rgba(255, 191, 122, 0.24)",
            pointBackgroundColor: "#ffddb1",
          },
        ],
      },
      options: {
        ...chartOptions(),
        scales: {
          r: {
            angleLines: { color: "rgba(190, 212, 232, 0.2)" },
            grid: { color: "rgba(190, 212, 232, 0.2)" },
            pointLabels: { color: "#d7e8f8", font: { family: "Manrope" } },
            ticks: {
              color: "#b3c9df",
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
}

setupParallaxAscent();
setupCounters();
setupCharts();
