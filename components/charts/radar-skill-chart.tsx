"use client";

import { Radar, RadarChart, PolarAngleAxis, PolarGrid, PolarRadiusAxis, ResponsiveContainer } from "recharts";
import { radarData } from "@/lib/site-data";

export default function RadarSkillChart() {
  return (
    <div className="h-[270px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={radarData} outerRadius="72%">
          <PolarGrid stroke="rgba(165, 193, 223, 0.25)" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: "#c4d7ed", fontSize: 11 }} />
          <PolarRadiusAxis axisLine={false} tick={false} />
          <Radar
            name="Before"
            dataKey="before"
            stroke="rgba(142, 167, 194, 0.95)"
            fill="rgba(122, 145, 170, 0.22)"
            fillOpacity={1}
          />
          <Radar name="Now" dataKey="now" stroke="#9ad0ff" fill="rgba(120, 187, 240, 0.22)" fillOpacity={1} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
