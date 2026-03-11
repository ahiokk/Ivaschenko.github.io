import { miniBars } from "@/lib/site-data";

export default function SkillBars() {
  return (
    <div className="space-y-3">
      {miniBars.map((item) => (
        <div key={item.name}>
          <div className="mb-1 flex items-center justify-between text-xs text-slate-300">
            <span>{item.name}</span>
            <span>{item.value}%</span>
          </div>
          <div className="h-[6px] rounded-full bg-slate-300/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-slate-200/60 via-blue-200/90 to-slate-100/70"
              style={{ width: `${item.value}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
