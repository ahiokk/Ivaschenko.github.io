export interface BuildStep {
  key:
    | "site"
    | "foundation"
    | "columns"
    | "beams"
    | "floors"
    | "facade"
    | "upper"
    | "rooftop";
  anchor: string;
  label: string;
  short: string;
  start: number;
}

export interface NarrativeMoment {
  key: "foundation" | "firstStructure" | "framework" | "upperFloors" | "rooftop";
  title: string;
  subtitle: string;
  copy: string;
  quote: string;
  start: number;
}

export const buildSteps: BuildStep[] = [
  { key: "site", anchor: "site-grid", label: "Site Grid", short: "01", start: 0.0 },
  { key: "foundation", anchor: "foundation", label: "Foundation", short: "02", start: 0.1 },
  { key: "columns", anchor: "columns", label: "Columns", short: "03", start: 0.2 },
  { key: "beams", anchor: "beams", label: "Frame Beams", short: "04", start: 0.32 },
  { key: "floors", anchor: "floors", label: "Floor Plates", short: "05", start: 0.45 },
  { key: "facade", anchor: "facade", label: "Glass Facade", short: "06", start: 0.6 },
  { key: "upper", anchor: "upper", label: "Upper Levels", short: "07", start: 0.74 },
  { key: "rooftop", anchor: "rooftop", label: "Rooftop", short: "08", start: 0.88 }
];

export const narrativeMoments: NarrativeMoment[] = [
  {
    key: "foundation",
    title: "Foundation",
    subtitle: "База. Дисциплина. Системность.",
    copy: "Сильный результат начинается с правильного фундамента: аналитическая база, rigor и архитектура мышления.",
    quote: "Рост — это не удача. Это архитектура.",
    start: 0.08
  },
  {
    key: "firstStructure",
    title: "First Structure",
    subtitle: "Первые проекты и практическая глубина.",
    copy: "Первые этажи опыта: реальные задачи, ранние ошибки, итерации и устойчивые рабочие решения в проде.",
    quote: "Я строила себя шаг за шагом.",
    start: 0.3
  },
  {
    key: "framework",
    title: "Framework",
    subtitle: "Сильные навыки и каркас знаний.",
    copy: "SQL, BI, data modeling и storytelling собираются в единую инженерную конструкцию решений.",
    quote: "Каждый уровень опирается на основание.",
    start: 0.5
  },
  {
    key: "upperFloors",
    title: "Upper Floors",
    subtitle: "Сложные кейсы и рост ответственности.",
    copy: "Мультикомандные задачи, архитектура метрик и зрелые BI-сценарии с измеримым бизнес-эффектом.",
    quote: "Сильный результат начинается с правильного фундамента.",
    start: 0.7
  },
  {
    key: "rooftop",
    title: "Rooftop",
    subtitle: "Текущий уровень и следующий вектор.",
    copy: "Сейчас я строю BI как систему принятия решений и готова к более сложным архитектурным задачам в данных.",
    quote: "Следующий уровень — продолжение той же архитектуры.",
    start: 0.88
  }
];

export const kpiCards = [
  { label: "Delivered Reports", value: "186+" },
  { label: "Strategy Sync Hours", value: "312" },
  { label: "Automation Coverage", value: "74%" },
  { label: "Data Trust Index", value: "91%" }
];

export const growthLineData = [
  { month: "Aug", reports: 11, complexity: 22 },
  { month: "Sep", reports: 17, complexity: 31 },
  { month: "Oct", reports: 24, complexity: 43 },
  { month: "Nov", reports: 30, complexity: 54 },
  { month: "Dec", reports: 36, complexity: 63 },
  { month: "Jan", reports: 42, complexity: 76 },
  { month: "Feb", reports: 48, complexity: 88 }
];

export const radarData = [
  { subject: "SQL", before: 30, now: 90 },
  { subject: "BI Viz", before: 34, now: 93 },
  { subject: "Data Model", before: 24, now: 86 },
  { subject: "Storytelling", before: 36, now: 91 },
  { subject: "Product", before: 32, now: 87 },
  { subject: "Automation", before: 25, now: 82 }
];

export const miniBars = [
  { name: "SQL Architecture", value: 93 },
  { name: "Dashboard Systems", value: 90 },
  { name: "Metric Engineering", value: 87 },
  { name: "Decision Storytelling", value: 89 }
];
