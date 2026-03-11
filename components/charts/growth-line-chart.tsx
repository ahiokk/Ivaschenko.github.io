"use client";

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { growthLineData } from "@/lib/site-data";

export default function GrowthLineChart() {
  return (
    <div className="h-[260px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={growthLineData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid stroke="rgba(154, 180, 207, 0.16)" />
          <XAxis dataKey="month" stroke="#9bb5ce" tick={{ fill: "#b9d1e8", fontSize: 12 }} />
          <YAxis stroke="#9bb5ce" tick={{ fill: "#b9d1e8", fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              background: "rgba(9, 19, 31, 0.95)",
              border: "1px solid rgba(174, 204, 232, 0.25)",
              color: "#dce9f8"
            }}
          />
          <Line
            type="monotone"
            dataKey="reports"
            name="Отчеты"
            stroke="#9ad0ff"
            strokeWidth={2.5}
            dot={{ r: 2 }}
            activeDot={{ r: 5 }}
          />
          <Line
            type="monotone"
            dataKey="complexity"
            name="Сложность задач"
            stroke="#b9c8d9"
            strokeWidth={2}
            dot={{ r: 2 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
