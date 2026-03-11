const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function setupMountainRoute() {
  const journey = document.getElementById("journey");
  const routeBase = document.getElementById("routeBase");
  const routeProgress = document.getElementById("routeProgress");
  const climber = document.getElementById("climber");
  const mountainSvg = document.getElementById("mountainSvg");
  const altitudeMeter = document.getElementById("altitudeMeter");

  if (!journey || !routeBase || !routeProgress || !climber || !mountainSvg || !altitudeMeter) return;

  const routeLength = routeBase.getTotalLength();
  routeProgress.style.strokeDasharray = String(routeLength);
  routeProgress.style.strokeDashoffset = String(routeLength);

  const viewBox = mountainSvg.viewBox.baseVal;
  const minAltitude = 450;
  const maxAltitude = 3100;

  const updateProgress = () => {
    const rect = journey.getBoundingClientRect();
    const startLine = window.innerHeight * 0.2;
    const endLine = window.innerHeight * 0.82;
    const track = rect.height + startLine - endLine;
    const progress = clamp((startLine - rect.top) / track, 0, 1);

    const currentLength = routeLength * progress;
    routeProgress.style.strokeDashoffset = String(routeLength - currentLength);

    const point = routeBase.getPointAtLength(currentLength);
    const xPercent = (point.x / viewBox.width) * 100;
    const yPercent = (point.y / viewBox.height) * 100;
    climber.style.left = `${xPercent}%`;
    climber.style.top = `${yPercent}%`;

    const altitude = Math.round(minAltitude + (maxAltitude - minAltitude) * progress);
    altitudeMeter.textContent = altitude.toLocaleString("ru-RU");
  };

  updateProgress();
  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress);
}

function setupStepsHighlight() {
  const steps = Array.from(document.querySelectorAll(".step-card"));
  const dots = Array.from(document.querySelectorAll(".checkpoint-dot"));

  if (!steps.length || !dots.length) return;

  const activate = (index) => {
    steps.forEach((step, stepIndex) => {
      step.classList.toggle("active", stepIndex === index);
    });

    dots.forEach((dot) => {
      const dotStep = Number(dot.dataset.step || "0") - 1;
      dot.classList.toggle("active", dotStep <= index);
    });
  };

  const updateActiveStep = () => {
    let activeIndex = 0;
    let bestDistance = Number.POSITIVE_INFINITY;
    const viewportCenter = window.innerHeight * 0.5;

    steps.forEach((step, index) => {
      const rect = step.getBoundingClientRect();
      const center = rect.top + rect.height * 0.5;
      const distance = Math.abs(viewportCenter - center);
      if (distance < bestDistance) {
        bestDistance = distance;
        activeIndex = index;
      }
    });

    activate(activeIndex);
  };

  updateActiveStep();
  window.addEventListener("scroll", updateActiveStep, { passive: true });
  window.addEventListener("resize", updateActiveStep);
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
        const duration = reducedMotion ? 80 : 1300;
        const startTime = performance.now();
        const suffixNode = el.querySelector("span");

        const animate = (now) => {
          const progress = clamp((now - startTime) / duration, 0, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const value = Math.round(target * eased).toLocaleString("ru-RU");
          if (suffixNode) {
            el.firstChild.textContent = value;
          } else {
            el.textContent = value;
          }
          if (progress < 1) requestAnimationFrame(animate);
        };

        requestAnimationFrame(animate);
        observer.unobserve(el);
      });
    },
    { threshold: 0.45 }
  );

  counters.forEach((counter) => observer.observe(counter));
}

function baseChartOptions() {
  return {
    responsive: true,
    maintainAspectRatio: false,
    animation: reducedMotion ? false : { duration: 900 },
    plugins: {
      legend: {
        labels: {
          color: "#d7e6f5",
          font: { family: "Manrope" },
        },
      },
      tooltip: {
        backgroundColor: "rgba(5, 19, 34, 0.95)",
        titleColor: "#fff3e5",
        bodyColor: "#d8e8f7",
        borderColor: "rgba(255,255,255,0.16)",
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        ticks: { color: "#c1d4e8", font: { family: "Manrope" } },
        grid: { color: "rgba(193, 212, 232, 0.14)" },
      },
      y: {
        ticks: { color: "#c1d4e8", font: { family: "Manrope" } },
        grid: { color: "rgba(193, 212, 232, 0.14)" },
      },
    },
  };
}

