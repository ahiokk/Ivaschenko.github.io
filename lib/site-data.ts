export type BuildStageKey =
  | "blueprint"
  | "foundation"
  | "firstFloor"
  | "framework"
  | "upperFloors"
  | "rooftop";

export interface StageContent {
  key: BuildStageKey;
  sectionId: string;
  stageLabel: string;
  stepLabel: string;
  title: string;
  description: string;
  notes?: string[];
}

export const stageOrder: BuildStageKey[] = [
  "blueprint",
  "foundation",
  "firstFloor",
  "framework",
  "upperFloors",
  "rooftop"
];

export const stageContent: StageContent[] = [
  {
    key: "blueprint",
    sectionId: "blueprint",
    stageLabel: "Blueprint",
    stepLabel: "01",
    title: "Пространство идеи и архитектурная сетка",
    description:
      "Все началось с чертежа: я училась видеть данные как систему. Не просто цифры, а структуру, зависимости и логику решений."
  },
  {
    key: "foundation",
    sectionId: "foundation",
    stageLabel: "Foundation",
    stepLabel: "02",
    title: "Фундамент: дисциплина, база, системность",
    description:
      "Я собрала основу: аналитическое мышление, SQL-базу, чистую работу с данными и привычку к аккуратной верификации гипотез.",
    notes: [
      "Фокус на базе данных и качестве источников",
      "Переход от интереса к регулярной практике",
      "Первые KPI-блоки и карта метрик"
    ]
  },
  {
    key: "firstFloor",
    sectionId: "projects",
    stageLabel: "First Floor",
    stepLabel: "03",
    title: "Первый этаж: реальные проекты и первые результаты",
    description:
      "Я начала строить рабочие кейсы: от первых отчетов и ошибок до устойчивых решений, которые команда стала использовать в ежедневной работе.",
    notes: [
      "Автоматизация регулярных отчетов",
      "Единая логика метрик для разных команд",
      "Четкие выводы вместо ручной сводки"
    ]
  },
  {
    key: "framework",
    sectionId: "skills",
    stageLabel: "Structure",
    stepLabel: "04",
    title: "Каркас: уверенные навыки и архитектура знаний",
    description:
      "На этом этапе сформировался профессиональный каркас: SQL, BI-визуализация, data storytelling и продуктовая аналитика стали работать как единая конструкция."
  },
  {
    key: "upperFloors",
    sectionId: "complex",
    stageLabel: "Elevation",
    stepLabel: "05",
    title: "Верхние этажи: сложные задачи и рост ответственности",
    description:
      "Я перешла к более сложным кейсам: multi-source аналитика, приоритизация гипотез, cross-team коммуникация и зрелые решения под бизнес-цели.",
    notes: [
      "Сокращение ручного труда в отчетах",
      "Рост скорости решений на основе данных",
      "Усиление прозрачности KPI"
    ]
  },
  {
    key: "rooftop",
    sectionId: "rooftop",
    stageLabel: "Rooftop",
    stepLabel: "06",
    title: "Крыша: мой текущий уровень и следующий горизонт",
    description:
      "Сегодня я строю BI как инженерную систему решений. Каждый уровень опирается на фундамент, а рост остается управляемым и осознанным."
  }
];

export const projectCards = [
  {
    name: "Retention Pulse",
    stack: "SQL · Power BI · Cohort",
    summary: "Система анализа удержания с weekly-срезами и ранними сигналами оттока.",
    result: "Время подготовки отчета: -62%"
  },
  {
    name: "Ops Control Desk",
    stack: "Data Modeling · BI",
    summary: "Операционная панель с приоритетами задач и контролем SLA по процессам.",
    result: "Скорость реакции команд: +34%"
  },
  {
    name: "Revenue Bridge",
    stack: "Dashboarding · Storytelling",
    summary: "Связка воронки, выручки и продуктовых сигналов в одном бизнес-потоке.",
    result: "Доверие к цифрам в команде: 91%"
  }
];

export const kpiCards = [
  { label: "Отчеты в проде", value: "186+" },
  { label: "Часы аналитических синков", value: "312" },
  { label: "Автоматизация отчетности", value: "74%" },
  { label: "Data trust score", value: "91%" }
];

export const growthLineData = [
  { month: "Авг", reports: 12, complexity: 24 },
  { month: "Сен", reports: 18, complexity: 32 },
  { month: "Окт", reports: 25, complexity: 41 },
  { month: "Ноя", reports: 31, complexity: 52 },
  { month: "Дек", reports: 36, complexity: 61 },
  { month: "Янв", reports: 41, complexity: 74 },
  { month: "Фев", reports: 47, complexity: 86 }
];

export const radarData = [
  { subject: "SQL", before: 28, now: 89 },
  { subject: "BI Viz", before: 34, now: 92 },
  { subject: "Modeling", before: 22, now: 84 },
  { subject: "Storytelling", before: 37, now: 90 },
  { subject: "Product", before: 31, now: 86 },
  { subject: "Automation", before: 24, now: 80 }
];

export const miniBars = [
  { name: "SQL / Query Design", value: 92 },
  { name: "Data Modeling", value: 86 },
  { name: "Dashboard Architecture", value: 90 },
  { name: "Business Framing", value: 84 }
];