function renderCharts() {
  if (typeof Chart === "undefined") return;

  const reports = document.getElementById("reportsChart");
  if (reports) {
    new Chart(reports, {
      type: "bar",
      data: {
        labels: ["Авг", "Сен", "Окт", "Ноя", "Дек", "Янв", "Фев"],
        datasets: [
          {
            label: "Выполненные отчеты",
            data: [12, 16, 21, 27, 31, 37, 42],
            borderRadius: 8,
            backgroundColor: ["#59c8b7", "#64cdb6", "#72d2b1", "#84d7a8", "#97dc9e", "#abdf93", "#bddf8b"],
          },
        ],
      },
      options: baseChartOptions(),
    });
  }

  const meetings = document.getElementById("meetingsChart");
  if (meetings) {
    new Chart(meetings, {
      type: "line",
      data: {
        labels: ["Авг", "Сен", "Окт", "Ноя", "Дек", "Янв", "Фев"],
        datasets: [
          {
            label: "Часы созвонов",
            data: [18, 24, 33, 41, 49, 63, 84],
            borderColor: "#ffbd76",
            backgroundColor: "rgba(255, 189, 118, 0.23)",
            pointBackgroundColor: "#ffe2be",
            pointRadius: 3,
            fill: true,
            tension: 0.35,
          },
        ],
      },
      options: baseChartOptions(),
    });
  }

  const focus = document.getElementById("focusChart");
  if (focus) {
    new Chart(focus, {
      type: "doughnut",
      data: {
        labels: ["Dashboard Dev", "SQL/ETL", "Анализ гипотез", "Коммуникация"],
        datasets: [
          {
            data: [34, 29, 21, 16],
            backgroundColor: ["#43c0ad", "#f7bc7f", "#69aae9", "#97d874"],
            borderWidth: 0,
          },
        ],
      },
      options: {
        ...baseChartOptions(),
        scales: {},
        cutout: "65%",
      },
    });
  }

  const automation = document.getElementById("automationChart");
  if (automation) {
    new Chart(automation, {
      type: "line",
      data: {
        labels: ["Спринт 1", "Спринт 2", "Спринт 3", "Спринт 4", "Спринт 5"],
        datasets: [
          {
            label: "Автоматизированные отчеты, %",
            data: [26, 39, 51, 66, 74],
            borderColor: "#59c8b7",
            backgroundColor: "rgba(89, 200, 183, 0.19)",
            fill: true,
            tension: 0.34,
            pointBackgroundColor: "#bdf0e9",
          },
        ],
      },
      options: baseChartOptions(),
    });
  }

  const skills = document.getElementById("skillsChart");
  if (skills) {
    new Chart(skills, {
      type: "radar",
      data: {
        labels: ["SQL", "BI Viz", "Data Modeling", "Storytelling", "Product Sense", "Automation"],
        datasets: [
          {
            label: "До",
            data: [20, 28, 16, 31, 35, 18],
            borderColor: "rgba(159, 181, 202, 0.88)",
            backgroundColor: "rgba(159, 181, 202, 0.17)",
            pointBackgroundColor: "#c4d4e6",
          },
          {
            label: "Сейчас",
            data: [86, 91, 82, 88, 84, 79],
            borderColor: "#ffbe78",
            backgroundColor: "rgba(255, 190, 120, 0.25)",
            pointBackgroundColor: "#ffd9ad",
          },
        ],
      },
      options: {
        ...baseChartOptions(),
        scales: {
          r: {
            angleLines: { color: "rgba(190, 210, 228, 0.2)" },
            grid: { color: "rgba(190, 210, 228, 0.2)" },
            pointLabels: { color: "#d5e5f5", font: { family: "Manrope" } },
            ticks: {
              color: "#b0c5db",
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

setupMountainRoute();
setupStepsHighlight();
setupCounters();
renderCharts();
